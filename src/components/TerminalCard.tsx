import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent';
}

const TerminalCard: React.FC<TerminalCardProps> = ({ 
  title, 
  children, 
  className,
  glowColor = 'primary' 
}) => {
  return (
    <div 
      className={cn(
        "relative rounded-lg border bg-card overflow-hidden transition-all duration-500",
        glowColor === 'primary' ? "border-primary/30 hover:border-primary/60" : "border-accent/30 hover:border-accent/60",
        className
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-primary/80" />
        </div>
        <span className="font-mono text-xs text-muted-foreground ml-2">
          {title}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
    </div>
  );
};

export default TerminalCard;
