/**
 * MenuController
 *
 * @description :: Server-side logic for managing Menus
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	loadMenu: function(req, res) {
        var menus = ['Home', 'Search'];
        if(req.body && req.body.username) {
            Menu.find().exec(function(err, menus) {
                return res.view('homepage1', {'menus':menus});
            });
        }
        return res.view('homepage1', {'menus':menus});
    }
};

