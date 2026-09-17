/**
 * News teaser as used in "Neues von Schmidt": photo, headline, two-line lead, red text action.
 */
export interface NewsCardProps {
  image?: string;
  kicker?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  href?: string;
  cta?: string;
  style?: React.CSSProperties;
}
export function NewsCard(props: NewsCardProps): JSX.Element;
