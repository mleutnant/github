/**
 * Square checkbox; the checked state is a white square inside a blue square — no tick glyph.
 */
export interface CheckboxProps {
  label: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
