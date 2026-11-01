import { HoverGroup } from '@/components/behavior/HoverGroup';
import { reveal } from '@/lib/reveal';
import styles from './about.module.css';

const JOBS = [
  {
    company: 'Digital Arts Agency',
    role: 'UI/UX & Graphic Designer',
    years: '2026',
    type: 'Employment',
    items: ['UI/UX design for AI-powered platforms', 'Websites and landing pages', 'Brand identities and visual systems', 'Email, social media and marketing design'],
  },
  {
    company: 'PanonIT / Codolis',
    role: 'UI/UX & Graphic Designer',
    years: '2024–2026',
    type: 'Employment',
    items: [
      'UI design for web-based games',
      '2D game animations in Spine 2D',
      'Game assets and visual systems',
      'Asset integration and HTML edits in game builds',
      'Marketing graphics and promotional materials',
    ],
  },
  {
    company: 'Bushido',
    role: 'UI/UX Designer',
    years: '2023–2024',
    type: 'Contract',
    items: [
      'Mobile app UI/UX, from wireframes to final screens',
      'Web interface design',
      'Interactive prototypes in Figma',
      'Developer handoff and implementation support',
    ],
  },
  {
    company: 'Freelance Projects',
    role: 'Independent Designer',
    years: '2022–Ongoing',
    type: 'Freelance',
    freelance: true,
    items: [
      'SaaS platforms and mobile apps, all launched and live',
      'Brand identities for diverse clients',
      'Websites and landing pages',
      'Social media and Instagram content',
      'Email and digital campaigns',
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className={`eyebrow ${styles.metaGrid}`}>
        <span className={styles.strong}>(02) Experience</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />

      <h2 id="experience-title" className={`${styles.title} ${styles.titleExperience}`}>
        <span className="hl hl-clip">
          <span {...reveal('line')} className="blk">Where I&apos;ve</span>
        </span>
        <span className={`hl hl-clip ${styles.i25}`}>
          <span {...reveal('line', 100)} className="blk">
            <span className="it-light">worked.</span>
          </span>
        </span>
      </h2>

      <HoverGroup className={styles.jobs}>
        {JOBS.map(j => (
          <article key={j.company} data-hover-item="" className={j.freelance ? `${styles.job} ${styles.freelance}` : styles.job}>
            <span aria-hidden="true" className={styles.jobLine} />
            <div className={styles.when}>
              <span className={styles.years}>
                <span className={j.freelance ? `${styles.dot} ${styles.dotOpen}` : styles.dot} />
                {j.years}
              </span>
              <span className={`eyebrow ${styles.muted}`}>{j.type}</span>
            </div>
            <div className={styles.jobMain}>
              <h3 className={styles.company}>{j.company}</h3>
              <span className={styles.role}>{j.role}</span>
            </div>
            <ul className={styles.duties}>
              {j.items.map(it => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
        <div {...reveal('rule')} className={styles.rule} />
      </HoverGroup>
    </section>
  );
}
