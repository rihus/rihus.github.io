import { getCollection, getEntry, render, type CollectionKey } from 'astro:content';

/** The single profile entry (src/content/profile.md). */
export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('src/content/profile.md is missing');
  return entry;
}

type OrderedKey = 'experience' | 'education' | 'honors' | 'publications' | 'presentations' | 'projects' | 'skills';

/** Entries of a YAML collection in the same order as they appear in the file. */
export async function getOrdered<C extends OrderedKey & CollectionKey>(collection: C) {
  const entries = await getCollection(collection);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Publications sorted newest first (file order kept within a year). */
export async function getPublications() {
  const pubs = await getOrdered('publications');
  return pubs.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

export { getCollection, render };

/** Wrap "Hussain, R." in <strong> for author lists (input is plain text, so escape first). */
export function highlightAuthor(authors: string, me = 'Hussain, R.') {
  const esc = authors
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.split(me).join(`<strong>${me}</strong>`);
}

export function doiUrl(doi: string) {
  return `https://doi.org/${doi}`;
}
