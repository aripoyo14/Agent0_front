import * as React from "react";
import { useRouter } from "next/navigation";
import { NetworkNode, SearchFilters } from "@/types";
import { sampleNetworkNodes } from "@/data/search-data";

interface NetworkMapProps {
  filters: SearchFilters;
  className?: string;
}

interface ConnectionLineProps {
  from: NetworkNode;
  to: NetworkNode;
}

function ConnectionLine({ from, to }: ConnectionLineProps) {
  // 両ノードの関連度の平均を計算
  const avgRelevance = ((from.relevanceScore || 0.5) + (to.relevanceScore || 0.5)) / 2;
  const opacity = 0.3 + avgRelevance * 0.4;
  
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgba(88, 170, 219, 0.4)"
      strokeWidth="1"
      opacity={opacity}
      className="transition-all duration-300 hover:stroke-[#58aadb] hover:opacity-80"
    />
  );
}

interface NodeCircleProps {
  node: NetworkNode;
  onClick: (node: NetworkNode) => void;
  onDoubleClick: (node: NetworkNode) => void;
}

function NodeCircle({ node, onClick, onDoubleClick }: NodeCircleProps) {
  // 関連度に基づいてサイズを計算 (0.5-1.0 -> 8-20px)
  const relevanceScore = node.relevanceScore || 0.5;
  const radius = 8 + (relevanceScore * 12);
  
  // グラデーション用のユニークID
  const gradientId = `node-gradient-${node.id}`;
  
  return (
    <g
      className="cursor-pointer transition-all duration-300 ease-out"
      onClick={() => onClick(node)}
      onDoubleClick={() => onDoubleClick(node)}
    >
      {/* グラデーション定義 */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#b4d9d6', stopOpacity: 0.8 + relevanceScore * 0.2 }} />
          <stop offset="100%" style={{ stopColor: '#58aadb', stopOpacity: 0.8 + relevanceScore * 0.2 }} />
        </linearGradient>
      </defs>
      
      {/* グラデーション円 */}
      <circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={`url(#${gradientId})`}
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="1.5"
        className="transition-all duration-300 hover:stroke-white hover:stroke-2"
        style={{
          filter: `drop-shadow(0 2px 4px rgba(88, 170, 219, ${0.2 + relevanceScore * 0.2}))`
        }}
      />
      
      {/* 名前ラベル */}
      <text
        x={node.x || 0}
        y={(node.y || 0) + radius + 15}
        textAnchor="middle"
        className="text-[11px] font-medium fill-gray-700 transition-all duration-300 pointer-events-none"
        style={{ 
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}
      >
        {node.name}
      </text>
    </g>
  );
}

export function NetworkMap({ filters, className }: NetworkMapProps) {
  const router = useRouter();
  const [filteredNodes, setFilteredNodes] = React.useState<NetworkNode[]>([]);

  // フィルターに基づいてノードをフィルタリング
  React.useEffect(() => {
    let nodes = [...sampleNetworkNodes];
    
    // 政策テーマやその他の条件でフィルタリング
    // ここでは簡単な例として、一部のノードのみを表示
    if (filters.policyThemes.length > 0 || filters.industries.length > 0 || 
        filters.positions.length > 0 || filters.searchQuery.trim() !== '') {
      // フィルターが適用されている場合、一部のノードのみを表示
      nodes = nodes.slice(0, 8);
    }
    
    setFilteredNodes(nodes);
  }, [filters]);

  const handleNodeClick = (node: NetworkNode) => {
    // ノードをクリックで直接プロフィールページに遷移
    router.push(`/profile/${node.id}`);
  };

  const handleNodeDoubleClick = (node: NetworkNode) => {
    // ダブルクリックも同じ動作
    router.push(`/profile/${node.id}`);
  };

  const getConnectedNodes = (nodeId: string): NetworkNode[] => {
    const node = filteredNodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    return filteredNodes.filter(n => node.connections.includes(n.id));
  };

  const hasAnyFilters = filters.policyThemes.length > 0 || 
    filters.industries.length > 0 || 
    filters.positions.length > 0 || 
    filters.searchQuery.trim() !== '';

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
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="w-full h-full block rounded"
        preserveAspectRatio="xMidYMid meet"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(88, 170, 219, 0.08) 0%, rgba(180, 217, 214, 0.04) 50%, transparent 100%)'
        }}
      >
        {/* 背景パターン */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        
        {/* グリッド背景 */}
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
        {/* 接続線を描画 */}
        {filteredNodes.map(node => {
          const connectedNodes = getConnectedNodes(node.id);
          return connectedNodes.map(connectedNode => (
            <ConnectionLine
              key={`${node.id}-${connectedNode.id}`}
              from={node}
              to={connectedNode}
            />
          ));
        })}
        
        {/* ノードを描画 */}
        {filteredNodes.map(node => (
          <NodeCircle
            key={node.id}
            node={node}
            onClick={handleNodeClick}
            onDoubleClick={handleNodeDoubleClick}
          />
        ))}
      </svg>
      

      
      {/* 美しい凡例 */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/50 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-br from-[#b4d9d6] to-[#58aadb] rounded-full shadow-sm"></div>
          <span className="text-gray-700 font-medium">クリックでプロフィール表示</span>
        </div>
      </div>
    </div>
  );
}
