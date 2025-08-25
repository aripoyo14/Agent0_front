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
    center?: boolean;
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

const MIN_SEPARATION = 240; // px: これ未満に近づかないように強制

function clamp(v: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, v));
}

export function computeAnchors(containerWidth: number, _containerHeight: number, paddingLeft = 0, paddingRight = 0, _paddingTop = 0, _paddingBottom = 0) {
	// U/Z を左右端に近づけて横一列に配置（中心0基準）
	const usableW = Math.max(0, containerWidth - paddingLeft - paddingRight);
	const halfW = usableW / 2;
	const marginX = 10; 
	// const marginX = Math.max(24, usableW * 0.03); // 余白
	const ux = -halfW + marginX;
	const zx = +halfW - marginX;
	return { ux, zx, uy: 0, zy: 0 };
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
	const fgRef = useRef<{ centerAt?: (x: number, y: number, ms?: number) => void; zoomToFit?: (ms?: number, padding?: number) => void; d3Force?: (n: string, f?: unknown) => unknown; d3ReheatSimulation?: () => void } | null>(null);
	const [containerW, setContainerW] = useState<number>(0);
	const [containerH, setContainerH] = useState<number>(0);
	const [padding, setPadding] = useState<{ left: number; right: number; top: number; bottom: number }>({ left: 0, right: 0, top: 0, bottom: 0 });
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
			const pt = parseFloat(cs.paddingTop || "0") || 0;
			const pb = parseFloat(cs.paddingBottom || "0") || 0;
			setPadding({ left: pl, right: pr, top: pt, bottom: pb });
			setContainerW(el.clientWidth);
			setContainerH(el.clientHeight);
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
		
		// 既存のリクエストを中断
		if (abortRef.current) {
			abortRef.current.abort();
		}
		
		// 新しいAbortControllerを作成
		const controller = new AbortController();
		abortRef.current = controller;
		
		setLoading(true);
		setError(null);
		
		(async () => {
			try {
				// リクエストが中断されたかチェック
				if (controller.signal.aborted) {
					return;
				}
				
				const payload = {
					user_id: user.userId,
					expert_id: expertId,
					window_days: 180,
					half_life_days: 90,
					overlap_config_id: 1,
					overlap_coef: 0.4,
					max_results: 5,
				};
				
				const data = await apiFetch<RoutesResponse>("/api/network_meti/routes", { 
					method: "POST", 
					body: payload, 
					headers: { "x-cancel": String(Date.now()) }, 
					signal: controller.signal, 
					auth: true 
				});
				
				// リクエストが中断されたかチェック
				if (controller.signal.aborted) {
					return;
				}
				
				setRoutesData(data);
			} catch (e: unknown) {
				// AbortErrorの場合は状態を更新しない
				if (e instanceof Error && e.name === 'AbortError') {
					return;
				}
				setError(e instanceof Error ? e.message : "取得に失敗しました");
				setRoutesData({ routes: [] });
			} finally {
				// リクエストが中断された場合はloading状態を更新しない
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		})();
		
		return () => {
			// クリーンアップ時にAbortControllerを中断
			if (controller && !controller.signal.aborted) {
				controller.abort();
			}
		};
	}, [expertId, reloadTick]);

	const anchors = useMemo(() => computeAnchors(containerW, containerH, padding.left, padding.right, padding.top, padding.bottom), [containerW, containerH, padding.left, padding.right, padding.top, padding.bottom]);

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
			const xNode = ensureNode(x.id, x.name || "", "staff");
			if (m) {
				const mNode = ensureNode(m.id, m.name || "", "staff");
				mNode.mediator = true;
			}
			const zNode = ensureNode(z.id, z.name || "", "expert");

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

		// Anchor U (top-left) and target Z (bottom-right)
		for (const n of nodes) {
			if (n.kind === "user") {
				n.fx = anchors.ux;
				n.fy = anchors.uy;
				n.x = n.fx;
				n.y = n.fy;
			}
			if (n.kind === "expert") {
				if (String(n.id) === String(expertId)) {
					n.fx = anchors.zx;
					n.fy = anchors.zy;
					n.x = n.fx;
					n.y = n.fy;
				} else {
					n.fx = undefined;
					n.fy = undefined;
				}
			}
		}

		// Place staff nodes between U and Z along the diagonal, with slight normal offsets
		const dx = anchors.zx - anchors.ux;
		const baseY = anchors.uy; // == anchors.zy
		const jitter = Math.max(50, Math.abs(dx) * 0.45);

		// Determine X-candidate staff nodes (connected to Z) using current aggregated edges in edgeMax
		const xCandidateIds = new Set<string>();
		edgeMax.forEach((e) => {
			const s = String(e.source);
			const t = String(e.target);
			if (s === String(expertId)) xCandidateIds.add(t);
			else if (t === String(expertId)) xCandidateIds.add(s);
		});

		const staffMediators: GraphNode[] = [];
		const staffX: GraphNode[] = [];
		const staffOthers: GraphNode[] = [];
		for (const n of nodes) {
			if (n.kind !== 'staff') continue;
			if ((n as GraphNode).center) continue; // skip center marker
			if ((n as GraphNode).mediator) staffMediators.push(n);
			else if (xCandidateIds.has(String(n.id))) staffX.push(n);
			else staffOthers.push(n);
		}

		const placeRandom = (list: GraphNode[], tMin: number, tMax: number) => {
			const count = list.length;
			if (!count) return;
			const placed: Array<{ x: number; y: number }> = [];
			const minSep = 48; // 最低分離距離(px)
			for (let i = 0; i < count; i++) {
				let px = 0, py = 0; let tries = 0;
				while (tries < 40) {
					const t = tMin + Math.random() * Math.max(0.01, (tMax - tMin));
					px = anchors.ux + dx * t + (Math.random() - 0.5) * jitter * 0.25;
					py = baseY + (Math.random() - 0.5) * 2 * jitter;
					let ok = true;
					for (const p of placed) {
						const d2 = (p.x - px) * (p.x - px) + (p.y - py) * (p.y - py);
						if (d2 < minSep * minSep) { ok = false; break; }
					}
					if (ok) break;
					tries++;
				}
				placed.push({ x: px, y: py });
				// 初期位置のみ設定（固定しない）
				list[i].fx = undefined;
				list[i].fy = undefined;
				list[i].x = px;
				list[i].y = py;
			}
		};

		// Mediators near user, X near expert, others random in middle (ランダム配置)
		placeRandom(staffMediators, 0.05, 0.40);
		placeRandom(staffOthers,   0.30, 0.70);
		placeRandom(staffX,        0.60, 0.95);

		edgeMax.forEach((e) => links.push(e));
		return { nodes, links };
	}, [routesData, anchors.ux, anchors.zx, anchors.uy, anchors.zy, expertId]);

	// node rendering to emphasize U/Z and mediator ring
	const nodeCanvasObject = (node: NodeObj, ctx: CanvasRenderingContext2D, globalScale: number) => {
		const n = node as GraphNode;
		const isUser = n.kind === "user";
		const isExpert = n.kind === "expert";
		const isMediator = !!n.mediator;
        const isCenter = !!n.center;
		const radius = isCenter ? 6 : ((isUser || isExpert) ? 12 : 9);
		ctx.save();
		ctx.beginPath();
		ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
		const fill = isCenter ? '#ef4444' : (isExpert ? '#58aadb' : (isUser ? '#1f2937' : '#9ca3af'));
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
		const labelText = isCenter ? '' : String(n.label);
		if (labelText) ctx.fillText(labelText, (n.x ?? 0), (n.y ?? 0) + radius + 4);
		ctx.restore();
	};

	// ランタイムで最小分離距離を維持
	const enforceSeparation = React.useCallback(() => {
		const nlist = nodes as unknown as Array<GraphNode & { x?: number; y?: number }>;
		for (let i = 0; i < nlist.length; i++) {
			for (let j = i + 1; j < nlist.length; j++) {
				const a = nlist[i];
				const b = nlist[j];
				if (!a || !b) continue;
				// U/Z は固定扱い
				const aFixed = a.kind === 'user' || a.kind === 'expert';
				const bFixed = b.kind === 'user' || b.kind === 'expert';
				const ax = (a.x ?? 0), ay = (a.y ?? 0);
				const bx = (b.x ?? 0), by = (b.y ?? 0);
				let dx = bx - ax; let dy = by - ay;
				let d2 = dx * dx + dy * dy;
				if (d2 === 0) { dx = (Math.random() - 0.5) * 0.01; dy = (Math.random() - 0.5) * 0.01; d2 = dx*dx + dy*dy; }
				const d = Math.sqrt(d2);
				if (d < MIN_SEPARATION) {
					const nx = dx / (d || 1);
					const ny = dy / (d || 1);
					const push = (MIN_SEPARATION - d) * 0.6;
					if (!aFixed && !bFixed) {
						a.x = ax - nx * push * 0.5; a.y = ay - ny * push * 0.5;
						b.x = bx + nx * push * 0.5; b.y = by + ny * push * 0.5;
					} else if (!aFixed && bFixed) {
						a.x = ax - nx * push; a.y = ay - ny * push;
					} else if (aFixed && !bFixed) {
						b.x = bx + nx * push; b.y = by + ny * push;
					}
				}
			}
		}
		try { fgRef.current?.d3ReheatSimulation?.(); } catch {}
	}, [nodes]);

	React.useEffect(() => {
		try { fgRef.current?.d3ReheatSimulation?.(); } catch {}
		const t = setTimeout(() => {
			try {
				fgRef.current?.zoomToFit?.(0, 120);
				fgRef.current?.centerAt?.(0, 0, 0);
				// レイアウト確定後の再フィット（念押し）
				setTimeout(() => {
					try {
						fgRef.current?.zoomToFit?.(0, 120);
						fgRef.current?.centerAt?.(0, 0, 0);
					} catch {}
				}, 400);
			} catch {}
		}, 150);
		return () => clearTimeout(t);
	}, [nodes.length, links.length]);

	// Spread nodes by adjusting forces
	React.useEffect(() => {
		if (!fgRef.current) return;
		try {
			const linkForceUnknown = fgRef.current.d3Force?.('link');
			const linkForce = linkForceUnknown as unknown as { distance?: (fn: (link: ForceGraphLink) => number) => void } | undefined;
			if (linkForce && typeof linkForce.distance === 'function') {
				linkForce.distance((link: ForceGraphLink) => {
					const sid = String(((link.source as { id?: string | number })?.id) ?? link.source ?? '');
					const tid = String(((link.target as { id?: string | number })?.id) ?? link.target ?? '');
					const userId = String((nodes.find(n => n.kind === 'user')?.id) ?? '');
					const involvesPinned = sid === String(expertId) || tid === String(expertId) || sid === userId || tid === userId;
					// U/Z を離し、その間は広めに
					return involvesPinned ? 130 : 240;
				});
			}

			const chargeForceUnknown = fgRef.current.d3Force?.('charge');
			const chargeForce = chargeForceUnknown as unknown as { strength?: (fn: (node: NodeObj) => number) => void } | undefined;
			if (chargeForce && typeof chargeForce.strength === 'function') {
				chargeForce.strength((node: NodeObj) => {
					const kind = (node as GraphNode).kind;
					if (kind === 'staff') return -360; // 強い分離
					return -220;
				});
			}

			// Collision force to avoid overlaps using built-in d3Force if available
			try {
				const d3 = fgRef.current?.d3Force?.('collide') as { radius?: (fn: (n: NodeObj) => number) => { strength?: (s: number) => unknown; iterations?: (i: number) => unknown } } | undefined;
				if (d3 && typeof d3.radius === 'function') {
					// 既存の衝突フォースがあれば半径を拡大
					const ret = d3.radius((n: NodeObj) => ((n as GraphNode).kind === 'user' || (n as GraphNode).kind === 'expert') ? 18 : 16);
					if (ret && typeof (ret as { strength?: (s: number) => unknown }).strength === 'function') {
						(ret as { strength?: (s: number) => unknown }).strength?.(1.2);
					}
					if (ret && typeof (ret as { iterations?: (i: number) => unknown }).iterations === 'function') {
						(ret as { iterations?: (i: number) => unknown }).iterations?.(4);
					}
				} else if (fgRef.current?.d3Force) {
					// APIが受け取れる環境では半径関数をセット（簡易）
					fgRef.current.d3Force('collide', ((n: NodeObj) => ((n as GraphNode).kind === 'user' || (n as GraphNode).kind === 'expert') ? 18 : 16) as unknown as never);
				}
			} catch {}

			fgRef.current.d3ReheatSimulation?.();
		} catch {}
	}, [nodes, expertId]);

	const nodeLabel = (node: NodeObj) => {
		const kind = node.kind as NodeType;
		if ((node as GraphNode).center) return "中心";
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
						nodeRelSize={4}
						nodeLabel={nodeLabel}
						linkLabel={linkLabel}
						linkColor={(link: ForceGraphLink) => {
							const value = typeof link.value === 'number' ? link.value : 0.4;
							const alpha = 0.3 + Math.min(0.7, value * 0.7);
							return `rgba(88,170,219,${alpha.toFixed(3)})`;
						}}
						linkDirectionalParticles={0}
						linkWidth={(link: ForceGraphLink) => {
							const value = typeof link.value === 'number' ? link.value : 0.4;
							return 1.5 + value * 4;
						}}
						linkCurvature={0}
						linkCurveRotation={0}
						enableZoomInteraction
						enablePanInteraction
						cooldownTime={4000}
						onNodeClick={onNodeClick}
						backgroundColor={'transparent'}
						nodeCanvasObject={nodeCanvasObject}
						onNodeDrag={(node: unknown) => { const n = node as NodeObj; n.fx = n.x; n.fy = n.y; }}
						onNodeDragEnd={(node: unknown) => { const n = node as NodeObj; if (n.kind !== 'user' && n.kind !== 'expert') { n.fx = undefined; n.fy = undefined; } try { fgRef.current?.d3ReheatSimulation?.(); } catch {} }}
						onEngineTick={enforceSeparation}
						onEngineStop={() => { try { fgRef.current?.zoomToFit?.(0, 120); fgRef.current?.centerAt?.(0, 0, 0); } catch {} }}
						centerAt={(width: number, height: number) => ({ x: width / 2, y: height / 2 })}
						width={Math.max(0, containerW - padding.left - padding.right)}
						height={Math.max(0, containerH - padding.top - padding.bottom)}
						onRenderFramePre={(ctx: CanvasRenderingContext2D) => {
							const { width, height } = ctx.canvas;
							ctx.save();
							ctx.clearRect(0, 0, width, height);
							ctx.restore();
						}}
						// Pin U/Z horizontally by setting fx via nodes; leave fy free
					/>

					{/* Legend */}
					<div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/50 text-[10px]">
						<div className="grid grid-cols-2 gap-x-4 gap-y-1">
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1f2937]" /> <span className="text-gray-700 font-bold">U</span> <span className="text-gray-600">ユーザー</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-[#6b7280]" /> <span className="text-gray-700 font-bold">X</span> <span className="text-gray-600">職員</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#9ca3af]" /> <span className="text-gray-700 font-bold">M</span> <span className="text-gray-600">仲介</span></div>
							<div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#b4d9d6] to-[#58aadb]" /> <span className="text-gray-700 font-bold">Z</span> <span className="text-gray-600">有識者</span></div>
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