import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { getAuthHeaders } from '../../utils/adminAuth';
import AdminLayout from '../../components/AdminLayout';
import PageHeader from '../../components/PageHeader';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const emptySchedule = {
  class_id: '',
  day_of_week: 'Senin',
  start_time: '09:00',
  end_time: '10:00',
  meeting_link: '',
  room_name: '',
  notes: '',
};

const JadwalMengajar = () => {
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [form, setForm] = useState(emptySchedule);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = getAuthHeaders(location.pathname);

  const loadClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/academic/admin/classes`, { headers });
      const data = res.data || [];
      setClasses(data);
      if (!selectedClassId && data.length) setSelectedClassId(String(data[0].id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat kelas');
    }
  };

  const loadSchedules = async (classId) => {
    if (!classId) {
      setSchedules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/academic/admin/classes/${classId}/schedules`, { headers });
      setSchedules(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClasses(); }, []);
  useEffect(() => { if (selectedClassId) loadSchedules(selectedClassId); }, [selectedClassId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptySchedule, class_id: selectedClassId });
    setIsModalOpen(true);
  };

  const openEdit = (sch) => {
    setEditingId(sch.id);
    setForm({
      class_id: String(sch.class_id),
      day_of_week: sch.day_of_week,
      start_time: String(sch.start_time).slice(0, 5),
      end_time: String(sch.end_time).slice(0, 5),
      meeting_link: sch.meeting_link || '',
      room_name: sch.room_name || '',
      notes: sch.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, class_id: Number(form.class_id || selectedClassId) };
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/academic/admin/schedules/${editingId}`, payload, { headers });
        toast.success('Jadwal berhasil diperbarui');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/academic/admin/schedules`, payload, { headers });
        toast.success('Jadwal berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadSchedules(selectedClassId);
      loadClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan jadwal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus jadwal ini?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/academic/admin/schedules/${id}`, { headers });
      toast.success('Jadwal berhasil dihapus');
      loadSchedules(selectedClassId);
      loadClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus jadwal');
    }
  };

  const selectedClass = classes.find((c) => String(c.id) === String(selectedClassId));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeader
            title="Jadwal Mengajar"
            description="Atur jadwal pertemuan untuk setiap kelas kursus bahasa Jepang."
            breadcrumbs={[{ label: 'Dashboard' }, { label: 'Akademik' }, { label: 'Jadwal Mengajar' }]}
          />
          <button type="button" onClick={openCreate} disabled={!selectedClassId} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-50">
            <Plus size={16} /> Tambah Jadwal
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="grid md:grid-cols-[1fr,2fr] gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pilih Kelas</label>
              <select className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            {selectedClass && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm">
                <p className="font-bold text-slate-900 dark:text-white">{selectedClass.name}</p>
                <p className="text-slate-500 mt-1">{selectedClass.description || 'Tidak ada deskripsi'}</p>
                <p className="text-xs text-slate-500 mt-2">Pengajar: {selectedClass.instructor_name || '-'} · Siswa terdaftar: {selectedClass.enrolled_count || 0}/{selectedClass.max_capacity}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-sm text-slate-500 py-6">Memuat jadwal...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Hari</th>
                    <th className="px-4 py-3">Jam</th>
                    <th className="px-4 py-3">Ruang/Platform</th>
                    <th className="px-4 py-3">Link</th>
                    <th className="px-4 py-3">Catatan</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((sch) => (
                    <tr key={sch.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-semibold">{sch.day_of_week}</td>
                      <td className="px-4 py-3">{String(sch.start_time).slice(0, 5)} - {String(sch.end_time).slice(0, 5)}</td>
                      <td className="px-4 py-3">{sch.room_name || '-'}</td>
                      <td className="px-4 py-3 text-xs text-blue-600 truncate max-w-[180px]">{sch.meeting_link || '-'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{sch.notes || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(sch)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"><Pencil size={14} /></button>
                          <button type="button" onClick={() => handleDelete(sch.id)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!schedules.length && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Belum ada jadwal untuk kelas ini.</td></tr>
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
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.class_id || selectedClassId} onChange={(e) => setForm({ ...form, class_id: e.target.value })} required>
              {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" className="rounded-xl border px-3 py-2 text-sm" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
              <input type="time" className="rounded-xl border px-3 py-2 text-sm" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
            </div>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Nama ruang / platform" value={form.room_name} onChange={(e) => setForm({ ...form, room_name: e.target.value })} />
            <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Link meeting (Zoom/Google Meet)" value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} />
            <textarea className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Catatan" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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

export default JadwalMengajar;
