export interface StatisticsData {
  total: number;
  historical: {
    change: number;
    average: number;
    resolution: string;
    quantity: number;
    values?: {
      date: string;
      value: number;
    }[];
  };
}

export interface UserStatistics {
  username: string;
  downloads: StatisticsData;
  views: StatisticsData;
}

export interface PhotoStatistics {
  id: string;
  downloads: StatisticsData;
  views: StatisticsData;
  likes: StatisticsData;
}
