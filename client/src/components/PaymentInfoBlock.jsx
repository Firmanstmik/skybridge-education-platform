import { MessageCircle, Landmark, Copy, Loader2 } from 'lucide-react';
import { resolveContentImage } from '../utils/content';
import {
  buildWhatsAppUrl,
  hasDisplayablePaymentInfo,
  hasTransferDetails,
  PAYMENT_UNAVAILABLE_MESSAGE,
} from '../utils/paymentSettings';

const copyText = async (value) => {
  if (!value || typeof navigator === 'undefined') return;
  try {
    await navigator.clipboard.writeText(String(value));
  } catch (_error) {
    // Ignore clipboard failures on unsupported browsers.
  }
};

const PaymentInfoBlock = ({
  payment,
  loading = false,
  compact = false,
  className = '',
  showWhatsappButton = true,
  whatsappMessage,
}) => {
  if (loading) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white/90 p-5 ${className}`}>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={18} className="animate-spin" />
          Memuat informasi pembayaran...
        </div>
      </div>
    );
  }

  if (!payment?.enabled) {
    return null;
  }

  if (!hasDisplayablePaymentInfo(payment)) {
    return (
      <div className={`rounded-2xl border border-amber-200 bg-amber-50/80 p-5 ${className}`}>
        <p className="text-sm text-amber-900">{PAYMENT_UNAVAILABLE_MESSAGE}</p>
      </div>
    );
  }

  const whatsappUrl = showWhatsappButton && payment.confirmationWhatsapp
    ? buildWhatsAppUrl(payment.confirmationWhatsapp, whatsappMessage)
    : null;

  const qrisUrl = payment.showQris && payment.qrisImage
    ? resolveContentImage(payment.qrisImage)
    : '';

  return (
    <div className={`rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-white p-5 md:p-6 space-y-4 ${className}`}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          Informasi Pembayaran
        </p>
        {payment.title && (
          <h3 className="mt-2 text-lg md:text-xl font-black text-emerald-950">
            {payment.title}
          </h3>
        )}
        {payment.description && (
          <p className="mt-2 text-sm leading-6 text-emerald-900/80">{payment.description}</p>
        )}
      </div>

      {payment.registrationFee && (
        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Biaya Pendaftaran</p>
          <p className="mt-1 text-base md:text-lg font-black text-emerald-900">{payment.registrationFee}</p>
        </div>
      )}

      {hasTransferDetails(payment) && (
        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Landmark size={18} />
            <p className="text-sm font-bold">Transfer ke</p>
          </div>

          {payment.bankName && (
            <div>
              <p className="text-xs text-slate-500">Bank</p>
              <p className="text-sm font-semibold text-slate-900">{payment.bankName}</p>
            </div>
          )}

          {payment.accountNumber && (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">No. Rekening</p>
                <p className="text-sm font-mono font-bold text-slate-900 break-all">{payment.accountNumber}</p>
              </div>
              {!compact && (
                <button
                  type="button"
                  onClick={() => copyText(payment.accountNumber)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Copy size={14} />
                  Salin
                </button>
              )}
            </div>
          )}

          {payment.accountHolder && (
            <div>
              <p className="text-xs text-slate-500">Atas Nama</p>
              <p className="text-sm font-semibold text-slate-900">{payment.accountHolder}</p>
            </div>
          )}
        </div>
      )}

      {qrisUrl && (
        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">QRIS</p>
          <img
            src={qrisUrl}
            alt="QRIS Pembayaran SKYBRIDGE"
            className="mx-auto max-w-[220px] w-full h-auto rounded-xl border border-slate-200 bg-white p-2"
          />
        </div>
      )}

      {payment.paymentInstructions && (
        <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instruksi Pembayaran</p>
          <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">{payment.paymentInstructions}</p>
        </div>
      )}

      {payment.confirmationInstructions && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Konfirmasi Pembayaran</p>
          <p className="mt-2 text-sm leading-6 text-emerald-900 whitespace-pre-line">{payment.confirmationInstructions}</p>
        </div>
      )}

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-105 transition"
        >
          <MessageCircle size={18} />
          Konfirmasi Pembayaran via WhatsApp
        </a>
      )}
    </div>
  );
};

export default PaymentInfoBlock;
