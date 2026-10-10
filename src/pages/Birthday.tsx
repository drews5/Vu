import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Seo } from '../components/Seo';
import { contactEmail, submitContactMessage } from '../utils/contact';
import birthday from '../data/birthday.json';
import performancePhoto from '../assets/icca-2025.webp';
import '../styles/birthday.css';

type Package = 'video' | 'live';
type Request = {
  package: Package;
  song: string;
  recipient: string;
  date: string;
  name: string;
  email: string;
  location: string;
  time: string;
  notes: string;
};

const emptyRequest: Request = {
  package: 'video', song: 'Happy Birthday', recipient: '', date: '',
  name: '', email: '', location: '', time: '', notes: '',
};

function localToday() {
  const today = new Date();
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
}

function requestMessage(request: Request) {
  const live = request.package === 'live';
  return [
    'Birthday song request',
    `Option: ${live ? 'In-person song ($50)' : 'Birthday video ($5)'}`,
    `Song: ${live ? request.song : 'Happy Birthday'}`,
    `Birthday person: ${request.recipient.trim()}`,
    `Requested date: ${request.date}`,
    ...(live ? [`Location: ${request.location.trim()}`, `Preferred time: ${request.time.trim()}`] : []),
    `Requested by: ${request.name.trim()}`,
    `Reply email: ${request.email.trim()}`,
    `Notes: ${request.notes.trim() || 'None'}`,
    '',
    'Please confirm availability and payment details by email. This request is not a confirmed booking.',
  ].join('\n');
}

function BirthdayDecorations() {
  return (
    <div className="birthday-decorations" aria-hidden="true">
      {['left', 'right'].map((side) => (
        <svg key={side} className={`birthday-balloons birthday-balloons-${side}`} viewBox="0 0 180 300" fill="none">
          <path d="M49 108c-19 55 61 83 38 152M111 80c29 50-38 92-20 180M142 134c-6 44-67 68-51 126" stroke="#7188a3" strokeWidth="1.5" />
          <ellipse cx="43" cy="66" rx="34" ry="44" transform="rotate(-19 43 66)" fill="#91a8c6" />
          <path d="m49 108-5 8 13-3" fill="#91a8c6" />
          <path d="M24 42c-5 6-7 15-6 23" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <ellipse cx="110" cy="44" rx="31" ry="40" transform="rotate(9 110 44)" fill="#2e4c6d" />
          <path d="m110 81-6 8 12 1" fill="#2e4c6d" />
          <path d="M97 20c-5 5-7 12-7 19" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".7" />
          <ellipse cx="143" cy="100" rx="28" ry="37" transform="rotate(19 143 100)" fill="#cbd8e6" />
          <path d="m142 134-7 6 11 4" fill="#cbd8e6" />
          <path d="M133 78c-5 3-8 8-9 14" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ))}
      <svg className="birthday-confetti" viewBox="0 0 1120 430" fill="none" preserveAspectRatio="none">
        <g strokeWidth="3" strokeLinecap="round">
          <path d="m235 47 5 13m-41 214 12-5m730-186 8-10m-57 234 12 7" stroke="#91a8c6" />
          <path d="M321 15c-8 10 11 12 3 22M807 25c13 1 3 18 16 19M147 352c12-10 13 12 24 2M983 360c-10-8-13 10-22 3" stroke="#2e4c6d" />
          <path d="m180 71 6-10m540 268 8 5m-479 55 6-12m610-204 12 2" stroke="#d2ad67" />
        </g>
        <g fill="#91a8c6"><circle cx="284" cy="155" r="4" /><circle cx="1020" cy="61" r="4" /><circle cx="933" cy="243" r="4" /><circle cx="361" cy="352" r="3" /></g>
        <g fill="#d2ad67"><path d="m704 15 7 5-5 7-7-5zm-483 171 7 5-5 7-7-5zm641 193 7 5-5 7-7-5z" /></g>
      </svg>
    </div>
  );
}

