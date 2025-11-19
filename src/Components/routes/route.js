const routes = {
  home: "/",
  games: {
    all: "/all-games",
    topGames: "/top-games",
    turbo: "/turbo-games",
    spribe: "/spribe-games",
    providers: "/providers",
    history: "/bet-history",
    bonus: "/bonus",
    filteredGames: "/filtered-games",
    filteredProviderGames: "/filtered-provider-games",
    // filteredAllGames: "/all-games",
    envelope: "/claim-bonus",
    gift_envelope: "/gift_envelope",
  },
  transactions: {
    withdraw: "/withdraw",
    deposit: "/deposit",
    withdrawHistory: "/withdraw-history",
    depositHistory: "/deposit-history",
    addBank: "/add-bank",
  },
  account: {
    dashboard: "/account-dashboard",
  },
  profile: {
    main: "/profile",
    edit: "/profile-edit",
    changePassword: "/change-password",
    avatar: "/select-avatar",
  },
  auth: {
    starting: "/starting-page",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    forgotOTP: "/forgototp",
    verifyOTP: "/verify-otp",
    newPassword: "/enter-new-password",
  },
  pages: {
    privacyPolicy: "/privacy-policy",
    terms: "/terms-condition",
    howToPlay: "/how-to-play",
    referEarn: "/refer-earn",
    slider: "/starting-slider",
    userEnter: "/user-enter",
    menu: "/menu",
    provider: "/provider",
    privacy: "/privacy",
    responsiblegame: "/responsiblegame",
    Restrict: "/restricted",
    // This is the new route for your "Testing app" badge
    testinginfo: "/testinginfo", // ✔ Route path
  },
};

export default routes;


