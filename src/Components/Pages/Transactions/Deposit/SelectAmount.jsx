import React, { useEffect, useState, useMemo } from "react";
import {
  getPortalSettings,
  getRandomDepositSuggestions,
} from "../../../../API/depositAPI";

/**
 * Props:
 *  - amount: string|number
 *  - setAmount: (v: string) => void
 *  - token?: string
 *  - count?: number  // how many quick-pick buttons (default 7)
 *  - roundStep?: number // optional rounding step for input & suggestions (default 100)
 */
const SelectAmount = ({
  amount,
  setAmount,
  token,
  count = 7,
  roundStep = 100,
}) => {
  const [amounts, setAmounts] = useState([]);
  const [minMax, setMinMax] = useState({ min: null, max: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const settings = await getPortalSettings("deposit", token);
        const min = Number(settings?.min_deposit) || 0;
        const max = Number(settings?.max_deposit) || 0;
        setMinMax({ min, max });

        // Generate suggestions
        let suggested = getRandomDepositSuggestions(settings, count);

        // Fallback if API fails or range too small
        if (!suggested.length) {
          // base fallback, but clamp to range when available
          const base = [500, 1000, 4000, 10000, 20000, 30000, 40000].slice(
            0,
            count
          );
          suggested = base
            .map((v) => clamp(roundTo(v, roundStep), min || v, max || v))
            .filter((v, i, arr) => arr.indexOf(v) === i);
        }

        setAmounts(suggested);
      } catch (e) {
        console.error(e);
        const fallback = [500, 1000, 4000, 10000, 20000, 30000, 40000].slice(
          0,
          count
        );
        setAmounts(fallback);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, count, roundStep]);

  const handleSelectAmount = (value) => {
    const v = String(value);
    setAmount(v);
  };

  // Keep typed value inside range (if range known)
  const onChangeAmount = (e) => {
    const raw = e.target.value;
    if (raw === "") return setAmount("");

    const num = Number(raw);
    if (Number.isNaN(num)) return;

    const rounded = roundTo(num, roundStep);
    const clamped = clamp(
      rounded,
      minMax.min ?? rounded,
      minMax.max ?? rounded
    );
    setAmount(String(clamped));
  };

  const hint = useMemo(() => {
    const { min, max } = minMax;
    if (!min || !max) return "";
    return `Allowed range: ₹${min} – ₹${max}`;
  }, [minMax]);

  return (
    <div className="card bg_light_grey account_input-textbox-container">
      <div className="card-body py-4 pb-3">
        <h5 className="mb-3">Select Amount</h5>

        <form
          className="form-control_container"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="input-field mb-1">
            <input
              required
              className="input"
              type="number"
              value={amount}
              min={minMax.min ?? undefined}
              max={minMax.max ?? undefined}
              step={roundStep}
              onChange={onChangeAmount}
              inputMode="numeric"
            />
            <label className="label" htmlFor="input">
              Enter the Amount or select the Amount
            </label>
          </div>

          {hint && <small className="text-muted d-block mb-3">{hint}</small>}

          <div className="recharge-amount-container button">
            {loading
              ? Array.from({ length: count }).map((_, i) => (
                  <button key={i} type="button" className="btn" disabled>
                    ...
                  </button>
                ))
              : amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="btn"
                    onClick={() => handleSelectAmount(amt)}
                  >
                    {amt}
                  </button>
                ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectAmount;

/* helpers (local) */
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function roundTo(n, step) {
  return Math.round(n / step) * step;
}
