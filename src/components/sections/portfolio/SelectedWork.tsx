import { PROJECTS } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { ProjectCard } from './ProjectCard';
import styles from './SelectedWork.module.css';

export function SelectedWork() {
  const [featured, ...rest] = PROJECTS;
  const rows = [rest.slice(0, 2), rest.slice(2, 4)];

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={`eyebrow ${styles.meta}`}>
        <span className={styles.metaStrong}>(03) Selected Work</span>
        <span />
        <span className={styles.metaEnd}>05 Projects</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />

      <div className={styles.head}>
        <h2 id="work-title" className={styles.title}>
          <span className="hl hl-clip">
            <span {...reveal('line')} className="blk">
              Selected <span className="it">Work.</span>
            </span>
          </span>
        </h2>
        <p {...reveal('fade', 150)} className={styles.intro}>
          Product, brand, web and email work from the last three years.
        </p>
      </div>

      {featured && <ProjectCard project={featured} index={0} variant="featured" />}

      {rows.map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map((p, col) => (
            <ProjectCard key={p.slug} project={p} index={1 + r * 2 + col} variant="grid" secondColumn={col === 1} />
          ))}
        </div>
      ))}
    </section>
  );
}
