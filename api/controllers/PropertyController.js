/**
 * PropertyController
 *
 * @description :: Server-side logic for managing Properties
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function(req, res) {
        req.session.nav = 4;
        if(req.method === 'GET') {
            return res.view('property/create');
        }
        
        var property = req.body.Property;
        
        Property.create(property).exec(function(err, data){
            if(err) {
                return res.send(err);
            }
            data.owner.add(req.session.userid);
            data.save();
            return res.redirect('property/view/'+ data.id);
        });
        

    },
    view: function(req, res) {
        var propertyId = req.params.id;
        Property.findOne(propertyId).exec(function(err, data) {
            if(err) {
                return res.send(err);
            }

            return res.view('property/view', {'property': data});
        });
    },
    update: function(req, res) {
        var propertyId = req.params.id;

        if(req.method === 'GET') {
            
            Property.findOne(propertyId).exec(function(err, data) {
                if(err) {
                    return res.send(err);
                }
                return res.view('property/update', {'property': data});
            });
        } else {
            Property.findOne(propertyId).exec(function(err, data) {
                if(err) {
                    return res.send(err);
                }

                data.title = req.body.Property.title;
                data.imageUrl = req.body.Property.imageUrl;
                data.estate = req.body.Property.estate;
                data.bedrooms = req.body.Property.bedrooms;
                data.grossArea = req.body.Property.grossArea;
                data.expectedTenants = req.body.Property.expectedTenants;
                data.rent = req.body.Property.rent;

                data.save();
                return res.redirect('property/view/'+ propertyId);
            });
        }

    },
    delete: function(req, res) {
        Property.findOne(req.params.id).exec(function(err, data){
            if(data != null) {
                data.destroy();
                return res.redirect('property/myProperties');
            } else {
                return res.send("Property not found.");
            }
        });
    },
    myProperties: function(req, res) {
        req.session.nav = 3;
        Member.findOne({id:req.session.userid}).populateAll().exec(function(err, data) {
            if(err) {
                return res.send(err);
            }
            console.log(data.properties);
            return res.view('property/myProperties', {'properties': data.properties});
        });
    },
    interestedMembers: function(req, res) {
        Property.findOne(req.params.id).populateAll().exec(function(err, data) {
            if(err) {
                return res.send(err);
            }
            return res.view('property/interestedMembers', {'members': data.interestedMembers});
        });
    },
    index: function(req, res) {
        req.session.nav = 0;
        Property.find().exec(function(err, data) {
            if(err) {
                return res.send(err);
            }
            return res.view('property/index', {'properties': data});
        });
    },
    search: function(req, res) {
        req.session.nav = 1;
        if(req.method === 'GET') {
            if(!req.query.rent) {
                Property.find().paginate({page: req.query.page, limit:2})
                .exec(function(err, data) {
                    Property.count().exec(function(err, value) {
                        var pages = Math.ceil(value/2);
                        return res.view('property/search', {
                            'properties':data,
                            'count': pages,
                            'current': req.query.page
                        });
                    });
                });
            } else {
                var queryData = req.query,
                rentPrice = queryData.rent.split(","),
                grossArea = queryData.grossArea.split(",");

                var query = Property.find();
                var queryCount = Property.count();
                
                if(queryData.estate) {
                    query = query.where({ estate: queryData.estate});
                    queryCount = queryCount.where({ estate: queryData.estate});
                }
                if(queryData.bedrooms) {
                    query = query.where({ bedrooms: queryData.bedrooms});
                    queryCount = queryCount.where({ bedrooms: queryData.bedrooms});
                }
                query = query.where({ rent: {'>=' : Number(rentPrice[0]),'<=' : Number(rentPrice[1])}});
                query = query.where({ grossArea: { '>=' : Number(grossArea[0]), '<=' : Number(grossArea[1])}});
                queryCount = queryCount.where({ rent: {'>=' : Number(rentPrice[0]),'<=' : Number(rentPrice[1])}});
                queryCount = queryCount.where({ grossArea: { '>=' : Number(grossArea[0]), '<=' : Number(grossArea[1])}});

                query.paginate({page: req.query.page, limit: 2})
                .exec(function(err, data) {
                    queryCount.exec(function(err, value) {
                        var pages = Math.ceil(value/2);
                        return res.view('property/search', {
                            'properties':data,
                            'count': pages,
                            'current': req.query.page
                        });
                    });
                });
            }
        }
    },
    admin: function(req, res) {
        req.session.nav = 2;
        Property.find().exec(function(err, data) {
            if(err) {
                return res.send(err);
            }
            return res.view('property/admin', {'properties' : data});
        })
    },
    json: function(req, res) {
        Property.find().exec(function(err, data ){ 
            if(err) {
                return res.send(err);
            }
            return res.json(data);
        });
    }
};

