import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { TbCheck, TbLoader2, TbSend } from 'react-icons/tb';
import { gsap, useGSAP } from '../../lib/gsap';
import { socials } from '../../data/socials';
import { useReveal } from '../../hooks';
import styles from './Contact.module.css';

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwiatWoYxg7rcPjsgpFLaqqiwEv3W7YhrrYztYsLeRrAiSxPLV57goYfjatw4ddJIDJ/exec';

const EMPTY = { nombre: '', email: '', telefono: '', mensaje: '' };
type Field = keyof typeof EMPTY;

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);

  useReveal(root);
  const { contextSafe } = useGSAP({ scope: root });

  // Quick crossfade from the form to the confirmation; no motion when reduced.
  const showSuccess = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap
      .timeline()
      .to(formRef.current, { autoAlpha: 0, y: reduce ? 0 : -8, duration: reduce ? 0 : 0.18, ease: 'power2.out' })
      .set(formRef.current, { display: 'none' })
      .set(successRef.current, { display: 'flex' })
      .from(successRef.current, { autoAlpha: 0, y: reduce ? 0 : 8, duration: reduce ? 0 : 0.3, ease: 'power3.out' });
    successRef.current?.focus();
  };

  const update = (key: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setSending(true);

    const data = new FormData();
    (Object.keys(form) as Field[]).forEach((k) => data.append(k, form[k]));
    data.append('honeypot', honeypot);

    try {
      // Apps Script answers with an opaque response under no-cors; reaching here means it was sent.
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data });
    } catch {
      /* network errors are indistinguishable under no-cors */
    }
    setSending(false);
    setForm(EMPTY);
    contextSafe(showSuccess)();
  };

  return (
    <section ref={root} id="contact" className="section" aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <h2 id="contact-title" className={styles.title} data-split>
            Hablemos de tu proyecto
          </h2>
          <p className={styles.lede} data-reveal>
            Cuéntame qué quieres construir o qué necesita escalar. Te respondo lo antes posible.
          </p>
          <ul className={styles.channels} data-reveal>
            {socials.map(({ label, handle, href, icon: Icon, external }) => (
              <li key={label}>
                <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
                  <Icon aria-hidden />
                  <strong>{label}</strong>
                  <span>{handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.card} glow-card`} data-reveal>
          <form ref={formRef} className={styles.form} onSubmit={onSubmit}>
            <input
              className={styles.honeypot}
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" autoComplete="name" required value={form.nombre} onChange={update('nombre')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@empresa.com"
                  value={form.email}
                  onChange={update('email')}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="telefono">
                Teléfono <span className={styles.optional}>(opcional)</span>
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={update('telefono')}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="¿Qué quieres construir y para cuándo?"
                value={form.mensaje}
                onChange={update('mensaje')}
              />
            </div>
            <button type="submit" className={styles.submit} disabled={sending}>
              {sending ? <TbLoader2 className={styles.spin} aria-hidden /> : <TbSend aria-hidden />}
              {sending ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </form>

          <div ref={successRef} className={styles.success} tabIndex={-1} role="status">
            <TbCheck aria-hidden />
            <h3>Mensaje enviado</h3>
            <p>Gracias por escribir. Te respondo lo antes posible.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
