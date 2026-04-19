import AdminLayout from '../../components/AdminLayout';
import PageHeader from '../../components/PageHeader';

const RekapAkademik = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Rekap Akademik"
          description="Halaman ini akan digunakan untuk melihat rekap akademik."
          breadcrumbs={[{ label: 'Dashboard' }, { label: 'Akademik' }, { label: 'Laporan Akademik' }, { label: 'Rekap Akademik' }]}
        />

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Coming Soon</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Modul ini akan segera tersedia.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RekapAkademik;

