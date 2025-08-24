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
        console.log('Creating policy node:', { id: t.id, title: t.title });
        
        nodes.push({ 
          id: nodeId, 
          name: t.title ?? String(t.id), 
          group: 0, 
          connections: [], 
          relevanceScore: 1, 
          color: '#f59e0b' 
        });
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
		
		if (isPolicy) {
			// 政策テーマ: 円形（水色グラデーション）- 人物ノードの1.5倍のサイズ
			const radius = (4 + relevance * 4) * 1.5; // 人物ノードの1.5倍のサイズ（縮小版）
			
			// メインカラー水色ベースのグラデーション作成
			const grad = ctx.createRadialGradient(
				(n.x ?? 0),
				(n.y ?? 0),
				Math.max(0.5, radius * 0.1),
				(n.x ?? 0),
				(n.y ?? 0),
				radius
			);
			
			grad.addColorStop(0, `rgba(88, 170, 219, 0.95)`); // #58aadb（明るめ）
			grad.addColorStop(0.7, `rgba(88, 170, 219, 0.9)`); // #58aadb（メインカラー）
			grad.addColorStop(1, `rgba(45, 140, 189, 0.85)`); // #58aadb（暗め）
			
			// 円形の描画
			ctx.beginPath();
			ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
			
			// 水色グラデーションで塗りつぶし
			ctx.fillStyle = grad;
			ctx.fill();
			
			// 太いストロークで関連する人物を強調
			ctx.strokeStyle = 'rgba(88, 170, 219, 0.8)'; // #58aadb
			ctx.lineWidth = 3; // 人物ノードよりも太い縁
			ctx.stroke();
			
			// テーマ名を円の中に表示
			const text = n.name;
			console.log('Policy node text:', { name: n.name, finalText: text });
			const fontSize = Math.max(6, 8 / globalScale); // 文字サイズを小さく
			ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`; // 太字に変更
			
			// テキストを折り返し用に分割（1列最大5文字）
			const maxCharsPerLine = 5; // 1列に最大5文字
			const lines: string[] = [];
			
			// 5文字ずつに分割
			for (let i = 0; i < text.length; i += maxCharsPerLine) {
				const line = text.slice(i, i + maxCharsPerLine);
				lines.push(line);
			}
			
			// 折り返しテキストを描画（円の中心に配置）
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			const lineHeight = fontSize * 1.2;
			const totalHeight = lines.length * lineHeight;
			const startY = (n.y ?? 0) - (totalHeight - lineHeight) / 2;
			
			lines.forEach((line, index) => {
				const y = startY + index * lineHeight;
				
				// 円の中心に文字を配置（シンプルなセンター配置）
				ctx.fillText(line, (n.x ?? 0), y);
			});
			
		} else {
			// 専門家: 円形（関連度に応じてサイズ調整）
			const radius = 4 + relevance * 4; // サイズを半分に縮小
			
			// Neo4j Bloom風の洗練されたグラデーション
			const grad = ctx.createRadialGradient(
				(n.x ?? 0),
				(n.y ?? 0),
				Math.max(0.5, radius * 0.1),
				(n.x ?? 0),
				(n.y ?? 0),
				radius
			);
			
			grad.addColorStop(0, `rgba(219, 234, 254, 0.95)`); // 明るいブルー
			grad.addColorStop(0.7, `rgba(147, 197, 253, 0.9)`); // blue-400
			grad.addColorStop(1, `rgba(59, 130, 246, 0.85)`); // blue-500

			// Neo4j Bloom風の洗練されたシャドウ効果
			ctx.save();
			ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
			ctx.shadowBlur = 8;
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 2;
			ctx.beginPath();
			ctx.arc((n.x ?? 0), (n.y ?? 0), radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = grad;
			ctx.fill();
			ctx.restore();

			// ストロークを削除（縁なし）
		}

		// 専門家ノードのみラベルを表示（政策テーマは矩形内にテキスト表示済み）
		if (!isPolicy) {
			const label = n.name;
			const fontSize = 4; // 文字サイズを4pxにさらに小さく
			ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`; // 太字に統一
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			
			// ラベルテキスト（背景なし、白色）
			ctx.fillStyle = 'white';
			const radius = 4 + relevance * 4;
			const labelY = (n.y ?? 0) + radius + 1; // ノードのすぐ下に配置（間隔も縮小）
			
			// 文字間隔を開けて個別に描画（センター配置）
			const charSpacing = 1.5; // 文字間隔を1.5pxに調整
			const textMetrics = ctx.measureText(label);
			const textWidth = textMetrics.width;
			const charWidth = textWidth / label.length;
			const totalSpacing = (label.length - 1) * charSpacing;
			const startX = (n.x ?? 0) - (textWidth + totalSpacing) / 2;
			
			for (let i = 0; i < label.length; i++) {
				const char = label[i];
				const x = startX + i * (charWidth + charSpacing);
				ctx.fillText(char, x, labelY);
			}
		}
	};

	React.useEffect(() => {
		// データが存在する場合のみズーム調整を実行
		if (!backendGraphData || backendGraphData.nodes.length === 0) return;
		
		// 表示準備ができたら全てのノードが見えるように調整
		const t = setTimeout(() => {
			if (fgRef.current) {
				try {
					// 全てのノードが見えるように表示範囲を調整（より小さく）
					fgRef.current.zoomToFit(400, 40);
					// 少し待ってから適切なズームレベルに調整
					setTimeout(() => {
						if (fgRef.current) {
							// 適切なズームレベルで全体を表示（より小さく）
							fgRef.current.zoomToFit(300, 30);
						}
					}, 800);
				} catch {}
			}
		}, 200);
		return () => clearTimeout(t);
	}, [backendGraphData]); // 依存配列を修正

	// 政策ノード密集の緩和（リンク距離・反発力）
	React.useEffect(() => {
		if (!fgRef.current || !backendGraphData || backendGraphData.nodes.length === 0) return;
		try {
			const linkForceUnknown = fgRef.current.d3Force?.('link');
			const linkForce = linkForceUnknown as unknown as { distance?: (fn: (link: ForceGraphLink) => number) => void } | undefined;
			if (linkForce && typeof linkForce.distance === 'function') {
				linkForce.distance((link: ForceGraphLink) => {
					const sid = String(((link.source as { id?: string | number })?.id) ?? link.source ?? '');
					const tid = String(((link.target as { id?: string | number })?.id) ?? link.target ?? '');
					const involvesPolicy = sid.startsWith('policy:') || tid.startsWith('policy:');
					const v = typeof link.value === 'number' ? link.value : 0.4;
					
					// 政策テーマノードの数を取得
					const policyNodeCount = graphData.nodes.filter(node => String(node.id).startsWith('policy:')).length;
					
					// 複数テーマ選択時は距離を調整（より近くに）
					const baseDistance = policyNodeCount > 1 ? 10 : 8;
					const distanceRange = policyNodeCount > 1 ? 3 : 3;
					
					// 政策テーマと人物ノードの距離を調整（3分の2に縮小）
					return involvesPolicy ? baseDistance + (1 - v) * distanceRange : 7;
				});
			}

			const chargeForceUnknown = fgRef.current.d3Force?.('charge');
			const chargeForce = chargeForceUnknown as unknown as { strength?: (fn: (node: NodeObj) => number) => void } | undefined;
			if (chargeForce && typeof chargeForce.strength === 'function') {
				chargeForce.strength((node: NodeObj) => {
					const isPolicy = String(node.id ?? '').startsWith('policy:');
					// 政策テーマノードの反発力を弱めて距離を縮小
					return isPolicy ? -300 : -50;
				});
			}

			// 政策テーマノードを中心に固定し、専門家ノードを放射状に配置
			const centerForceUnknown = fgRef.current.d3Force?.('center');
			const centerForce = centerForceUnknown as unknown as { x?: (fn: () => number) => void; y?: (fn: () => number) => void } | undefined;
			if (centerForce && typeof centerForce.x === 'function' && typeof centerForce.y === 'function') {
				centerForce.x(() => 0);
				centerForce.y(() => 0);
			}

			// 政策テーマノードを複数選択時に位置をずらして配置
			const policyNodes = graphData.nodes.filter(node => String(node.id).startsWith('policy:'));
			policyNodes.forEach((node, index) => {
				const isPolicy = String(node.id).startsWith('policy:');
				if (isPolicy) {
					if (policyNodes.length === 1) {
						// 単一の場合は中心に配置
						node.fx = 0;
						node.fy = 0;
					} else {
						// 複数の場合は円形に配置（半径を縮小）
						const angle = (index / policyNodes.length) * 2 * Math.PI;
						const radius = 50; // 配置半径を50に縮小
						node.fx = Math.cos(angle) * radius;
						node.fy = Math.sin(angle) * radius;
					}
				} else {
					// 専門家ノードは自由に移動
					node.fx = undefined;
					node.fy = undefined;
				}
			});

			fgRef.current.d3ReheatSimulation?.();
		} catch {}
	}, [backendGraphData, graphData.nodes]); // 依存配列を修正

  const shouldShowEmpty = !backendGraphData || backendGraphData.nodes.length === 0;
  if (shouldShowEmpty) {
		return (
			<div className={`h-full flex items-center justify-center ${className}`}>
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
						<span className="material-symbols-outlined text-blue-500 text-2xl">group</span>
					</div>
          <p className="text-white text-lg mb-2 font-bold">人脈マップ</p>
          <p className="text-white text-sm font-bold">検索を実行して結果を表示します</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`h-full w-full overflow-hidden min-h-0 bg-transparent ${className}`}>
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				nodeRelSize={4}
				nodeLabel={nodeLabel}
				nodeCanvasObject={nodeCanvasObject}
				linkColor={(link: ForceGraphLink) => {
					const value = typeof link.value === 'number' ? link.value : 0.4;
					const alpha = 0.3 + Math.min(0.7, value * 0.7);
					return `rgba(88,170,219,${alpha.toFixed(3)})`; // 水色系に変更
				}}
				linkDirectionalParticles={0}
				linkWidth={(link: ForceGraphLink) => {
					const value = typeof link.value === 'number' ? link.value : 0.4;
					return 1.5 + value * 4;
				}}
				linkCurvature={0.3}
				linkCurveRotation={0}
				enableZoomInteraction
				enablePanInteraction
				cooldownTime={4000}
				onNodeClick={handleNodeClick}
				backgroundColor={'transparent'}
				centerAt={(width: number, height: number) => ({ x: width / 2, y: height / 2 })}
				// キャンバスを外側カードと同じ位置に固定
				width={undefined}
				height={undefined}
				onRenderFramePre={(ctx: CanvasRenderingContext2D) => {
					const { width, height } = ctx.canvas;
					// 背景を透明で初期化
					ctx.save();
					ctx.clearRect(0, 0, width, height);
					// 背景は透明（外側のカードの背景色を使用）
					ctx.restore();
				}}
			/>

			{/* Neo4j Bloom風の洗練された凡例 - レスポンシブ対応 */}
			<div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-xl border border-gray-200/50 text-xs">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full shadow-sm border border-blue-300"></div>
						<span className="text-gray-700 font-semibold">政策テーマ</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full shadow-sm border border-blue-300"></div>
						<span className="text-gray-700 font-semibold">専門家</span>
					</div>
					<div className="text-gray-500 font-medium text-xs sm:text-sm">
						クリックでプロフィール表示 / ドラッグで移動 / ホイールでズーム
					</div>
				</div>
			</div>
		</div>
	);
}