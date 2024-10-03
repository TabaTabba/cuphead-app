import axios from "axios";

export const fetchBosses = async () => {
  return await axios.get("http://localhost:3000/bosses");
};

export const fetchWeapons = async () => {
  return await axios.get("http://localhost:3000/weapons");
};
