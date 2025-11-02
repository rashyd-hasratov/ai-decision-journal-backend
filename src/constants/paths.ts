const BASE_PATH = "/";
const AUTH_PATH = `${BASE_PATH}auth`;
const DECISIONS_PATH = `${BASE_PATH}decisions`;

const PATHS = {
  BASE: BASE_PATH,

  //auth
  AUTH: AUTH_PATH,
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  SIGN_OUT: "/sign-out",
  REFRESH: "/refresh",

  //decision
  DECISIONS: DECISIONS_PATH,
  ADD_DECISION: "/add",
};

export default PATHS;
