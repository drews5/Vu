import { useState, type FormEvent } from 'react';
import { Seo } from '../components/Seo';
import '../styles/merch.css';
import merchConfig from '../data/merch.json';
import { submitMerchInterest } from '../utils/merchSubmission';

const products = [
  { id: 'shirt', title: 'Vocal U T-shirt', image: '/merch/anniversary-shirt.webp', description: 'Vocal blue T-shirt with our white logo and Est. 2011 for our 15th anniversary!', sizes: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2X'] },
  { id: 'hoodie', title: 'Vocal U hoodie', image: '/merch/navy-hoodie.webp', description: 'Navy hoodie with our Vocal U A Cappella logo in vocal blue.', sizes: ['S', 'M', 'L', 'XL', '2X'] },
] as const;
const initialQuantities = Object.fromEntries(products.flatMap(p => p.sizes.map(size => [`${p.id}-${size}`, 0])));

export function Merch() {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const submitted = status === 'success';

  function change(key: string, value: number) {
    setQuantities(previous => ({ ...previous, [key]: Math.max(0, Math.min(99, Math.trunc(value) || 0)) }));
    setError('');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || status === 'success') return;
    const form = event.currentTarget;
    if (!Object.values(quantities).some(value => value > 0)) {
      setError('Please choose at least one item.');
      document.querySelector<HTMLInputElement>('#shirt-YS')?.focus();
      return;
    }
    if ((form.elements.namedItem('_honey') as HTMLInputElement)?.value) return;
    setError('');
    setStatus('sending');
    const payload = Object.fromEntries(new FormData(form));
    delete payload._honey;
    try {
      await submitMerchInterest(merchConfig.endpoint, payload);
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setError(error instanceof Error ? error.message : 'We couldn’t send your form. Please try again. Your choices are still here.');
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
      {submitted && <p className="merch-message merch-success" role="status">Thank you! Your merch interest form has been submitted.</p>}
      <form onSubmit={submit} aria-label="Merch interest form" aria-busy={status === 'sending'}>
        <fieldset className="merch-fields" disabled={status === 'sending' || submitted}>
          <label className="merch-contact">Your name<input name="name" autoComplete="name" required pattern=".*\S.*" maxLength={100} placeholder="Enter your name here..." /></label>
          <label className="merch-contact">Your email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Enter your email here..." /></label>
          <div className="merch-products">
            <h2>Merch options</h2>
            {products.map(p => <section className="merch-product" key={p.id} aria-labelledby={`${p.id}-heading`}>
              <h3 id={`${p.id}-heading`}>{p.title}</h3>
              <img src={p.image} width={p.id === 'shirt' ? 1240 : 960} height={p.id === 'shirt' ? 1237 : 1210} alt={p.id === 'shirt' ? 'Vocal blue anniversary T-shirt with a white Vocal U design and Est. 2011' : 'Navy hoodie with the Vocal U A Cappella logo in vocal blue'} />
              <p>{p.description}</p>
              <div className="merch-sizes" aria-label={`${p.title} quantities by size`}>{p.sizes.map(size => {
                const key = `${p.id}-${size}`;
                return <div className="merch-size" data-selected={quantities[key] > 0} key={key}><label htmlFor={key}>{size}</label><div className="merch-counter"><button type="button" aria-label={`Remove one ${p.title}, size ${size}`} disabled={quantities[key] === 0} onClick={() => change(key, quantities[key] - 1)}>−</button><input id={key} name={`${p.title} - ${size}`} type="number" inputMode="numeric" min="0" max="99" step="1" value={quantities[key]} onFocus={e => e.currentTarget.select()} onChange={e => change(key, Number(e.target.value))} aria-label={`${p.title}, size ${size}, quantity`} /><button type="button" aria-label={`Add one ${p.title}, size ${size}`} disabled={quantities[key] === 99} onClick={() => change(key, quantities[key] + 1)}>+</button></div></div>;
              })}</div>
            </section>)}
          </div>
          <div className="merch-honey" aria-hidden="true"><label>Leave this empty<input name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
          <button className="merch-submit" type="submit">{status === 'sending' ? 'Submitting…' : submitted ? 'Submitted' : 'Submit Form'}</button>
        </fieldset>
        {error && <p className="merch-message merch-error" role="alert">{error}</p>}
      </form>
    </div>
  </div>;
}
