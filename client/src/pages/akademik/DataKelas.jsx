import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import PageHeader from '../../components/PageHeader';
import { COURSE_PACKAGES } from '../../constants/coursePackages';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '',
  description: '',
  package_type: 'basic',
  instructor_name: '',
  max_capacity: 30,
  status: 'active',
};

const DataKelas = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/academic/admin/classes`, { headers });
      setClasses(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat data kelas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClasses(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (cls) => {
    setEditingId(cls.id);
    setForm({
      name: cls.name || '',
      description: cls.description || '',
      package_type: cls.package_type || 'basic',
      instructor_name: cls.instructor_name || '',
      max_capacity: cls.max_capacity || 30,
      status: cls.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/academic/admin/classes/${editingId}`, form, { headers });
        toast.success('Kelas berhasil diperbarui');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/academic/admin/classes`, form, { headers });
        toast.success('Kelas berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan kelas');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kelas ini beserta jadwalnya?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/academic/admin/classes/${id}`, { headers });
      toast.success('Kelas berhasil dihapus');
      loadClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kelas');
    }
  };

  const pkgLabel = (id) => COURSE_PACKAGES.find((p) => p.id === id)?.name || id;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeader
            title="Data Kelas"
            description="Kelola daftar kelas kursus bahasa Jepang berdasarkan paket Basic, Intensif, dan Premium."
            breadcrumbs={[{ label: 'Dashboard' }, { label: 'Akademik' }, { label: 'Data Kelas' }]}
          />
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold">
            <Plus size={16} /> Tambah Kelas
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">Memuat data kelas...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Nama Kelas</th>
                    <th className="px-4 py-3">Paket</th>
                    <th className="px-4 py-3">Pengajar</th>
                    <th className="px-4 py-3">Kapasitas</th>
                    <th className="px-4 py-3">Jadwal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{cls.name}</td>
                      <td className="px-4 py-3">{pkgLabel(cls.package_type)}</td>
                      <td className="px-4 py-3">{cls.instructor_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1"><Users size={14} /> {cls.enrolled_count || 0}/{cls.max_capacity}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {(cls.schedules || []).map((s) => `${s.day_of_week} ${String(s.start_time).slice(0, 5)}`).join(', ') || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${cls.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {cls.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(cls)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><Pencil size={14} /></button>
                          <button type="button" onClick={() => handleDelete(cls.id)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!classes.length && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Belum ada kelas. Tambahkan kelas pertama Anda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{editingId ? 'Edit Kelas' : 'Tambah Kelas'}</h3>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Nama kelas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Deskripsi" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.package_type} onChange={(e) => setForm({ ...form, package_type: e.target.value })}>
              {COURSE_PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.priceLabel}</option>)}
            </select>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Nama pengajar" value={form.instructor_name} onChange={(e) => setForm({ ...form, instructor_name: e.target.value })} />
            <input type="number" className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Kapasitas maksimal" value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: Number(e.target.value) })} />
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border font-bold text-sm">Batal</button>
              <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default DataKelas;
