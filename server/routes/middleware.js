module.exports = {
  // to forbid someone from seeing the page/post
  ensureLoggedIn: function (req, res, next) {
    // TODO: implement me
    // eg: req.userId = 1;
    next();
    // if not logged in, redirect to error page? alert they need to log in? redirect to login?
    // potential, save their url and once they're logged in, redirect to that url
  }
  // TODO make another mmiddleware
}
