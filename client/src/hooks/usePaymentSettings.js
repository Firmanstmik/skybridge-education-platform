import { useEffect, useState } from 'react';
import axios from 'axios';
import { EMPTY_PAYMENT_SETTINGS, normalizePaymentSettings } from '../utils/paymentSettings';

let cachedPayment = null;
let pendingRequest = null;

export const invalidatePaymentSettingsCache = () => {
  cachedPayment = null;
  pendingRequest = null;
};

export const fetchPaymentSettings = async ({ force = false } = {}) => {
  if (!force && cachedPayment) return cachedPayment;
  if (!force && pendingRequest) return pendingRequest;

  pendingRequest = axios
    .get(`${import.meta.env.VITE_API_URL}/content/settings/payment`)
    .then((response) => {
      cachedPayment = normalizePaymentSettings(response.data || EMPTY_PAYMENT_SETTINGS);
      return cachedPayment;
    })
    .catch(() => {
      cachedPayment = normalizePaymentSettings(EMPTY_PAYMENT_SETTINGS);
      return cachedPayment;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
};

export const usePaymentSettings = () => {
  const [payment, setPayment] = useState(cachedPayment || EMPTY_PAYMENT_SETTINGS);
  const [loading, setLoading] = useState(!cachedPayment);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPaymentSettings()
      .then((data) => {
        if (!cancelled) {
          setPayment(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setPayment(normalizePaymentSettings(EMPTY_PAYMENT_SETTINGS));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    payment,
    loading,
    error,
    enabled: Boolean(payment?.enabled),
    refresh: async () => {
      setLoading(true);
      const data = await fetchPaymentSettings({ force: true });
      setPayment(data);
      setLoading(false);
      return data;
    },
  };
};
