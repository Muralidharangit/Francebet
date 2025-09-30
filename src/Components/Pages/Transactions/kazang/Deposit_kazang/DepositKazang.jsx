import { useContext, useState } from "react";
import StickyHeader from "../../../../layouts/Header/Header";
import Sidebar from "../../../../layouts/Header/Sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyToken } from "../../../../../API/authAPI";
import AuthContext from "../../../../../Auth/AuthContext";
import {
  DepositKazangVoucher,
  redeemKazangVoucher,
} from "../../../../../API/depositAPI";
// ^ make sure depositAPI exports both wrappers (see snippets below)

// helpers
const digitsOnly = (s) => (s || "").replace(/\D+/g, "");
const fmtPin16 = (s) => {
  const d = digitsOnly(s).slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim(); // 4-4-4-4 with spaces
};

const schema = Yup.object({
  pin: Yup.string()
    .transform((v) => digitsOnly(v || ""))
    .matches(/^\d{16}$/, "PIN must be exactly 16 digits")
    .required("PIN is required"),
});

function Deposit() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiBusy, setApiBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  const [details, setDetails] = useState(null);
  const [checking, setChecking] = useState(false); // for Apply (check status)
  const [redeeming, setRedeeming] = useState(false); // for Redeem
  const { user } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: { pin: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setApiError("");
      setApiBusy(true);
      setDetails(null);

      try {
        // 1) Verify token
        const currentToken = user?.token;
        try {
          const tokenRes = await verifyToken(currentToken);
          if (tokenRes.status !== "success") {
            const msg =
              tokenRes.message ||
              "Invalid or expired token. Please log in again.";
            setErrors({ api: msg });
            return;
          }
        } catch (verifyError) {
          const msg =
            verifyError?.response?.data?.message ||
            "Invalid or expired token. Please log in again.";
          setErrors({ api: msg });
          return;
        }

        // 2) Clean PIN (digits only)
        const cleanPin = digitsOnly(values.pin);

        // 3) Check voucher status
        const response = await DepositKazangVoucher({
          token: currentToken,
          pin: cleanPin,
        });
        // Expect shape like: { response_code: "0", voucher_detail: {...} }
        if (String(response?.response_code) !== "0") {
          setApiError(response?.response_message || "Check status failed");
          return;
        }
        setDetails(response?.voucher_detail || null);
      } catch (e) {
        setApiError(e?.message || "Network error");
      } finally {
        setChecking(false);
        setApiBusy(false);
        setSubmitting(false);
      }
    },
  });

  const hasError = !!(formik.touched.pin && formik.errors.pin);

  const onPinChange = (e) => {
    const formatted = fmtPin16(e.target.value);
    formik.setFieldValue("pin", formatted);
  };

  const onRedeem = async () => {
    if (!details) return;
    setApiError("");
    setRedeeming(true);
    try {
      const currentToken = user?.token;
      const cleanPin = digitsOnly(formik.values.pin);
      const data = await redeemKazangVoucher({
        token: currentToken,
        player_id: user?.id,
        pin: cleanPin,
      });
      if (String(data?.response_code) !== "0") {
        throw new Error(
          data?.message || data?.response_message || "Redemption failed"
        );
      }

      alert("Voucher redeemed and deposited successfully.");

      // reset everything for next voucher
      setDetails(null);
      setApiError("");
      formik.resetForm({ values: { pin: "" } });
      formik.setStatus(undefined);
      formik.setSubmitting(false);
      setTimeout(() => document.getElementById("pin-input")?.focus(), 0);
    } catch (e) {
      setApiError(e?.message || "Redemption error");
    } finally {
      setRedeeming(false);
    }
  };

  const statusCode = details?.status_code ?? -1;
  const isAvailable = statusCode !== 1; // 1 = redeemed per your sample

  return (
    <>
      {/* header  */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* header end */}
      <div className="container-fluid page-body-wrapper">
        <Sidebar />

        <div className="main-panel">
          <div className="content-wrapper">
            <div className="max-1250 mx-auto">
              <div className="h-100">
                <div className="pt-3 pb-2">
                  <div className="row px-2">
                    {/* header */}
                    <div className="d-flex align-items-center justify-content-between position-relative px-0">
                      <h5 className="position-absolute start-50 translate-middle-x m-0 text-white fs-16">
                        Voucher Deposit
                      </h5>
                    </div>
                    <div className="d-flex justify-content-between align-items-center px-0">
                      <button
                        className="go_back_btn bg-grey"
                        onClick={() => window.history.back()}
                      >
                        <i className="ri-arrow-left-s-line text-white fs-24" />
                      </button>
                    </div>

                    {/* Wizard */}
                    <div className="container mt-4 px-0">
                      <div className="wizard my-5 px-2">
                        <div className="card bg_light_grey account_input-textbox-container">
                          <div className="card-body py-4 pb-5 ">
                            <h5 className="mb-3">My Voucher</h5>

                            <div className="">
                              <div>
                                <form
                                  className="nl-form"
                                  onSubmit={formik.handleSubmit}
                                >
                                  <div className="nl-bar">
                                    <div
                                      className={`nl-input ${
                                        hasError ? "is-invalid" : ""
                                      }`}
                                    >
                                      <input
                                        name="pin"
                                        id="pin-input"
                                        required
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9 ]*"
                                        maxLength={19}
                                        value={formik.values.pin}
                                        onChange={onPinChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete="one-time-code"
                                        aria-describedby="pinHelp pinError"
                                        placeholder="Enter 16-digit voucher PIN"
                                      />
                                      {/* optional leading icon */}
                                      <span className="nl-icon" aria-hidden>
                                        🔒
                                      </span>
                                    </div>

                                    <button
                                      type="submit"
                                      className="nl-btn"
                                      disabled={
                                        !formik.isValid ||
                                        !formik.values.pin ||
                                        checking ||
                                        formik.isSubmitting ||
                                        !!details
                                      }
                                    >
                                      {checking || formik.isSubmitting
                                        ? "Checking..."
                                        : "Apply"}
                                    </button>
                                  </div>

                                  {/* helper + errors */}
                                  {formik.errors.api && (
                                    <div
                                      className="nl-msg nl-msg-error"
                                      role="alert"
                                    >
                                      {formik.errors.api}
                                    </div>
                                  )}

                                  {hasError && (
                                    <div
                                      id="pinError"
                                      className="nl-msg nl-msg-error"
                                      role="alert"
                                    >
                                      {formik.errors.pin}
                                    </div>
                                  )}

                                  <div
                                    id="pinHelp"
                                    className="nl-msg nl-msg-help"
                                  >
                                    Enter your 16-digit PIN. It will format like{" "}
                                    <code>2704 1497 6989 5665</code>.
                                  </div>
                                </form>

                                {/* request error (catch) */}
                                {apiError === "Not Found" && (
                                  <div className="alert alert-danger mt-3 py-2">
                                    The entered PIN is invalid.
                                  </div>
                                )}

                                {/* Status card */}
                                {details && (
                                  <div className="mt-4">
                                    <div
                                      className="card border-0 shadow-sm"
                                      style={{ maxWidth: "900px" }}
                                    >
                                      <div className="card-body white-border">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <h6 className="mb-0">
                                            <img
                                              src="https://cdn-icons-png.flaticon.com/512/869/869649.png"
                                              alt=""
                                              style={{
                                                width: "25px",
                                                height: "25px",
                                              }}
                                            />{" "}
                                            Voucher Details
                                          </h6>
                                          <span
                                            className={`badge rounded-pill ${
                                              isAvailable
                                                ? "text-bg-success"
                                                : "text-bg-danger"
                                            }`}
                                          >
                                            {isAvailable
                                              ? "Available"
                                              : details.status_text ||
                                                "Redeemed"}
                                          </span>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="row g-2 ">
                                          <div className="col-6">
                                            <div className="text-grey small ">
                                              Face Value
                                            </div>
                                            <div className="fw-semibold text-white">
                                              {" "}
                                              {(
                                                details.face_value ?? 0
                                              ).toFixed(2)}
                                            </div>
                                          </div>
                                          <div className="col-6">
                                            <div className="text-grey small">
                                              Currency
                                            </div>
                                            <div className="fw-semibold text-white">
                                              {details.currency_code || "NAD"}{" "}
                                              {details.cost || "NAD"}
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="text-grey small">
                                              Description
                                            </div>
                                            <div className="fw-medium text-white">
                                              {details.description || "-"}
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="text-grey small">
                                              Serial
                                            </div>
                                            <div className="font-monospace text-white">
                                              {details.serial || "-"}
                                            </div>
                                          </div>
                                          {!isAvailable && (
                                            <div className="col-12">
                                              <div className="text-grey small">
                                                Redeemed At
                                              </div>
                                              <div className="text-white">
                                                {details.redemption_date || "-"}
                                              </div>
                                            </div>
                                          )}
                                          {/* <img src="https://cdn-icons-png.flaticon.com/512/3595/3595867.png"/> */}
                                        </div>

                                        <div className="d-flex gap-2 mt-3">
                                          <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={onRedeem}
                                            disabled={!isAvailable || redeeming}
                                          >
                                            {redeeming
                                              ? "Processing..."
                                              : "Redeem & Deposit"}
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                              setDetails(null);
                                              setApiError("");
                                            }}
                                          >
                                            Back
                                          </button>
                                        </div>

                                        <div className="text-grey small mt-2">
                                          {isAvailable
                                            ? "Voucher is available. Click Redeem when ready."
                                            : "This voucher has already been redeemed. Try another PIN."}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* end status card */}
                              </div>

                              {/* <div>
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/3595/3595867.png"
                                  alt=""
                                  className="w75"
                                />
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end wizard */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Deposit;
