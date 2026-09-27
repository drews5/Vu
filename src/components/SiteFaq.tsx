import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { fontYearbook } from '../styles/fonts';
import siteContent from '../data/siteContent.json';
import memberGroups from '../data/memberGroups.json';

export function SiteFaq() {
  return (
    <section aria-labelledby="faq-heading" className="rounded-2xl bg-[#EDF2F8] px-5 py-8 md:p-10">
      <h2 id="faq-heading" className="mb-6 text-[#2B4C6F]" style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 48px)' }}>
        FAQs
      </h2>
      <div className="grid items-start gap-4 md:grid-cols-2">
        {siteContent.faqs.map(({ question, answer, path, linkText, includeMembers }) => (
          <details key={question} className="vu-panel vu-faq group border border-[#8FA8C8] bg-white text-[#2B4C6F]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4C6F]" style={{ ...fontYearbook, fontSize: '20px', lineHeight: 1.3 }}>
              {question}
              <Plus aria-hidden="true" className="size-5 shrink-0 group-open:rotate-45" />
            </summary>
            <div className="px-5 pb-6" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.7 }}>
              <p>{answer}</p>
              {includeMembers && (
                <dl className="mt-4 space-y-3">
                  {memberGroups.map(({ part, members }) => (
                    <div key={part}>
                      <dt className="font-semibold">{part}</dt>
                      <dd>{members.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <Link to={path} className="mt-4 inline-block underline underline-offset-4 hover:text-[#597AA2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4C6F]">
                {linkText} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
