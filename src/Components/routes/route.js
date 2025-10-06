const routes = {
  home: "/",
  games: {
    all: "/all-games",
    topGames: "/top-games",
    turbo: "/turbo-games",
    spribe: "/spribe-games",
    providers: "/providers",
    history: "/transaction-history",
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
    paymentMethod: "/payment-method",
    deposit_static: "/deposit_static",
    withdrawHistory: "/withdraw-history",
    depositHistory: "/deposit-history",
    addBank: "/add-bank",

    // namibia
    deposit_namibia: "/deposit-namibia/manual-deposit/get-payment-details",

    manual_withdraw_namibia: "/manual-withdraw-namibia",

    manual_withdraw_india: "/manual-withdraw-india",

    manual_deposit_history: "/deposit-namibia-manual-history",

    ewallet_deposit_namibia:
      "/deposit-namibia/ewallet-deposit/get-payment-details",
    ewallet_deposit_history: "/deposit-namibia-ewallet-history",
    all_deposit_history: "/deposit_history",

    // Kazang
    kazang_deposit_voucher: "/deposit-namibia-kazang",
    kazang_deposit_history: "/Voucher-Deposit-History",
    kazang_how_to_deposit: "/How-to-deposit",

    // India
    manual_deposit_India: "/manual-deposit-india",
    manual_withdraw_India: "/manual-withdraw-india",
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
