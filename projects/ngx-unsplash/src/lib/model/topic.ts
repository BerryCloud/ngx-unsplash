import { Photo } from './photo';
import { User } from './user';

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  updated_at: string;
  starts_at: string;
  ends_at: string;
  only_submissions_after: string;
  visibility: string;
  featured: boolean;
  total_photos: number;
  links: {
    self: string;
    html: string;
    photos: string;
  };
  status: string;
  owners: User[];
  top_contributors: User[];
  cover_photo: Photo;
  preview_photos: Photo[];
}
