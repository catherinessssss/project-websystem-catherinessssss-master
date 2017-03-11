module.exports = function(req,res,next) {
    if (!req.session.username) {
        return res.forbidden('You are not permitted to perform this action.');
    }
    return next();
}