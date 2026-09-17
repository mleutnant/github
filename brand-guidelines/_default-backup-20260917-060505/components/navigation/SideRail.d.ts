/**
 * The website's yellow rail on the right edge: contact/chat and back-to-top.
 */
export interface SideRailProps {
  onContact?: () => void;
  onTop?: () => void;
  contactLabel?: string;
  topLabel?: string;
  style?: React.CSSProperties;
}
export function SideRail(props: SideRailProps): JSX.Element;
