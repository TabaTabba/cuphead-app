export type Boss = {
  id: string;
  name: string;
  description: string;
  appearance?: string;
  personality?: string;
  coverImage?: any;
  images: any;
  gif?: any;
  difficulty: number;
  isle: 1 | 2 | 3;
};

export type RootStackParamList = {
  MainScreen?: {};
  DetailsScreen?: {};
  FavoritesScreen?: {};
};
