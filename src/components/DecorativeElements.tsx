
import React from 'react';
import { cn } from '@/lib/utils';

interface LeafProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
}

const LeafPattern: React.FC<LeafProps> = ({ 
  className, 
  size = 'md',
  rotation = 0,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };
  
  return (
    <div 
      className={cn(
        'leaf-pattern', 
        sizeClasses[size], 
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      <svg 
        viewBox="0 0 200 200" 
        fill="none"
        className="w-full h-full animate-leaf-sway"
      >
        <path 
          d="M100 20C60 20 20 60 20 100C20 140 60 180 100 180C140 180 180 140 180 100C180 60 140 20 100 20ZM100 170C65 170 30 140 30 100C30 60 65 30 100 30C135 30 170 60 170 100C170 140 135 170 100 170Z" 
          fill="currentColor" 
          className="text-forest-500" 
        />
        <path 
          d="M100 40C70 40 40 70 40 100C40 130 70 160 100 160C130 160 160 130 160 100C160 70 130 40 100 40ZM100 150C75 150 50 130 50 100C50 70 75 50 100 50C125 50 150 70 150 100C150 130 125 150 100 150Z" 
          fill="currentColor" 
          className="text-forest-400" 
        />
        <path 
          d="M100 60C80 60 60 80 60 100C60 120 80 140 100 140C120 140 140 120 140 100C140 80 120 60 100 60ZM100 130C85 130 70 115 70 100C70 85 85 70 100 70C115 70 130 85 130 100C130 115 115 130 100 130Z" 
          fill="currentColor" 
          className="text-forest-300" 
        />
        <path 
          d="M100 80C90 80 80 90 80 100C80 110 90 120 100 120C110 120 120 110 120 100C120 90 110 80 100 80Z" 
          fill="currentColor" 
          className="text-forest-200" 
        />
      </svg>
    </div>
  );
};

interface WavyBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top' | 'bottom';
  amplitude?: number;
  color?: string;
}

const WavyBorder: React.FC<WavyBorderProps> = ({ 
  className, 
  position = 'bottom',
  amplitude = 20,
  color = 'text-forest-50',
  ...props 
}) => {
  const isTop = position === 'top';
  const transformStyle = isTop ? 'rotate(180deg)' : '';
  
  return (
    <div 
      className={cn(
        'absolute left-0 w-full overflow-hidden z-10',
        isTop ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ transform: transformStyle }}
      {...props}
    >
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className={cn('w-full h-[60px]', color)}
      >
        <path 
          d={`M0,0 C150,${amplitude} 350,${-amplitude} 500,${amplitude} C650,${-amplitude} 850,${amplitude} 1200,0 V120 H0 Z`}
          fill="currentColor" 
        />
      </svg>
    </div>
  );
};

export { LeafPattern, WavyBorder };
