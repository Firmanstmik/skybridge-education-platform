export const EMPTY_PAYMENT_SETTINGS = {
  enabled: false,
  title: '',
  description: '',
  registrationFee: '',
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  paymentInstructions: '',
  confirmationWhatsapp: '',
  confirmationInstructions: '',
  qrisImage: '',
  showQris: false,
};

export const PAYMENT_UNAVAILABLE_MESSAGE =
  'Informasi pembayaran akan tersedia setelah dikonfirmasi admin.';

export const normalizePaymentSettings = (value = {}) => ({
  ...EMPTY_PAYMENT_SETTINGS,
  ...value,
  accountNumber:
    value?.accountNumber !== undefined && value?.accountNumber !== null
      ? String(value.accountNumber)
      : '',
  enabled: Boolean(value?.enabled),
  showQris: Boolean(value?.showQris),
});

export const hasTransferDetails = (payment) =>
  Boolean(payment?.bankName || payment?.accountNumber || payment?.accountHolder);

export const hasDisplayablePaymentInfo = (payment) => {
  if (!payment?.enabled) return false;
  return Boolean(
    payment.title ||
      payment.description ||
      payment.registrationFee ||
      hasTransferDetails(payment) ||
      payment.paymentInstructions ||
      payment.confirmationWhatsapp ||
      payment.confirmationInstructions ||
      (payment.showQris && payment.qrisImage)
  );
};

export const isValidWhatsappNumber = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
};

export const buildWhatsAppUrl = (phone, message = 'Konfirmasi pembayaran SKYBRIDGE') => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
};

export const getPaymentRegistrationLabel = (payment) => {
  if (payment?.registrationFee) {
    return `Pembayaran Pendaftaran (${payment.registrationFee})`;
  }
  return 'Pembayaran Pendaftaran';
};

export const validatePaymentForm = (payment) => {
  if (!payment.enabled) return null;

  if (hasTransferDetails(payment) && !payment.accountHolder) {
    return 'Nama pemilik rekening wajib diisi jika informasi transfer diisi.';
  }

  if (payment.accountNumber && !payment.bankName) {
    return 'Nama bank wajib diisi jika nomor rekening diisi.';
  }

  if (payment.confirmationWhatsapp && !isValidWhatsappNumber(payment.confirmationWhatsapp)) {
    return 'Format nomor WhatsApp konfirmasi tidak valid.';
  }

  if (payment.showQris && !payment.qrisImage) {
    return 'Upload gambar QRIS terlebih dahulu atau nonaktifkan tampilan QRIS.';
  }

  return null;
};
