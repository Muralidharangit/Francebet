import React, { useEffect, useState, useRef, useContext } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../API/api";
import { toast, ToastContainer } from "react-toastify";
import StickyHeader from "./Header/Header";
import Footer from "./footer/Footer";
import { Images } from "./Header/constants/images";
import routes from "../routes/route";
import { motion } from "framer-motion";
import Sidebar from "./Header/Sidebar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// ✅ make sure this points to your real search hook file:
// import useSearchGames from "../../hooks/useSearchGames";
import useSearchGames from "../../hooks/filteredGames";
// ✅ React Query (inline use)
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { getIsMobileParam } from "../../hooks/homePageApi";
import AuthContext from "../../Auth/AuthContext";

const FilteredGamesPage = () => {
  const [games, setGames] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [selectedGameUrl, setSelectedGameUrl] = useState(null);
  const [showFullScreenGame, setShowFullScreenGame] = useState(false);
  const [isLaunchingGame, setIsLaunchingGame] = useState(false);
  const iframeRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // ---- SEARCH STATE ----
  const [searchByNameResults, setSearchByNameResults] = useState([]);
  const [searchByProviderResults, setSearchByProviderResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // ---- FILTERED (PAGINATION) STATE ----
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // ===== SEARCH via hook (unchanged) =====

  const { fetchUser, user } = useContext(AuthContext);
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchGames(searchTerm, isSearchMode);

  useEffect(() => {
    if (searchData) {
      setSearchByNameResults(searchData.searchByName);
      setSearchByProviderResults(searchData.searchByProvider);
    }
  }, [searchData]);

  // after const [searchParams] = useSearchParams();
  useEffect(() => {
    const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
    const urlProvider = searchParams.get("provider") || "";
    const urlType = searchParams.get("type") || "";

    if (urlType) {
      // filtered mode
      setFilterType(urlType);
      setIsSearchMode(false);
      setPage(1);
      setGames([]);
    } else if (urlSearch || urlProvider) {
      // search mode from URL
      const term = urlSearch || urlProvider;
      setSearchTerm(term);
      setIsSearchMode(true);
      setSearchPage(1);
      setHasMore(true);
      // fire the first page immediately
      handleAutoSearch(term.trim(), 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== FILTERED via React Query (inline) =====
  const getFilteredGames = async (customType, pageNum = 1, limit = 30) => {
    const isMobile = getIsMobileParam(); // 1 or 0
    const { data } = await axios.get(`${BASE_URL}/all-games`, {
      params: { is_mobile: String(isMobile), customType, page: pageNum, limit },
    });
    const items = Array.isArray(data?.allGames) ? data.allGames : [];
    const tp =
      data?.pagination?.total_page || data?.pagination?.total_pages || 1;
    return { items, totalPages: tp };
  };

  // const {
  //   data: filteredData,
  //   isLoading: isRQLoading,
  //   isFetching: isRQFetching,
  // } = useQuery({
  //   queryKey: ["filteredGames", filterType, page, 30],
  //   queryFn: () => getFilteredGames(filterType, page, 30),
  //   enabled: !!filterType && !isSearchMode, // only when not in search mode
  //   placeholderData: keepPreviousData,
  //   staleTime: 5 * 60 * 1000, // 5 mins cache
  //   gcTime: 30 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  //   retry: 1,
  // });

  const {
    data: filteredData,
    isLoading: isRQLoading,
    isFetching: isRQFetching,
  } = useQuery({
    queryKey: ["filteredGames", { type: filterType || "all", page, limit: 30 }],
    queryFn: () => getFilteredGames(filterType, page, 30),
    enabled: !isSearchMode, // run whenever not in search mode
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // accumulate pages into local `games`
  useEffect(() => {
    if (!filteredData || isSearchMode) return;
    setTotalPages(filteredData.totalPages);
    setHasMore(page < filteredData.totalPages);

    setGames((prev) => {
      if (page === 1) return filteredData.items;
      const combined = [...prev, ...filteredData.items];
      return Array.from(new Map(combined.map((g) => [g.uuid, g])).values());
    });
  }, [filteredData, page, isSearchMode]);

  // derived loading for skeletons in filtered view
  const loading = isRQLoading && page === 1;

  // ===== Search handlers (unchanged) =====
  const handleSubmit = (e) => {
    e.preventDefault();
    const fixedSearchTerm = searchTerm.trim();
    if (!fixedSearchTerm) return;
    setIsSearchMode(true);
  };

  useEffect(() => {
    const fixedSearchTerm = searchTerm.trim();

    if (fixedSearchTerm.length < 3) {
      setIsSearchMode(false);
      setSearchByNameResults([]);
      setSearchByProviderResults([]);
      setSearchPage(1);
      return;
    }

    setIsSearchMode(true);
    setSearchPage(1);
    setHasMore(true);

    const delay = setTimeout(() => {
      handleAutoSearch(fixedSearchTerm, 1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const fixedSearchTerm = searchTerm.trim();
    if (isSearchMode && fixedSearchTerm.length >= 3 && searchPage > 1) {
      handleAutoSearch(fixedSearchTerm, searchPage);
    }
  }, [searchPage]);

  // ===== Infinite scroll trigger =====
  useEffect(() => {
    const handleScroll = () => {
      const bottomReached =
        window.innerHeight + document.documentElement.scrollTop + 300 >=
        document.documentElement.scrollHeight;

      if (bottomReached && !isFetching) {
        if (isSearchMode && searchPage < totalPages) {
          setSearchPage((prev) => prev + 1);
        } else if (!isSearchMode && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, isSearchMode, page, searchPage, totalPages]);

  // ===== When URL ?type= changes =====
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setFilterType(type);
      setPage(1);
      setHasMore(true);
      setGames([]); // clear while new type loads via React Query
    }
  }, [searchParams]);

  // ===== Detect iframe close & refresh list (invalidate cache) =====
  useEffect(() => {
    let interval;
    if (showFullScreenGame && selectedGameUrl) {
      interval = setInterval(() => {
        const frame = iframeRef.current;
        if (!document.body.contains(frame)) {
          setShowFullScreenGame(false);
          setSelectedGameUrl(null);
          if (filterType) {
            queryClient.invalidateQueries({
              queryKey: ["filteredGames", filterType],
            });
          }
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showFullScreenGame, selectedGameUrl, filterType, queryClient]);

  // ====== GAME LAUNCH (unchanged) ======
  // const handleGameClick = async (game) => {
  //   if (!game.provider || !game.name || !game.uuid) {
  //     toast.error("Missing game info.");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");

  //   try {
  //     setIsLaunchingGame(true);

  //     // const response = await axios.get(
  //     //   `${BASE_URL}/player/${game.provider}/launch/${encodeURIComponent(
  //     //     game.name
  //     //   )}/${game.uuid}`,
  //     //   {
  //     //     params: {
  //     //       return_url: `${window.location.origin}/all-games?is_mobile=1`,
  //     //       has_lobby: game.has_lobby,
  //     //       has_tables: game.has_tables,
  //     //     },
  //     //     headers: { Authorization: `Bearer ${token}` },
  //     //   }
  //     // );
  //     const isMobileParam = getIsMobileParam();
  //     // inside component

  //     const returnUrl = `${window.location.origin}${location.pathname}${
  //       location.search || ""
  //     }`;

  //     const response = await axios.get(
  //       `${BASE_URL}/player/${game.provider}/launch/${encodeURIComponent(
  //         game.name
  //       )}/${game.uuid}`,
  //       {
  //         params: {
  //           return_url: returnUrl,
  //           has_lobby: game.has_lobby,
  //           has_tables: game.has_tables,
  //         }, // ⬅️ use the exact current URL
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // const response = await axios.get(
  //     //   `${BASE_URL}/player/${game.provider}/launch/${encodeURIComponent(
  //     //     game.name
  //     //   )}/${game.uuid}`,
  //     //   {
  //     //     params: {
  //     //       // return_url: `${window.location.origin}/all-games?is_mobile=${isMobileParam}`,
  //     //       return_url: `${window.location.origin}/top-games`,
  //     //       has_lobby: game.has_lobby,
  //     //       has_tables: game.has_tables,
  //     //     },
  //     //     headers: { Authorization: `Bearer ${token}` },
  //     //   }
  //     // );

  //     const gameUrl = response.data?.game?.gameUrl || response.data?.game_url;
  //     if (gameUrl) {
  //       sessionStorage.setItem("prevPage", location.pathname + location.search);
  //       window.history.pushState(
  //         { isGameOpen: true },
  //         "",
  //         window.location.href
  //       );
  //       setSelectedGameUrl(gameUrl);
  //       setShowFullScreenGame(true);
  //     } else {
  //       toast.error("Failed to get game URL.");
  //     }
  //   } catch (error) {
  //     setIsLaunchingGame(false);
  //     const errMsg = error.response?.data?.message;
  //     if (errMsg === "Unauthenticated." || error.response?.status === 401) {
  //       toast.error("Please login to jump into the Game World! 🎮🚀");
  //       localStorage.removeItem("token");
  //       setTimeout(() => navigate("/login"), 3000);
  //       return;
  //     }
  //     console.error("Error launching game:", error);
  //     toast.error("Game launch failed. Try again later.");
  //   }
  // };
  // const RETURN_URL_KEY = "returnUrl";

  // const buildReturnUrl = (location) => {
  //   // If you use HashRouter, prefer: return window.location.href;
  //   const base = import.meta?.env?.BASE_URL || process.env.PUBLIC_URL || "";
  //   const baseTrim = base.replace(/\/$/, ""); // e.g. '/app'
  //   const path = `${baseTrim}${location.pathname}${location.search || ""}`;
  //   return new URL(path, window.location.origin).toString();
  // };

  // const handleGameClick = async (game) => {
  //   if (!game?.provider || !game?.name || !game?.uuid) {
  //     toast.error("Missing game info.");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.error("Please login to jump into the Game World! 🎮🚀");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     setIsLaunchingGame(true);

  //     // Build & save exact return URL for later (Back / popstate / iframe return)
  //     const returnUrl = buildReturnUrl(location);
  //     sessionStorage.setItem(RETURN_URL_KEY, returnUrl);

  //     const response = await axios.get(
  //       `${BASE_URL}/player/${game.provider}/launch/${encodeURIComponent(
  //         game.name
  //       )}/${game.uuid}`,
  //       {
  //         params: {
  //           return_url: returnUrl,
  //           ...(game.has_lobby !== undefined && { has_lobby: game.has_lobby }),
  //           ...(game.has_tables !== undefined && {
  //             has_tables: game.has_tables,
  //           }),
  //         },
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const gameUrl = response.data?.game?.gameUrl || response.data?.game_url;
  //     if (gameUrl) {
  //       // (optional) keep this if you use it elsewhere
  //       sessionStorage.setItem("prevPage", location.pathname + location.search);

  //       // Push a state so browser Back triggers your popstate handler
  //       window.history.pushState(
  //         { isGameOpen: true },
  //         "",
  //         window.location.href
  //       );

  //       setSelectedGameUrl(gameUrl);
  //       setShowFullScreenGame(true); // keep spinner until iframe onLoad sets it false
  //     } else {
  //       setIsLaunchingGame(false); // <-- stop overlay here too
  //       toast.error("Failed to get game URL.");
  //     }
  //   } catch (error) {
  //     setIsLaunchingGame(false);
  //     const errMsg = error.response?.data?.message;
  //     if (errMsg === "Unauthenticated." || error.response?.status === 401) {
  //       toast.error("Please login to jump into the Game World! 🎮🚀");
  //       localStorage.removeItem("token");
  //       setTimeout(() => navigate("/login"), 3000);
  //       return;
  //     }
  //     console.error("Error launching game:", error);
  //     toast.error("Game launch failed. Try again later.");
  //   }
  // };

  // ====== Auto search (your existing code) ======
  const handleAutoSearch = async (fixedSearchTerm, pageNo = 1) => {
    if (isFetching || !hasMore) return;

    try {
      setSearchLoading(true);
      setIsFetching(true);
      const isMobileParam = getIsMobileParam();

      const [res1, res2, res3] = await Promise.all([
        axios.get(
          `${BASE_URL}/all-games?is_mobile=${isMobileParam}&global=${fixedSearchTerm}&page=${pageNo}`
        ),
        axios.get(
          `${BASE_URL}/all-games?is_mobile=${isMobileParam}&provider=${fixedSearchTerm}&page=${pageNo}`
        ),
        axios.get(
          `${BASE_URL}/all-games?is_mobile=${isMobileParam}&type=${fixedSearchTerm}&page=${pageNo}`
        ),
      ]);

      let mergedSearchResults = [
        ...(res1.data.allGames || []),
        ...(res3.data.allGames || []),
      ];

      const total = Math.max(
        res1.data.pagination?.total_page || 1,
        res2.data.pagination?.total_page || 1,
        res3.data.pagination?.total_page || 1
      );

      const newSearchGames = Array.from(
        new Map(mergedSearchResults.map((game) => [game.uuid, game])).values()
      );

      if (pageNo === 1) {
        setSearchByNameResults(newSearchGames);
      } else {
        setSearchByNameResults((prev) => {
          const combined = [...prev, ...newSearchGames];
          return Array.from(new Map(combined.map((g) => [g.uuid, g])).values());
        });
      }

      if (pageNo === 1) {
        setSearchByProviderResults(res2.data.allGames || []);
      }

      setHasMore(pageNo < total);
      setTotalPages(total);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
      setIsFetching(false);
    }
  };

  const RETURN_URL_KEY = "returnUrl";

  const navigateToSavedReturnUrl = React.useCallback(() => {
    const target = sessionStorage.getItem(RETURN_URL_KEY) || "/";

    // Strip origin so React Router can handle it
    const origin = window.location.origin;
    const toPath = target.startsWith(origin)
      ? target.slice(origin.length)
      : target;

    // If we’re already at that path+query, just close overlay; don’t navigate again
    const here = window.location.pathname + window.location.search;
    const url = new URL(target, origin);
    const there = url.pathname + url.search;
    if (here === there) return;

    navigate(toPath, { replace: true }); // soft navigate (no full reload)
  }, [navigate]);

  // back btn setup starts
  const buildReturnUrl = (location) => {
    const base = import.meta?.env?.BASE_URL || process.env.PUBLIC_URL || "";
    const baseTrim = base.replace(/\/$/, "");
    const path = `${baseTrim}${location.pathname}${location.search || ""}`;
    return new URL(path, window.location.origin).toString();
  };

  // back btn / overlay state (OUTSIDE the function)
  const [showModal, setShowModal] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  // const iframeRef = useRef(null);

  const handleConfirm = async () => {
    setShowModal(false);
    setIsLaunchingGame(false);
    setShowFullScreenGame(false);
    setSelectedGameUrl("");
    await fetchUser(user?.token);
    // go back to saved returnUrl
    const target = sessionStorage.getItem(RETURN_URL_KEY) || "/";
    // window.location.replace(target);
    navigateToSavedReturnUrl();
  };

  const handleCancel = () => setShowModal(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIsLaunchingGame(false);

    const el = iframeRef.current;
    if (!el) return;

    try {
      // if same-origin (provider redirected to our app)
      const href = el.contentWindow.location.href;
      if (href.startsWith(window.location.origin)) {
        setShowFullScreenGame(false);
        setSelectedGameUrl("");
        setIframeError(false);
        setIframeLoaded(false);
        const target = sessionStorage.getItem(RETURN_URL_KEY) || href;
        // window.location.replace(target);
        navigateToSavedReturnUrl();
      }
    } catch {
      // still cross-origin; ignore
    }
  };

  // ---- keep popstate too (optional but nice) ----
  useEffect(() => {
    const onPop = () => {
      setShowFullScreenGame(false);
      setSelectedGameUrl("");
      setIsLaunchingGame(false);
      // const target = sessionStorage.getItem(RETURN_URL_KEY) || "/";
      // window.location.replace(target);
      navigateToSavedReturnUrl();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ====== GAME LAUNCH (ENTIRE function body stays together) ======
  const handleGameClick = async (game) => {
    if (!game?.provider || !game?.name || !game?.uuid) {
      toast.error("Missing game info.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to jump into the Game World! 🎮🚀");
      navigate("/login");
      return;
    }

    try {
      setIsLaunchingGame(true);

      const returnUrl = buildReturnUrl(location);
      sessionStorage.setItem(RETURN_URL_KEY, returnUrl);

      const response = await axios.get(
        `${BASE_URL}/player/${game.provider}/launch/${encodeURIComponent(
          game.name
        )}/${game.uuid}`,
        {
          params: {
            return_url: returnUrl,
            ...(game.has_lobby !== undefined && { has_lobby: game.has_lobby }),
            ...(game.has_tables !== undefined && {
              has_tables: game.has_tables,
            }),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const gameUrl = response.data?.game?.gameUrl || response.data?.game_url;
      if (gameUrl) {
        // (optional)
        sessionStorage.setItem("prevPage", location.pathname + location.search);

        // push state so Back triggers our popstate handler
        window.history.pushState(
          { isGameOpen: true },
          "",
          window.location.href
        );

        setSelectedGameUrl(gameUrl);
        setShowFullScreenGame(true);
      } else {
        setIsLaunchingGame(false);
        toast.error("Failed to get game URL.");
      }
    } catch (error) {
      setIsLaunchingGame(false);
      const errMsg = error.response?.data?.message;
      if (errMsg === "Unauthenticated." || error.response?.status === 401) {
        toast.error("Please login to jump into the Game World! 🎮🚀");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }
      console.error("Error launching game:", error);
      toast.error("Game launch failed. Try again later.");
    }
  };
  // back btn setup Ends
  return (
    <>
      {isLaunchingGame && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <div className="spinner-border text-light me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Launching game, please wait...
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      {/* header  */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* header end */}

      <div className="container-fluid page-body-wrapper">
        {/* Sidebar Nav Starts */}
        <Sidebar />
        {/* Sidebar Nav Ends */}
        {/* 🔍 Search Bar */}

        <div className="main-panel">
          <div className="content-wrapper new">
            <div className="max-1250 mx-auto">
              <div className="search_container_box mx-2">
                <form className="form my-2" onSubmit={handleSubmit}>
                  <button type="submit">
                    <i className="ri-search-2-line fs-18" />
                  </button>

                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onInput={(e) => setSearchTerm(e.target.value)} // ✅ extra support for mobile
                    className="my-3 input"
                  />

                  {isSearchMode && (
                    <button
                      type="button"
                      className="reset"
                      onClick={() => {
                        setSearchTerm("");
                        setSearchByNameResults([]); // ✅ Clear actual search result state
                        setSearchByProviderResults([]); // ✅ Clear provider results
                        setSearchPage(1); // ✅ Reset pagination
                        setIsSearchMode(false);
                        setHasMore(true); // ✅ Enable future searching
                      }}
                    >
                      ❌
                    </button>
                  )}
                </form>
              </div>

              {/* 🕹️ Game List */}
              {isSearchMode ? (
                <>
                  {isSearchMode && (
                    <div className=" px-2 ">
                      {searchLoading && searchPage === 1 ? (
                        <p className="text-white text-center mt-5">
                          🎮 Loading games...
                        </p>
                      ) : searchByNameResults.length > 0 ||
                        searchByProviderResults.length > 0 ? (
                        <>
                          {/* 🔍 Search by Game Name Section */}
                          {searchByNameResults.length > 0 && (
                            <>
                              <h5 className="text-white mt-4">
                                Search by Game Name
                              </h5>
                              <div className="">
                                <div className="row px-8leftright">
                                  {searchByNameResults.map((game, index) => (
                                    <motion.div
                                      className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 col-custom-3"
                                      key={game.uuid}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: index * 0.002,
                                      }}
                                    >
                                      <div
                                        className="game-card-wrapper rounded-2 new-cardclr mt-2 hover-group"
                                        onClick={() => handleGameClick(game)}
                                      >
                                        <div className="game-card position-relative p-0 m-0 overflow-hidden">
                                          <img
                                            src={
                                              game.image ||
                                              "/assets/img/play_now.png"
                                            }
                                            className="game-card-img"
                                            alt={game.name}
                                          />
                                        </div>
                                        <div className="btn-play position-absolute top-50 start-50 translate-middle">
                                          <i className="fa-solid fa-play"></i>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* 🔍 Search by Provider */}
                          {searchPage === 1 &&
                            searchByProviderResults.length > 0 && (
                              <>
                                <h5 className="text-white mt-6">
                                  Search by Provider
                                </h5>
                                <div className="row ">
                                  {searchByProviderResults.map(
                                    (game, index) => (
                                      <motion.div
                                        className="col-md-4 col-sm-4 col-6 px-1"
                                        key={game.uuid}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: index * 0.002,
                                        }}
                                      >
                                        <div
                                          className="game-card-wrapper rounded-2 new-cardclr mt-2"
                                          onClick={() => handleGameClick(game)}
                                        >
                                          <div className="game-card p-0 m-0 p-1">
                                            <img
                                              src={
                                                game.image ||
                                                "/assets/img/play_now.png"
                                              }
                                              className="game-card-img"
                                              alt={game.name}
                                            />
                                            <div className="d-flex flex-column text-white text-center py-2 px-1">
                                              <span className="fs-12 fw-bold text-truncate">
                                                {game.name}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="game-play-button d-flex flex-column">
                                            <div className="btn-play">
                                              <i className="fa-solid fa-play"></i>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                        </>
                      ) : searchTerm.trim().length >= 3 && !searchLoading ? (
                        <p className="text-center text-gray-400 mt-4">
                          No results found.
                        </p>
                      ) : null}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* filter Game List Starts */}
                  <SkeletonTheme baseColor="#313131" highlightColor="#525252">
                    <div className="game-list px-2 container">
                      <h5 className="text-white text-capitalize my-2">
                        {filterType
                          ? filterType === "card"
                            ? "Live Casino"
                            : `${filterType} Games`
                          : "Games"}
                      </h5>

                      <div className="">
                        <div className="row px-8leftright">
                          {loading ? (
                            // 🔄 Skeleton Cards While Loading
                            Array.from({ length: 6 }).map((_, index) => (
                              <div
                                className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 col-custom-3"
                                key={index}
                              >
                                <div className="game-card-wrapper rounded-2 new-cardclr mt-2">
                                  <Skeleton height={140} borderRadius={10} />
                                  <div className="mt-2 px-1">
                                    <Skeleton height={12} width="80%" />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : games.length > 0 ? (
                            games
                              .filter((game) => game.image)
                              .map((game) => (
                                <div
                                  className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 col-custom-3"
                                  key={game.uuid}
                                >
                                  <div
                                    className="game-card-wrapper rounded-2 new-cardclr mt-2 hover-group"
                                    onClick={() => handleGameClick(game)}
                                  >
                                    <div className="game-card position-relative p-0 m-0 overflow-hidden">
                                      <img
                                        src={game.image}
                                        className="game-card-img"
                                        alt={game.name}
                                      />
                                      {/* <h6>ytstinn</h6> */}
                                    </div>
                                    <div className="btn-play position-absolute top-50 start-50 translate-middle">
                                      <i className="fa-solid fa-play"></i>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            // ❌ No Games
                            <div className="d-flex flex-column align-items-center mt-5">
                              <img
                                src="assets/img/notification/img_2.png"
                                alt="unauth"
                                className="w-25"
                              />
                              <p className="text-white text-center">
                                No games available.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SkeletonTheme>

                  {/* filter Games End here  */}
                </>
              )}

              {/* filter Game List Starts */}
              {/* <div className="game-list px-3 container">
        <h5 className="text-white text-capitalize my-2">
          {filterType ? `${filterType} Games` : "Games"}
        </h5>

        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <div className="row">
            {loading ? (
              <p className="text-white text-center">🎮 Loading games...</p>
            ) : games.length > 0 ? (
              games
                .filter((game) => game.image)
                .map((game) => (
                  <div
                    className="col-md-4 col-sm-4 col-6 px-1 col-custom-3"
                    key={game.uuid}
                  >
                    <div className="game-card-wrapper rounded-2 new-cardclr mt-2 hover-group">
                      <div className="game-card position-relative p-0 m-0 overflow-hidden">
                        <img
                          src={game.image}
                          className="game-card-img"
                          alt={game.name}
                        />
                      </div>
                      <div
                        className="btn-play position-absolute top-50 start-50 translate-middle"
                        onClick={() => handleGameClick(game)}
                      >
                        <i className="fa-solid fa-play"></i>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <>
                <div className="d-flex flex-column align-items-center mt-5">
                  <img
                    src="assets/img/notification/img_2.png"
                    alt="unauth"
                    className="w-75"
                  />
                  <p className="text-white text-center">No games available.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div> */}
              {/* filter Games End here  */}
            </div>
            {showFullScreenGame && selectedGameUrl && (
              <div
                className="iframe-container"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "#000",
                  zIndex: 9999,
                }}
              >
                {/* Navbar only appears if iframe loaded successfully */}
                {iframeLoaded && !iframeError && (
                  <nav
                    className="navbar py-1 navbar-dark bg-black sticky-top shadow-sm d-flex align-items-center"
                    style={{ height: "50px" }}
                  >
                    <div className="container-fluid d-flex align-items-center">
                      <button
                        className="btn btn-index w-100 deposit-btn text-white py-2"
                        style={{ background: "#292524" }}
                        onClick={() => setShowModal(true)}
                      >
                        Back
                      </button>
                    </div>
                  </nav>
                )}

                {/* Iframe or Error Message */}
                <div
                  className="flex-grow-1 d-flex justify-content-center align-items-center"
                  style={{ height: "calc(100vh - 50px)" }}
                >
                  {!iframeError ? (
                    <iframe
                      ref={iframeRef}
                      src={selectedGameUrl}
                      title="Game"
                      allowFullScreen
                      // onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                      onLoad={handleIframeLoad}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        color: "red",
                        fontSize: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      Game not visible
                    </div>
                  )}
                </div>

                {/* Modal */}
                {showModal && (
                  <div
                    className="modal-backdrop d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 99999,
                    }}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered m-2"
                      style={{ maxWidth: "400px", color: "white" }}
                    >
                      <div
                        className="modal-content text-center p-4"
                        style={{
                          borderRadius: "1rem",
                          background:
                            "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
                          border: "1px solid #ff0055",
                          boxShadow: "0 0 20px #ff0055ae",
                        }}
                      >
                        <div className="modal-header border-0 justify-content-end">
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleCancel}
                          />
                        </div>

                        <div className="modal-body">
                          <h5 className="modal-title fs-2 text-warning mb-3">
                            Go Back?
                          </h5>
                          <p className="fs-5 text-light">
                            Are you sure you want to leave this game?
                          </p>
                        </div>

                        <div className="modal-footer border-0 justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-index w-100 deposit-btn text-white py-2"
                            onClick={handleConfirm}
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            className="btn btn-index w-100 deposit-btn text-white py-2"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="" style={{ marginTop: "100px" }}></div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilteredGamesPage;
