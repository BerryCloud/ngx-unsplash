import { Photo } from './photo';
import { User } from './user';

export interface Like {
  photo: Photo;
  user: User;
}
