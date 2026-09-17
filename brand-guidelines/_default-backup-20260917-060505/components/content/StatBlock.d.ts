/**
 * A "Zahlen und Fakten" figure: big bold value over a quiet caption.
 */
export interface StatBlockProps {
  value: React.ReactNode;
  label: React.ReactNode;
  tone?: 'ink' | 'on-blue';
  style?: React.CSSProperties;
}
export function StatBlock(props: StatBlockProps): JSX.Element;
