import { Download, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const programPath = '/program.pdf';

export function Program() {
  const pdfUrl = toAbsoluteUrl(programPath);

  return (
    <PageTransition className="pb-16">
      <Seo
        title="Spring Showcase Program"
        description="Read the Vocal U Spring Showcase program."
        path="/program"
        keywords={['Vocal U Spring Showcase program', 'Vocal U program', 'Spring Showcase program']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Program', path: '/program' },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <motion.div variants={childVariants} className="mb-6 md:mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-[#6F8BA8] text-sm font-bold uppercase tracking-widest" style={fontInter}>
              <FileText className="h-4 w-4" />
              Vocal U
            </div>
            <h1
              className="text-[#2B4C6F] leading-none"
              style={{ ...fontYearbook, fontSize: 'clamp(44px, 8vw, 88px)', letterSpacing: '0.02em' }}
            >
              Spring Showcase Program
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={programPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2B4C6F] border border-[#DDE7F0] px-5 py-3 font-semibold text-sm hover:border-[#8FA8C8] hover:shadow-md transition-all"
              style={{ ...fontInter, borderRadius: '10px' }}
            >
              <ExternalLink className="h-4 w-4" />
              Open PDF
            </a>
            <a
              href={programPath}
              download="Vocal U Spring Showcase Program.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#2B4C6F] text-white border border-[#2B4C6F] px-5 py-3 font-semibold text-sm hover:bg-white hover:text-[#2B4C6F] hover:shadow-md transition-all"
              style={{ ...fontInter, borderRadius: '10px' }}
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="overflow-hidden border border-[#DDE7F0] bg-[#F7FAFD] shadow-sm"
          style={{ borderRadius: '12px' }}
        >
          <object
            data={`${programPath}#view=FitH`}
            type="application/pdf"
            aria-label="Vocal U Spring Showcase Program PDF"
            className="block h-[78vh] min-h-[620px] w-full bg-white"
          >
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-12 text-center" style={fontInter}>
              <p className="max-w-md text-[#2B4C6F]/80">
                Your browser cannot display the program inline. Open or download the PDF to read it.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#2B4C6F] text-white px-5 py-3 font-semibold text-sm"
                style={{ borderRadius: '10px' }}
              >
                <ExternalLink className="h-4 w-4" />
                Open Program
              </a>
            </div>
          </object>
        </motion.div>
      </section>
    </PageTransition>
  );
}
