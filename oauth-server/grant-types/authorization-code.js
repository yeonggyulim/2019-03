const { InvalidGrantError } = require("../error-types");
const { generateHexUsingHash } = require("../lib");
const {
  saveToken,
  checkIsExistedByRefreshToken,
  updateAccessToken,
  generateToken
} = require("../services/token-service");

let codeRepository = {};

function expireAuthorizationCode(clientId, code) {
  let codes = codeRepository[clientId];
  const removedIndex = codes.findIndex(({ code: _code }) => _code === code);
  if (removedIndex === -1) return;

  codes = [...codes.slice(0, removedIndex), ...codes.slice(removedIndex + 1)];
  codeRepository[clientId] = codes;
}

function setExpireAuthorizationCode(clientId, code) {
  setTimeout(expireAuthorizationCode, 600000, clientId, code); // 10분 만료
}

async function codeHandler(
  { redirect_uri: redirectURI, client_id: clientId, state },
  { username }
) {
  const code = await generateHexUsingHash(16);
  let codes = codeRepository[clientId] || [];
  codes = [...codes, { code, username }];
  codeRepository[clientId] = codes;

  setExpireAuthorizationCode(clientId, code);

  let path = `${redirectURI}?code=${code}`;
  if (state) path = path.concat("&state=", state);

  return path;
}

async function tokenHandler({ client_id: clientId, code, scope }) {
  const codes = codeRepository[clientId];
  const codeInfo = codes.find(({ code: _code }) => _code === code);
  if (!codeInfo) {
    return next(new InvalidGrantError());
  }

  scope = scope || "read_profile";
  const expiresIn = 2592000; // ONE_MONTH
  const { accessToken, refreshToken } = await saveToken(
    scope,
    clientId,
    codeInfo.username
  );
  expireAuthorizationCode(clientId, code);

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope
  };
}

async function refreshAccessToken({ refresh_token: refreshToken }) {
  const isExisted = await checkIsExistedByRefreshToken(refreshAccessToken);
  if (!isExisted) {
    throw new Error("The refresh token is not existed.");
  }

  const accessToken = await updateAccessToken(refreshToken);
  const expiresIn = 2592000;
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn
  };
}

module.exports = { codeHandler, tokenHandler, refreshAccessToken };
