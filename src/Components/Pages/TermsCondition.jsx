import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- IMPORT HERE
import routes from "../routes/route";
import BottomFooter from "../layouts/footer/BottomFooter";
import Footer from "../layouts/footer/Footer";
import StickyHeader from "../layouts/Header/Header";
import Sidebar from "../layouts/Header/Sidebar";
// Removed APP_NAME import as it's not strictly used in this component

function TermsCondition() {
  const { t } = useTranslation(); // <-- USE HOOK HERE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Constants are now defined or used inside the translation key for substitution (interpolation)
  const COMPANY_NAME = "BetWin Namibia";
  const WEBSITE_URL = "play.betwin.co.na";
  const MIN_STAKE = "N$10";
  const GOVERNING_LAW = "Republic of Namibia";

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* header  */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* header end */}
      <div className="container-fluid page-body-wrapper">
        {/* Sidebar Nav Starts */}
        <Sidebar />
        {/* Sidebar Nav Ends */}
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="max-1250 mx-auto px-2">
              <div className="h-100 d-flex justify-content-evenly flex-column">
                
                {/* Breadcrumb Section */}
                <div className="pt-3 pb-2 ">
                  <div className="breadcrumb">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item text-white">
                          <Link to={routes.home} className="text-white fw-600 ">
                            {t('terms.breadcrumb.home')}
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item active text-white"
                          aria-current="page"
                        >
                          {t('terms.breadcrumb.current')}
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
                
                {/* Terms and Conditions Content Section */}
                <section className="privacy-container px-2 m-0 pt-0">
                  <h1 className="text-white">{t('terms.title')}</h1>

                  {/* 1) Interpretation & Definitions */}
                  <h2>{t('terms.section1.title')}</h2>
                  <ul>
                    <li>
                      <strong>{t('terms.section1.company.strong')}:</strong> {t('terms.section1.company.text', { company: COMPANY_NAME })}
                    </li>
                    <li>
                      <strong>{t('terms.section1.website.strong')}:</strong> <a href="http://play.betwin.co.na/ " target="_blank" rel="noopener noreferrer">{WEBSITE_URL} 
                      </a> {t('terms.section1.website.text')}
                    </li>
                    <li>
                      <strong>{t('terms.section1.player.strong')}:</strong> {t('terms.section1.player.text')}
                    </li>
                    <li>
                      <strong>{t('terms.section1.device.strong')}:</strong> {t('terms.section1.device.text')}
                    </li>
                    <li>
                      <strong>{t('terms.section1.account.strong')}:</strong> {t('terms.section1.account.text')}
                    </li>
                  </ul>
                  
                  {/* 2) Eligibility & Account */}
                  <h2>{t('terms.section2.title')}</h2>
                  <p>
                    {t('terms.section2.p1')}
                  </p>
                  <p>
                    {t('terms.section2.p2')}
                  </p>
                  <p>
                    {t('terms.section2.p3')}
                  </p>
                  <p>
                    {t('terms.section2.p4')}
                  </p>

                  {/* 3) Responsible Play */}
                  <h2>{t('terms.section3.title')}</h2>
                  <p>
                    {t('terms.section3.p1')}
                  </p>
                  <p>
                    {t('terms.section3.p2')}
                  </p>

                  {/* 4) Bet Rules & Limits (Important) */}
                  <h2>{t('terms.section4.title')}</h2>
                  <p>
                    <strong>{t('terms.section4.min_stake.strong')}:</strong> {t('terms.section4.min_stake.text', { minStake: MIN_STAKE })}
                  </p>
                  <p>
                    <strong>{t('terms.section4.acceptance.strong')}:</strong> {t('terms.section4.acceptance.text')}
                  </p>
                  <p>
                    <strong>{t('terms.section4.limits.strong')}:</strong> {t('terms.section4.limits.text')}
                  </p>
                  <p>
                    <strong>{t('terms.section4.errors.strong')}:</strong> {t('terms.section4.errors.text')}
                  </p>

                  {/* 5) Fair Play & Anti-Fraud */}
                  <h2>{t('terms.section5.title')}</h2>
                  <p>{t('terms.section5.p1')}</p>
                  <ul>
                    <li>{t('terms.section5.li1')}</li>
                    <li>{t('terms.section5.li2')}</li>
                    <li>{t('terms.section5.li3')}</li>
                    <li>{t('terms.section5.li4')}</li>
                  </ul>
                  <p>
                    <strong>{t('terms.section5.voiding.strong')}:</strong> {t('terms.section5.voiding.text')}
                  </p>

                  {/* 6) Deposits & Withdrawals */}
                  <h2>{t('terms.section6.title')}</h2>
                  <p>
                    <strong>{t('terms.section6.payments.strong')}:</strong> {t('terms.section6.payments.text')}
                  </p>
                  <p>
                    <strong>{t('terms.section6.withdrawal_conditions.strong')}:</strong>
                  </p>
                  <ul>
                    <li>{t('terms.section6.li1')}</li>
                    <li>{t('terms.section6.li2')}</li>
                    <li>{t('terms.section6.li3')}</li>
                    <li>{t('terms.section6.li4')}</li>
                    <li>{t('terms.section6.li5')}</li>
                  </ul>
                  
                  {/* 7) Promotions & Bonuses */}
                  <h2>{t('terms.section7.title')}</h2>
                  <p>{t('terms.section7.p1')}</p>
                  <p>{t('terms.section7.p2')}</p>
                  <p>{t('terms.section7.p3')}</p>

                  {/* 8) Account Security & Privacy */}
                  <h2>{t('terms.section8.title')}</h2>
                  <p>{t('terms.section8.p1')}</p>
                  <p>
                    {t('terms.section8.p2_part1')}{" "}
                    <Link to={routes.pages.privacyPolicy}>{t('terms.section8.privacy_link')}</Link>.
                  </p>

                  {/* 9) Suspension & Termination */}
                  <h2>{t('terms.section9.title')}</h2>
                  <p>{t('terms.section9.p1')}</p>
                  <p>{t('terms.section9.p2')}</p>

                  {/* 10) Liability */}
                  <h2>{t('terms.section10.title')}</h2>
                  <p>{t('terms.section10.p1')}</p>
                  <p>{t('terms.section10.p2', { limit: 'N$2,000' })}</p>

                  {/* 11) Governing Law & Disputes */}
                  <h2>{t('terms.section11.title')}</h2>
                  <p>{t('terms.section11.p1', { law: GOVERNING_LAW })}</p>
                  <p>{t('terms.section11.p2')}</p>
                  
                  {/* 12) Severability & Waiver */}
                  <h2>{t('terms.section12.title')}</h2>
                  <p>{t('terms.section12.p1')}</p>
                  <p>{t('terms.section12.p2')}</p>

                  {/* 13) Changes to These Terms */}
                  <h2>{t('terms.section13.title')}</h2>
                  <p>{t('terms.section13.p1')}</p>
                  
                  {/* Schedule A - Limits */}
                  <h2>{t('terms.scheduleA.title')}</h2>
                  <p>
                    {t('terms.scheduleA.p1', { company: COMPANY_NAME })}
                  </p>
                  <ol>
                    <li>
                      <strong>{t('terms.scheduleA.li1.strong')}:</strong> {t('terms.scheduleA.li1.text', { minStake: MIN_STAKE })}
                    </li>
                    <li>
                      <strong>{t('terms.scheduleA.li2.strong')}:</strong> {t('terms.scheduleA.li2.text', { cap: '150× stake', min: 'N$20' })}
                    </li>
                    <li>
                      <strong>{t('terms.scheduleA.li3.strong')}:</strong> {t('terms.scheduleA.li3.text', { cap: 'N$15,000' })}
                    </li>
                    <li>
                      <strong>{t('terms.scheduleA.li4.strong')}:</strong> {t('terms.scheduleA.li4.text', { win: 'N$5,000', cool: '30 minutes' })}
                    </li>
                    <li>
                      <strong>{t('terms.scheduleA.li5.strong')}:</strong> {t('terms.scheduleA.li5.text', { max: '1–2' })}
                    </li>
                    <li>
                      <strong>{t('terms.scheduleA.li6.strong')}:</strong> {t('terms.scheduleA.li6.text', { section: 'Section 5' })}
                    </li>
                  </ol>

                </section>
                {/* End Terms and Conditions Content Section */}

              </div>
            </div>
          </div>
          <BottomFooter />
          <div className="h-100 w-100 mb-5 px-2"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default TermsCondition;