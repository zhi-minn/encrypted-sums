import React from 'react';
import { Server, ArrowRight, Cpu } from 'lucide-react';

interface ProcessingAnimationProps {
  isProcessing: boolean;
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="p-3 rounded-lg bg-secondary border border-primary/30">
          <Cpu className="w-6 h-6 text-primary animate-pulse-glow" />
        </div>
        <span className="font-mono text-sm">Encrypted Data</span>
      </div>
      
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <ArrowRight 
            key={i} 
            className="w-4 h-4 text-primary animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="p-3 rounded-lg bg-secondary border border-accent/30">
          <Server className="w-6 h-6 text-accent animate-encrypt-spin" />
        </div>
        <span className="font-mono text-sm">HE Server</span>
      </div>
      
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <ArrowRight 
            key={i} 
            className="w-4 h-4 text-accent animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="p-3 rounded-lg bg-secondary border border-primary/30 glow-primary">
          <Cpu className="w-6 h-6 text-primary" />
        </div>
        <span className="font-mono text-sm">Result</span>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
