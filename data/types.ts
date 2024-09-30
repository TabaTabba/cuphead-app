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
  recommendedWeapons?: number[];
  health?: number;
};

export type Weapon = {
  id: string;
  name: string;
  url: string;
  damage: number;
  exDamage: number;
  dps: number;
  color: string;
};

export type RootStackParamList = {
  MainScreen?: {};
  DetailsScreen?: {};
  FavoritesScreen?: {};
};
