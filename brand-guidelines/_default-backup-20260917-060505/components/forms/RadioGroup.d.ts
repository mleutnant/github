/**
 * Mutually exclusive choice. The only round shapes in the system, because a radio must read as a radio.
 */
export interface RadioGroupProps {
  legend?: string;
  name: string;
  options: (string | { value: string; label: string })[];
  value?: string;
  inline?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
export function RadioGroup(props: RadioGroupProps): JSX.Element;
