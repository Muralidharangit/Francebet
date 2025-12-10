import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- IMPORT HERE
import routes from "../routes/route";
import StickyHeader from "../layouts/Header/Header";
import BottomFooter from "../layouts/footer/BottomFooter";
import Footer from "../layouts/footer/Footer";
import Sidebar from "../layouts/Header/Sidebar";
import { APP_NAME } from "../../constants";

const ResponsibleGamingPolicy = () => { // Renamed component for clarity, though export remains
  const { t } = useTranslation(); // <-- USE HOOK HERE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Dynamic email for the contact link
  const supportEmail = `support@${APP_NAME}.in`; 

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
          <div className="content-wrapper">
            <div className="max-1250 mx-auto">
              <div className="h-100 d-flex justify-content-evenly flex-column">
                
                {/* Breadcrumb Section */}
                <div className="pt-3 pb-2 px-2">
                  <div className=" ">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item text-white">
                          <Link to={routes.home} className="text-white fw-600 ">
                            {t('responsibleGaming.breadcrumb.home')}
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item active  text-white"
                          aria-current="page"
                        >
                          {t('responsibleGaming.breadcrumb.current')}
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>

                <section className="privacy-container px-2 m-0">
                  <h1 className="text-white">
                    {t('responsibleGaming.title')}
                  </h1>
                  <p>
                    {t('responsibleGaming.intro_p1', { appName: APP_NAME })}
                  </p>
                  <p>
                    {t('responsibleGaming.intro_p2')}
                  </p>

                  {/* Our Commitment */}
                  <h2>{t('responsibleGaming.section1.title')}</h2>
                  <p>
                    {t('responsibleGaming.section1.p1', { appName: APP_NAME })}
                    <strong>{t('responsibleGaming.section1.p1_strong')}</strong>
                    {t('responsibleGaming.section1.p1_tail')}
                  </p>
                  <ul>
                    <li>{t('responsibleGaming.section1.li1')}</li>
                    <li>{t('responsibleGaming.section1.li2')}</li>
                    <li>{t('responsibleGaming.section1.li3')}</li>
                    <li>{t('responsibleGaming.section1.li4')}</li>
                    <li>{t('responsibleGaming.section1.li5')}</li>
                  </ul>

                  {/* Temporary Account Closure / Self-Exclusion */}
                  <h2>{t('responsibleGaming.section2.title')}</h2>
                  <p>
                    {t('responsibleGaming.section2.p1')}
                  </p>
                  <p>
                    <strong>{t('responsibleGaming.section2.p2_strong')}:</strong>
                  </p>
                  <ul>
                    <li>
                      {t('responsibleGaming.section2.li1_part1')}
                      <strong>{t('responsibleGaming.section2.li1_strong')}</strong>
                      {t('responsibleGaming.section2.li1_part2')}
                    </li>
                  </ul>
                  <p>
                    <strong>{t('responsibleGaming.section2.p3_strong')}:</strong>
                  </p>
                  <ul>
                    <li>
                      {t('responsibleGaming.section2.li2_p1')}
                      <strong>{t('responsibleGaming.section2.li2_strong')}</strong>
                      {t('responsibleGaming.section2.li2_p2')}
                    </li>
                    <li>
                      {t('responsibleGaming.section2.li3_p1')}
                      <strong>{t('responsibleGaming.section2.li3_strong')}</strong>
                      {t('responsibleGaming.section2.li3_p2')}
                    </li>
                  </ul>

                  {/* Maintaining Control Over Gambling */}
                  <h2>{t('responsibleGaming.section3.title')}</h2>
                  <p>
                    {t('responsibleGaming.section3.p1')}
                  </p>
                  <ul>
                    <li>
                      {t('responsibleGaming.section3.li1_p1')}
                      <strong>{t('responsibleGaming.section3.li1_strong')}</strong>
                      {t('responsibleGaming.section3.li1_p2')}
                    </li>
                    <li>{t('responsibleGaming.section3.li2')}</li>
                    <li>
                      {t('responsibleGaming.section3.li3_p1')}
                      <strong>{t('responsibleGaming.section3.li3_strong')}</strong>
                      {t('responsibleGaming.section3.li3_p2')}
                    </li>
                    <li>
                      {t('responsibleGaming.section3.li4_p1')}
                      <strong>{t('responsibleGaming.section3.li4_strong')}</strong>
                      {t('responsibleGaming.section3.li4_p2')}
                    </li>
                    <li>
                      {t('responsibleGaming.section3.li5_p1')}
                      <strong>{t('responsibleGaming.section3.li5_strong')}</strong>
                      {t('responsibleGaming.section3.li5_p2')}
                    </li>
                    <li>{t('responsibleGaming.section3.li6')}</li>
                  </ul>
                  <div className="highlight-box text-black">
                    💡 {t('responsibleGaming.section3.highlight_p1')}
                    <strong>{t('responsibleGaming.section3.highlight_strong')}</strong>
                    {t('responsibleGaming.section3.highlight_p2')}
                    <a href={`mailto:${supportEmail}`}>
                      {supportEmail}
                    </a>
                    {t('responsibleGaming.section3.highlight_p3')}
                  </div>

                  {/* Do You Think You Have a Problem? */}
                  <h2>{t('responsibleGaming.section4.title')}</h2>
                  <p>
                    {t('responsibleGaming.section4.p1')}
                  </p>
                  <ul>
                    <li>{t('responsibleGaming.section4.li1')}</li>
                    <li>{t('responsibleGaming.section4.li2')}</li>
                    <li>{t('responsibleGaming.section4.li3')}</li>
                    <li>{t('responsibleGaming.section4.li4')}</li>
                    <li>{t('responsibleGaming.section4.li5')}</li>
                    <li>{t('responsibleGaming.section4.li6')}</li>
                    <li>{t('responsibleGaming.section4.li7')}</li>
                    <li>{t('responsibleGaming.section4.li8')}</li>
                    <li>{t('responsibleGaming.section4.li9')}</li>
                    <li>{t('responsibleGaming.section4.li10')}</li>
                  </ul>
                  <p>
                    👉 {t('responsibleGaming.section4.p2_p1')}
                    <strong>{t('responsibleGaming.section4.p2_strong')}</strong>
                    {t('responsibleGaming.section4.p2_p2')}
                    <a href="#" target="_blank">
                      {t('responsibleGaming.section4.link1')}
                    </a>
                    {t('responsibleGaming.section4.p2_or')}
                    <a href="#" target="_blank">
                      {t('responsibleGaming.section4.link2')}
                    </a>
                    .
                  </p>

                  {/* Underage Gambling Policy */}
                  <h2>{t('responsibleGaming.section5.title')}</h2>
                  <p>
                    {t('responsibleGaming.section5.p1_p1')}
                    <strong>{t('responsibleGaming.section5.p1_strong')}</strong>
                    {t('responsibleGaming.section5.p1_p2', { appName: APP_NAME })}
                  </p>
                  <p>{t('responsibleGaming.section5.p2')}</p>
                  <ul>
                    <li>{t('responsibleGaming.section5.li1')}</li>
                    <li>{t('responsibleGaming.section5.li2')}</li>
                    <li>{t('responsibleGaming.section5.li3')}</li>
                    <li>{t('responsibleGaming.section5.li4')}</li>
                  </ul>

                  {/* Our Promise */}
                  <h2>{t('responsibleGaming.section6.title')}</h2>
                  <p>
                    {t('responsibleGaming.section6.p1', { appName: APP_NAME })}
                  </p>
                  <p>
                    📧 {t('responsibleGaming.section6.p2_p1')}
                    <a href={`mailto:${supportEmail}`}>
                      {supportEmail}
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
          <BottomFooter />
          <div className="h-100 w-100 mb-5"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ResponsibleGamingPolicy; // Exporting under a descriptive name
// export default HowToPlay; // If you must keep the original export name