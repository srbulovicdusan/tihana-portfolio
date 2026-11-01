import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import styles from './about.module.css';

const SKILLS = [
  ['UI/UX Design', 'Figma, Framer, FigJam'],
  ['Web Design', 'Figma, Framer, Wix, HTML / CSS'],
  ['Brand Identity', 'Illustrator, Photoshop, InDesign'],
  ['Email Design', 'Klaviyo, Mailchimp'],
  ['Wireframing & Prototyping', 'Figma'],
  ['Marketing & Social Media Design', 'Photoshop, Illustrator, CapCut'],
  ['Animation', 'Spine 2D, After Effects'],
] as const;

export function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className={`eyebrow ${styles.metaRow}`}>
        <span className={styles.strong}>(03) Skills</span>
        <span>Disciplines &amp; Tools</span>
      </div>
      <div {...reveal('rule')} className={styles.rule} />

      <h2 id="skills-title" className={`${styles.title} ${styles.titleSkills}`}>
        <span className="hl hl-clip">
          <span {...reveal('line')} className="blk">What I do</span>
        </span>
        <span className={`hl hl-clip ${styles.i25}`}>
          <span {...reveal('line', 100)} className="blk">
            and <span className="it-light">how.</span>
          </span>
        </span>
      </h2>

      <div>
        <div className={`eyebrow ${styles.skillsHead}`}>
          <span>Disciplines</span>
          <span>Tools</span>
        </div>
        <ul className={styles.skills}>
          {SKILLS.map(([label, tools], i) => (
            <li key={label} className={styles.skill}>
              <span className={styles.skillNum}>{pad2(i + 1)}</span>
              <span className={styles.skillLabel}>{label}</span>
              <span className={styles.skillTools}>{tools}</span>
            </li>
          ))}
        </ul>
        <div className={styles.rule} />
      </div>
    </section>
  );
}
