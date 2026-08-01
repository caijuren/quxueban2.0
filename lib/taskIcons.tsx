import { TaskCategory } from './storage.types';

function SchoolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 7h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      <path d="M12 11v4" />
    </svg>
  );
}

function ReadingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 5h5c1.5 0 3 .5 3 1.5v10c-1.5-1-3-1.5-5-1.5H4V5z" />
      <path d="M20 5h-5c-1.5 0-3 .5-3 1.5v10c1.5-1 3-1.5 5-1.5h3V5z" />
    </svg>
  );
}

function SportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="14" r="5" />
      <path d="M9 9l-2-5h10l-2 5" />
      <path d="M12 14l1.5-1.5" />
    </svg>
  );
}

function InterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AbilityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function OtherIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

export const categoryIcons: Record<TaskCategory, React.FC<React.SVGProps<SVGSVGElement>>> = {
  school: SchoolIcon,
  reading: ReadingIcon,
  sport: SportIcon,
  interest: InterestIcon,
  ability: AbilityIcon,
  other: OtherIcon,
};

export const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];
