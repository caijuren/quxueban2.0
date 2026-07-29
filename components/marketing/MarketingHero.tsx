'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import MotionSection from '@/components/ui/MotionSection';

interface Tag {
  icon: ReactNode;
  text: string;
}

interface MarketingHeroProps {
  eyebrow: string;
  eyebrowColor?: 'primary' | 'secondary' | 'accent';
  title: ReactNode;
  description: string;
  tags: Tag[];
  visual: ReactNode;
}

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

export default function MarketingHero({
  eyebrow,
  eyebrowColor = 'primary',
  title,
  description,
  tags,
  visual,
}: MarketingHeroProps) {
  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <MotionSection direction="up" duration={0.7}>
            <span
              className={`text-xs font-mono ${colorMap[eyebrowColor]} uppercase tracking-widest mb-3 block`}
            >
              {eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-[1.05] mb-5">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-text-tertiary max-w-md mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-text-secondary"
                >
                  {tag.icon}
                  {tag.text}
                </div>
              ))}
            </div>
          </MotionSection>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {visual}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
