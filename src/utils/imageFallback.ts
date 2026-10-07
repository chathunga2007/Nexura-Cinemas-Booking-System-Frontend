import React from 'react';

// Fallback image constants and handlers

export const FALLBACK_POSTER = 
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="%230F172A"><rect width="400" height="600" fill="%230F172A"/><rect x="20" y="20" width="360" height="560" rx="16" fill="%231E293B" stroke="%23334155" stroke-width="2"/><circle cx="200" cy="240" r="60" fill="%23E11D48" opacity="0.2"/><path d="M185 210 L225 240 L185 270 Z" fill="%23E11D48"/><text x="200" y="340" fill="%23FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">NEXURA CINEMA</text><text x="200" y="370" fill="%2394A3B8" font-family="sans-serif" font-size="13" text-anchor="middle">Experience Pure Immersion</text></svg>';

export const FALLBACK_CONCESSION = 
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%230F172A"><rect width="400" height="300" fill="%230F172A"/><rect x="15" y="15" width="370" height="270" rx="16" fill="%231E293B" stroke="%23334155" stroke-width="2"/><circle cx="200" cy="130" r="45" fill="%23F59E0B" opacity="0.2"/><text x="200" y="140" fill="%23F59E0B" font-family="sans-serif" font-size="36" text-anchor="middle">&#127871;</text><text x="200" y="210" fill="%23FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">GOURMET SNACKS</text><text x="200" y="235" fill="%2394A3B8" font-family="sans-serif" font-size="12" text-anchor="middle">Freshly Prepared In-House</text></svg>';

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = FALLBACK_POSTER) => {
  const target = e.currentTarget;
  if (target && target.src !== fallback) {
    target.onerror = null;
    target.src = fallback;
  }
};
