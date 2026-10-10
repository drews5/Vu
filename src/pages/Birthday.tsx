import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Copy, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Seo } from '../components/Seo';
import { contactEmail } from '../utils/contact';
import { birthdayEmailDraft, birthdayRequestText, type BirthdayRequest } from '../utils/birthdayRequest';
import birthday from '../data/birthday.json';
import groupPhoto from '../assets/winter-showcase.webp';
import '../styles/birthday.css';

const emptyRequest: BirthdayRequest = {
  package: 'video', song: 'Happy Birthday', recipient: '', date: '', plans: '', notes: '',
};

function localToday() {
  const today = new Date();
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
}

function BirthdayConfetti() {
  return (
    <svg className="birthday-confetti" viewBox="0 0 640 450" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <g strokeWidth="3" strokeLinecap="round">
        <path d="m16 68 6 12m584 48 8-8M14 300l9-5m595 52 10 6" stroke="#91a8c6" />
        <path d="M55 11c-8 9 10 12 3 20M576 19c13 1 3 18 16 19M39 429c12-10 13 12 24 2M608 418c-10-8-13 10-22 3" stroke="#2e4c6d" />
        <path d="m200 10 6-8m215 439 7 5m208-235 6 9m-630-6 7-8" stroke="#d2ad67" />
      </g>
      <g fill="#91a8c6"><circle cx="352" cy="12" r="4" /><circle cx="630" cy="277" r="4" /><circle cx="12" cy="387" r="3" /><circle cx="205" cy="440" r="3" /></g>
      <g fill="#d2ad67"><path d="m486 12 7 5-5 7-7-5zM7 152l7 5-5 7-7-5zm618 225 7 5-5 7-7-5z" /></g>
    </svg>
  );
}

export function Birthday() {
  const [request, setRequest] = useState<BirthdayRequest>({ ...emptyRequest });
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const manualCopy = useRef<HTMLTextAreaElement>(null);
  const live = request.package === 'live';
  const emailDraft = birthdayEmailDraft(request);

  function update(field: keyof BirthdayRequest, value: string) {
    setRequest((previous) => ({ ...previous, [field]: value }));
    setCopyStatus('idle');
  }

  function selectPackage(value: BirthdayRequest['package']) {
    setRequest((previous) => ({
      ...previous, package: value,
      ...(value === 'video' ? { song: 'Happy Birthday', plans: '' } : {}),
    }));
    setCopyStatus('idle');
  }

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = emailDraft;
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(birthdayRequestText(request));
      setCopyStatus('copied');
    } catch {
      setCopyStatus('manual');
      window.requestAnimationFrame(() => {
        manualCopy.current?.focus();
        manualCopy.current?.select();
      });
    }
  }

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
          <h1 id="birthday-heading" className="birthday-title"><span>Birthday songs</span>{' '}<span>with Vocal U</span></h1>
          <p className="birthday-intro">{birthday.intro}</p>
          <p className="birthday-support">{birthday.support}</p>
          <div className="birthday-hero-actions">
            <a href="#birthday-request" className="birthday-button">Request a birthday song <ArrowRight size={18} aria-hidden="true" /></a>
            <Link to="/media" className="birthday-link">Hear us sing <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="birthday-photo">
          <BirthdayConfetti />
          <img src={groupPhoto} alt="Vocal U smiling and posing together after the winter showcase" width={1500} height={1003} fetchPriority="high" />
        </figure>
      </motion.section>

      <motion.section variants={childVariants} id="birthday-request" className="birthday-request" aria-labelledby="birthday-request-heading">
        <form onSubmit={openEmail} aria-label="Birthday song request">
          <fieldset className="birthday-options">
            <legend>Video or in person?</legend>
            <div className="birthday-choice-list">
              {birthday.packages.map((option) => (
                <label key={option.id} className="birthday-choice" data-selected={request.package === option.id}>
                  <input type="radio" name="birthday-package" value={option.id} checked={request.package === option.id} onChange={() => selectPackage(option.id as BirthdayRequest['package'])} />
                  <span className="birthday-choice-copy"><span className="birthday-choice-title">{option.title}</span><span className="birthday-choice-description">{option.description}</span></span>
                  <span className="birthday-choice-price">${option.price}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="birthday-request-grid">
            <div className="birthday-dedication">
              <h2 id="birthday-request-heading">Request a birthday song</h2>
              <p>Tell us who we're singing for and when.</p>
            </div>
            <div className="birthday-form-sheet">
              <div className="birthday-fields">
                <div>
                  <label htmlFor="birthday-recipient">Birthday person's name</label>
                  <input id="birthday-recipient" value={request.recipient} onChange={(event) => update('recipient', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="birthday-date">{live ? 'What day?' : 'Video needed by'}</label>
                  <input id="birthday-date" type="date" value={request.date} min={localToday()} onChange={(event) => update('date', event.target.value)} required />
                </div>
                {live && <>
                  <fieldset className="birthday-song-options birthday-field-full">
                    <legend>Song</legend>
                    <div className="birthday-song-list">
                      {['Happy Birthday', 'Birthday Sex'].map((song) => (
                        <label key={song}><input type="radio" name="birthday-song" value={song} checked={request.song === song} onChange={() => update('song', song)} /><span>{song}</span></label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="birthday-field-full">
                    <label htmlFor="birthday-plans">Where and about what time? <span>(optional)</span></label>
                    <input id="birthday-plans" value={request.plans} onChange={(event) => update('plans', event.target.value)} maxLength={500} placeholder="e.g. your dorm lounge, around 7 pm" />
                  </div>
                </>}
                <div className="birthday-field-full">
                  <label htmlFor="birthday-notes">Anything else? <span>(optional)</span></label>
                  <textarea id="birthday-notes" value={request.notes} onChange={(event) => update('notes', event.target.value)} maxLength={1200} rows={3} placeholder="How to say their name or a message you'd like us to include" />
                </div>
              </div>
              <div className="birthday-form-footer">
                <p id="birthday-email-help">Your email app will open with this request filled in. Send it to <a href={emailDraft}>{contactEmail}</a>, and we'll reply to work out the details and send our Venmo.</p>
                <div className="birthday-form-actions">
                  <button type="submit" className="birthday-button" aria-describedby="birthday-email-help"><Mail size={18} aria-hidden="true" /> Email birthday request</button>
                  <button type="button" className="birthday-copy-button" onClick={copyRequest}><Copy size={16} aria-hidden="true" /> Copy request</button>
                </div>
                <p className="birthday-copy-help">Email didn't open? Copy your request and paste it into an email.</p>
                <p role="status" className="birthday-copy-status">{copyStatus === 'copied' ? 'Request copied. You can paste it into an email to vocalu@umn.edu.' : ''}</p>
                {copyStatus === 'manual' && <div className="birthday-manual-copy">
                  <label htmlFor="birthday-request-copy">Copy these details into an email to {contactEmail}:</label>
                  <textarea ref={manualCopy} id="birthday-request-copy" readOnly value={birthdayRequestText(request)} rows={7} />
                </div>}
              </div>
            </div>
          </div>
        </form>
      </motion.section>
    </PageTransition>
  );
}
