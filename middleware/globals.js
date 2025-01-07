module.exports = (vars) => {
    return  (req, res, next) => {
        req.modules = vars.modules; 
        req.navbarPath = './partials/navbar.ejs';
        req.layout_view = 'layout';
        next();
    }
};