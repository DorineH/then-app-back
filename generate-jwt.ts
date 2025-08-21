const jwt = require("jsonwebtoken");

const payload = {
  userId: "66a0000000000000000000bb",
  coupleId: "66a000000000000000000001",
  email: "demo@then.app",
};

const secret = "dev-secret";
//  "9Q935FCOKDoBcdLrDo+xqcMgPqH5Y6JmCT0rHhhQ41x1leH1wJEkAw19e3nXlxGX53IpRbWuNt9+RRIX87KCig==";
const token = jwt.sign(payload, secret, { expiresIn: "12h" });
console.log(token);
