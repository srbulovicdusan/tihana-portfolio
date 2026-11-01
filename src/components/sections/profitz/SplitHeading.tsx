import { reveal } from '@/lib/reveal';

type Props = {
  id: string;
  className?: string;
  first: string;
  /** Invisible lead-in that aligns the accent under the matching words of the first line */
  indent: string;
  accent: string;
};

/** Two-line display heading: "High revenue can hide / ·········· thin margins." */
export function SplitHeading({ id, className, first, indent, accent }: Props) {
  return (
    <h2 id={id} className={className}>
      <span className="hl hl-clip">
        <span {...reveal('line')} className="blk">{first}</span>
      </span>
      <span className="hl hl-clip">
        <span {...reveal('line', 100)} className="blk nowrap">
          <span aria-hidden="true" className="spacer">{indent}</span>
          <span className="it-light">{accent}</span>
        </span>
      </span>
    </h2>
  );
}
