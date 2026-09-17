/**
 * Icon with its Unterzeile — the product-argument unit used across slides, brochure and website.
 */
export interface FeatureIconProps {
  /** Icon name from the SCHMIDT set */
  name: string;
  label: React.ReactNode;
  size?: number;
  tone?: 'ink' | 'on-blue' | 'red';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}
export function FeatureIcon(props: FeatureIconProps): JSX.Element;
