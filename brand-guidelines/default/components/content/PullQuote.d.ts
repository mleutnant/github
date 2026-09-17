/**
 * Magazine-style pull quote, set in bold display type with German quotation marks („ ").
 */
export interface PullQuoteProps {
  quote: React.ReactNode;
  author?: string;
  role?: React.ReactNode;
  tone?: 'ink' | 'on-blue';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export function PullQuote(props: PullQuoteProps): JSX.Element;
