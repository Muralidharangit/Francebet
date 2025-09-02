// src/API/depositAPI.js

import axios from "axios";
import BASE_URL from "./api";
import axiosInstance from "./axiosConfig";
/** ---------------- Common helper ---------------- */
const ensureOk = (res, fallback = "Request failed") => {
  // Normalize APIs that return { status: "success" | "error", msg, ... }
  if (res?.data?.status && res.data.status !== "success") {
    throw new Error(res.data?.msg || fallback);
  }
  return res.data;
};

// src/API/depositAPI.js

// get the deposit payment method
export const getDepositMethods = async (token) => {
  const response = await axiosInstance.get("/player/get-deposit-method", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// get the Admin payment details
// export const getPaymentDetails = async (token, methodId) => {
//   const response = await axiosInstance.get("/player/get-payment-detail", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: {
//       payment_method_id: methodId,
//     },
//   });
//   return response.data;
// };

// get the Admin payment details
export const getPaymentDetails = async (token, methodId) => {
  const res = await axiosInstance.get("/player/get-payment-detail", {
    headers: { Authorization: `Bearer ${token}` },
    params: { payment_method_id: methodId },
  });

  if (res.data?.status === "error") {
    throw new Error(res.data.msg || "Payment details not found");
  }
  return res.data;
};

// Send the Deposit Request
export const sendDepositRequest = async ({
  token,
  amount,
  utr_number,
  payment_screenshot,
  paymentSelectedMethod,
}) => {
  // console.log("paymentSelectedMethod", paymentSelectedMethod);

  const formData = new FormData();
  formData.append("payment_detail_id", paymentSelectedMethod);
  formData.append("amount", amount);
  formData.append("utr", utr_number);

  if (payment_screenshot) {
    formData.append("image", payment_screenshot);
  }

  const response = await axios.post(
    `${BASE_URL}/player/send-deposit-request`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// deposit History
export const depositHistory = async (token) => {
  const response = await axiosInstance.get("/player/deposit-history", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/** ---------------- Portal Settings + Random Suggestions ---------------- */

/**
 * Fetch portal settings to get min/max deposit (or withdraw)
 * @param {"deposit"|"withdraw"} type
 */
export const getPortalSettings = async (type = "deposit", token) => {
  const res = await axiosInstance.get("/player/portal-setting", {
    params: { type: type },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  // Expected: { status: "success", settings: { min_deposit, max_deposit } }
  const data = ensureOk(res, "Failed to fetch portal settings");
  return data?.settings || {};
};

// /**
//  * Create 4 neat-looking amounts within [min_deposit, max_deposit].
//  * Rounded to nearest 100 and spread across the range.
//  */
// export const getRandomDepositSuggestions = (
//   { min_deposit, max_deposit },
//   count = 6
// ) => {
//   const min = Number(min_deposit) || 0;
//   const max = Number(max_deposit) || 0;
//   if (!min || !max || min >= max) return [];

//   const results = new Set();
//   const buckets = [
//     { start: 0.1, end: 0.2 },
//     { start: 0.25, end: 0.4 },
//     { start: 0.5, end: 0.7 },
//     { start: 0.75, end: 0.95 },
//   ];

//   for (let i = 0; i < buckets.length && results.size < count; i++) {
//     const { start, end } = buckets[i];
//     const lo = Math.floor(min + (max - min) * start);
//     const hi = Math.floor(min + (max - min) * end);
//     let val = randInt(lo, hi);
//     val = roundTo(val, 100);
//     val = clamp(val, min, max);
//     results.add(val);
//   }

//   // If still short (small ranges), fill randomly
//   while (results.size < count) {
//     let val = roundTo(randInt(min, max), 100);
//     results.add(clamp(val, min, max));
//   }

//   return Array.from(results).sort((a, b) => a - b);
// };

// /** ---------------- Helpers ---------------- */
// const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
// const roundTo = (n, step) => Math.round(n / step) * step;
// const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
