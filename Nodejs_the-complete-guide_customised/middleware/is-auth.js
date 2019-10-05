const globalVars = require('../util/global-vars');
module.exports = (req, res, next) => {
    if (!(req.session.user || req.session.isLoggedIn)) {
        const errMsg = 'You must be logged in for this action.';
        console.log(errMsg);
        globalVars.putSessionData(req, 'error', 'Error: ' + errMsg);
        return res.redirect('/login');  
    }
    next();
}
