/**
 * Square-cornered brand button. Red = primary action, blue = secondary, outline = tertiary, quiet = inline text action.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'quiet';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Set on blue surfaces so the outline variant flips to white */
  onBlue?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
