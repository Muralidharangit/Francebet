import axiosInstance from "../API/axiosConfig";

export const fetchDiceGames = async () => {
  const response = await axiosInstance.get(
    `/all-games?is_mobile=1&limit=10&type=dice`
  );
  const data = response.data;
  return Array.isArray(data.allGames) ? data.allGames : [];
};

export const fetchSmartSoftGames = async () => {
  const response = await axiosInstance.get(
    `/all-games?is_mobile=1&limit=10&provider=SmartSoft`
  );
  const data = response.data;
  return Array.isArray(data.allGames) ? data.allGames : [];
};

export const fetchProviderList = async () => {
  const response = await axiosInstance.get(`/providers-list`);
  const data = response.data;

  if (Array.isArray(data.providers)) {
    return data.providers.slice(0, 10); // only first 10
  }
  return [];
};

