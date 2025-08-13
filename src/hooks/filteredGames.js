import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BASE_URL from "../API/api";
import { toast } from "react-toastify";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import BASE_URL from "../API/api";

// This function runs all 3 search API calls
const fetchSearchGames = async (searchTerm) => {
  const fixedSearchTerm = searchTerm.trim();
  if (!fixedSearchTerm) {
    return { searchByName: [], searchByProvider: [] };
  }

  const [res1, res2, res3] = await Promise.all([
    axios.get(`${BASE_URL}/all-games?is_mobile=1&global=${fixedSearchTerm}`),
    axios.get(`${BASE_URL}/all-games?is_mobile=1&provider=${fixedSearchTerm}`),
    axios.get(`${BASE_URL}/all-games?is_mobile=1&type=${fixedSearchTerm}`),
  ]);

  // Merge res1 + res3 results
  const mergedSearchResults = [
    ...(res1.data.allGames || []),
    ...(res3.data.allGames || []),
  ];

  // Remove duplicates by uuid
  const uniqueMergedResults = Array.from(
    new Map(mergedSearchResults.map((game) => [game.uuid, game])).values()
  );

  return {
    searchByName: uniqueMergedResults,
    searchByProvider: res2.data.allGames || [],
  };
};

// React Query hook
const useSearchGames = (searchTerm, enabled) => {
  return useQuery({
    queryKey: ["searchGames", searchTerm],
    queryFn: () => fetchSearchGames(searchTerm),
    enabled: enabled && !!searchTerm.trim(), // only run if search mode is on and term is valid
    staleTime: 1000 * 60, // 1 min
  });
};

export default useSearchGames;

// const getFilteredGames = async (type) => {
//   const response = await axios.get(`${BASE_URL}/all-games?is_mobile=1`, {
//     params: { type },
//   });
//   return response.data.allGames;
// };

// export const useFilteredGames = (type, options = {}) => {
//   return useQuery({
//     queryKey: ["filteredGames", type],
//     queryFn: () => getFilteredGames(type),
//     enabled: !!type,
//     onError: () => {
//       toast.error("Something went wrong while filtering games.");
//     },
//     staleTime: 1000 * 60,
//     ...options,
//   });
// };

// hooks/filteredGames.js

// const getFilteredGames = async (type, page = 1, limit = 30) => {
//   const { data } = await axios.get(`${BASE_URL}/all-games`, {
//     params: { is_mobile: 1, type, page, limit },
//   });
//   const items = Array.isArray(data?.allGames) ? data.allGames : [];
//   const totalPages =
//     data?.pagination?.total_page || data?.pagination?.total_pages || 1;
//   return { items, totalPages };
// };

// export const useFilteredGames = (type, page = 1, limit = 30) =>
//   useQuery({
//     queryKey: ["filteredGames", type, page, limit],
//     queryFn: () => getFilteredGames(type, page, limit),
//     enabled: !!type, // don't run when type is null
//     // placeholderData: keepPreviousData,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 30 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });
