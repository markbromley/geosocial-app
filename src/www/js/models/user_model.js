/**
* User Model. Represents the data for a single user. Contains the validation
* data, accepted fields and corresponding model service URL.
*
* @class UserModel
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "js/url_handle",
    "bbvalidation"
], function($, _, Backbone, urlHandle){
    "use strict";
        var UserModel = Backbone.Model.extend({
            // Only triggered when making, not downloading models... 
            // allows less data if server decides...
            validation:{
                name:{
                 required: true,
                 minLength: 2,
                 maxLength: 200,
                 msg: "Please enter a name between 2 and 200 characters long."
                 },
                email:{
                    required: true,
                    pattern: "email",
                    msg: "Please enter a valid email."
                },
                password:{
                    required: true,
                    msg: "Please enter a password."
                }
            },
            defaults: {
                name: "",
                email: "",
                rel_type: "",
                password: "",
                gender:"",
                prof_im_url_id: "",
                category: "",
                pref_name: "",
                distance: "",
                distanceFormat: "",
                description: "",
                dob_day: "",
                dob_month: "",
                dob_year: "",
                height: "",
                weight: "",
                posts: "",
                rel_status: "",
                sexuality: "",
                likes_1: "",
                likes_2: "",
                likes_3: "",
                ethnicity: "",
                eye_color: "",
                hair_color: "",
                political_views: "",
                religous_views: "",
                education: "",
                pets: "",
                work_status: "",
                latest_loc_name: ""
            },
            urlRoot: urlHandle.createUrlFromSegment("/users")
        });
        return UserModel;
});