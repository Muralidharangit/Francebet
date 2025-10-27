import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../../../Auth/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import StickyHeader from "../../../layouts/Header/Header";
import Sidebar from "../../../layouts/Header/Sidebar";
import { CURRENCY_SYMBOL } from "../../../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchDepositDetails,
  fetchDepositHistory,
} from "../../../../API/depositAPI";

const ITEMS_PER_PAGE = 10;

const DepositHistory = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [openId, setOpenId] = useState(null);
  // const toggleOpen = (id) => setOpenId((v) => (v === id ? null : id));
  const toggleOpen = (key) => setOpenKey((v) => (v === key ? null : key));
  const [openKey, setOpenKey] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const qc = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: [
      "depositHistory",
      { page: currentPage, perPage: ITEMS_PER_PAGE, tab: selectedTab, token },
    ],
    queryFn: () =>
      fetchDepositHistory({
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        token,
      }),

    placeholderData: keepPreviousData,
    retry: 1,

    // 👇 ensure it fetches latest when you enter this page
    staleTime: 0, // treat cached data as stale immediately (per this query)
    refetchOnMount: "always", // always refetch on mount
    refetchOnWindowFocus: true, // optional: update when user returns to tab
    refetchOnReconnect: true, // optional: update after network reconnect

    onError: (e) => {
      toast.error(
        `${
          (e && e.message) || "Request failed"
        }. Please log in again to continue.`,
        {
          toastId: "unauthorized-toast",
          onClose: () =>
            navigate(location.pathname, { replace: true, state: {} }),
        }
      );
    },
  });
  // toggle
  const PREFETCH = false;
  // Prefetch next/prev pages
  useEffect(() => {
    if (!PREFETCH || !data) return; // <— guard prefetch
    const next = (data.current_page || 1) + 1;
    const prev = (data.current_page || 1) - 1;

    if (next <= (data.last_page || 1)) {
      qc.prefetchQuery({
        queryKey: [
          "depositHistory",
          { page: next, perPage: ITEMS_PER_PAGE, tab: selectedTab, token },
        ],
        queryFn: () =>
          fetchDepositHistory({ page: next, perPage: ITEMS_PER_PAGE, token }),
        staleTime: 5 * 60 * 1000,
      });
    }
    if (prev >= 1) {
      qc.prefetchQuery({
        queryKey: [
          "depositHistory",
          { page: prev, perPage: ITEMS_PER_PAGE, tab: selectedTab, token },
        ],
        queryFn: () =>
          fetchDepositHistory({ page: prev, perPage: ITEMS_PER_PAGE, token }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [data, qc, selectedTab, token]);

  // Reset to page 1 when changing tab (if you later filter on server)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  const rows = (data && data.data) || [];
  const meta = {
    current_page: (data && data.current_page) || currentPage,
    last_page: (data && data.last_page) || 1,
    per_page: (data && data.per_page) || ITEMS_PER_PAGE,
    total: (data && data.total) || rows.length,
  };

  const displayRows = useMemo(() => {
    if (selectedTab === "all") return rows;
    return rows.filter((b) => (b.status || "").toLowerCase() === selectedTab);
  }, [rows, selectedTab]);

  const statusBadge = (s) => {
    const v = (s || "").toString().trim().toLowerCase();
    if (!v) return "badge bg-secondary";
    if (["success", "paid", "completed", "verified"].includes(v))
      return "history_badge success_badge";
    if (["failed", "rejected", "error", "cancelled", "canceled"].includes(v))
      return "history_badge text-danger";
    if (["processing", "created", "pending", "initiated"].includes(v))
      return "history_badge pending_badge";
    return "badge bg-secondary";
  };

  const renderPagination = () => {
    const items = [];
    const curr = meta.current_page || 1;
    const last = meta.last_page || 1;

    const addPage = (p) => items.push({ type: "page", value: p });
    const addDots = () => items.push({ type: "dots" });

    if (last <= 7) {
      for (let i = 1; i <= last; i++) addPage(i);
    } else {
      const left = Math.max(2, curr - 1);
      const right = Math.min(last - 1, curr + 1);
      addPage(1);
      if (left > 2) addDots();
      for (let p = left; p <= right; p++) addPage(p);
      if (right < last - 1) addDots();
      addPage(last);
    }

    return items.map((it, idx) =>
      it.type === "dots" ? (
        <li key={`dots-${idx}`} className="page-item disabled">
          <span className="page-link">…</span>
        </li>
      ) : (
        <li
          key={`p-${it.value}`}
          className={`page-item ${
            meta.current_page === it.value ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(it.value)}
          >
            {it.value}
          </button>
        </li>
      )
    );
  };
  const prefetchPage = (p) => {
    if (!p) return;
    qc.prefetchQuery({
      queryKey: [
        "depositHistory",
        { page: p, perPage: ITEMS_PER_PAGE, tab: selectedTab, token },
      ],
      queryFn: () =>
        fetchDepositHistory({ page: p, perPage: ITEMS_PER_PAGE, token }),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchDetails = (id, type) => {
    if (!id) return;
    qc.prefetchQuery({
      queryKey: ["depositDetails", { id, type, token }],
      queryFn: () => fetchDepositDetails({ id, type, token }),
      staleTime: 5 * 60 * 1000,
    });
  };
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <section className="page-body-wrapper">
        <Sidebar />

        <div className="main-panel overflow-hidden">
          <div className="content-wrapper">
            <div className="max-1250 mx-auto">
              <div className="h-100">
                <div className="pt-3 pb-2">
                  <div className="row px-2">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between position-relative px-2">
                      <div className="d-flex justify-content-between align-items-center px-1">
                        <button
                          className="go_back_btn bg-grey"
                          onClick={() => window.history.back()}
                        >
                          <i className="ri-arrow-left-s-line text-white fs-20" />
                        </button>
                      </div>

                      <h5 className="m-0 text-white fs-16 text-center">
                        All Deposit History
                      </h5>

                      <div className="d-flex justify-content-between align-items-center px-1">
                        {/* Invalidate cache manually (optional) */}
                        <button
                          className="go_back_btn bg-grey"
                          onClick={() =>
                            qc.invalidateQueries({
                              queryKey: ["depositHistory"],
                            })
                          }
                        >
                          <i className="fa-solid fa-arrows-rotate text-white fs-16"></i>
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="overflow-auto px-3 mt-4">
                      <div
                        className="nav nav-pills flex-nowrap gap-2 scroll-hidden rounded-2"
                        id="latest-bet-tabs"
                        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                      >
                        {["all"].map((tab) => (
                          <button
                            key={tab}
                            className={`nav-link latest_bet_btn ${
                              selectedTab === tab ? "active" : ""
                            }`}
                            style={{ padding: "2px 12px" }}
                            onClick={() => setSelectedTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="tab-content px-3 mt-2 mb-3">
                      {isLoading ? (
                        <p className="text-white text-center mt-4">Loading…</p>
                      ) : isError ? (
                        <p className="text-danger text-center mt-3">
                          {String((error && error.message) || "Failed")}
                        </p>
                      ) : displayRows && displayRows.length > 0 ? (
                        displayRows.map((bet) => {
                          const rowKey = `${bet.id}:${bet.type}`; // composite key
                          return (
                            <DepositRow
                              key={rowKey} // unique React key
                              bet={bet}
                              token={token}
                              isOpen={openKey === rowKey} // open state per (id,type)
                              onToggle={() => toggleOpen(rowKey)}
                              prefetchDetails={prefetchDetails}
                              statusBadge={statusBadge}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center mt-4">
                          <p className="text-white text-center">
                            No Deposit History Found
                          </p>
                        </div>
                      )}

                      {/* Pagination */}
                      {meta.last_page > 1 && (
                        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 my-3">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={meta.current_page <= 1}
                          >
                            ⬅ Prev
                          </button>
                          <ul className="pagination mb-0">
                            {renderPagination()}
                          </ul>
                          {/* // In your Next button: */}
                          <button
                            className="btn btn-outline-secondary"
                            onMouseEnter={() =>
                              prefetchPage(meta.current_page + 1)
                            }
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(meta.last_page, p + 1)
                              )
                            }
                            disabled={meta.current_page >= meta.last_page}
                          >
                            Next ➡
                          </button>
                        </div>
                      )}

                      {/* Hint while background fetching */}
                      {isFetching && (
                        <div className="text-center text-grey small">
                          Updating…
                        </div>
                      )}

                      <div className="text-center text-grey small">
                        Page {meta.current_page} of {meta.last_page} • Total{" "}
                        {meta.total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepositHistory;

function DepositRow({ bet, token, isOpen, onToggle, prefetchDetails }) {
  const {
    data: details,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["depositDetails", { id: bet.id, type: bet.type, token }],
    queryFn: () => fetchDepositDetails({ id: bet.id, type: bet.type, token }),
    enabled: isOpen,
    staleTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });

  return (
    <div className="dh-card">
      {/* Header */}
      <button
        className={`dh-row ${isOpen ? "is-open" : ""}`}
        onClick={() => onToggle(bet.id)}
        onMouseEnter={() => prefetchDetails(bet.id, bet.type)}
        onFocus={() => prefetchDetails(bet.id, bet.type)}
        aria-expanded={isOpen}
        aria-controls={`row-${bet.id}-details`}
      >
        <div className="dh-row__left ">
          <div className="dh-icon">
            <i
              className="fa-solid fa-arrow-down"
              style={{ transform: "rotate(45deg)" }}
            />
          </div>

          <div>
            <div className="dh-eyebrow">Payment Method</div>
            <div className="dh-title">{bet.type}</div>
            <div className="dh-subtle">
              {new Date(bet.created_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              •{" "}
              {new Date(bet.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>

        <div className="dh-row__right d-flex  align-items-end flex-column">
          <div className="dh-amount">
            NAD$ {Number(bet?.deposit_amount || 0).toFixed(2)}
          </div>
          <span
            className={`fw-bold ${
              bet.status === "pending"
                ? "history_badge pending_badge"
                : bet.status === "verified"
                ? "history_badge success_badge"
                : bet.status === "processing"
                ? "history_badge processing_badge"
                : "text-danger"
            }`}
          >
            {bet.status}
          </span>
          {/* <div className={statusClass}>{details?.status || bet.status}</div> */}
          <div className="dh-chevron" aria-hidden>
            <i className="fa-solid fa-chevron-down text-white" />
            {/* <p className="mb-0 mt-1 text-danger">
              see more <i className="fa-solid fa-chevron-down text-white" />
            </p> */}
          </div>
        </div>
      </button>

      {/* Details */}
      <div
        id={`row-${bet.id}-details`}
        className={`dh-details ${isOpen ? "open" : ""}`}
      >
        <div className="dh-details__inner">
          {isLoading && (
            <div className="skeleton">
              <div className="skeleton-line" />
              <div className="skeleton-line w-75" />
              <div className="skeleton-line w-50" />
            </div>
          )}

          {isError && (
            <div className="alert alert-danger py-2 px-3">
              {String(error?.message || "Failed to load details")}
            </div>
          )}

          {!isLoading &&
            !isError &&
            details &&
            (() => {
              const d = details?.depositDetail ?? details; // normalize just in case
              if (!d) return null;

              return (
                <div className="dh-grid">
                  {/* UTR only if present */}
                  {d.utr ? (
                    <div className="dh-field">
                      <div className="dh-label">UTR / Reference</div>
                      <div className="dh-value">{d.utr}</div>
                    </div>
                  ) : null}

                  {d.remarks ? (
                    <div className="dh-field">
                      <div className="dh-label">Remarks</div>
                      <div className="dh-value">{d.remarks}</div>
                    </div>
                  ) : null}

                  {d.bonus ? (
                    <div className="dh-field">
                      <div className="dh-label">Bonus</div>
                      <div className="dh-value">{d.bonus}</div>
                    </div>
                  ) : null}

                  {/* Image only if present */}
                  {d.image_url ? (
                    <div className="dh-field" style={{ gridColumn: "1 / -1" }}>
                      <img
                        src={d.image_url}
                        alt="Payment proof"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        style={{
                          maxWidth: "35%",
                          height: "auto",
                          borderRadius: 8,
                          display: "block",
                        }}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </div>
                  ) : null}
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
}

// export default DepositRow;
