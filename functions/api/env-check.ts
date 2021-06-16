require('dotenv').config()
// TODO: cp .env.example .env , and set your Bux.ph Credentials
const { BUX_API_KEY, BUX_BASE_URL, BUX_CLIENT_ID, BUX_API_SECRET } = process.env;

if (!BUX_API_KEY)
  throw new Error("SET BUX API KEY");

if (!BUX_BASE_URL)
  throw new Error("SET BUX BASE URL");
  
if (!BUX_CLIENT_ID)
  throw new Error("SET BUX CLIENT ID");
  
if (!BUX_API_SECRET)
  throw new Error("SET BUX SECRET KEY");
export { BUX_API_KEY, BUX_BASE_URL, BUX_CLIENT_ID, BUX_API_SECRET };

