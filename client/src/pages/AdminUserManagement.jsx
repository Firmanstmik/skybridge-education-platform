import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Filter, 
    Plus, 
    Edit2, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    KeyRound,
    UserPlus,
    ChevronDown,
    ArrowUpDown,
    ShieldCheck,
    Briefcase,
    Clock,
    Loader2,
    MoreHorizontal,
    Mail,
    User
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../utils/adminAuth';
import { motion, AnimatePresence } from 'framer-motion';

const _MOTION = motion;

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        status: 'Active'
    });
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const headers = getAuthHeaders('/admin');
            const response = await axios.get('/api/users', { headers });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Gagal memuat data user');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            username: '',
            full_name: '',
            email: '',
            role: '',
            password: '',
            confirmPassword: '',
            status: 'Active'
        });
        setEditingId(null);
    };

    const handleEdit = (user) => {
        setFormData({
            username: user.username,
            full_name: user.full_name || '',
            email: user.email || '',
            role: user.role,
            password: '',
            confirmPassword: '',
            status: user.status || 'Active'
        });
        setEditingId(user.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Password tidak cocok');
            return;
        }

        if (!editingId && !formData.password) {
            toast.error('Password wajib diisi untuk user baru');
            return;
        }

        setIsSubmitting(true);
        try {
            const headers = getAuthHeaders('/admin');
            
            if (editingId) {
                await axios.put(`/api/users/${editingId}`, formData, { headers });
                toast.success('User berhasil diperbarui');
            } else {
                await axios.post('/api/users', formData, { headers });
                toast.success('User berhasil ditambahkan');
            }
            
            setIsModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            toast.error(error.response?.data?.message || 'Gagal menyimpan user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

        try {
            const headers = getAuthHeaders('/admin');
            await axios.delete(`/api/users/${id}`, { headers });
            toast.success('User berhasil dihapus');
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('Gagal menghapus user');
        }
    };

    // Stats
    const stats = [
        { 
            label: 'Total Super Admin', 
            value: users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'superadmin').length, 
            icon: ShieldCheck, 
            gradient: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400'
        },
        { 
            label: 'Total Staff', 
            value: users.filter(u => u.role === 'STAFF').length, 
            icon: Users, 
            gradient: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-600 dark:text-emerald-400'
        },
        { 
            label: 'Total Kepala LPK', 
            value: users.filter(u => u.role === 'KEPALA_LPK').length, 
            icon: Briefcase, 
            gradient: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            text: 'text-violet-600 dark:text-violet-400'
        },
    ];

    const filteredUsers = users.filter(user => {
        const name = user.full_name || user.username || '';
        const email = user.email || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        return new Date(a.created_at) - new Date(b.created_at);
    });

    const getRoleBadge = (role) => {
        switch(role) {
            case 'SUPER_ADMIN':
            case 'superadmin':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30 uppercase tracking-wider">Super Admin</span>;
            case 'STAFF':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider">Staff</span>;
            case 'KEPALA_LPK':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30 uppercase tracking-wider">Kepala LPK</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 uppercase tracking-wider">{role}</span>;
        }
    };

    const getStatusBadge = (status) => {
        return status === 'Active' 
            ? <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Active</span>
            : <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Nonaktif</span>;
    };

    const MobileUserCard = ({ user }) => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-3"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-indigo-500/20 shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.full_name || user.username}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                </div>
                {getStatusBadge(user.status || 'Active')}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Email</span>
                    <span className="truncate block">{user.email || '-'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Bergabung</span>
                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={() => handleEdit(user)}
                    className="flex-1 flex items-center justify-center py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-800/30"
                >
                    <Edit2 size={14} className="mr-1.5" />
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 flex items-center justify-center py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors border border-rose-100 dark:border-rose-800/30"
                >
                    <Trash2 size={14} className="mr-1.5" />
                    Hapus
                </button>
            </div>
        </motion.div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                
                {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] text-indigo-500 uppercase mb-2">
                                System Management / ユーザー管理
                            </p>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Manajemen User
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                                Kelola hak akses dan akun pengguna dalam sistem dengan kontrol penuh.
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-slate-900/20 dark:shadow-indigo-600/30 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <Plus size={20} strokeWidth={2.5} />
                            <span>Tambah User Baru</span>
                        </motion.button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    className={`relative bg-white dark:bg-slate-950 rounded-[24px] p-5 md:p-6 border border-slate-200/60 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden group ${index === 0 ? 'col-span-2 md:col-span-1' : 'col-span-1'}`}
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-bl-[100px] group-hover:scale-110 transition-transform duration-500`} />
                                    
                                    <div className="flex items-start justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">{stat.label}</p>
                                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={24} strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.text}`}>
                                            ACTIVE
                                        </span>
                                        <span className="text-xs text-slate-400">accounts</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4">
                        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full xl:w-96 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Cari berdasarkan nama atau email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <select 
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="appearance-none w-full sm:w-48 pl-5 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    >
                                        <option value="All">Semua Role</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="STAFF">Staff</option>
                                        <option value="KEPALA_LPK">Kepala LPK</option>
                                    </select>
                                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                                
                                <div className="relative w-full sm:w-auto">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full sm:w-48 pl-5 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    >
                                        <option value="newest">Terbaru</option>
                                        <option value="oldest">Terlama</option>
                                    </select>
                                    <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile List */}
                    <div className="md:hidden space-y-3">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse h-40"></div>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => <MobileUserCard key={user.id} user={user} />)
                        ) : (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                                Tidak ada user ditemukan.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="hidden md:block relative bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-20 flex flex-col items-center justify-center">
                                    <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat data user...</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                            <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User Profile</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role Access</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Join Date</th>
                                            <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <AnimatePresence>
                                            {filteredUsers.map((user, index) => (
                                                <motion.tr 
                                                    key={user.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                                                >
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow-sm border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                                                                    {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                                                    {user.status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                    {user.full_name || user.username}
                                                                </p>
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    <Mail size={12} className="text-slate-400" />
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                        {user.email || 'No Email'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {getRoleBadge(user.role)}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {getStatusBadge(user.status || 'Active')}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 w-fit">
                                                            <Clock size={14} className="text-slate-400" />
                                                            {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => handleEdit(user)}
                                                                className="p-2.5 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all active:scale-90 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800" 
                                                                title="Edit User"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(user.id)}
                                                                className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all active:scale-90 border border-transparent hover:border-rose-100 dark:hover:border-rose-800" 
                                                                title="Hapus User"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            )}
                            {!isLoading && filteredUsers.length === 0 && (
                                <div className="py-24 text-center">
                                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <Search className="text-slate-300 dark:text-slate-600" size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">User tidak ditemukan</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                                        Kami tidak dapat menemukan user dengan kata kunci tersebut. Coba cari dengan nama atau email lain.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Modal Tambah/Edit User */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                
                                <div className="p-8 relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {editingId ? 'Edit User' : 'Tambah User Baru'}
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                {editingId ? 'Perbarui informasi user yang dipilih' : 'Lengkapi form di bawah untuk membuat user baru'}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                                        placeholder="johndoe"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</label>
                                                <div className="relative group">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                    <select
                                                        name="role"
                                                        value={formData.role}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer dark:text-white"
                                                        required
                                                    >
                                                        <option value="">Pilih Role</option>
                                                        <option value="SUPER_ADMIN">Super Admin</option>
                                                        <option value="STAFF">Staff</option>
                                                        <option value="KEPALA_LPK">Kepala LPK</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-5 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Password {editingId && <span className="normal-case font-normal text-xs text-amber-500">(Kosongkan jika tidak diubah)</span>}
                                                </label>
                                                <div className="relative group">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Konfirmasi Password</label>
                                                <div className="relative group">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Akun</label>
                                            <div className="flex gap-4">
                                                <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${formData.status === 'Active' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="status" 
                                                        value="Active" 
                                                        checked={formData.status === 'Active'} 
                                                        onChange={handleInputChange}
                                                        className="hidden" 
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.status === 'Active' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                                        {formData.status === 'Active' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${formData.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>Active</span>
                                                </label>
                                                <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${formData.status === 'Inactive' ? 'border-slate-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="status" 
                                                        value="Inactive" 
                                                        checked={formData.status === 'Inactive'} 
                                                        onChange={handleInputChange}
                                                        className="hidden" 
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.status === 'Inactive' ? 'border-slate-500' : 'border-slate-300'}`}>
                                                        {formData.status === 'Inactive' && <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${formData.status === 'Inactive' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>Inactive</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="flex-1 py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all"
                                                disabled={isSubmitting}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        <span>Menyimpan...</span>
                                                    </>
                                                ) : (
                                                    <span>{editingId ? 'Simpan Perubahan' : 'Buat User Baru'}</span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminUserManagement;
