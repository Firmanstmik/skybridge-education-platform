import { useEffect, useState } from 'react';
import axios from 'axios';

let cachedLink = null;
let pendingRequest = null;

export const fetchWaGroupLink = async () => {
  const envFallback = String(import.meta.env.VITE_WA_GROUP_LINK || '').trim();
  if (cachedLink) return cachedLink;
  if (pendingRequest) return pendingRequest;

  pendingRequest = axios
    .get(`${import.meta.env.VITE_API_URL}/content/settings`)
    .then((response) => {
      cachedLink = String(response.data?.waGroupLink || envFallback).trim();
      return cachedLink;
    })
    .catch(() => {
      cachedLink = envFallback;
      return cachedLink;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
};

export const useWaGroupLink = () => {
  const envFallback = String(import.meta.env.VITE_WA_GROUP_LINK || '').trim();
  const [waGroupLink, setWaGroupLink] = useState(cachedLink || envFallback);
  const [loading, setLoading] = useState(!cachedLink && !envFallback);

  useEffect(() => {
    let cancelled = false;
    fetchWaGroupLink().then((link) => {
      if (!cancelled) setWaGroupLink(link);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { waGroupLink, loading, hasWaGroupLink: Boolean(waGroupLink) };
};
