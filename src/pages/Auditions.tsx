import { PageTransition } from '../components/PageTransition';
import { Seo } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

export function Auditions() {
  return (
    <PageTransition className="flex min-h-screen items-center justify-center px-4 py-16">
      <Seo
        title="Thank You for Auditioning | Vocal U"
        description="Thank you for auditioning for Vocal U. Results will be emailed to you shortly. Auditions for 2027 will open in August."
        path="/auditions"
      />
      <section className="max-w-2xl text-center text-[#2B4C6F]">
        <h1
          className="mb-5"
          style={{ ...fontYearbook, fontSize: 'clamp(38px, 7vw, 68px)', lineHeight: 1.1 }}
        >
          Thank you for auditioning!
        </h1>
        <p className="mb-7 text-lg md:text-2xl">Results will be emailed to you shortly.</p>
        <p className="text-sm text-[#2B4C6F]/70 md:text-base">
          Auditions for 2027 will open in August.
        </p>
      </section>
    </PageTransition>
  );
}
