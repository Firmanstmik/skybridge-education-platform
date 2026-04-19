import { Link, useLocation } from 'react-router-dom';

const getBasePathFromPathname = (pathname) => {
  if (pathname.startsWith('/staff')) return '/staff';
  if (pathname.startsWith('/kepalalpk')) return '/kepalalpk';
  return '/admin';
};

const PageHeader = ({ title, description, breadcrumbs }) => {
  const location = useLocation();
  const basePath = getBasePathFromPathname(location.pathname);

  const items = breadcrumbs?.length
    ? breadcrumbs
    : [
        { label: 'Dashboard', to: `${basePath}/dashboard` },
        { label: title },
      ];

  return (
    <div className="space-y-2">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
                {item.to ? (
                  <Link to={item.to} className="hover:text-red-500 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-slate-700 dark:text-slate-200 font-semibold' : ''}>{item.label}</span>
                )}
                {!isLast && <span className="opacity-60">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default PageHeader;

