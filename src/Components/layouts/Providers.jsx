import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import StickyHeader from "./Header/Header";
import Footer from "./footer/Footer";
import { motion } from "framer-motion";
import axiosInstance from "../../API/axiosConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "./Header/Sidebar";
import BottomFooter from "./footer/BottomFooter";

// ---------- helpers ----------
const parseProviders = (data) => {
  // Try common response shapes
  if (Array.isArray(data?.providers)) return data.providers;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.providers?.data)) return data.providers.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getHasMore = (data) => {
  // Supports multiple pagination shapes
  if (data?.links?.next) return true; // { links: { next: "..." } }
  if (data?.pagination && "next_page_url" in data.pagination) {
    return Boolean(data.pagination.next_page_url);
  }
  if (data?.meta?.current_page && data?.meta?.last_page) {
    return data.meta.current_page < data.meta.last_page;
  }
  // Fallback heuristic
  const list = parseProviders(data);
  return list.length >= 20;
};

const getLogo = (item) =>
  item?.images?.logo ||
  item?.images?.name ||
  item?.images?.logo_name ||
  "assets/img/game.png";

const getName = (item) =>
  item?.provider || item?.name || item?.provider_name || "Unknown";

// --------------------------------

const Providers = () => {
  const [providerList, setProviderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedGames, setSearchedGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSearchingGames, setIsSearchingGames] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // Debounced provider search (min 3 chars)
  useEffect(() => {
    const fixed = searchTerm.trim();
    if (fixed.length >= 3) {
      setIsSearchingGames(true);
      const t = setTimeout(() => handleAutoSearch(fixed), 400);
      return () => clearTimeout(t);
    } else {
      setSearchedGames([]);
      setIsSearchingGames(false);
    }
  }, [searchTerm]);

  const handleAutoSearch = async (term) => {
    try {
      // Use axiosInstance so headers/baseURL are consistent
      const res = await axiosInstance.get(`/providers-list`, {
        params: { provider: term },
      });
      const list = parseProviders(res.data);
      setSearchedGames(list);
    } catch (error) {
      console.error("Auto search failed:", error);
    } finally {
      setIsSearchingGames(false);
    }
  };

  // Fetch all providers (with pagination)
  const fetchAllProvider = async (page = 1) => {
    if (page === pageRef.current && page !== 1) return;
    page === 1 ? setIsInitialLoading(true) : setIsPageLoading(true);

    try {
      const res = await axiosInstance.get(`/providers-list`, {
        params: { page },
      });
      const data = res.data;
      const list = parseProviders(data);

      setProviderList((prev) => (page === 1 ? list : [...prev, ...list]));
      pageRef.current = page;
      setCurrentPage(page);
      setHasMore(getHasMore(data));
    } catch (error) {
      console.error("Error fetching provider list:", error);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
      setIsPageLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllProvider(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll (safer documentElement metrics)
  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 120;

    if (
      nearBottom &&
      !isInitialLoading &&
      !isPageLoading &&
      hasMore &&
      !isFetchingRef.current
    ) {
      isFetchingRef.current = true;
      fetchAllProvider(pageRef.current + 1).finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [isInitialLoading, isPageLoading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {isPageLoading && (
        <div className="text-white text-center my-3 w-100">
          <span className="spinner-border text-light" role="status" />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

      {/* header */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="container-fluid page-body-wrapper">
        {/* Sidebar */}
        <Sidebar />

        <div className="main-panel">
          <div className="content-wrapper new">
            <div className="max-1250 mx-auto px-2">
              {/* 🔍 Search Bar */}
              <div className="search_container_box">
                <form
                  className="form my-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <button type="submit">
                    <i className="ri-search-2-line fs-18" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search provider..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="my-3 input"
                  />
                  <button
                    className="reset"
                    type="reset"
                    onClick={() => setSearchTerm("")}
                  />
                </form>
              </div>

              <h5>Providers</h5>

              <div className="row px-8leftright">
                {searchTerm.trim().length >= 3 ? (
                  // Search Mode
                  isSearchingGames ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6 mb-3"
                        key={`searched-game-skel-${index}`}
                      >
                        <div className="game-card-wrapper rounded p-2 bg-dark text-white text-center">
                          <Skeleton
                            height={100}
                            borderRadius={4}
                            baseColor="#313131"
                            highlightColor="#525252"
                            className="mb-2"
                          />
                          <Skeleton
                            height={14}
                            width="80%"
                            baseColor="#313131"
                            highlightColor="#525252"
                            className="mx-auto mt-2"
                          />
                          <Skeleton
                            height={12}
                            width="60%"
                            baseColor="#313131"
                            highlightColor="#525252"
                            className="mt-1 mx-auto"
                          />
                        </div>
                      </div>
                    ))
                  ) : searchedGames.length > 0 ? (
                    searchedGames.map((item, index) => (
                      <motion.div
                        className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-4 mb-3"
                        key={item.id ?? `${getName(item)}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div
                          className="game-card-wrapper rounded-2 new-cardclr mt-2 d-flex justify-content-center pt-2"
                          style={{ height: "120px" }}
                          onClick={() =>
                            navigate(
                              `/filtered-provider-games?provider=${encodeURIComponent(
                                getName(item)
                              )}`
                            )
                          }
                        >
                          <div className="d-flex gap-1 flex-column align-items-center justify-content-center">
                            <img
                              src={getLogo(item)}
                              alt={getName(item)}
                              style={{ width: "35%" }}
                            />
                            <span className="fs-12 fw-bold text-truncate text-white">
                              {getName(item)}
                            </span>
                          </div>
                          <div className="game-play-button d-flex flex-column">
                            <div className="btn-play">
                              <i className="fa-solid fa-play" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white text-center mt-5">
                      No providers found for this search.
                    </p>
                  )
                ) : // Default Mode (list + infinite scroll)
                isInitialLoading ? (
                  Array.from({ length: 9 }).map((_, index) => (
                    <div
                      className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-4 px-1"
                      key={`provider-skel-${index}`}
                    >
                      <div
                        className="game-card-wrapper rounded-2 new-cardclr mt-2 d-flex justify-content-center pt-2"
                        style={{ height: "100px" }}
                      >
                        <div className="d-flex gap-1 flex-column align-items-center justify-content-center">
                          <Skeleton
                            circle
                            height={40}
                            width={40}
                            baseColor="#313131"
                            highlightColor="#525252"
                          />
                          <Skeleton
                            height={12}
                            width={100}
                            baseColor="#313131"
                            highlightColor="#525252"
                            className="mt-1"
                          />
                        </div>
                        <div
                          className="game-play-button d-flex flex-column"
                          style={{ opacity: 0 }}
                        >
                          <div className="btn-play">
                            <Skeleton
                              circle
                              width={40}
                              height={40}
                              baseColor="#313131"
                              highlightColor="#525252"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : providerList.length > 0 ? (
                  providerList.map((provider, index) => (
                    <motion.div
                      className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-4 px-1"
                      key={provider.id ?? `${getName(provider)}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div
                        className="game-card-wrapper rounded-2 new-cardclr mt-2 d-flex justify-content-center pt-2"
                        style={{ height: "120px" }}
                        onClick={() =>
                          navigate(
                            `/filtered-provider-games?provider=${encodeURIComponent(
                              getName(provider)
                            )}`
                          )
                        }
                      >
                        <div className="d-flex gap-1 flex-column align-items-center justify-content-center">
                          <img
                            src={getLogo(provider)}
                            alt={getName(provider)}
                            style={{ width: "50%" }}
                          />
                          <span className="fs-12 fw-bold text-truncate text-white">
                            {getName(provider)}
                          </span>
                        </div>
                        <div className="game-play-button d-flex flex-column">
                          <div className="btn-play">
                            <i className="fa-solid fa-play" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-white text-center mt-5">
                    No providers to display.
                  </p>
                )}
              </div>
            </div>

            <BottomFooter />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Providers;
