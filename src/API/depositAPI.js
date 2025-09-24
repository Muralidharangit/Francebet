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

// Namibia function
export const getDepositMethodsNamibia = async (token) => {
  const response = await axiosInstance.get(
    "/player/deposit-namibia/manual-deposit/get-payment-details",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Send the Deposit Request
export const sendDepositRequestNamibia = async ({
  token,
  amount,
  utr_number,
  paymentSelectedMethod,
  player_id,
}) => {
  // console.log("paymentSelectedMethod", paymentSelectedMethod);

  const formData = new FormData();
  formData.append("player_id", player_id);
  formData.append("manual_deposit_id", paymentSelectedMethod);
  formData.append("amount", amount);
  formData.append("utr", utr_number);

  const response = await axios.post(
    `${BASE_URL}/player/deposit-namibia/manual-deposit/send-deposit-request`,
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

// Namibia Ewallet Function

export const getDepositMethodsNamibiaEwallet = async (token) => {
  const response = await axiosInstance.get(
    "/player/deposit-namibia/ewallet-deposit/get-payment-details",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// deposit-namibia/ewallet-deposit/send-deposit-request
// Send the Deposit Request namibia
export const sendDepositRequestNamibiaEwallet = async ({
  token,
  amount,
  utr_number,
  paymentSelectedMethod,
  player_id,
}) => {
  // console.log("paymentSelectedMethod", paymentSelectedMethod);

  const formData = new FormData();
  formData.append("player_id", player_id);
  formData.append("manual_deposit_id", paymentSelectedMethod);
  formData.append("amount", amount);
  formData.append("utr", utr_number);

  const response = await axios.post(
    `${BASE_URL}/player/deposit-namibia/manual-deposit/send-deposit-request`,
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
