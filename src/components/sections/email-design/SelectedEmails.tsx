import Image from 'next/image';
import { SectionHead } from '@/components/sections/case-study/SectionHead';
import { Arrow } from '@/components/ui/Arrow';
import { img, topCrop, type ImageSrc } from '@/lib/images';
import { pad2 } from '@/lib/projects';
import { reveal } from '@/lib/reveal';
import { EmailLightbox } from './EmailLightbox';
import styles from './email-design.module.css';

export type Email = { brand: string; desc: string; image: ImageSrc };

/** Gallery of email tops; each opens the full email in the viewer. */
export function SelectedEmails({ emails }: { emails: Email[] }) {
  const full = emails.map(({ brand, desc, image }) => {
    const { src, width, height } = img(image);
    return { brand, desc, src, width, height };
  });

  return (
    <section id="emails" className={styles.emails} aria-labelledby="emails-title">
      <SectionHead label="(03) Selected Emails" headingId="emails-title" />
      <EmailLightbox emails={full}>
        <ul {...reveal('fade')} className={styles.gallery}>
          {emails.map((e, i) => (
            <li key={e.brand} className={styles.item}>
              <button type="button" data-email={i} aria-label={`View full ${e.brand} email`} className={styles.card}>
                <Image
                  {...img(topCrop(e.image))}
                  alt={`${e.brand} email, top section`}
                  sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 22vw"
                  className={styles.thumb}
                />
                <span aria-hidden="true" className={styles.pill}>
                  <span>
                    View full email <Arrow dir="up-right" />
                  </span>
                </span>
              </button>
              <div className={styles.caption}>
                <h3 className={styles.brand}>{e.brand}</h3>
                <span className={styles.num}>{pad2(i + 1)}</span>
              </div>
            </li>
          ))}
        </ul>
      </EmailLightbox>
    </section>
  );
}
