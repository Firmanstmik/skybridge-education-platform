import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { ChevronDown, Calendar } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const DocumentUpload = ({ label, name, register, watch, currentFile, quantity }) => {
    const files = watch(name);
    const [preview, setPreview] = useState(null);
    const [sizeError, setSizeError] = useState('');
    const inputId = `upload-${name}`;

    useEffect(() => {
        if (files && files.length > 0 && typeof files !== 'string') {
            const file = files[0];
            if (file && file.type && file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreview(url);
                return () => URL.revokeObjectURL(url);
            }
        } else if (currentFile || (typeof files === 'string' && files)) {
             const filePath = typeof files === 'string' ? files : currentFile;
             const isImage = filePath.match(/\.(jpeg|jpg|png|gif|webp)$/i);
             if (isImage) {
                 const baseUrl = (import.meta.env.VITE_API_URL || '').replace('/api', '');
                 setPreview(`${baseUrl}/${filePath.replace(/\\/g, '/')}`);
             } else {
                 setPreview(null);
             }
        } else {
            setPreview(null);
        }
    }, [files, currentFile]);

    const effectiveFilePath = typeof files === 'string' ? files : currentFile;
    const getFileUrl = (path) => {
        if (!path) return '#';
        const baseUrl = (import.meta.env.VITE_API_URL || '').replace('/api', '');
        return `${baseUrl}/${path.replace(/\\/g, '/')}`;
    };
    const hasFile = (files && files.length > 0 && typeof files !== 'string') || !!effectiveFilePath;
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    const registeredField = register(name, {
        validate: (value) => {
            const file = value?.[0];
            if (!file) return true;
            const extOk = /\.(jpe?g|png|webp|gif|heic|heif|pdf)$/i.test(file.name || '');
            const typeOk = file.type
                ? file.type.startsWith('image/') || file.type === 'application/pdf'
                : extOk;
            if (!extOk && !typeOk) {
                return 'Format file tidak sesuai. Hanya gambar (JPG/PNG/WEBP/HEIC) atau PDF';
            }
            if (file.size > MAX_SIZE_BYTES) {
                return 'Ukuran file melebihi 10MB';
            }
            return true;
        }
    });

    return (
        <div className="border border-gray-200/80 rounded-2xl bg-white/80 dark:bg-slate-800 dark:border-slate-700 shadow-sm px-4 py-4 sm:px-5 sm:py-5 md:p-6 hover:border-dory-red/40 hover:shadow-md hover:bg-red-50/10 dark:hover:bg-red-900/10 transition-all group flex flex-col">
            <div className="flex flex-row items-center justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <label className="block text-sm md:text-base font-bold text-gray-800 dark:text-slate-200 truncate">{label}</label>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <p className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400">JPG/PNG/PDF (Maks. 10MB)</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasFile ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                        {hasFile ? 'Ada' : 'Kosong'}
                    </span>
                </div>
            </div>

            <div className="flex-grow">
                {preview ? (
                    <div className="mb-3">
                        <img
                            src={preview}
                            alt={`Preview ${label}`}
                            className="w-full h-44 sm:h-48 md:h-52 object-contain rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 shadow-inner"
                        />
                    </div>
                ) : effectiveFilePath && !preview && (
                    <div className="mb-3">
                        <a
                            href={getFileUrl(effectiveFilePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group/file"
                        >
                            <div className="mr-3 text-dory-red flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 truncate">
                                    {effectiveFilePath ? effectiveFilePath.split(/[/\\]/).pop() : 'File'}
                                </p>
                                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">File Tersimpan</p>
                            </div>
                            <div className="ml-2 text-[10px] bg-gray-200 dark:bg-slate-600 px-2.5 py-1 rounded-full text-gray-700 dark:text-slate-300 font-bold group-hover/file:bg-dory-red group-hover/file:text-white transition-colors">
                                LIHAT
                            </div>
                        </a>
                    </div>
                )}
            </div>

            <div className="mt-1 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => {
                        const input = document.getElementById(inputId);
                        if (input) input.click();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-gray-600 dark:text-slate-300 hover:border-dory-red/60 hover:text-dory-red hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all w-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    PILIH FILE BARU
                </button>
                <div className="px-1">
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 italic truncate text-center">
                        {files?.[0]?.name
                            ? files[0].name
                            : effectiveFilePath
                            ? effectiveFilePath.split(/[\\/]/).pop()
                            : 'Belum ada file'}
                    </p>
                </div>
                <input 
                    id={inputId}
                    type="file" 
                    {...registeredField}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const extOk = /\.(jpe?g|png|webp|gif|heic|heif|pdf)$/i.test(file.name || '');
                            const typeOk = file.type
                                ? file.type.startsWith('image/') || file.type === 'application/pdf'
                                : extOk;
                            if (!extOk && !typeOk) {
                                setSizeError('Format file tidak sesuai. Hanya gambar (JPG/PNG/WEBP/HEIC) atau PDF');
                                e.target.value = '';
                                registeredField.onChange({ target: { name, value: null, files: [] } });
                                return;
                            }
                            if (file.size > MAX_SIZE_BYTES) {
                                setSizeError('Ukuran file melebihi 10MB');
                                e.target.value = '';
                                registeredField.onChange({ target: { name, value: null, files: [] } });
                                return;
                            }
                        }
                        setSizeError('');
                        registeredField.onChange(e);
                    }}
                    className="hidden" 
                />
            </div>
            {sizeError && (
                <p className="text-[11px] text-red-600 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-center font-medium">{sizeError}</p>
            )}
        </div>
    );
};

