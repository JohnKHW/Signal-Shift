import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundView = () => {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen px-6 py-16 text-foreground sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-xl border bg-card p-8 shadow-sm sm:p-10">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{t('notFound.code')}</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">{t('notFound.title')}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {t('notFound.body')}
          </p>
          <div className="mt-8">
            <Link className="inline-flex items-center font-medium" to="/">
              {t('notFound.returnHome')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundView;
