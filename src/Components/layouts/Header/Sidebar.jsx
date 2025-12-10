import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- IMPORT HERE
import routes from "../../routes/route";

const Sidebar = () => {
  const { t } = useTranslation(); // <-- USE HOOK HERE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Note: The toggle logic for `isSidebarOpen` is not fully wired up
  // in this component's return block based on the provided code, but
  // the state variable is present.

  return (
    <>
      <nav
        className={`sidebar sidebar-offcanvas ${isSidebarOpen ? "open" : ""}`}
        id="sidebar"
      >
        <ul className="nav">
          
          {/* Home */}
          <li className="nav-item">
            <NavLink
              to={routes.home}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.home')}</span>
              <i className="fi fi-sr-home menu-icon" />
            </NavLink>
          </li>

          {/* All Games */}
          <li className="nav-item">
            <NavLink
              to={routes.games.topGames}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.allGames')}</span>
              <i className="fi fi-sr-dice-alt menu-icon" />
            </NavLink>
          </li>

          {/* Live Casino */}
          <li className="nav-item">
            <NavLink
              to="/filtered-games?type=card"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.liveCasino')}</span>
              <i className="fi fi-rr-playing-cards menu-icon" />
            </NavLink>
          </li>

          {/* Crash Games */}
          <li className="nav-item">
            <NavLink
              to="/filtered-games?type=crash"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.crashGames')}</span>
              <i className="fa-solid fa-explosion menu-icon"></i>
            </NavLink>
          </li>

          {/* Providers */}
          <li className="nav-item">
            <NavLink
              to={routes.games.providers}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.providers')}</span>
              <i className="fi fi-rs-clipboard menu-icon" />
            </NavLink>
          </li>

          {/* How To Deposit */}
          <li className="nav-item">
            <NavLink
              to={routes.transactions.kazang_how_to_deposit}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.howToDeposit')}</span>
              <i className="fi fi-rs-memo-pad menu-icon" />
            </NavLink>
          </li>

          {/* How to Play */}
          <li className="nav-item">
            <NavLink
              to={routes.pages.howToPlay}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.howToPlay')}</span>
              <i className="fi fi-rr-interrogation menu-icon" />
            </NavLink>
          </li>

          {/* Terms and Conditions */}
          <li className="nav-item">
            <NavLink
              to={routes.pages.terms}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.terms')}</span>
              <i className="fi fi-rs-memo-pad menu-icon" />
            </NavLink>
          </li>

          {/* Privacy and policy */}
          <li className="nav-item">
            <NavLink
              to={routes.pages.privacyPolicy}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-title">{t('sidebar.menu.privacy')}</span>
              <i className="fi fi-rs-clipboard menu-icon" />
            </NavLink>
          </li>
        </ul>
        
        {/* Bottom Section */}
        <div className="br-top-gray"></div>
        <div className="min-menunone">
          <div className="container px-5">
            <Link to={routes.games.all}>
              <button
                type="button"
                className="btn  w-100  rounded-pill fs-15 fw-500  golden-button-clr"
              >
                {t('sidebar.button.allGames')}
              </button>
            </Link>
          </div>
          <div className="text-center  bottom-0 w-100 my-3 start-0">
            <div className="icon-social">
              <div className="d-flex justify-content-center  text-white fs-25 gap-3">
                {/* Social links remain untranslated as they are URLs */}
                <Link
                  to="https://www.facebook.com/betwinnamibia"
                  target="new"
                  className="text-white"
                >
                  <i className="ri-facebook-fill" />
                </Link>
                <Link
                  to={"https://www.instagram.com/betwin_namibia"}
                  target="new"
                  className="text-white"
                >
                  <i className="ri-instagram-line" />
                </Link>

                <Link
                  to={"https://x.com/BetWin2025"}
                  target="new"
                  className="text-white"
                >
                  <i className="ri-twitter-x-line" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;