const CustomDatePickerInput = ({ value, onClick, placeholder }) => (
    <div 
        onClick={onClick} 
        className={`input-field w-full cursor-pointer group-hover:border-dory-red transition-colors flex items-center h-[42px] dark:bg-slate-800 dark:border-slate-700 ${!value ? 'text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-slate-200'}`}
        style={{ paddingLeft: 48 }}
    >
        {value || placeholder}
    </div>
);

export const CustomDatePicker = ({ field }) => {
    const [isOpen, setIsOpen] = useState(false);
    const initialYear = field.value ? new Date(field.value).getFullYear() : new Date().getFullYear();
    const [yearInput, setYearInput] = useState(initialYear);

    const updateDate = (newMonth, newYear) => {
        const baseDate = field.value ? new Date(field.value) : new Date();
        const current = new Date(baseDate.getTime());
        const oldDay = current.getDate();

        if (newYear !== undefined && !Number.isNaN(newYear)) current.setFullYear(newYear);
        if (newMonth !== undefined && !Number.isNaN(newMonth)) {
            current.setMonth(newMonth);
            if (current.getDate() !== oldDay) {
                current.setDate(0);
            }
        }

        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        field.onChange(`${year}-${month}-${day}`);
    };

    const applyYear = (rawYear) => {
        const parsed = Number(rawYear);
        if (!Number.isFinite(parsed)) return;
        const currentYear = new Date().getFullYear();
        const clamped = Math.min(Math.max(parsed, 1950), currentYear + 1);
        setYearInput(clamped);
        updateDate(undefined, clamped);
    };

    return (
        <div className="relative group">
            <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                    if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${year}-${month}-${day}`);
                    } else {
                        field.onChange('');
                    }
                }}
                onMonthChange={(date) => updateDate(date.getMonth(), undefined)}
                onYearChange={(date) => updateDate(undefined, date.getFullYear())}
                open={isOpen}
                onInputClick={() => setIsOpen(true)}
                onClickOutside={() => setIsOpen(false)}
                dateFormat="dd MMMM yyyy"
                placeholderText="Pilih tanggal lahir"
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                shouldCloseOnSelect={false}
                customInput={<CustomDatePickerInput placeholder="Pilih tanggal lahir" />}
                calendarClassName="japanese-calendar shadow-2xl border-0 font-sans overflow-hidden rounded-xl dark:bg-slate-800 dark:border-slate-700"
                wrapperClassName="w-full"
                popperClassName="z-50"
            >
                <div className="px-4 pt-3 pb-2 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        Atur Tahun
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                applyYear((Number(yearInput) || new Date().getFullYear()) - 1);
                            }}
                            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-dory-red transition-colors text-xs"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            inputMode="numeric"
                            className="w-20 text-center text-xs border border-gray-200 dark:border-slate-600 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-dory-red focus:border-dory-red dark:bg-slate-700 dark:text-slate-200"
                            value={yearInput || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                    setYearInput('');
                                    return;
                                }
                                const num = Number(value);
                                if (Number.isNaN(num)) return;
                                setYearInput(num);
                            }}
                            onBlur={() => {
                                if (yearInput) applyYear(yearInput);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && yearInput) {
                                    e.preventDefault();
                                    applyYear(yearInput);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                applyYear((Number(yearInput) || new Date().getFullYear()) + 1);
                            }}
                            className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-dory-red transition-colors text-xs"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="p-3 border-t border-gray-100 dark:border-slate-700 flex justify-end bg-gray-50 dark:bg-slate-900 rounded-b-xl">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                        }}
                        className="bg-dory-red text-white px-6 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Simpan Tanggal
                    </button>
                </div>
            </DatePicker>
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 group-hover:text-dory-red transition-colors pointer-events-none" size={18} />
        </div>
    );
};

export const CustomSelect = ({ control, name, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <div className="relative w-full">
                    <div
                        className={`input-field w-full min-h-[42px] pl-4 pr-10 flex items-center justify-between cursor-pointer dark:bg-slate-800 dark:border-slate-700 ${!value ? 'text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-slate-200'}`}
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                        role="button"
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                    >
                        <span className="whitespace-nowrap">{value || placeholder}</span>
                        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-400 dark:text-slate-500`}>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animation-fade-in-down">
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {options.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            onChange(option);
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors border-l-2 ${value === option ? 'bg-red-50 dark:bg-red-900/20 text-dory-red border-dory-red font-bold' : 'text-gray-600 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-dory-red hover:border-red-200'}`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export const JapaneseDateGroup = ({ label, register, control, monthName, yearName, monthKey, yearKey, errorsGroup, yearLabel = 'Tahun', icon: Icon }) => {
    const monthError = errorsGroup?.[monthKey];
    const yearError = errorsGroup?.[yearKey];
    const hasError = !!monthError || !!yearError;

    return (
        <div className="group">
            {label && (
                <label className="flex md:hidden items-center text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                    {Icon && <Icon size={14} className="mr-2" />}
                    {label}
                </label>
            )}
            <div className={`bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 space-y-2 transition-all duration-200 ${hasError ? 'border-red-300' : 'border-gray-200 dark:border-slate-700'} focus-within:ring-1 focus-within:ring-red-100 focus-within:border-dory-red`}>
                <CustomSelect 
                    control={control}
                    name={monthName}
                    options={MONTHS}
                    placeholder="Pilih Bulan"
                />
                <div>
                    <div className="text-[11px] font-medium text-gray-500 dark:text-slate-400 mb-1 text-left">
                        {yearLabel}
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="Tahun"
                        {...register(yearName)}
                        className="input-field w-full text-center dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"
                    />
                </div>
            </div>
            {hasError && (
                <div className="mt-1 text-red-600 text-xs font-medium">
                    {[monthError?.message, yearError?.message].filter(Boolean).join(' • ')}
                </div>
            )}
        </div>
    );
};
