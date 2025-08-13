"use client";

import * as React from "react";
import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { NetworkNode, SearchFilters } from "@/types";
import { sampleNetworkNodes } from "@/data/search-data";
import dynamic from "next/dynamic";
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// 最低限の型定義（ランタイム依存を避けるためローカルに定義）
type NodeObj = GraphNode & { x?: number; y?: number; id?: string | number };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LinkObj = { source: string; target: string; value?: number };
interface ForceGraphMethods {
  zoomToFit: (ms?: number, padding?: number, nodeFilter?: (node: NodeObj) => boolean) => void;
}

interface NetworkMapProps {
  filters: SearchFilters;
  className?: string;
}

type GraphNode = NetworkNode & { color?: string };

type GraphLink = { source: string; target: string; value?: number };

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function NetworkMap({ filters, className }: NetworkMapProps) {
  const router = useRouter();
  const fgRef = useRef<ForceGraphMethods | null>(null);

  const hasAnyFilters = filters.policyThemes.length > 0 || 
    filters.industries.length > 0 || 
    filters.positions.length > 0 || 
    filters.searchQuery.trim() !== '';

  const filteredNodes = useMemo<NetworkNode[]>(() => {
    let nodes = [...sampleNetworkNodes];
    if (hasAnyFilters) {
      nodes = nodes.slice(0, 12);
    }
    return nodes;
  }, [hasAnyFilters]);

  const graphData = useMemo<GraphData>(() => {
    const nodes: GraphNode[] = filteredNodes.map((n) => ({
      ...n,
      color: groupToColor(n.group)
    }));

    // 重複リンクを避けるため、idの大小で一意化
    const linkSet = new Set<string>();
    const links: GraphData["links"] = [];
    const nodeIdSet = new Set(nodes.map(n => String(n.id)));
    for (const n of filteredNodes) {
      for (const to of n.connections) {
        // 片側が存在しないリンクは除外
        if (!nodeIdSet.has(String(to))) continue;
        const key = Number(n.id) < Number(to) ? `${n.id}-${to}` : `${to}-${n.id}`;
        if (!linkSet.has(key)) {
          linkSet.add(key);
          links.push({ source: n.id, target: to, value: 1 });
        }
      }
    }
    return { nodes, links };
  }, [filteredNodes]);

  const handleNodeClick = (node: NodeObj) => {
    const id = node.id as string;
    router.push(`/profile/${id}`);
  };

  const nodeLabel = (node: NodeObj) => {
    return `${node.name}${node.company ? "\n" + node.company : ""}`;
  };

  const nodeCanvasObject = (node: NodeObj, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node;
    const relevance = n.relevanceScore ?? 0.5;
    const radius = 4 + relevance * 8;

    // 放射状グラデーション（中心: #b4d9d6 → 外側: #58aadb）
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
    grad.addColorStop(0, `rgba(180, 217, 214, ${innerOpacity})`); // #b4d9d6
    grad.addColorStop(1, `rgba(88, 170, 219, ${outerOpacity})`);   // #58aadb

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
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 名前ラベル
    const label = n.name;
    const fontSize = Math.max(8, 10 / globalScale + relevance * 6);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(55,65,81,0.9)';
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

  if (!hasAnyFilters) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-500 text-2xl">group</span>
          </div>
          <p className="text-gray-500 text-lg mb-2 font-bold">人脈マップ</p>
          <p className="text-gray-400 text-sm font-bold">絞り込み条件を選択してください</p>
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
        linkColor={() => 'rgba(88,170,219,0.35)'}
        linkDirectionalParticles={0}
        linkWidth={() => 1}
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

function groupToColor(group: number): string {
  const palette = [
    '#58aadb', '#b4d9d6', '#7db0e3', '#a3e1dc', '#9fb8d1', '#6fbfca', '#90d1f0', '#7ec8e3'
  ];
  return palette[(Math.abs(group) || 0) % palette.length];
}
