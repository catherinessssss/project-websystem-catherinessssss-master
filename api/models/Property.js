/**
 * Property.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: 'cm_property',

    attributes: {
        owner: {
            collection: 'Member',
            via: 'properties'
        },
        interestedMembers: {
            collection: 'Member',
            via: 'interestedProperties'
        },
        title: {
            type: 'string',
            required: true,
            columnName: 'title'
        },
        imageUrl: {
            type: 'string',
            columnName: 'image_url',
        },
        estate: {
            type: 'string',
            enum: ['Festival City', 'Tin Ma Court', 'City One Shatin'],
            columnName: 'estate'
        },
        bedrooms: {
            type: 'integer',
            columnName: 'bedrooms'
        },
        grossArea: {
            type: 'integer',
            columnName: 'gross_area'
        },
        expectedTenants: {
            type: 'integer',
            columnName: 'expected_tenants'
        },
        rent: {
            type: 'integer',
            columnName: 'rent'
        },
        toJSON: function() {
          var obj = this.toObject();
          return obj;
        }
    }
};

