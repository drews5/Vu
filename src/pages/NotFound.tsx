import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Home, Search, Music, ArrowLeft } from 'lucide-react';
import { Seo } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };

export function NotFound() {
    const missingPath = typeof window !== 'undefined' ? window.location.pathname : '/404';

    return (
        <PageTransition className="min-h-[80vh] flex items-center justify-center px-4 overflow-hidden relative">
            <Seo
                title="Page Not Found"
                description="The page you requested could not be found on the Vocal U website."
                path={missingPath}
                noindex
            />

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-24 -right-24 w-96 h-96 bg-[#8FA8C8]/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2B4C6F]/5 rounded-full blur-3xl"
                />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                <motion.div
                    variants={childVariants}
                    initial="initial"
                    animate="animate"
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <motion.h1
                            style={{ ...fontYearbook, fontSize: 'clamp(120px, 20vw, 200px)', lineHeight: '0.8' }}
                            className="text-[#2B4C6F]/10 select-none"
                        >
                            404
                        </motion.h1>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Music className="w-24 h-24 md:w-32 md:h-32 text-[#8FA8C8] drop-shadow-2xl" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div variants={childVariants} className="space-y-6">
                    <h2
                        style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 48px)' }}
                        className="text-[#2B4C6F] tracking-tight"
                    >
                        OFF-KEY!
                    </h2>
                    <p
                        style={fontInter}
                        className="text-gray-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed"
                    >
                        Looks like this page lost its pitch. We couldn't find the arrangement you were looking for.
                    </p>
                </motion.div>

                <motion.div
                    variants={childVariants}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/"
                        className="w-full sm:w-auto bg-[#2B4C6F] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a3249] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
                        style={fontInter}
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>

                    <Link
                        to="/events"
                        className="w-full sm:w-auto bg-white text-[#2B4C6F] px-8 py-4 rounded-2xl font-bold border-2 border-gray-100 flex items-center justify-center gap-2 hover:border-[#8FA8C8] hover:text-[#8FA8C8] transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 group"
                        style={fontInter}
                    >
                        <Search className="w-5 h-5" />
                        Find Events
                    </Link>
                </motion.div>

                <motion.div
                    variants={childVariants}
                    className="mt-16 pt-8 border-t border-gray-100"
                >
                    <Link
                        to="/"
                        className="text-[#8FA8C8] font-bold tracking-widest text-sm flex items-center justify-center gap-2 hover:text-[#2B4C6F] transition-colors"
                        style={fontInter}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        GET BACK IN TUNE
                    </Link>
                </motion.div>
            </div>
        </PageTransition>
    );
}
