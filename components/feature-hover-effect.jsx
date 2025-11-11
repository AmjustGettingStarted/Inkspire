import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link || "#"}
          key={item?.title || idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.5 },
                }}
              />
            )}
          </AnimatePresence>

          <div className="rounded-2xl h-full w-full p-6 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 transition-all duration-500 ease-in-out">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
              >
                {item.icon && <item.icon className="w-5 h-5" />}
              </motion.div>

              <h4 className="text-zinc-100 font-semibold tracking-wide text-lg sm:text-xl">
                {item.title}
              </h4>
            </div>

            <p className="mt-3 text-zinc-400 tracking-wide leading-relaxed text-sm sm:text-base">
              {item.desc}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
