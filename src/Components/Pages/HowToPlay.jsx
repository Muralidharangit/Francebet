import React, { useState } from "react";
import { Link } from "react-router-dom";
import routes from "../routes/route";
import StickyHeader from "../layouts/Header/Header";
import BottomFooter from "../layouts/footer/BottomFooter";
import Footer from "../layouts/footer/Footer";
import Sidebar from "../layouts/Header/Sidebar";

const HowToPlay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div style={{ overflowX: "hidden" }}>
      {/* header  */}
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* header end */}
      {/* <section className="container pt-40 text-white"> */}
      <div className="container-fluid page-body-wrapper">
        {/* Sidebar Nav Starts */}
        <Sidebar />
        {/* Sidebar Nav Ends */}
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="max-1250 mx-auto">
              <div className="h-100 d-flex justify-content-evenly flex-column">
                <div className="pt-3 pb-2 px-2">
                  <div className="breadcrumb">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item text-white">
                          <Link to={routes.home} className="text-white fw-600 ">
                            Home
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item active  text-white"
                          aria-current="page"
                        >
                          How to play
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
                <section className="Privacy_policy_content mt-2 px-2">
                  <p>
                    This privacy policy is designed to provide players with
                    information on how personal data is collected and how it is
                    used in interaction with the official website and services
                    of the bookmaker’s office.
                  </p>
                  <p>
                    Player personal data refers to any personal information that
                    identifies a player as a unique user. This is first and last
                    name, country of residence, address, phone number, email
                    address, etc.
                  </p>
                  <p>
                    <Link to={routes.home}>jiboomba</Link> collects and
                    processes personal data in order to improve the quality of
                    service and player service. Data is collected at the stage
                    of <Link to={routes.auth.register}>registration</Link>
                    when verifying identity when creating a game account when
                    betting. When using any services provided by betting company
                    jiboomba India, you automatically agree to this privacy
                    policy.
                  </p>
                  <p>
                    Playing is simple and designed to give you a smooth and
                    exciting experience. Please follow the steps below to get
                    started:
                  </p>

                  <ul className="personal_info_list text-white">
                    <li>
                      <strong>Step 1 – Register / Login:</strong> Create an
                      account by completing the registration form or log in if
                      you already have one.
                    </li>
                    <li>
                      <strong>Step 2 – Add Funds:</strong> Deposit money into
                      your wallet using any of the available secure payment
                      methods.
                    </li>
                    <li>
                      <strong>Step 3 – Choose a Game:</strong> Browse through
                      the list of games and select the one you want to play.
                    </li>
                    <li>
                      <strong>Step 4 – Place Your Bet:</strong> Select your bet
                      amount and confirm before the game starts.
                    </li>
                    <li>
                      <strong>Step 5 – Play & Win:</strong> Enjoy the game! If
                      you win, your winnings will be added to your account
                      balance instantly.
                    </li>
                    <li>
                      <strong>Step 6 – Withdraw Earnings:</strong> You can
                      withdraw your winnings securely anytime using the
                      withdrawal option in your account.
                    </li>
                  </ul>

                  <p>
                    Make sure you play responsibly. Always set a budget, enjoy
                    the experience, and never chase losses. The goal is to have
                    fun while testing your skills and luck!
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

export default HowToPlay;
