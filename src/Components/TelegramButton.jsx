import { useLocation } from "react-router-dom";

export default function TelegramButton({
  href,
  hideOn = [],
  style,
  ariaLabel = "Open Telegram",
  title = "Telegram",
}) {
  const { pathname } = useLocation();
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  // fallback if API didn’t send link yet
  const finalHref = href || "https://t.me/";

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={title}
      className="btn-telegram-pulse"
      style={style}
    >
      {/* use FA or inline SVG; here’s SVG to avoid external deps */}
      <svg viewBox="0 0 240 240" width="22" height="22" aria-hidden="true">
        <circle cx="120" cy="120" r="120" fill="currentColor" opacity="0.12" />
        <path
          fill="currentColor"
          d="M196.3 54.8c3.4-1.4 7.1 1.6 6.3 5.2l-24.8 116.6c-0.9 4.3-5.7 6.3-9.4 4.1l-44.1-26.6-22.7 22.1c-2.5 2.4-6.7 1.2-7.7-2.2l-10-33.4L63 126.3c-4.1-1.5-4-7.2 0.1-8.6l133.2-62.9zM154 89.3l-77.1 48.7 12.1 40.6 7.2-22.3 57.8-67z"
        />
      </svg>
    </a>
  );
}
