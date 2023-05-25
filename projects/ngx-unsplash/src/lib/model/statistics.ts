import { Resolution } from './resolution';

type Historical = {
  historical: {
    change: number;
    resolution: Resolution;
    quantity: number;
    values: {
      date: string;
      value: number;
    }[];
  }[];
};

export interface Statistics {
  id: string;
  downloads: {
    total: number;
    historical: Historical;
  };
  views: {
    total: number;
    historical: Historical;
  };
  likes: {
    total: number;
    historical: Historical;
  };
}