export function Birthday() {
  const [request, setRequest] = useState<Request>(emptyRequest);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [submitted, setSubmitted] = useState<Request | null>(null);
  const recipientInput = useRef<HTMLInputElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const live = request.package === 'live';
  const selectedPackage = birthday.packages.find((option) => option.id === request.package)!;
  const sending = status === 'sending';

  useEffect(() => {
    if (status === 'success') successHeading.current?.focus();
  }, [status]);

  function update(field: keyof Request, value: string) {
    setRequest((previous) => ({ ...previous, [field]: value }));
    if (status === 'error') setStatus('idle');
  }

  function selectPackage(value: Package) {
    setRequest((previous) => ({
      ...previous,
      package: value,
      ...(value === 'video' ? { song: 'Happy Birthday', location: '', time: '' } : {}),
    }));
    if (status === 'error') setStatus('idle');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setStatus('sending');
    try {
      await submitContactMessage({
        name: request.name.trim(),
        email: request.email.trim(),
        subject: `Birthday song request — ${request.recipient.trim()}`,
        message: requestMessage(request),
      });
      setSubmitted({ ...request });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const fallbackEmail = `mailto:${contactEmail}?subject=${encodeURIComponent(`Birthday song request — ${request.recipient.trim()}`)}&body=${encodeURIComponent(requestMessage(request))}`;

  return (
    <PageTransition className="vu-birthday">
      <Seo
        title="Birthday songs | Vocal U"
        description={birthday.description}
        path="/birthday"
        keywords={['Vocal U birthday songs', 'birthday video', 'a cappella birthday serenade']}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: birthday.heading, path: '/birthday' }]}
      />

      <motion.section variants={childVariants} className="birthday-hero" aria-labelledby="birthday-heading">
        <BirthdayDecorations />
        <div className="birthday-hero-copy">
          <h1 id="birthday-heading" className="birthday-title"><span>Birthday songs</span><span>with Vocal U</span></h1>
          <p className="birthday-intro">{birthday.intro}</p>
          <div className="birthday-hero-actions">
            <a href="#birthday-request" className="birthday-button">Request a birthday song <ArrowRight size={18} aria-hidden="true" /></a>
            <Link to="/media" className="birthday-link">Hear us sing <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="birthday-photo">
          <img src={performancePhoto} alt="Vocal U singing together on stage at ICCA in 2025" width={1500} height={1000} fetchPriority="high" />
          <figcaption>Vocal U at ICCA, 2025</figcaption>
        </figure>
      </motion.section>

      <motion.section variants={childVariants} id="birthday-request" className="birthday-request" aria-label="Make a birthday request">
        {status === 'success' && submitted ? (
          <div role="status" className="birthday-success">
            <CheckCircle2 size={40} aria-hidden="true" />
            <p className="birthday-eyebrow">Request received</p>
            <h2 ref={successHeading} tabIndex={-1}>Thanks for your request!</h2>
            <p>We've received your request for {submitted.recipient} and will reply to <strong>{submitted.email}</strong> to confirm the details.</p>
            <button type="button" className="birthday-button" onClick={() => { setRequest({ ...emptyRequest }); setStatus('idle'); window.requestAnimationFrame(() => recipientInput.current?.focus()); }}>Send another request <ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-label="Birthday song request" aria-busy={sending}>
            <fieldset disabled={sending} className="birthday-options">
              <legend>Video or in person?</legend>
              <div className="birthday-choice-list">
                {birthday.packages.map((option) => (
                  <label key={option.id} className="birthday-choice" data-selected={request.package === option.id}>
                    <input type="radio" name="birthday-package" value={option.id} checked={request.package === option.id} onChange={() => selectPackage(option.id as Package)} />
                    <span className="birthday-choice-copy"><span className="birthday-choice-title">{option.action}</span><span className="birthday-choice-description">{option.description}</span></span>
                    <span className="birthday-choice-price">${option.price}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="birthday-request-grid">
              <div className="birthday-dedication">
                <h2>{request.recipient.trim() ? <>A birthday song for <span>{request.recipient.trim()}</span></> : <>Who are we singing for?</>}</h2>
                <p>Share their name, the date, and a few details about what you have in mind.</p>
                <div className="birthday-summary" aria-live="polite">
                  <p>{selectedPackage.title} <span>${selectedPackage.price}</span></p>
                  <p>{live ? request.song : 'Happy Birthday'}</p>
                </div>
              </div>

              <div className="birthday-form-sheet">
                <fieldset disabled={sending} className="birthday-fields">
                  <legend className="sr-only">Birthday song details</legend>
                  <div>
                    <label htmlFor="birthday-recipient">Birthday person's name</label>
                    <input ref={recipientInput} id="birthday-recipient" value={request.recipient} onChange={(event) => update('recipient', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="birthday-date">{live ? 'Requested date' : 'Video needed by'}</label>
                    <input id="birthday-date" type="date" value={request.date} min={localToday()} onChange={(event) => update('date', event.target.value)} required aria-describedby="birthday-confirmation" />
                  </div>
                  {live && <>
                    <div className="birthday-field-full">
                      <label htmlFor="birthday-song">Song</label>
                      <select id="birthday-song" value={request.song} onChange={(event) => update('song', event.target.value)}><option>Happy Birthday</option><option>Birthday Sex</option></select>
                    </div>
                    <div>
                      <label htmlFor="birthday-location">Location</label>
                      <input id="birthday-location" value={request.location} onChange={(event) => update('location', event.target.value)} required pattern=".*\S.*" maxLength={300} placeholder="Venue or address, city" />
                    </div>
                    <div>
                      <label htmlFor="birthday-time">Preferred time</label>
                      <input id="birthday-time" value={request.time} onChange={(event) => update('time', event.target.value)} required pattern=".*\S.*" maxLength={100} placeholder="Time and time zone" />
                    </div>
                  </>}
                  <div>
                    <label htmlFor="birthday-name">Your name</label>
                    <input id="birthday-name" value={request.name} onChange={(event) => update('name', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="birthday-email">Your email</label>
                    <input id="birthday-email" type="email" value={request.email} onChange={(event) => update('email', event.target.value)} required maxLength={254} autoComplete="email" />
                  </div>
                  <div className="birthday-field-full">
                    <label htmlFor="birthday-notes">Anything we should know? <span>(optional)</span></label>
                    <textarea id="birthday-notes" value={request.notes} onChange={(event) => update('notes', event.target.value)} maxLength={2000} rows={3} placeholder="How to say their name, a message for them, or delivery details" />
                  </div>
                </fieldset>
                <div className="birthday-form-footer">
                  <p id="birthday-confirmation">We'll email you to confirm availability and arrange payment.</p>
                  <button type="submit" disabled={sending} className="birthday-button">{sending ? 'Sending your request...' : 'Send birthday request'} <ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                {status === 'error' && <div role="alert" className="birthday-error">We couldn't send your request. Your details are still here. Please try again or <a href={fallbackEmail}>email this request to {contactEmail}</a>.</div>}
                <p className="birthday-contact">Have another booking question? <a href={`mailto:${contactEmail}`}>Email us at {contactEmail}</a>.</p>
              </div>
            </div>
          </form>
        )}
      </motion.section>
    </PageTransition>
  );
}
