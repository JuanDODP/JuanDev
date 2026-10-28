import { useRef } from 'react';
import type { IconType } from 'react-icons';
import { TbBinaryTree, TbHeartHandshake, TbLanguage, TbScale, TbUsersGroup } from 'react-icons/tb';
import { profile, softSkills } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import styles from './About.module.css';

const SKILL_ICONS: IconType[] = [TbUsersGroup, TbScale, TbHeartHandshake, TbBinaryTree, TbLanguage];

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="about" className="section" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.bio}>
          <h2 id="about-title" className={styles.title} data-split>
            Sobre mí
          </h2>
          <p className={styles.intro} data-reveal>
            No me quedo en escribir código: diseño sistemas que una empresa pueda operar, escalar y mantener. Priorizo la
            arquitectura limpia y la ética profesional en cada decisión.
          </p>
          <p data-reveal>{profile.bio}</p>
        </div>

        <ul className={styles.skills} aria-label="Habilidades blandas">
          {softSkills.map((skill, i) => {
            const Icon = SKILL_ICONS[i % SKILL_ICONS.length];
            return (
              <li key={skill.label} className={`${styles.skill} glow-card`} data-reveal>
                <Icon aria-hidden />
                <h3>{skill.label}</h3>
                <p>{skill.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
