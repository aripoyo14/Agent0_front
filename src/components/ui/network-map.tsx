import * as React from "react";
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
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#e5e7eb"
      strokeWidth="1"
      opacity="0.6"
    />
  );
}

interface NodeCircleProps {
  node: NetworkNode;
  isHighlighted: boolean;
  onClick: (node: NetworkNode) => void;
}

function NodeCircle({ node, isHighlighted, onClick }: NodeCircleProps) {
  return (
    <g
      className="cursor-pointer transition-all hover:opacity-80"
      onClick={() => onClick(node)}
    >
      {/* 背景円 */}
      <circle
        cx={node.x}
        cy={node.y}
        r={isHighlighted ? "28" : "24"}
        fill={isHighlighted ? "#007aff" : "#ffffff"}
        stroke={isHighlighted ? "#005bb5" : "#007aff"}
        strokeWidth="2"
        className="transition-all"
      />
      
      {/* アイコン */}
      <foreignObject
        x={(node.x || 0) - 12}
        y={(node.y || 0) - 12}
        width="24"
        height="24"
      >
        <div className="flex items-center justify-center w-6 h-6">
          <span 
            className={`material-symbols-outlined text-lg ${
              isHighlighted ? "text-white" : "text-blue-600"
            }`}
          >
            person
          </span>
        </div>
      </foreignObject>
      
      {/* 名前ラベル */}
      <text
        x={node.x || 0}
        y={(node.y || 0) + 35}
        textAnchor="middle"
        className="text-[9px] font-medium fill-gray-700"
      >
        {node.name}
      </text>
      
      {/* 会社名ラベル */}
      <text
        x={node.x || 0}
        y={(node.y || 0) + 45}
        textAnchor="middle"
        className="text-[8px] fill-gray-500"
      >
        {node.company}
      </text>
    </g>
  );
}

export function NetworkMap({ filters, className }: NetworkMapProps) {
  const [selectedNode, setSelectedNode] = React.useState<NetworkNode | null>(null);
  const [filteredNodes, setFilteredNodes] = React.useState<NetworkNode[]>([]);

  // フィルターに基づいてノードをフィルタリング
  React.useEffect(() => {
    let nodes = [...sampleNetworkNodes];
    
    // 政策テーマやその他の条件でフィルタリング
    // ここでは簡単な例として、一部のノードのみを表示
    if (filters.policyThemes.length > 0 || filters.industries.length > 0 || 
        filters.positions.length > 0 || filters.regions.length > 0 || 
        filters.others.length > 0) {
      // フィルターが適用されている場合、一部のノードのみを表示
      nodes = nodes.slice(0, 8);
    }
    
    setFilteredNodes(nodes);
  }, [filters]);

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const getConnectedNodes = (nodeId: string): NetworkNode[] => {
    const node = filteredNodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    return filteredNodes.filter(n => node.connections.includes(n.id));
  };

  const hasAnyFilters = filters.policyThemes.length > 0 || 
    filters.industries.length > 0 || 
    filters.positions.length > 0 || 
    filters.regions.length > 0 || 
    filters.others.length > 0;

  if (!hasAnyFilters) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-500 text-2xl">group</span>
          </div>
          <p className="text-gray-500 text-lg mb-2">人脈マップ</p>
          <p className="text-gray-400 text-sm">絞り込み条件を選択してください</p>
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
        className="bg-gray-50 rounded w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
      >
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
            isHighlighted={selectedNode?.id === node.id}
            onClick={handleNodeClick}
          />
        ))}
      </svg>
      
      {/* 選択されたノードの詳細情報 */}
      {selectedNode && (
        <div className="absolute top-2 right-2 bg-white p-3 rounded shadow-lg border max-w-[200px] z-10">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-800 text-xs leading-tight">{selectedNode.name}</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600 ml-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mb-0.5 leading-tight">{selectedNode.company}</p>
          <p className="text-[10px] text-gray-500 mb-2 leading-tight">{selectedNode.position}</p>
          
          {selectedNode.connections.length > 0 && (
            <div>
              <p className="text-[9px] text-gray-500 mb-1">
                接続: {selectedNode.connections.length}名
              </p>
              <button className="text-[9px] text-blue-600 hover:text-blue-800">
                詳細を見る →
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 凡例 */}
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-sm border text-[10px]">
        <div className="flex items-center gap-1 mb-0.5">
          <div className="w-2 h-2 bg-white border border-blue-600 rounded-full"></div>
          <span className="text-gray-600">人物</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-600 border border-blue-800 rounded-full"></div>
          <span className="text-gray-600">選択中</span>
        </div>
      </div>
    </div>
  );
}
