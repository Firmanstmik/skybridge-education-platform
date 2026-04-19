import AdminLayout from '../../components/AdminLayout';
import PageHeader from '../../components/PageHeader';

const DataSiswa = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Data Siswa"
          description="Halaman ini akan digunakan untuk mengelola data siswa."
          breadcrumbs={[{ label: 'Dashboard' }, { label: 'Akademik' }, { label: 'Data Siswa' }]}
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

export default DataSiswa;

