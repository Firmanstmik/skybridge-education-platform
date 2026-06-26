export const COURSE_PACKAGES = [
  {
    id: 'basic',
    name: 'Kelas Basic',
    price: 150000,
    priceLabel: 'Rp 150.000',
    schedule: '1x seminggu · 1 jam',
    frequency: '1x/minggu',
    duration: '1 jam',
    description: 'Cocok untuk pemula yang ingin belajar bahasa Jepang secara santai dan terjangkau.',
  },
  {
    id: 'intensive',
    name: 'Kelas Intensif',
    price: 1500000,
    priceLabel: 'Rp 1.500.000',
    schedule: '3x seminggu · 1,5 jam',
    frequency: '3x/minggu',
    duration: '1,5 jam',
    description: 'Progress lebih cepat dengan latihan rutin dan materi terstruktur.',
  },
  {
    id: 'premium',
    name: 'Kelas Premium',
    price: 2500000,
    priceLabel: 'Rp 2.500.000',
    schedule: '5x seminggu · 1,5 jam',
    frequency: '5x/minggu',
    duration: '1,5 jam',
    description: 'Program paling intensif untuk target mahir dan siap kerja/magang lebih cepat.',
  },
];

export const getPackageById = (id) => COURSE_PACKAGES.find((p) => p.id === id) || null;

export const getPackageLabel = (id) => {
  const pkg = getPackageById(id);
  if (!pkg) return '-';
  return `${pkg.name} (${pkg.priceLabel} · ${pkg.schedule})`;
};
