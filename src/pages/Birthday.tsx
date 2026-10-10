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
        <div className="birthday-hero-copy">
          <p className="birthday-eyebrow">Vocal U · Birthday songs</p>
          <h1 id="birthday-heading" className="birthday-title"><span>Happy</span><span>Birthday.</span></h1>
          <p className="birthday-intro">{birthday.intro}</p>
          <p className="birthday-prices">A video for $5. An in-person song for $50.</p>
          <div className="birthday-hero-actions">
            <a href="#birthday-request" className="birthday-button">Make a request <ArrowRight size={18} aria-hidden="true" /></a>
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
            <h2 ref={successHeading} tabIndex={-1}>Thanks for thinking of us!</h2>
            <p>We've received your {submitted.package === 'live' ? 'in-person song' : 'birthday video'} request for {submitted.recipient}. We'll reply to <strong>{submitted.email}</strong> to confirm the details and payment.</p>
            <p>Please wait for our email before paying. Your birthday song isn't booked yet.</p>
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
                <p className="birthday-eyebrow">Your birthday request</p>
                <h2>{request.recipient.trim() ? <>For<br /><span>{request.recipient.trim()}.</span></> : <>Who's<br />it for?</>}</h2>
                <p>Tell us about them. We'll reply by email to confirm the plan and sort out payment.</p>
                <div className="birthday-summary" aria-live="polite">
                  <p>{selectedPackage.title} <span>${selectedPackage.price}</span></p>
                  <p>{live ? request.song : 'Happy Birthday'}</p>
                </div>
                <Link to="/contact" className="birthday-link">Other booking questions? <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>

              <div className="birthday-form-sheet">
                <fieldset disabled={sending} className="birthday-fields">
                  <legend className="sr-only">Birthday song details</legend>
                  <div>
                    <label htmlFor="birthday-recipient">Birthday person's name</label>
                    <input ref={recipientInput} id="birthday-recipient" value={request.recipient} onChange={(event) => update('recipient', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="off" placeholder="Who gets the song?" />
                  </div>
                  <div>
                    <label htmlFor="birthday-date">{live ? 'Requested date' : 'Video needed by'}</label>
                    <input id="birthday-date" type="date" value={request.date} min={localToday()} onChange={(event) => update('date', event.target.value)} required aria-describedby="birthday-confirmation" />
                  </div>
                  {live && <>
                    <div className="birthday-field-full">
                      <label htmlFor="birthday-song">What are we singing?</label>
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
                  <p id="birthday-confirmation">We'll confirm the date and details by email before you're booked. Please wait for our reply before sending Venmo payment.</p>
                  <button type="submit" disabled={sending} className="birthday-button">{sending ? 'Sending your request...' : 'Send birthday request'} <ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                {status === 'error' && <div role="alert" className="birthday-error">We couldn't send your request. Your details are still here. Please try again or <a href={fallbackEmail}>email this request to {contactEmail}</a>.</div>}
              </div>
            </div>
          </form>
        )}
      </motion.section>
    </PageTransition>
  );
}
