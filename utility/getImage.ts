import { imageMapping } from "./imageMapping";

export const getImage = (path: string) => {
  return imageMapping[path] || null;
};
