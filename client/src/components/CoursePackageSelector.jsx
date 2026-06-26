import { COURSE_PACKAGES } from '../constants/coursePackages';

const CoursePackageSelector = ({ value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-[11px] font-extrabold tracking-[0.22em] text-[#D0021B] uppercase">Paket Kursus</p>
        <h3 className="text-lg font-black text-slate-900 mt-1">Pilih Paket Kelas Bahasa Jepang</h3>
        <p className="text-xs text-slate-500 mt-1">Pendaftaran gratis. Biaya di bawah adalah biaya pendidikan/kursus per bulan.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {COURSE_PACKAGES.map((pkg) => {
          const active = value === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onChange(pkg.id)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                active
                  ? 'border-[#D0021B] bg-red-50 shadow-lg shadow-red-100 ring-2 ring-red-200'
                  : 'border-slate-200 bg-white hover:border-red-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-slate-900">{pkg.name}</p>
                  <p className="text-lg font-black text-[#D0021B] mt-1">{pkg.priceLabel}</p>
                </div>
                {active && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-[#D0021B] px-2 py-1 rounded-full">
                    Dipilih
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-2">{pkg.schedule}</p>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{pkg.description}</p>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-red-500 font-semibold text-center">{error}</p> : null}
    </div>
  );
};

export default CoursePackageSelector;
