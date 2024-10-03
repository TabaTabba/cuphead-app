import { imageMapping } from "../data/imageMapping";

export const getImage = (path: string) => {
  return imageMapping[path] || null;
};
