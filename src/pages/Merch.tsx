import { useRef, useState, type FormEvent } from 'react';
import { Seo } from '../components/Seo';
import { submitContactMessage } from '../utils/contact';
import '../styles/merch.css';

const products = [
  { id: 'shirt', title: 'Vocal U T-shirt', color: 'Vocal blue · White print', price: 10, image: '/merch/anniversary-shirt.webp', description: 'Our 15th anniversary tee, with Vocal U on the front and Est. 2011.', sizes: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2X'] },
  { id: 'hoodie', title: 'Vocal U hoodie', color: 'Navy · Vocal blue print', price: 30, image: '/merch/navy-hoodie.webp', description: 'A navy hoodie with our Vocal U A Cappella logo in vocal blue.', sizes: ['S', 'M', 'L', 'XL', '2X'] },
] as const;
type Quantities = Record<string, number>;
const initialQuantities = Object.fromEntries(products.flatMap(p => p.sizes.map(size => [`${p.id}-${size}`, 0])));

export function Merch() {
  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const [step, setStep] = useState<'choose' | 'review' | 'done'>('choose');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [honey, setHoney] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const total = Object.values(quantities).reduce((a, b) => a + b, 0);
  const minimum = products.reduce((sum, p) => sum + p.sizes.reduce((n, size) => n + quantities[`${p.id}-${size}`], 0) * p.price, 0);
  const selections = products.flatMap(p => p.sizes.filter(size => quantities[`${p.id}-${size}`] > 0).map(size => ({ key: `${p.id}-${size}`, title: p.title, size, quantity: quantities[`${p.id}-${size}`] })));
  function move(next: typeof step) {
    setStep(next);
    setStatus('idle');
    setError('');
    requestAnimationFrame(() => { panel.current?.focus({ preventScroll: true }); panel.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); });
  }
  function change(key: string, value: number) {
    setQuantities(previous => ({ ...previous, [key]: Math.max(0, Math.min(99, Math.trunc(value) || 0)) }));
    setError('');
  }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!total) { setError('Choose at least one item to continue.'); document.querySelector<HTMLInputElement>('.merch-counter input')?.focus(); return; }
    move('review');
  }
  async function submit() {
    if (status === 'sending' || !total || !name.trim() || !email.trim() || honey) return;
    setStatus('sending');
    try {
      await submitContactMessage({ name, email, subject: 'Vocal U merch interest · ' + name.trim(), message: [
        'Merch interest (not a paid order)', ...selections.map(s => `${s.title} | Size ${s.size} | Quantity ${s.quantity}`),
        `Total items: ${total}`, `Starting contribution: $${minimum} (pay what you can)`,
        'Pickup: Winter Showcase, December 5, or through a Vocal U member.',
      ].join('\n') });
      move('done');
    } catch { setStatus('error'); setError('Your form didn’t go through. Your choices are still here. Please try again, or email vocalu@umn.edu.'); }
  }
  return <div className="merch-page">
    <Seo title="Merch interest | Vocal U" description="Let Vocal U know which anniversary T-shirts and navy hoodies you’re interested in." path="/merch" noindex />
    <div className="merch-wrap">
      <header className="merch-heading"><p className="merch-kicker">15 years of Vocal U · 2011–2026</p><h1>Vocal U merch<br />interest form</h1><p>Hello VU friends and family! Tell us which items and sizes you’re interested in so we can order the right amount. Please fill this out by <strong>November 11.</strong></p><p>Pick up at our Winter Showcase on <strong>December 5</strong>, or have a Vocal U member pick up for you.</p><p>Pay what you can, starting at <strong>$10 for shirts</strong> and <strong>$30 for hoodies.</strong> This is an interest form; no payment is due now.</p></header>
      <div className="merch-panel" ref={panel} tabIndex={-1}>
        {step !== 'done' && <ol className="merch-steps" aria-label="Form progress"><li aria-current={step === 'choose' ? 'step' : undefined}><span>1</span> Choose your merch</li><li aria-current={step === 'review' ? 'step' : undefined}><span>2</span> Review & send</li></ol>}
        {step === 'choose' && <form className="merch-enter" onSubmit={review}>
          <div className="merch-contact"><label>Your name<input name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required pattern=".*\S.*" maxLength={100} placeholder="Enter your name" /></label><label>Your email<input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} placeholder="you@example.com" /><small>So we can follow up about your merch.</small></label></div>
          <div className="merch-products">{products.map(p => <section className="merch-product" key={p.id} aria-labelledby={`${p.id}-heading`}>
            <div className="merch-product-heading"><div><h2 id={`${p.id}-heading`}>{p.title}</h2><p>{p.color}</p></div><span className="merch-price">From <strong>${p.price}</strong></span></div>
            <img src={p.image} width={p.id === 'shirt' ? 1240 : 960} height={p.id === 'shirt' ? 1237 : 1210} alt={p.id === 'shirt' ? 'Light blue anniversary T-shirt with white Vocal U A Cappella design and Est. 2011' : 'Navy hoodie with the Vocal U A Cappella logo in light blue'} />
            <p className="merch-description">{p.description}</p>
            <fieldset><legend>How many of each size?</legend>{p.id === 'shirt' && <p className="merch-size-help">YS, YM & YL are youth sizes. All other sizes are adult.</p>}<div className="merch-sizes">{p.sizes.map(size => {
              const key = `${p.id}-${size}`, value = quantities[key];
              return <div className="merch-size" data-selected={value > 0} key={key}><label htmlFor={key}>{size}</label><div className="merch-counter"><button type="button" disabled={!value} aria-label={`Remove one ${p.title}, size ${size}`} onClick={() => change(key, value - 1)}>−</button><input id={key} name={key} type="number" inputMode="numeric" min="0" max="99" step="1" value={value} onChange={e => change(key, Number(e.target.value))} aria-label={`${p.title}, size ${size}, quantity`} /><button type="button" disabled={value >= 99} aria-label={`Add one ${p.title}, size ${size}`} onClick={() => change(key, value + 1)}>+</button></div></div>;
            })}</div></fieldset>
          </section>)}</div>
          <div className="merch-honey" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} /></label></div>
          {error && <p className="merch-error" role="alert">{error}</p>}
          <div className="merch-bottom"><div role="status" aria-live="polite"><strong>{total} {total === 1 ? 'item' : 'items'} selected</strong><span>{total ? `Starting at $${minimum} · No payment now` : 'Use + to add your sizes'}</span></div><button className="merch-primary" type="submit">Review choices <span aria-hidden="true">→</span></button></div>
        </form>}
        {step === 'review' && <section className="merch-review merch-enter" aria-labelledby="merch-review-title"><h2 id="merch-review-title">Looks good?</h2><p>We’ll use these quantities to plan our merch order.</p><dl className="merch-person"><div><dt>Name</dt><dd>{name}</dd></div><div><dt>Email</dt><dd>{email}</dd></div></dl><ul className="merch-review-items">{selections.map(s => <li key={s.key}><span>{s.title}<small>Size {s.size}</small></span><strong>× {s.quantity}</strong></li>)}</ul><div className="merch-review-total"><strong>{total} {total === 1 ? 'item' : 'items'}</strong><span>Starting at ${minimum}</span></div><p className="merch-note">No payment now. This lets us know what you’re interested in.</p>{error && <p className="merch-error" role="alert">{error}</p>}<div className="merch-review-actions"><button type="button" className="merch-back" disabled={status === 'sending'} onClick={() => move('choose')}>← Edit choices</button><button type="button" className="merch-primary" disabled={status === 'sending'} onClick={submit}>{status === 'sending' ? 'Sending…' : 'Submit interest'}</button></div><p role="status" className="merch-note">{status === 'sending' ? 'Sending your choices. This may take a few seconds.' : ''}</p></section>}
        {step === 'done' && <section className="merch-success merch-enter" aria-labelledby="merch-success-title"><div className="merch-check" aria-hidden="true">✓</div><h2 id="merch-success-title">You’re on the list!</h2><p>Thanks, {name.trim().split(/\s+/)[0]}! We received your interest in {total} {total === 1 ? 'item' : 'items'}.</p><p>We’ll follow up at <strong>{email}</strong> about merch and pickup. Thanks for celebrating 15 years with us!</p><p className="merch-note">No payment has been collected.</p></section>}
      </div>
      <footer className="merch-footer">Questions? <a href="mailto:vocalu@umn.edu">vocalu@umn.edu</a></footer>
    </div>
  </div>;
}
