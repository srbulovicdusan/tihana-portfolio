import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { Arrow } from '@/components/ui/Arrow';
import { reveal } from '@/lib/reveal';
import { routes } from '@/lib/site';
import styles from './case-study.module.css';

export type Fact = {
  term: string;
  value: string;
  /** Keep on one line, or balance its lines */
  wrap?: 'nowrap' | 'balance';
  tabular?: boolean;
  /** Full-width row closing the list */
  wide?: boolean;
};

type Props = {
  /** Id of the h1, which also names the section */
  titleId: string;
  tags: string;
  caseNumber: string;
  title: string;
  /**
   * Font size of a title that shares a wrapping row with the tagline. Without
   * it the title and tagline sit on Profitz's 3:1 grid.
   */
  titleSize?: string;
  titleNowrap?: boolean;
  /** One or two lines; the last never wraps */
  tagline: [string] | [string, string];
  intro: string;
  facts: Fact[];
  /** Small print under the facts (which then keep four columns, two on mobile) */
  note?: string;
  /** Four columns (two on mobile) without a note, instead of as many as fit */
  factsFour?: boolean;
  /** The hero figure */
  children: ReactNode;
};

function ddClass(f: Fact) {
  if (f.wrap === 'nowrap') return 'nowrap';
  if (f.wrap === 'balance') return styles.balance;
  return f.tabular ? styles.tabular : undefined;
}

export function CaseHero({ titleId, tags, caseNumber, title, titleSize, titleNowrap, tagline, intro, facts, note, factsFour, children }: Props) {
  const list = (
    <dl className={factsFour ? `${styles.facts} ${styles.factsFour}` : styles.facts}>
      {facts.map((f, i) => (
        <div key={f.term} {...reveal('fade', i * 60)} className={f.wide ? `${styles.fact} ${styles.factWide}` : styles.fact}>
          <dt className="eyebrow">{f.term}</dt>
          <dd className={ddClass(f)}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <section id="top" className={styles.top} aria-labelledby={titleId}>
      <div className={styles.heroInner}>
        <Link href={routes.work} className={styles.back}>
          <Arrow dir="left" />
          Back to work
        </Link>
        <div className={`eyebrow ${styles.heroMeta}`}>
          <span className={styles.strong}>{tags}</span>
          <span>{`Case Study (${caseNumber})`}</span>
        </div>
        <div {...reveal('rule')} className={styles.rule} />

        <div
          className={titleSize ? styles.heroRow : styles.heroGrid}
          style={titleSize ? ({ '--title-size': titleSize } as CSSProperties) : undefined}
        >
          <h1 id={titleId} className={styles.h1}>
            <span className="hl hl-clip">
              <span {...reveal('line')} className={titleNowrap ? 'blk nowrap' : 'blk'}>{title}</span>
            </span>
          </h1>
          <p {...reveal('fade', 120)} className={styles.tagline}>
            {tagline.map((line, i) => (
              <span key={line} className={i === tagline.length - 1 ? 'blk nowrap' : 'blk'}>
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.introGrid}>
          <p {...reveal('fade')} className={styles.intro}>
            {intro}
          </p>
          {note ? (
            <div className={styles.factsCol}>
              {list}
              <p className={styles.factsNote}>{note}</p>
            </div>
          ) : (
            list
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
