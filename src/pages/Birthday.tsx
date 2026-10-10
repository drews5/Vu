import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, Mail, Music2, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { ExploreMore } from '../components/ExploreMore';
import { Seo } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { contactEmail, submitContactMessage } from '../utils/contact';
import birthday from '../data/birthday.json';
import groupPhoto from '../assets/group-photo.webp';

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
const inputClass = 'w-full rounded-xl border-2 border-[#A3B8D3] bg-white px-4 py-3 text-base text-[#2B4C6F] transition-colors focus:border-[#2B4C6F] focus:outline-2 focus:outline-offset-2 focus:outline-[#8FA8C8]';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B4C6F] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#385F88] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4C6F] disabled:cursor-wait disabled:opacity-60';

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
  const packageSelect = useRef<HTMLSelectElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
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

  function choosePackage(value: Package) {
    selectPackage(value);
    setStatus('idle');
    document.getElementById('birthday-request')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
    // The form may be replacing its success state, so focus after React renders it.
    window.requestAnimationFrame(() => packageSelect.current?.focus({ preventScroll: true }));
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
    <PageTransition className="pb-8 text-[#2B4C6F] md:pb-16">
      <Seo
        title="Birthday songs | Vocal U"
        description={birthday.description}
        path="/birthday"
        keywords={['Vocal U birthday songs', 'birthday video', 'a cappella birthday serenade']}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: birthday.heading, path: '/birthday' }]}
      />

      <motion.section variants={childVariants} className="vu-page-hero my-[25px] grid bg-[#2B4C6F] text-white lg:grid-cols-[1.15fr_1fr]" aria-labelledby="birthday-heading">
        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-10 md:p-12">
          <h1 id="birthday-heading" style={{ ...fontYearbook, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: '1.1', letterSpacing: '0.03em' }}>
            {birthday.heading}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 md:text-lg">{birthday.intro}</p>
          <a href="#birthday-request" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-[#2B4C6F] transition-colors hover:bg-[#EDF2F8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Request a birthday song <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <img src={groupPhoto} alt="Vocal U members together on campus" className="relative z-10 h-[270px] w-full object-cover object-[center_20%] md:h-[360px] lg:h-full lg:min-h-[390px]" width={1347} height={1236} fetchPriority="high" />
      </motion.section>

      <motion.section variants={childVariants} aria-labelledby="birthday-options" className="mt-9 md:mt-12">
        <h2 id="birthday-options" className="mb-5 px-3 md:px-0" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 40px)' }}>Two ways to celebrate</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {birthday.packages.map((option) => {
            const Icon = option.id === 'video' ? Video : Music2;
            return (
              <article key={option.id} className="vu-panel flex flex-col border border-gray-100 bg-white p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="rounded-xl bg-[#8FA8C8]/15 p-3"><Icon className="size-6" aria-hidden="true" /></div>
                  <span className="text-4xl" style={fontYearbook}>${option.price}</span>
                </div>
                <h3 className="mb-3 text-2xl" style={fontYearbook}>{option.title}</h3>
                <p className="leading-7">{option.description}</p>
                <p className="mb-6 mt-3 leading-7 text-[#2B4C6F]/75">{option.details}</p>
                <button type="button" className={`${buttonClass} mt-auto self-start`} disabled={sending} onClick={() => choosePackage(option.id as Package)}>
                  {option.action} <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </motion.section>

      <motion.section variants={childVariants} id="birthday-request" aria-labelledby="request-heading" className="mt-10 grid scroll-mt-32 items-start gap-6 lg:mt-14 lg:grid-cols-[.75fr_1.25fr]">
        <div className="px-3 py-2 md:px-0 lg:pr-8">
          <h2 id="request-heading" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: '1.2' }}>Who are we singing for?</h2>
          <p className="mt-5 leading-7">Tell us a little about the birthday person and what you have in mind. We'd love to help you celebrate!</p>
          <ol className="mt-7 space-y-5">
            {[
              ['Send your request', 'Choose a video or an in-person song and share the details below.'],
              ['Hear back from us', "We'll email you to confirm availability, delivery or location, and payment details."],
              ['Celebrate with VU', 'Once everything is confirmed, leave the singing to us.'],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8FA8C8]/20 text-sm font-semibold" aria-hidden="true">{index + 1}</span>
                <div><h3 className="font-semibold">{title}</h3><p className="mt-1 leading-7 text-[#2B4C6F]/75">{text}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-8 border-t border-[#8FA8C8]/30 pt-6">
            <p className="leading-7">Have a question or a different event in mind?</p>
            <Link to="/contact" className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4C6F]">Get in touch <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="vu-panel border border-gray-100 bg-white p-6 md:p-8">
          {status === 'success' && submitted ? (
            <div role="status" className="py-4">
              <CheckCircle2 className="mb-5 size-10 text-[#2B4C6F]" aria-hidden="true" />
              <h3 ref={successHeading} tabIndex={-1} className="text-3xl" style={fontYearbook}>Thanks for the request!</h3>
              <p className="mt-4 leading-7">We've received your {submitted.package === 'live' ? 'in-person song' : 'birthday video'} request for {submitted.recipient}. We'll reply to <strong className="break-words">{submitted.email}</strong> to confirm the details.</p>
              <p className="mt-4 leading-7">Your booking isn't confirmed yet. Please wait for our email before sending payment.</p>
              <button type="button" className={`${buttonClass} mt-6`} onClick={() => { setRequest({ ...emptyRequest }); setStatus('idle'); window.requestAnimationFrame(() => packageSelect.current?.focus()); }}>Send another request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Birthday song request" aria-busy={sending}>
              <h3 className="mb-6 text-2xl" style={fontYearbook}>Request a birthday song</h3>
              <fieldset disabled={sending} className="grid min-w-0 gap-5 sm:grid-cols-2">
                <legend className="sr-only">Birthday song details</legend>
                <div className={live ? '' : 'sm:col-span-2'}>
                  <label htmlFor="birthday-package" className="mb-2 block">Birthday option</label>
                  <select ref={packageSelect} id="birthday-package" value={request.package} onChange={(event) => selectPackage(event.target.value as Package)} className={inputClass}>
                    {birthday.packages.map((option) => <option key={option.id} value={option.id}>{option.title} — ${option.price}</option>)}
                  </select>
                </div>
                {live && <div>
                  <label htmlFor="birthday-song" className="mb-2 block">Song</label>
                  <select id="birthday-song" value={request.song} onChange={(event) => update('song', event.target.value)} className={inputClass}>
                    <option>Happy Birthday</option><option>Birthday Sex</option>
                  </select>
                </div>}
                <div>
                  <label htmlFor="birthday-recipient" className="mb-2 block">Birthday person's name</label>
                  <input id="birthday-recipient" value={request.recipient} onChange={(event) => update('recipient', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="off" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="birthday-date" className="mb-2 block">{live ? 'Requested date' : 'Video needed by'}</label>
                  <input id="birthday-date" type="date" value={request.date} min={localToday()} onChange={(event) => update('date', event.target.value)} required aria-describedby="birthday-confirmation" className={`${inputClass} min-w-0`} />
                </div>
                <div>
                  <label htmlFor="birthday-name" className="mb-2 block">Your name</label>
                  <input id="birthday-name" value={request.name} onChange={(event) => update('name', event.target.value)} required pattern=".*\S.*" maxLength={100} autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="birthday-email" className="mb-2 block">Your email</label>
                  <input id="birthday-email" type="email" value={request.email} onChange={(event) => update('email', event.target.value)} required maxLength={254} autoComplete="email" className={inputClass} />
                </div>
                {live && <>
                  <div>
                    <label htmlFor="birthday-location" className="mb-2 block">Location</label>
                    <input id="birthday-location" value={request.location} onChange={(event) => update('location', event.target.value)} required pattern=".*\S.*" maxLength={300} placeholder="Venue or address, city" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="birthday-time" className="mb-2 block">Preferred time</label>
                    <input id="birthday-time" value={request.time} onChange={(event) => update('time', event.target.value)} required pattern=".*\S.*" maxLength={100} placeholder="Time and time zone" className={inputClass} />
                  </div>
                </>}
                <div className="sm:col-span-2">
                  <label htmlFor="birthday-notes" className="mb-2 block">Anything we should know? <span className="text-sm text-[#2B4C6F]/65">(optional)</span></label>
                  <textarea id="birthday-notes" value={request.notes} onChange={(event) => update('notes', event.target.value)} maxLength={2000} rows={4} placeholder="Name pronunciation, a message for the birthday person, or delivery details" className={`${inputClass} resize-y`} />
                </div>
              </fieldset>
              <div className="my-6 rounded-xl bg-[#8FA8C8]/15 p-4" aria-live="polite">
                <p className="font-semibold">{selectedPackage.title} · ${selectedPackage.price}</p>
                <p className="mt-1">{live ? request.song : 'Happy Birthday'}</p>
              </div>
              <p id="birthday-confirmation" className="mb-5 text-sm leading-6 text-[#2B4C6F]/75">This is a request, not a confirmed booking. We'll confirm the details by email and coordinate Venmo payment. Please wait for our reply before paying.</p>
              <button type="submit" disabled={sending} className={`${buttonClass} w-full`}>
                {sending ? 'Sending your request...' : 'Send request'} <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              {status === 'error' && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                <p>We couldn't send your request. Your details are still here. Please try again or <a href={fallbackEmail} className="font-semibold underline underline-offset-4">email this request to {contactEmail}</a>.</p>
              </div>}
              <a href={`mailto:${contactEmail}`} className="mt-5 inline-flex items-center gap-2 break-all text-sm underline underline-offset-4"><Mail className="size-4 shrink-0" aria-hidden="true" />{contactEmail}</a>
            </form>
          )}
        </div>
      </motion.section>
      <ExploreMore currentPath="/birthday" className="mt-16 md:mt-20" />
    </PageTransition>
  );
}
