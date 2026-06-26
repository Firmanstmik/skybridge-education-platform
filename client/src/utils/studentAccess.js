export const getPaymentStatus = (student) => {
  const status =
    student?.documents?.payment_status ||
    student?.payment_status ||
    'Belum Lunas';
  return String(status).trim() || 'Belum Lunas';
};

export const isStudentFullyApproved = (student) =>
  String(student?.status || '').trim() === 'Diterima' &&
  getPaymentStatus(student) === 'Lunas';

export const getWaJoinConfig = (waGroupLinkOverride) => {
  const waGroupLink = String(
    waGroupLinkOverride ?? import.meta.env.VITE_WA_GROUP_LINK ?? ''
  ).trim();

  return {
    waGroupLink,
    hasWaGroupLink: Boolean(waGroupLink),
    waJoinUrl: waGroupLink,
    waJoinLabel: 'Gabung Grup WA',
  };
};
