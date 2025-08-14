"use client";

import * as React from "react";
import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { NetworkNode, SearchFilters, NetworkMapResponseDTO } from "@/types";
import dynamic from "next/dynamic";
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// 最低限の型定義（ランタイム依存を避けるためローカルに定義）
type NodeObj = GraphNode & { x?: number; y?: number; id?: string | number; fx?: number; fy?: number };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LinkObj = { source: string; target: string; value?: number };
interface ForceGraphMethods {
	zoomToFit: (ms?: number, padding?: number, nodeFilter?: (node: NodeObj) => boolean) => void;
	// 以下はランタイム側で存在するため unknown で防御的に扱う
	// 型の厳密性よりも互換性を優先
	d3Force?: (name: string, force?: unknown) => unknown;
	d3ReheatSimulation?: () => void;
}

interface NetworkMapProps {
    filters: SearchFilters;
    className?: string;
    backendData?: NetworkMapResponseDTO | null;
}

type GraphNode = NetworkNode & { color?: string };

type GraphLink = { source: string; target: string; value?: number };

// ForceGraph のリンク型（ランタイムでは source/target が id かノードオブジェクトになる）
type ForceGraphLink = {
	source: string | number | { id?: string | number };
	target: string | number | { id?: string | number };
	value?: number;
};

interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

