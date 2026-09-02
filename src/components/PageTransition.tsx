import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

// Common animation variants that can be reused based on page content
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 22,
        scale: 0.995,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.52,
            ease: [0.22, 1, 0.36, 1] as const, // Custom ease-out
            when: 'beforeChildren',
            staggerChildren: 0.075,
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.997,
        transition: {
            duration: 0.26,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export const childVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function PageTransition({ children, className = '', delay = 0 }: PageTransitionProps) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
                ...pageVariants,
                animate: {
                    ...pageVariants.animate,
                    transition: {
                        ...pageVariants.animate.transition,
                        delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
