/**
 * Blue site footer with address, legal links, negative logo and the yellow closing rule.
 */
export interface SiteFooterProps {
  address?: string[];
  phone?: string;
  email?: string;
  legal?: string[];
  social?: string[];
  style?: React.CSSProperties;
}
export function SiteFooter(props: SiteFooterProps): JSX.Element;
