"use client";

import * as React from "react";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { getUserFromToken } from "@/lib/auth";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

type NodeType = "user" | "staff" | "expert";

interface RouteNode {
	id: string;
	type: "user" | "expert"; // backend schema
	name?: string;
}

interface RouteBreakdown {
	ux_score?: number;
	um_score?: number;
	mx_score?: number;
	xz_score?: number;
}

interface RouteItem {
	path: RouteNode[]; // [U,(M,)X,Z]
	score: number;
	breakdown: RouteBreakdown;
}

interface RoutesResponse {
	routes: RouteItem[];
}

interface GraphNode {
	id: string | number;
	label: string;
	kind: NodeType;
	fx?: number;
	fy?: number;
	x?: number;
	y?: number;
    mediator?: boolean;
}

interface GraphEdge {
	id: string;
	source: string;
	target: string;
	weight: number; // 0..1
	label?: string;
}

type NodeObj = GraphNode & { id?: string | number };
type ForceGraphLink = {
	source: string | number | { id?: string | number };
	target: string | number | { id?: string | number };
	value?: number;
	label?: string;
};

const MARGIN_RATIO = 0.08 as const;
const MARGIN_MIN = 24;
const MARGIN_MAX = 96;

function clamp(v: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, v));
}

export function computeAnchors(containerWidth: number, paddingLeft = 0, paddingRight = 0) {
	const usableW = Math.max(0, containerWidth - paddingLeft - paddingRight);
	const m = Math.max(MARGIN_MIN, Math.min(MARGIN_MAX, usableW * MARGIN_RATIO));
	const ux = paddingLeft + m;
	const zx = paddingLeft + usableW - m;
	return { ux, zx };
}

function scoreToStrokeWidth(score?: number) {
	const s = typeof score === "number" ? clamp(score, 0, 1) : undefined;
	if (s == null) return 0;
	return 1.5 + 4.5 * s;
}

function nodeTypeLabel(kind: NodeType): string {
	if (kind === "user") return "ユーザー";
	if (kind === "staff") return "職員";
	return "有識者";
}

interface ProfileNetworkRoutesProps {
	expertId: string;
	className?: string;
}

