/**
 * The brand's list: level 1 is marked by a vertical bar, level 2 by a filled square —
 * both sized from the body type (guideline p.4).
 */
export interface BulletListProps {
  items: React.ReactNode[];
  level?: 1 | 2;
  tone?: 'ink' | 'on-blue';
  columns?: number;
  style?: React.CSSProperties;
}
export function BulletList(props: BulletListProps): JSX.Element;
