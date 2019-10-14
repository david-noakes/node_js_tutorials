const globalVars = require('../util/global-vars');

exports.get404 = (req, res, next) => {
  const userName = req.session.userEmail;
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404'
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    errorMessage: globalVars.pullSessionData(req, 'error'),
    isAuthenticated: req.session.isLoggedIn
  });
};
