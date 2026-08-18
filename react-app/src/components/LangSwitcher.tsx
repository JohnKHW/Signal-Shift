import { useTranslation } from 'react-i18next';
import type { Lang } from '@/i18n';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tc', label: '繁' },
  { code: 'zh', label: '简' },
];

interface LangSwitcherProps {
  className?: string;
}

const LangSwitcher = ({ className }: LangSwitcherProps) => {
  const { i18n } = useTranslation();
  const current = i18n.language as Lang;

  return (
    <div className={className} role="group" aria-label={i18n.t('langSwitcher.label')}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={current === code}
          className={[
            'rounded-lg px-2.5 py-1 text-xs font-semibold transition',
            current === code
              ? 'bg-[color:var(--signal-navy)] text-white'
              : 'text-[color:var(--signal-navy)]/60 hover:text-[color:var(--signal-navy)]',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitcher;
