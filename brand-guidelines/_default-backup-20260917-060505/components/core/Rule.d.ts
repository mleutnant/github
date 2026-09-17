/**
 * The Unterlinie / accent rule. Weight is derived from the type it belongs to, per guideline p.4.
 */
export interface RuleProps {
  color?: 'red' | 'yellow' | 'blue' | 'white' | 'ink' | string;
  /** "title" (4px, under a Subtitel) | "body" (2px) | number | CSS length */
  weight?: 'title' | 'body' | number | string;
  width?: string;
  orientation?: 'horizontal' | 'vertical';
  /** Length when vertical */
  length?: string;
  style?: React.CSSProperties;
}
export function Rule(props: RuleProps): JSX.Element;
