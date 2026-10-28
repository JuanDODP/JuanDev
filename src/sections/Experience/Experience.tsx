import { useRef } from 'react';
import { TbSchool } from 'react-icons/tb';
import { education, experiences } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../lib/gsap';
import { TechTag } from '../../components/ui';
import styles from './Experience.module.css';

export function Experience() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // The rail fills as you read down the timeline, and each stop lights up when reached.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(`.${styles.railFill}`, {
          scaleY: 0,
          ease: 'none',
          scrollTrigger: { trigger: `.${styles.timeline}`, start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
        });
        gsap.utils.toArray<HTMLElement>(`.${styles.role}`).forEach((role) =>
          ScrollTrigger.create({ trigger: role, start: 'top 65%', toggleClass: { targets: role, className: styles.lit } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="section" aria-labelledby="experience-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.aside}>
          <h2 id="experience-title" className={styles.title} data-split>
            Experiencia
          </h2>
          <p className={styles.lede} data-reveal>
            Más de dos años construyendo y operando software en producción, de startups a equipos corporativos.
          </p>

          <div className={styles.education} data-reveal>
            <h3>Formación</h3>
            <ul>
              {education.map((e) => (
                <li key={e.degree}>
                  <TbSchool aria-hidden />
                  <div>
                    <strong>{e.degree}</strong>
                    <span>
                      {e.institution} · {e.period}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.track}>
          <span className={styles.railFill} aria-hidden />
          <ol className={styles.timeline}>
          {experiences.map((job) => (
            <li key={job.id} className={`${styles.role} ${job.isCurrent ? styles.current : ''}`} data-reveal>
              <p className={styles.period}>
                <span>{job.period}</span>
                <span>{job.location}</span>
                {job.isCurrent && <span className={styles.badge}>Actual</span>}
              </p>
              <h3 className={styles.company}>{job.company}</h3>
              <p className={styles.position}>{job.role}</p>
              <ul className={styles.highlights}>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className={styles.tags} data-stagger>
                {job.tags.map((t) => (
                  <TechTag key={t} name={t} />
                ))}
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
