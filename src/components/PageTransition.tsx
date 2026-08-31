import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

// Common animation variants that can be reused based on page content
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1] as const, // Custom ease-out
            when: 'beforeChildren',
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        y: -6,
        transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export const childVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
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
