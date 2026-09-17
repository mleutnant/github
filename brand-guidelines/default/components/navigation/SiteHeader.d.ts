/**
 * schmidt-boke.de masthead: logo left, bold nav right, language switch and Kunden-Login.
 */
export interface SiteHeaderProps {
  items: { id: string; label: string; href?: string }[];
  active?: string;
  onNavigate?: (id: string) => void;
  login?: string;
  languages?: string[];
  language?: string;
  onLanguage?: (l: string) => void;
  sticky?: boolean;
  style?: React.CSSProperties;
}
export function SiteHeader(props: SiteHeaderProps): JSX.Element;
