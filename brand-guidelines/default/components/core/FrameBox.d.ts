/**
 * Layout Prinzip 1 (guideline p.6): a coloured surface or photo overlaid by an L-shaped frame,
 * offset so a gap opens where the two cross — an analogy to the Bildmarke.
 */
export interface FrameBoxProps {
  children?: React.ReactNode;
  surface?: 'blue' | 'white' | 'subtle' | 'none' | string;
  frame?: 'red' | 'yellow' | 'blue' | string;
  corner?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Offset between surface edge and frame, in px */
  inset?: number | string;
  weight?: string;
  /** Background photo URL instead of a flat surface */
  image?: string;
  minHeight?: number | string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}
export function FrameBox(props: FrameBoxProps): JSX.Element;
