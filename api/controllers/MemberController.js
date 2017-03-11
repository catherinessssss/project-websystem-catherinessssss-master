/**
 * MemberController
 *
 * @description :: Server-side logic for managing members
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
	login: function(req, res) {
        req.session.nav = 7;
        if (req.method == "GET")
            return res.view('member/login');
        else {
            Member.findOne({username:req.body.username})
            .exec(function (err, user) {
                var responseData = {
                    success : true,
                    message : '',
                    data: null
                }
                if (user == null) {
                    responseData.success = false;
                    responseData.message = 'No such user';
                    return res.send(responseData);
                }
                    
                
                var matchPassword = user.verifyPassword(req.body.password);

                if (!matchPassword) {
                    responseData.success = false;
                    responseData.message = 'Wrong Password';
                    return res.send(responseData);
                }

                responseData.data = user;
                req.session.username = req.body.username;
                req.session.userid = user.id;
                return res.send(responseData);
            });
            
        }
    },
    register: function(req, res) {
        req.session.nav = 7;
        var register = {
            taken: 'none'
        };

        if(req.method === 'GET') {
            return res.view('member/register', {'register': register});
        }

        var username = req.param("username");
        var password = req.param("password");

        Member.findOne({username: username}).exec(function(err, users) {
            if(users) {
                register.taken = 'block';
                return res.view('member/register', {'register': register});        
            }

            Member.create({
                username: username, 
                password: password
            }).exec(function(err, user) {
                if(err) {
                    return res.send(err);
                } else {
                    return res.send('Register Successfully!');
                }
            });
        });
    },
    logout: function(req, res) {
        req.session.username = '';
        req.session.userid = '';
        return res.redirect('/');
    },
    myIntProperties: function(req, res) {
        req.session.nav = 5;
        Member.findOne(req.params.id).populateAll().exec(function(err, member) {
            if(err) {
                return res.send(err);
            }
            return res.view('property/interestedProperties', {'properties': member.interestedProperties});
        });
    },
    myIntPropertiesJSON: function(req, res) {
        Member.findOne(req.params.id).populateAll().exec(function(err, member) {
            if(err) {
                return res.send(err);
            }
            return res.json(member.interestedProperties);
        });
    },
    declareInterested: function(req, res) {
        Member.findOne(req.session.userid).exec(function(err, data) {
            if (err) {
                return res.send(err)
            }
            data.interestedProperties.add(req.params.id);
            data.save();
            return res.send('Declare Successfully.');
        });
    },
    declareUninterested: function(req, res) {
        Member.findOne(req.session.userid).exec(function(err, data) {
            if(err) {
                return res.send(err);
            }
            data.interestedProperties.remove(req.params.id);
            data.save();
            return res.send('Unliked property!');
        });
    }
};

