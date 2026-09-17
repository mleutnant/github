/**
 * A glyph from the proprietary SCHMIDT icon set (16 icons, guideline p.5).
 * Black on white or white on blue; red is permitted on the website only.
 */
export interface IconProps {
  /** 'barrierefrei' | 'chat' | 'breite' | 'taschenrechner' | 'komfort' | 'renovierung' | 'barrierefrei' | 'groesse' | 'regen' | 'lautsprecher-aus' | 'schloss' | 'tablet-handy' | 'thermostat' | 'sonnenschutz' | 'komfort' | 'sonderausstattung' */
  name: string;
  size?: number | string;
  tone?: 'ink' | 'white' | 'red' | 'blue';
  title?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