export function NetworkMap({ filters: _filters, className, backendData }: NetworkMapProps) {
	const router = useRouter();
	const fgRef = useRef<ForceGraphMethods | null>(null);

  // バックエンドデータからグラフ化（唯一のデータソースとする）
  const backendGraphData = useMemo<GraphData | null>(() => {
    if (!backendData) return null;
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const added = new Set<string>();

    // バックエンドから返ってきた政策テーマをそのままノード化
    for (const t of backendData.policy_themes) {
      const nodeId = `policy:${t.id}`;
      if (!added.has(nodeId)) {
        nodes.push({ id: nodeId, name: t.title ?? String(t.id), group: 0, connections: [], relevanceScore: 1, color: '#f59e0b' });
        added.add(nodeId);
      }
    }

    // 専門家ノードとリンク
    const expertInfo = new Map(backendData.experts.map(e => [e.id, e] as const));
    for (const rel of backendData.relations) {
      const policyNodeId = `policy:${rel.policy_id}`;
      if (!added.has(policyNodeId)) {
        // 返却テーマに無い場合も安全に作成
        nodes.push({ id: policyNodeId, name: String(rel.policy_id), group: 0, connections: [], relevanceScore: 1, color: '#f59e0b' });
        added.add(policyNodeId);
      }

      const ex = expertInfo.get(rel.expert_id);
      if (ex && !added.has(ex.id)) {
        nodes.push({ id: ex.id, name: ex.name, company: ex.department, position: ex.title, group: 1, connections: [], relevanceScore: rel.relation_score, color: '#58aadb' });
        added.add(ex.id);
      }

      links.push({ source: policyNodeId, target: rel.expert_id, value: rel.relation_score });
    }

    return { nodes, links };
  }, [backendData]);

  // 最終グラフデータ
  const graphData = useMemo<GraphData>(() => {
    return backendGraphData || { nodes: [], links: [] };
  }, [backendGraphData]);

	const handleNodeClick = (node: NodeObj) => {
		const id = node.id as string;
		if (id?.startsWith('policy:')) return; // 政策テーマノードは遷移しない
		router.push(`/profile/${id}`);
	};

	const nodeLabel = (node: NodeObj) => {
		const id = (node.id as string) || '';
		if (id.startsWith('policy:')) {
			return `政策テーマ: ${node.name}`;
		}
		const relevance = typeof node.relevanceScore === 'number' ? node.relevanceScore : 0;
		const dept = (node.company as string) || '';
		const title = (node.position as string) || '';
		const info = [dept, title].filter(Boolean).join(' / ');
		const score = `関連度: ${(relevance).toFixed(2)}`;
		return `${node.name}${info ? "\n" + info : ""}\n${score}`;
	};

	const nodeCanvasObject = (node: NodeObj, ctx: CanvasRenderingContext2D, globalScale: number) => {
		const n = node;
		const isPolicy = (String(n.id || '').startsWith('policy:'));
		const relevance = isPolicy ? 1 : (n.relevanceScore ?? 0.5);
		// 政策ノードの半径とラベルを控えめに
		const radius = (isPolicy ? 6 : 4) + relevance * (isPolicy ? 6 : 6);

		// 放射状グラデーション（政策: オレンジ系 / 有識者: 既存ブルー系）
		const grad = ctx.createRadialGradient(
			(n.x ?? 0),
			(n.y ?? 0),
			Math.max(0.5, radius * 0.2),
			(n.x ?? 0),
			(n.y ?? 0),
			radius
		);
		const innerOpacity = 0.8 + relevance * 0.2;
		const outerOpacity = 0.8 + relevance * 0.2;
		if (isPolicy) {
			grad.addColorStop(0, `rgba(251, 191, 36, ${innerOpacity})`); // amber-400
			grad.addColorStop(1, `rgba(245, 158, 11, ${outerOpacity})`); // amber-500
		} else {
			grad.addColorStop(0, `rgba(180, 217, 214, ${innerOpacity})`); // #b4d9d6
			grad.addColorStop(1, `rgba(88, 170, 219, ${outerOpacity})`);   // #58aadb
		}

		// ドロップシャドウ風の効果
		ctx.save();
		ctx.shadowColor = `rgba(88, 170, 219, ${0.2 + relevance * 0.2})`;
		ctx.shadowBlur = 6;
		ctx.beginPath();
		ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = grad;
		ctx.fill();
		ctx.restore();

		// 白いストローク
		ctx.beginPath();
		ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
		ctx.strokeStyle = 'rgba(255,255,255,0.95)';
		ctx.lineWidth = isPolicy ? 2 : 1.5;
		ctx.stroke();

		// 名前ラベル（政策はやや小さめ色濃く）
		const label = n.name;
		const fontSize = Math.max(7, (isPolicy ? 10 : 9) / globalScale + relevance * (isPolicy ? 6 : 5));
		ctx.font = `${fontSize}px sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = isPolicy ? 'rgba(120,53,15,0.95)' : 'rgba(55,65,81,0.9)';
		ctx.fillText(label, (n.x ?? 0), ((n.y ?? 0)) + radius + 4);
	};

	React.useEffect(() => {
		// 表示準備ができたらビュー全体にフィット
		const t = setTimeout(() => {
			if (fgRef.current) {
				try {
					fgRef.current.zoomToFit(400, 40);
				} catch {}
			}
		}, 100);
		return () => clearTimeout(t);
	}, [graphData]);

	// 政策ノード密集の緩和（リンク距離・反発力）
	React.useEffect(() => {
		if (!fgRef.current) return;
		try {
			const linkForceUnknown = fgRef.current.d3Force?.('link');
			const linkForce = linkForceUnknown as unknown as { distance?: (fn: (link: ForceGraphLink) => number) => void } | undefined;
			if (linkForce && typeof linkForce.distance === 'function') {
				linkForce.distance((link: ForceGraphLink) => {
					const sid = String(((link.source as { id?: string | number })?.id) ?? link.source ?? '');
					const tid = String(((link.target as { id?: string | number })?.id) ?? link.target ?? '');
					const involvesPolicy = sid.startsWith('policy:') || tid.startsWith('policy:');
					const v = typeof link.value === 'number' ? link.value : 0.4;
					return involvesPolicy ? 140 + (1 - v) * 60 : 90;
				});
			}

			const chargeForceUnknown = fgRef.current.d3Force?.('charge');
			const chargeForce = chargeForceUnknown as unknown as { strength?: (fn: (node: NodeObj) => number) => void } | undefined;
			if (chargeForce && typeof chargeForce.strength === 'function') {
				chargeForce.strength((node: NodeObj) => {
					const isPolicy = String(node.id ?? '').startsWith('policy:');
					return isPolicy ? -420 : -140;
				});
			}

			fgRef.current.d3ReheatSimulation?.();
		} catch {}
	}, [graphData]);

  const shouldShowEmpty = !backendGraphData || backendGraphData.nodes.length === 0;
  if (shouldShowEmpty) {
		return (
			<div className={`h-full flex items-center justify-center ${className}`}>
				<div className="text-center">
					<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
						<span className="material-symbols-outlined text-gray-500 text-2xl">group</span>
					</div>
          <p className="text-gray-500 text-lg mb-2 font-bold">人脈マップ</p>
          <p className="text-gray-400 text-sm font-bold">検索を実行して結果を表示します</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`h-full w-full relative overflow-hidden ${className}`}>
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				nodeRelSize={6}
				nodeLabel={nodeLabel}
				nodeCanvasObject={nodeCanvasObject}
				linkColor={(link: ForceGraphLink) => {
					const value = typeof link.value === 'number' ? link.value : 0.4;
					const alpha = 0.2 + Math.min(0.8, value * 0.8);
					return `rgba(88,170,219,${alpha.toFixed(3)})`;
				}}
				linkDirectionalParticles={0}
				linkWidth={(link: ForceGraphLink) => {
					const value = typeof link.value === 'number' ? link.value : 0.4;
					return 0.5 + value * 3;
				}}
				enableZoomInteraction
				enablePanInteraction
				cooldownTime={2000}
				onNodeClick={handleNodeClick}
				backgroundColor={'rgba(255,255,255,1)'}
				onRenderFramePre={(ctx: CanvasRenderingContext2D) => {
					const { width, height } = ctx.canvas;
					// 背景を白で初期化
					ctx.save();
					ctx.clearRect(0, 0, width, height);
					ctx.fillStyle = 'white';
					ctx.fillRect(0, 0, width, height);

					// 背景色は完全な白
					// （放射状グラデーションは削除）

					// （方眼紙風のグリッドは削除）
					ctx.restore();
				}}
			/>

			{/* 凡例 */}
			<div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/50 text-[10px]">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-gradient-to-br from-[#b4d9d6] to-[#58aadb] rounded-full shadow-sm"></div>
					<span className="text-gray-700 font-medium">クリックでプロフィール表示 / ドラッグで移動 / ホイールでズーム</span>
				</div>
			</div>
		</div>
	);
}

