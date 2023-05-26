import { Photo } from './photo';
import { User } from './user';

export interface Collection {
  id: number;
  title: string;
  description: string;
  published_at: string;
  last_collected_at: string;
  updated_at: string;
  featured: boolean;
  total_photos: number;
  private: boolean;
  share_key: string;
  cover_photo: Photo;
  user: User;
  links: {
    self: string;
    html: string;
    photos: string;
    related: string;
  };
}
