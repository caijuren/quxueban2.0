'use client';

import ConsolePageShell from './ConsolePageShell';
import Section from './Section';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  message: string;
}

export default function PlaceholderPage({ title, description, message }: PlaceholderPageProps) {
  return (
    <ConsolePageShell title={title} description={description}>
      <Section title={title}>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">{message}</p>
        </div>
      </Section>
    </ConsolePageShell>
  );
}
