import { Calendar, Home, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

export function NotFound() {
  const missingPath = typeof window !== 'undefined' ? window.location.pathname : '/404';

  return (
    <PageShell className="flex min-h-[68vh] items-center justify-center px-1 py-10">
      <Seo
        title="Page Not Found"
        description="The page you requested could not be found on the Vocal U website."
        path={missingPath}
        noindex
      />

      <div className="w-full max-w-2xl rounded-2xl border border-[#dce5ed] bg-[#f4f7fa] px-6 py-12 text-center md:px-12 md:py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#7895b7]">
          <Music className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold text-[#7895b7]">Error 404</p>
        <h1 className="mt-2 text-[clamp(2.4rem,7vw,4rem)] leading-none text-[#2e4c6d]">We can’t find that page</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-[#2e4c6d]/70">
          The link may be outdated, or the page may have moved. Head home or browse upcoming and past events.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2e4c6d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7895b7]">
            <Home className="h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
          <Link to="/events" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#b9c9d9] bg-white px-6 py-3 font-semibold text-[#2e4c6d] transition-colors hover:border-[#91a8c6] hover:bg-[#eef3f7]">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Browse events
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
