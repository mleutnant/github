/**
 * Single-line text field. Square corners, 1px blue border, bold caption label.
 */
export interface InputProps {
  label?: string;
  id?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'search';
  hint?: string;
  error?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
