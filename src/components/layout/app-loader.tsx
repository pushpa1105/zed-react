import { motion } from "motion/react";

export const AppLoader = () => {
    const transition = (i: number) => ({
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
        delay: i * 0.2,
        ease: "easeInOut" as const,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
            <div className="flex items-center gap-3">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0 }}
                        animate={{ y: [0, 12, 0] }}
                        transition={transition(i)}
                        className="h-4 w-4 rounded-full border border-neutral-700 bg-gradient-to-b from-neutral-400 to-neutral-300"
                    />
                ))}
            </div>
        </div>
    );
};
