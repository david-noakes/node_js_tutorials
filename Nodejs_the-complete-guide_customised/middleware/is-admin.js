const globalVars = require('../util/global-vars');
module.exports = (req, res, next) => {
    if (!(req.session.user && req.session.user.isAdmin)) {
        const errMsg = 'You do not have admin access.';
        console.log(errMsg);
        globalVars.putSessionData(req, 'error', 'Error: ' + errMsg);
        return res.redirect('/login');
    }
    next();
}
