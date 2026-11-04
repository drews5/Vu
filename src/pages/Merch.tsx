import { useState, type FormEvent } from 'react';
import { Seo } from '../components/Seo';
import { submitContactMessage } from '../utils/contact';
import '../styles/merch.css';

const products = [
  { id: 'shirt', title: 'Vocal U T-shirt', image: '/merch/anniversary-shirt.webp', description: 'Vocal blue T-shirt with our white logo and Est. 2011 for our 15th anniversary!', sizes: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2X'] },
  { id: 'hoodie', title: 'Vocal U hoodie', image: '/merch/navy-hoodie.webp', description: 'Navy hoodie with our Vocal U A Cappella logo in vocal blue.', sizes: ['S', 'M', 'L', 'XL', '2X'] },
] as const;
const initialQuantities = Object.fromEntries(products.flatMap(p => p.sizes.map(size => [`${p.id}-${size}`, 0])));

export function Merch() {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [honey, setHoney] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || status === 'success' || honey) return;
    const selections = products.flatMap(p => p.sizes.filter(size => quantities[`${p.id}-${size}`] > 0).map(size => `${p.title} | Size ${size} | Quantity ${quantities[`${p.id}-${size}`]}`));
    if (!selections.length) {
      setError('Please choose at least one item.');
      document.querySelector<HTMLInputElement>('#shirt-YS')?.focus();
      return;
    }
    setError('');
    setStatus('sending');
    try {
      await submitContactMessage({ name, email, subject: 'Vocal U merch interest · ' + name.trim(), message: ['Merch interest', ...selections].join('\n') });
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Your form didn’t go through. Please try again. Your choices are still here.');
    }
  }

  return <div className="merch-page">
    <Seo title="Merch interest | Vocal U" description="Let Vocal U know which anniversary T-shirts and navy hoodies you’re interested in." path="/merch" noindex />
    <div className="merch-wrap">
      <header className="merch-heading">
        <h1>Vocal U merch<br />interest form</h1>
        <p>Hello VU friends and family! Please fill out this form with how many items and which sizes of each merch item you want so we can order the right amount. This form will close on November 11.</p>
        <p>Items will be available at our Winter Showcase on December 5. If you can’t make it, a Vocal U member can pick up items for you.</p>
        <p>The prices will be pay what you can, starting at $10 for shirts and $30 for hoodies.</p>
      </header>
      <form onSubmit={submit} aria-label="Merch interest form" aria-busy={status === 'sending'}>
        <fieldset className="merch-fields" disabled={status === 'sending' || status === 'success'}>
          <label className="merch-contact">Your name<input name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required pattern=".*\S.*" maxLength={100} placeholder="Enter your name here..." /></label>
          <label className="merch-contact">Your email<input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} placeholder="Enter your email here..." /></label>
          <div className="merch-products">
            <h2>Merch options</h2>
            {products.map(p => <section className="merch-product" key={p.id} aria-labelledby={`${p.id}-heading`}>
              <h3 id={`${p.id}-heading`}>{p.title}</h3>
              <img src={p.image} width={p.id === 'shirt' ? 1240 : 960} height={p.id === 'shirt' ? 1237 : 1210} alt={p.id === 'shirt' ? 'Vocal blue anniversary T-shirt with a white Vocal U design and Est. 2011' : 'Navy hoodie with the Vocal U A Cappella logo in vocal blue'} />
              <p>{p.description}</p>
              <div className="merch-sizes" aria-label={`${p.title} quantities by size`}>{p.sizes.map(size => {
                const key = `${p.id}-${size}`;
                return <label className="merch-size" key={key} htmlFor={key}><span>{size}</span><input id={key} name={key} type="number" inputMode="numeric" min="0" max="99" step="1" value={quantities[key]} onFocus={e => e.currentTarget.select()} onChange={e => { setQuantities(previous => ({ ...previous, [key]: Math.max(0, Math.min(99, Math.trunc(Number(e.target.value)) || 0)) })); setError(''); }} aria-label={`${p.title}, size ${size}, quantity`} /></label>;
              })}</div>
            </section>)}
          </div>
          <div className="merch-honey" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} /></label></div>
          <button className="merch-submit" type="submit">{status === 'sending' ? 'Submitting…' : status === 'success' ? 'Submitted' : 'Submit Form'}</button>
        </fieldset>
        {error && <p className="merch-message merch-error" role="alert">{error}</p>}
        {status === 'success' && <p className="merch-message" role="status">Thank you! Your merch interest form has been submitted.</p>}
      </form>
    </div>
  </div>;
}
