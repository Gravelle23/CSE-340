const jwt = require("jsonwebtoken")
const utilities = require(".")

async function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    // No token present
    req.flash("notice", "Please log in.")
    const nav = await utilities.getNav()
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Valid token
    res.locals.accountData = decoded
    next()
  } catch (error) {
    // Invalid or expired token
    req.flash("notice", "Your session has expired. Please log in again.")
    const nav = await utilities.getNav()
    return res.status(403).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

function checkAdmin(req, res, next) {
  const accountData = res.locals.accountData

  if (
    accountData &&
    (accountData.account_type === "Employee" ||
      accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "You do not have permission to access that page.")
  return res.redirect("/")
}

module.exports = { checkJWTToken, checkAdmin }
