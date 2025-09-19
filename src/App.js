import React, { lazy, Suspense } from "react";
import routes from "./Components/routes/route";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";
import ScrollToTop from "./ScrollToTop";
import DepositStatic from "./Components/Pages/Transactions/Deposit copy/Deposit_static";
import DepositMethod from "./Components/Pages/Transactions/Deposit/DepositMethod";

const Home = lazy(() => import("./Components/layouts/Home"));
const Bonus = lazy(() => import("./Components/layouts/Bonus"));
const Envelope = lazy(() => import("./Components/Pages/Envelope/Envelope"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const ProfileEdit = lazy(() => import("./Components/Profile/ProfileEdit"));
const AccountDashboard = lazy(() =>
  import("./Components/Profile/AccountDashboard")
);
const ChangePassword = lazy(() =>
  import("./Components/Profile/ChangePassword")
);
const Avatar = lazy(() => import("./Components/Profile/Avatar"));

const LoginPage = lazy(() => import("./Components/Auth/Login"));
const Register = lazy(() => import("./Components/Auth/Register"));
const ForgotPassword = lazy(() => import("./Components/Auth/ForgotPassword"));
const ForgotOTP = lazy(() => import("./Components/Auth/ForgotOTP"));
const VerifyOTP = lazy(() => import("./Components/Auth/VerifyOTP"));
const NewPassword = lazy(() => import("./Components/Auth/NewPassword"));

const AllGame = lazy(() => import("./Components/layouts/AllGame"));
const SearchTopGames = lazy(() =>
  import("./Components/layouts/SearchTopGames")
);
const TurboGame = lazy(() => import("./Components/layouts/TurboGame"));
const SpribeGame = lazy(() => import("./Components/layouts/SpribeGame"));
const Providers = lazy(() => import("./Components/layouts/Providers"));
const FilteredGamesPage = lazy(() =>
  import("./Components/layouts/FilteredGamesPage")
);
const FilteredProviderGamesPage = lazy(() =>
  import("./Components/layouts/Header/FilteredProviderGamesPage")
);
const BetHistory = lazy(() => import("./Components/layouts/BetHistory"));
const AddBank = lazy(() => import("./Components/layouts/AddBank"));

const HowToPlay = lazy(() => import("./Components/Pages/HowToPlay"));
const PrivacyPolicy = lazy(() => import("./Components/Pages/PrivacyPolicy"));
const TermsCondition = lazy(() => import("./Components/Pages/TermsCondition"));
const ResponsibleGaming = lazy(() =>
  import("./Components/Pages/Responsiblegame")
);
const StartingPage = lazy(() => import("./Components/Pages/StartingPage"));
const ReferEarn = lazy(() => import("./Components/Pages/ReferEarn"));
const StartingSlider = lazy(() => import("./Components/Pages/StartingSlider"));
const Menu = lazy(() => import("./Components/Pages/Menu"));
const Provider = lazy(() => import("./Components/layouts/Provider"));
const CountryRestrict = lazy(() =>
  import("./Components/Pages/CountryRestrict")
);
// const AllGamesSearch = lazy(() =>
//   import("./Components/layouts/AllGamesSearch")
// );
const TemporaryContentPage = lazy(() =>
  import("./Components/Pages/TemporaryContentPage")
);

const Deposit = lazy(() =>
  import("./Components/Pages/Transactions/Deposit/Deposit")
);
const DepositHistory = lazy(() =>
  import("./Components/Pages/Transactions/Deposit/DepositHistory")
);
const WithdrawHistory = lazy(() =>
  import("./Components/Pages/Transactions/Withdraw/WithdrawHistory")
);
const WithdrawIndex = lazy(() =>
  import("./Components/Pages/Transactions/Withdraw/WithdrawIndex")
);

function App() {
  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Suspense>
        <ScrollToTop />
        <Routes>
          {/* Add the new Testing Info Page Route */}
          <Route
            path={routes.pages.testinginfo}
            element={<TemporaryContentPage />}
          />

          {/* Public Routes */}
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.games.all} element={<AllGame />} />
          <Route path={routes.games.topGames} element={<SearchTopGames />} />
          {/* <Route path={routes.games.topGames} element={<AllGamesSearch />} /> */}
          <Route path={routes.games.turbo} element={<TurboGame />} />
          <Route path={routes.games.spribe} element={<SpribeGame />} />
          <Route path={routes.games.providers} element={<Providers />} />
          <Route
            path={routes.games.filteredGames}
            element={<FilteredGamesPage />}
          />
          <Route
            path={routes.games.filteredProviderGames}
            element={<FilteredProviderGamesPage />}
          />
          <Route path={routes.pages.Restrict} element={<CountryRestrict />} />

          {/* Auth */}
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<Register />} />
          <Route path={routes.auth.verifyOTP} element={<VerifyOTP />} />
          <Route
            path={routes.auth.forgotPassword}
            element={<ForgotPassword />}
          />
          <Route path={routes.auth.forgotOTP} element={<ForgotOTP />} />
          <Route path={routes.auth.newPassword} element={<NewPassword />} />
          <Route path={routes.auth.starting} element={<StartingPage />} />

          {/* Pages */}
          <Route
            path={routes.pages.privacyPolicy}
            element={<PrivacyPolicy />}
          />
          <Route path={routes.pages.terms} element={<TermsCondition />} />
          <Route path={routes.pages.privacy} element={<PrivacyPolicy />} />
          <Route
            path={routes.pages.responsiblegame}
            element={<ResponsibleGaming />}
          />
          <Route path={routes.pages.howToPlay} element={<HowToPlay />} />
          <Route path={routes.pages.referEarn} element={<ReferEarn />} />
          <Route path={routes.pages.slider} element={<StartingSlider />} />
          {/* <Route path={routes.pages.userEnter} element={<UserEnter />} /> */}
          <Route path={routes.pages.menu} element={<Menu />} />
          <Route path={routes.pages.provider} element={<Provider />} />
          <Route path={routes.games.bonus} element={<Bonus />} />
          <Route path={routes.games.gift_envelope} element={<Envelope />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={routes.games.history} element={<BetHistory />} />
            <Route
              path={routes.transactions.withdrawHistory}
              element={<WithdrawHistory />}
            />
            <Route
              path={routes.transactions.depositHistory}
              element={<DepositHistory />}
            />

            <Route
              path={routes.transactions.paymentMethod}
              element={<DepositMethod />}
            />

            <Route path={routes.transactions.addBank} element={<AddBank />} />

            {/* <Route path={routes.transactions.withdraw} element={<Withdraw />} /> */}
            <Route path={routes.transactions.deposit} element={<Deposit />} />
            <Route
              path={routes.transactions.deposit_static}
              element={<DepositStatic />}
            />

            <Route path={routes.profile.main} element={<Profile />} />
            <Route path={routes.profile.edit} element={<ProfileEdit />} />
            <Route
              path={routes.profile.changePassword}
              element={<ChangePassword />}
            />
            <Route path={routes.profile.avatar} element={<Avatar />} />
            <Route
              path={routes.account.dashboard}
              element={<AccountDashboard />}
            />
            <Route
              path={routes.transactions.withdraw}
              element={<WithdrawIndex />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
