/**
 * SCHMIDT logo — Bildmarke (symbol) and Wortmarke, per guideline p.2.
 */
export interface LogoProps {
  /** "wordmark" = Bild- + Wortmarke (default), "mark" = Bildmarke only */
  variant?: 'wordmark' | 'mark';
  /** positive (on white), negative (white, on blue/photo), mono (all black) */
  theme?: 'positive' | 'negative' | 'mono';
  /** Rendered height in px, or any CSS length. Height is defined by the Bildmarke. */
  height?: number | string;
  alt?: string;
  /** Reserve the Schutzraum (clear space) around the lockup */
  clearspace?: boolean;
  style?: React.CSSProperties;
}
export function Logo(props: LogoProps): JSX.Element;
