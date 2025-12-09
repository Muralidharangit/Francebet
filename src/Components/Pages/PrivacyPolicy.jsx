import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- IMPORT HERE
import routes from "../routes/route";
import BottomFooter from "../layouts/footer/BottomFooter";
import Footer from "../layouts/footer/Footer";
import StickyHeader from "../layouts/Header/Header";
import Sidebar from "../layouts/Header/Sidebar";
import { APP_NAME } from "../../constants"; // APP_NAME is now used for interpolation

function PrivacyPolicy() {
  const { t } = useTranslation(); // <-- USE HOOK HERE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div style={{ overflowX: "hidden" }}>
      {/* header  */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* header end */}
      <div className="container-fluid page-body-wrapper">
        {/* Sidebar Nav Starts */}
        <Sidebar />
        {/* Sidebar Nav Ends */}
        <div className="main-panel">
          <div className="content-wrapper new">
            <div className="max-1250 mx-auto">
              <div className="h-100 d-flex justify-content-evenly flex-column">
                
                {/* Breadcrumb Section */}
                <div className="pt-3 pb-2  px-2">
                  <div className="breadcrumb mb-0">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item text-white">
                          <Link to={routes.home} className="text-white fw-600 ">
                            {t('privacy.breadcrumb.home')}
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item active  text-white"
                          aria-current="page"
                        >
                          {t('privacy.breadcrumb.current')}
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>

                {/* Privacy Policy Content Section */}
                <section className="privacy-container px-2 pt-0">
                  <h1 className="text-white">{t('privacy.title')}</h1>

                  <p>
                    {t('privacy.intro_p1')}
                  </p>
                  <div className="highlight-box">
                    <p>
                      <strong>
                        {t('privacy.intro_highlight')}
                      </strong>
                    </p>
                  </div>

                  <h2>{t('privacy.section1.title')}</h2>
                  <h3>{t('privacy.section1.h3_interpretation')}</h3>
                  <p>
                    {t('privacy.section1.p_interpretation')}
                  </p>

                  <h3>{t('privacy.section1.h3_definitions')}</h3>
                  <ul>
                    <li>
                      <strong>{t('privacy.section1.account.strong')}:</strong> {t('privacy.section1.account.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.affiliate.strong')}:</strong> {t('privacy.section1.affiliate.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.company.strong')}:</strong> {t('privacy.section1.company.text', { appName: APP_NAME })}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.cookies.strong')}:</strong> {t('privacy.section1.cookies.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.country.strong')}:</strong> {t('privacy.section1.country.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.device.strong')}:</strong> {t('privacy.section1.device.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.personal_data.strong')}:</strong> {t('privacy.section1.personal_data.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.service.strong')}:</strong> {t('privacy.section1.service.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.website.strong')}:</strong> {t('privacy.section1.website.text', { appName: APP_NAME })}
                    </li>
                    <li>
                      <strong>{t('privacy.section1.you.strong')}:</strong> {t('privacy.section1.you.text')}
                    </li>
                  </ul>

                  <h2>{t('privacy.section2.title')}</h2>
                  <h3>{t('privacy.section2.h3_types')}</h3>
                  <h4>{t('privacy.section2.h4_personal')}</h4>
                  <p>
                    {t('privacy.section2.p_personal')}
                  </p>
                  <ul>
                    <li>{t('privacy.section2.li_email')}</li>
                    <li>{t('privacy.section2.li_usage')}</li>
                  </ul>

                  <h4>{t('privacy.section2.h4_usage')}</h4>
                  <p>
                    {t('privacy.section2.p_usage')}
                  </p>

                  <h2>{t('privacy.section3.title')}</h2>
                  <p>
                    {t('privacy.section3.p1')}
                  </p>
                  <ul>
                    <li>
                      <strong>{t('privacy.section3.li1.strong')}:</strong> {t('privacy.section3.li1.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section3.li2.strong')}:</strong> {t('privacy.section3.li2.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section3.li3.strong')}:</strong> {t('privacy.section3.li3.text')}
                    </li>
                  </ul>

                  <h2>{t('privacy.section4.title')}</h2>
                  <ul>
                    <li>{t('privacy.section4.li1')}</li>
                    <li>{t('privacy.section4.li2')}</li>
                    <li>{t('privacy.section4.li3')}</li>
                    <li>{t('privacy.section4.li4')}</li>
                    <li>{t('privacy.section4.li5')}</li>
                    <li>{t('privacy.section4.li6')}</li>
                    <li>{t('privacy.section4.li7')}</li>
                  </ul>

                  <h2>{t('privacy.section5.title')}</h2>
                  <p>
                    {t('privacy.section5.p1')}
                  </p>

                  <h2>{t('privacy.section6.title')}</h2>
                  <p>
                    {t('privacy.section6.p1')}
                  </p>

                  <h2>{t('privacy.section7.title')}</h2>
                  <ul>
                    <li>
                      <strong>{t('privacy.section7.li1.strong')}:</strong> {t('privacy.section7.li1.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section7.li2.strong')}:</strong> {t('privacy.section7.li2.text')}
                    </li>
                    <li>
                      <strong>{t('privacy.section7.li3.strong')}:</strong> {t('privacy.section7.li3.text')}
                    </li>
                  </ul>

                  <h2>{t('privacy.section8.title')}</h2>
                  <p>
                    {t('privacy.section8.p1')}
                  </p>

                  <h2>{t('privacy.section9.title')}</h2>
                  <p>
                    {t('privacy.section9.p1')}
                  </p>
                </section>
                {/* End Privacy Policy Content Section */}
              </div>
            </div>
            <BottomFooter />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;