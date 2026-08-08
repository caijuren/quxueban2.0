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
    <section className="relative flex min-h-[90vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="bg-primary/5 absolute right-0 top-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <MotionSection direction="up" duration={0.7}>
            <span
              className={`font-mono text-[11px] ${colorMap[eyebrowColor]} mb-3 block uppercase tracking-widest`}
            >
              {eyebrow}
            </span>
            <h1 className="mb-5 font-display text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-text-tertiary sm:text-base">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.text}
                  className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-secondary"
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
