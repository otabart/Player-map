declare module 'playermap_graph' {
  interface GraphVisualizationProps {
    endpoint: string;
    onNodeSelect: (node: any) => void;
    onLoadingChange: (isLoading: boolean) => void;
    walletAddress?: string;
  }

  export const GraphVisualization: React.FC<GraphVisualizationProps>;
  export const LoadingAnimation: React.FC;
} 