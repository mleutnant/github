/**
 * Layout Prinzip 2 (guideline p.6): images overlaid with the "negativ multiplizieren" effect,
 * an analogy to overlapping panes of glass. Used in the inner pages of print and in digital media.
 */
export interface ImageOverlayProps {
  base: string;
  overlay: string;
  ratio?: string;
  /** Horizontal offset of the overlaid image */
  offset?: string;
  blend?: 'screen' | 'lighten' | 'multiply';
  style?: React.CSSProperties;
}
export function ImageOverlay(props: ImageOverlayProps): JSX.Element;
