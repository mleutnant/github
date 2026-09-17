/**
 * Section title with the optional red Unterlinie and a lead paragraph.
 */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  rule?: 'red' | 'yellow' | 'blue' | false;
  ruleWidth?: string;
  tone?: 'ink' | 'on-blue';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
