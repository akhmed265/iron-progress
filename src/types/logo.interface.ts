export type LogoSize = 'small' | 'medium' | 'large';

export interface DumbbellLogoProps {
  size: LogoSize;
  isAnimated: boolean;
  animationSpeed?: number;
  showText?: boolean;
}

