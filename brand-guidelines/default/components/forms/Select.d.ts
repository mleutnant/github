/**
 * Dropdown with a square chevron drawn from two brand-blue triangles.
 */
export interface SelectProps {
  label?: string;
  id?: string;
  options: (string | { value: string; label: string })[];
  value?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
