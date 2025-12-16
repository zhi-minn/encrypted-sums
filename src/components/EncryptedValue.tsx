import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EncryptedValueProps {
  value: string;
  label?: string;
  isAnimating?: boolean;
}

const EncryptedValue: React.FC<EncryptedValueProps> = ({ 
  value, 
  label,
  isAnimating = false 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {label}
        </span>
      )}
      <div 
        className={cn(
          "flex items-center gap-3 p-4 rounded-md bg-secondary/50 border border-primary/20",
          isAnimating && "animate-pulse-glow"
        )}
      >
        <Lock className="w-4 h-4 text-primary shrink-0" />
        <code className="text-xs font-mono text-primary/90 break-all leading-relaxed">
          {value}
        </code>
      </div>
    </div>
  );
};

export default EncryptedValue;