export function ProfileNetworkRoutes({ expertId, className }: ProfileNetworkRoutesProps) {
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const fgRef = useRef<{ zoomToFit?: (ms?: number, padding?: number) => void; d3Force?: (n: string, f?: unknown) => unknown; d3ReheatSimulation?: () => void } | null>(null);
	const [containerW, setContainerW] = useState<number>(0);
	const [padding, setPadding] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
	const [routesData, setRoutesData] = useState<RoutesResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const [reloadTick, setReloadTick] = useState<number>(0);

	// ResizeObserver to get container width and paddings
	React.useLayoutEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const update = () => {
			const cs = getComputedStyle(el);
			const pl = parseFloat(cs.paddingLeft || "0") || 0;
			const pr = parseFloat(cs.paddingRight || "0") || 0;
			setPadding({ left: pl, right: pr });
			setContainerW(el.clientWidth);
		};
		update();
		const ro = new ResizeObserver(() => update());
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// Fetch routes on mount or expert change
	React.useEffect(() => {
		const user = getUserFromToken();
		if (!expertId || !user?.userId) {
			setRoutesData({ routes: [] });
			return;
		}
		if (abortRef.current) {
			try { abortRef.current.abort(); } catch {}
		}
		const c = new AbortController();
		abortRef.current = c;
		setLoading(true);
		setError(null);
		(async () => {
			try {
				const payload = {
					user_id: user.userId,
					expert_id: expertId,
					window_days: 180,
					half_life_days: 90,
					overlap_config_id: 1,
					overlap_coef: 0.4,
					max_results: 5,
				};
				const data = await apiFetch<RoutesResponse>("/api/network_meti/routes", { method: "POST", body: payload, headers: { "x-cancel": String(Date.now()) }, signal: c.signal });
				setRoutesData(data);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : "取得に失敗しました");
				setRoutesData({ routes: [] });
			} finally {
				setLoading(false);
			}
		})();
		return () => {
			try { c.abort(); } catch {}
		};
	}, [expertId, reloadTick]);

	const anchors = useMemo(() => computeAnchors(containerW, padding.left, padding.right), [containerW, padding.left, padding.right]);

	// Transform backend routes to graph nodes/edges
	const { nodes, links } = useMemo(() => {
		const nodes: GraphNode[] = [];
		const links: GraphEdge[] = [];
		if (!routesData || !routesData.routes) return { nodes, links };

		const nodeAdded = new Map<string, GraphNode>();
		const edgeMax = new Map<string, GraphEdge>();

		// helpers
		const ensureNode = (id: string, label: string, kind: NodeType) => {
			let n = nodeAdded.get(id);
			if (!n) {
				n = { id, label, kind };
				nodeAdded.set(id, n);
				nodes.push(n);
			}
			return n;
		};

		const addEdgeMax = (a: string, b: string, weight: number, label: string) => {
			const key = `${a}::${b}`;
			const ex = edgeMax.get(key);
			if (!ex || weight > ex.weight) {
				edgeMax.set(key, { id: key, source: a, target: b, weight, label });
			}
		};

		// sort routes desc just in case
		const sorted = [...routesData.routes].sort((ra, rb) => (rb.score ?? 0) - (ra.score ?? 0)).slice(0, 5);
		for (const r of sorted) {
			if (!r.path || r.path.length < 3) continue;
			const hops = r.path;
			const u = hops[0];
			const z = hops[hops.length - 1];
			const isFour = hops.length === 4;
			const m = isFour ? hops[1] : null;
			const x = isFour ? hops[2] : hops[1];

			// nodes: classify kinds
			const uNode = ensureNode(u.id, u.name || "あなた", "user");
			const xNode = ensureNode(x.id, x.name || x.id, "staff");
			if (m) {
				const mNode = ensureNode(m.id, m.name || m.id, "staff");
				mNode.mediator = true;
			}
			const zNode = ensureNode(z.id, z.name || z.id, "expert");

			// edges from breakdown
			const bd = r.breakdown || {};
			if (bd.ux_score != null && !isNaN(bd.ux_score) && !isFour) {
				addEdgeMax(u.id, x.id, clamp(bd.ux_score, 0, 1), `${uNode.label}–${xNode.label}: ${bd.ux_score.toFixed(2)}`);
			}
			if (bd.um_score != null && m) {
				addEdgeMax(u.id, m.id, clamp(bd.um_score, 0, 1), `${uNode.label}–${(m.name || m.id)}: ${bd.um_score.toFixed(2)}`);
			}
			if (bd.mx_score != null && m) {
				addEdgeMax(m.id, x.id, clamp(bd.mx_score, 0, 1), `${(m.name || m.id)}–${xNode.label}: ${bd.mx_score.toFixed(2)}`);
			}
			if (bd.xz_score != null) {
				addEdgeMax(x.id, z.id, clamp(bd.xz_score, 0, 1), `${xNode.label}–${zNode.label}: ${bd.xz_score.toFixed(2)}`);
			}
		}

		// Anchor U and Z on X axis using fx
		for (const n of nodes) {
			if (n.kind === "user") n.fx = anchors.ux;
			if (n.kind === "expert") n.fx = anchors.zx;
		}

		edgeMax.forEach((e) => links.push(e));
		return { nodes, links };
	}, [routesData, anchors.ux, anchors.zx]);

	// node rendering to emphasize U/Z and mediator ring
	const nodeCanvasObject = (node: NodeObj, ctx: CanvasRenderingContext2D, globalScale: number) => {
		const n = node as GraphNode;
		const isUser = n.kind === "user";
		const isExpert = n.kind === "expert";
		const isMediator = !!n.mediator;
		const radius = (isUser || isExpert) ? 12 : 9;
		ctx.save();
		ctx.beginPath();
		ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
		const fill = isExpert ? '#58aadb' : (isUser ? '#1f2937' : '#9ca3af');
		ctx.fillStyle = fill;
		ctx.globalAlpha = isUser || isExpert ? 0.95 : 0.8;
		ctx.fill();
		ctx.lineWidth = isUser || isExpert ? 2.5 : 1.5;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		if (isMediator) {
			ctx.setLineDash([3, 2]);
			ctx.lineWidth = 1.2;
			ctx.strokeStyle = '#9ca3af';
			ctx.beginPath();
			ctx.arc((n.x ?? 0), (n.y ?? 0), radius + 3, 0, 2 * Math.PI, false);
			ctx.stroke();
		}
		const fontSize = Math.max(8, (isUser || isExpert ? 12 : 10) / globalScale);
		ctx.font = `600 ${fontSize}px sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'rgba(31,41,55,0.95)';
		ctx.fillText(String(n.label), (n.x ?? 0), (n.y ?? 0) + radius + 4);
		ctx.restore();
	};

	React.useEffect(() => {
		try { fgRef.current?.d3ReheatSimulation?.(); } catch {}
		const t = setTimeout(() => { try { fgRef.current?.zoomToFit?.(400, 40); } catch {} }, 120);
		return () => clearTimeout(t);
	}, [nodes.length, links.length, anchors.ux, anchors.zx]);

	const nodeLabel = (node: NodeObj) => {
		const kind = node.kind as NodeType;
		return `${node.label}\n種別: ${nodeTypeLabel(kind)}`;
	};

	const linkLabel = (link: ForceGraphLink) => {
		const label = (link as unknown as GraphEdge).label;
		return label || "";
	};

	const onNodeClick = (node: NodeObj) => {
		if (node.kind === "staff") {
			setSelectedStaffId(String(node.id));
			return;
		}
		if (node.kind === "expert") {
			// 現在表示中のプロフィールの強調: 軽いズームフィット
			try { fgRef.current?.zoomToFit?.(400, 40); } catch {}
			return;
		}
	};

	const shouldShowEmpty = !nodes.length || !links.length;

	return (
		<div ref={containerRef} className={`h-full w-full relative overflow-hidden ${className || ""}`}>
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="bg-white/90 rounded px-3 py-1 text-xs text-gray-700 border">読み込み中...</div>
				</div>
			)}
			{error && (
				<div className="absolute inset-x-4 top-3 z-10">
					<div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2 flex items-center justify-between">
						<span>{error}</span>
						<button className="text-red-700 underline" onClick={() => setError(null)}>閉じる</button>
					</div>
				</div>
			)}
			{shouldShowEmpty ? (
				<div className="h-full flex items-center justify-center">
					<div className="text-center">
						<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
							<span className="material-symbols-outlined text-gray-500 text-xl">group</span>
						</div>
						<p className="text-gray-700 text-sm font-bold mb-1">関係が見つかりませんでした</p>
						<button
							onClick={() => setReloadTick(v => v + 1)}
							className="inline-flex items-center justify-center px-3 py-1.5 bg-[#58aadb] text-white rounded text-xs hover:opacity-90"
						>
							再取得
						</button>
					</div>
				</div>
			) : (
				<>
					<ForceGraph2D
						ref={fgRef as unknown as React.MutableRefObject<unknown>}
						graphData={{ nodes, links: links.map(l => ({ source: l.source, target: l.target, value: l.weight, label: l.label })) }}
						nodeRelSize={6}
						nodeLabel={nodeLabel}
						linkLabel={linkLabel}
						linkColor={(link: ForceGraphLink) => {
							const value = typeof (link as any).value === 'number' ? (link as any).value : 0.4;
							const alpha = 0.25 + Math.min(0.75, value * 0.75);
							return `rgba(88,170,219,${alpha.toFixed(3)})`;
						}}
						linkWidth={(link: ForceGraphLink) => scoreToStrokeWidth((link as any).value)}
						enableZoomInteraction
						enablePanInteraction
						cooldownTime={1800}
						onNodeClick={onNodeClick}
						backgroundColor={'rgba(255,255,255,1)'}
						// Pin U/Z horizontally by setting fx via nodes; leave fy free
					/>

					{/* Legend */}
					<div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/50 text-[10px]">
						<div className="grid grid-cols-2 gap-x-4 gap-y-1">
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-[#1f2937]" /> <span className="text-gray-700 font-bold">U</span> <span className="text-gray-600">ユーザー</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-[#6b7280]" /> <span className="text-gray-700 font-bold">X</span> <span className="text-gray-600">職員</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#9ca3af]" /> <span className="text-gray-700 font-bold">M</span> <span className="text-gray-600">仲介</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#b4d9d6] to-[#58aadb]" /> <span className="text-gray-700 font-bold">Z</span> <span className="text-gray-600">有識者</span></div>
						</div>
						<div className="mt-2">
							<div className="text-gray-700 font-medium mb-1">線の太さ = 関係強度</div>
							<div className="flex items-center gap-2">
								<div className="h-0.5 bg-[#58aadb]" style={{ width: 32 }} />
								<span className="text-gray-600">0</span>
								<div className="h-[6px] bg-[#58aadb]" style={{ width: 32 }} />
								<span className="text-gray-600">1</span>
							</div>
						</div>
					</div>

					{/* Staff detail panel */}
					{selectedStaffId && (
						<div className="absolute right-3 top-3 bg-white/95 rounded-lg shadow-lg border p-3 text-[11px]">
							<div className="flex items-center justify-between mb-2">
								<div className="font-bold text-gray-800">職員 詳細</div>
								<button className="text-gray-500" onClick={() => setSelectedStaffId(null)}>×</button>
							</div>
							<div className="text-gray-700 mb-2">ID: {selectedStaffId}</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => {
										// 既存の紹介依頼フローに接続する想定のハンドラ
										alert("紹介依頼フローに接続してください");
									}}
									className="px-3 py-1.5 bg-[#58aadb] text-white rounded hover:opacity-90"
								>
									紹介依頼
								</button>
								<button
									onClick={() => router.push(`/dashboard`)}
									className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded border hover:bg-gray-50"
								>
									社内プロフィール
								</button>
							</div>
						</div>
					)}
				</>
			)}

		</div>
	);
}


