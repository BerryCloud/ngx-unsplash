import { Photo } from './photo';

export interface SearchResult {
  total: number;
  total_pages: number;
  results: Photo[];
}
