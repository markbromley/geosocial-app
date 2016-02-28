/**
* Edit Profile View. Allows the user to edit their profile.
* // TODO: Update to refresh cash once data loaded...
*
* @class EditProfileView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/edit_page.html",
    "js/models/user_model",
    "js/ajax_error",
    "js/app_constants",
    "js/views/help_view",
    "js/mods/spinner_mod"
], function($, _, Backbone, editProfileTemplate, UserModel, ajaxError,
    consts, HelpView, spinner){
    "use strict";
        var EditProfileView = Backbone.View.extend({
            // Private vars
            _helpObj: {
                title: "Edit Profile",
                message: "<p>You can come here to edit your account settings, like Email, Name etc or to add new information about your self, like a profile tag line, the things you like, your personal details or even what pets you have!</p><p>Just edit the information in the tabs below and tap 'update' when you're done.</p><p>Happy editing! :)</p>"
            },
            _editHeightElement: "edit_height",
            _editWeightElement: "edit_weight",
            _editRelationshipElement: "edit_relationship",
            _editSexualityElement: "edit_sexuality",
            _editLikes1Element: "edit_likes_1",
            _editLikes2Element: "edit_likes_2",
            _editLikes3Element: "edit_likes_3",
            _editEthnicityElement: "edit_ethnicity",
            _editEyeColorElement: "edit_eye_color",
            _editHairColorElement: "edit_hair_color",
            _editPolitcialViewsElement: "edit_political_views",
            _editReligousViewsElement: "edit_religous_views",
            _editEducationElement: "edit_education",
            _editPetsElement: "edit_pets",
            _editWorkStatusElement: "edit_work_status",
            _editDobDayElement: "edit_dob_day",
            _editDobMonthElement: "edit_dob_month",
            _editDobYearElement: "edit_dob_year",
            _editGenderElement: "edit_gender",
            _editFullNameElement: "edit_full_name",
            _editEmailOneElement: "edit_email_one",
            _editNickNameElement: "edit_nick_name",
            _editDescriptionElement: "edit_description",

            _accountSectionElement: "account_section",
            _profileSectionElement: "profile_section",
            _bioSectionElement: "bio_section",
            _accountShowElement: "account_show",
            _bioShowElement: "bio_show",
            _profileShowElement: "profile_show",

            _activeClass: "active",


            _getIdString: function(id){
                return "#" + id;
            },

            /**
            * Gets an an element from the DOM from its ID.
            *
            * @method _getElement
            * @param {string} id
            * @return The DOM element.
            */
            _getElement: function(id){
                return this.$("#" + id);
            },

            events:{
                "submit form"         : "updateSubmit",
                "click #account_show" : "showAccountSection",
                "click #profile_show" : "showProfileSection",
                "click #bio_show"     : "showBioSection"
            },

            /**
            * The main template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(editProfileTemplate),

            /**
            * Displays the help view and fetches the user's profile data.
            * Binds callbacks and calls render.
            *
            * @method initialize
            */
            initialize: function(){
                var help = new HelpView(this._helpObj);
                spinner.showSpinner();
                var that = this;
                // Create before and after render methods
                this.render = _.wrap(this.render, function(render) {
                    // this.beforeRender();
                    render.apply(this);                       
                    this.afterRender();
                });

                this.model = new UserModel({id: 0});
                this.model.fetch({
                    success: function(profile){
                        spinner.hideSpinner();
                        that.profile = profile;
                        that.render();
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    }
                });
            },

            /**
            * Renders the main view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template(this.profile.toJSON()));
                return this;
            },

            /** 
            * Called after the render method has completed. Creates the
            * HTML elements for the update view.
            *
            * @method afterRender
            */
            afterRender: function(){
                // Add options to the select boxes
                this._createDate();
                this._createSelect(consts.height, 
                    this._getIdString(this._editHeightElement));
                this._createSelect(consts.weight, 
                    this._getIdString(this._editWeightElement));
                this._createSelect(consts.relStatus, 
                    this._getIdString(this._editRelationshipElement));
                this._createSelect(consts.sexuality, 
                    this._getIdString(this._editSexualityElement));
                this._createSelect(consts.likes, 
                    this._getIdString(this._editLikes1Element));
                this._createSelect(consts.likes, 
                    this._getIdString(this._editLikes2Element));
                this._createSelect(consts.likes, 
                    this._getIdString(this._editLikes3Element));
                this._createSelect(consts.ethnicity, 
                    this._getIdString(this._editEthnicityElement));
                this._createSelect(consts.eyeColor, 
                    this._getIdString(this._editEyeColorElement));
                this._createSelect(consts.hairColor, 
                    this._getIdString(this._editHairColorElement));
                this._createSelect(consts.politicalViews, 
                    this._getIdString(this._editPolitcialViewsElement));
                this._createSelect(consts.religousViews, 
                    this._getIdString(this._editReligousViewsElement));
                this._createSelect(consts.education, 
                    this._getIdString(this._editEducationElement));
                this._createSelect(consts.pets, 
                    this._getIdString(this._editPetsElement));
                this._createSelect(consts.workStatus, 
                    this._getIdString(this._editWorkStatusElement));

                this._getElement(this._profileSectionElement).hide();
                this._getElement(this._bioSectionElement).hide();

                // Now set the defaults
                var user = this.profile.toJSON();
                // Add the DOB & Gender items
                this._getElement(this._editDobDayElement).val(user.dob_day);
                this._getElement(this._editDobMonthElement).val(user.dob_month);
                this._getElement(this._editDobYearElement).val(user.dob_year);
                this._getElement(this._editGenderElement).val(user.gender);
                
                // Add the select items
                this._createValue(user.height, consts.height, 
                    this._getIdString(this._editHeightElement));
                this._createValue(user.weight, consts.weight, 
                    this._getIdString(this._editWeightElement));
                this._createValue(user.rel_status, consts.relStatus, 
                    this._getIdString(this._editRelationshipElement));
                this._createValue(user.sexuality, consts.sexuality, 
                    this._getIdString(this._editSexualityElement));
                this._createValue(user.ethnicity, consts.ethnicity, 
                    this._getIdString(this._editEthnicityElement));
                this._createValue(user.eye_color, consts.eyeColor, 
                    this._getIdString(this._editEyeColorElement));
                this._createValue(user.hair_color, consts.hairColor, 
                    this._getIdString(this._editHairColorElement));
                this._createValue(user.likes_1, consts.likes, 
                    this._getIdString(this._editLikes1Element));
                this._createValue(user.likes_2, consts.likes, 
                    this._getIdString(this._editLikes2Element));
                this._createValue(user.likes_3, consts.likes, 
                    this._getIdString(this._editLikes3Element));
                this._createValue(user.political_views, consts.politicalViews, 
                    this._getIdString(this._editPolitcialViewsElement));
                this._createValue(user.religous_views, consts.religousViews, 
                    this._getIdString(this._editReligousViewsElement));
                this._createValue(user.education, consts.education, 
                    this._getIdString(this._editEducationElement));
                this._createValue(user.pets, consts.pets, 
                    this._getIdString(this._editPetsElement));
                this._createValue(user.work_status, consts.workStatus, 
                    this._getIdString(this._editWorkStatusElement));
            },

            /**
            * Selects the appropriate DOM element and binds the associated
            * data from the model.
            *
            * @method _createValue
            * @param {object} modelProp The model property ID.
            * @param {object} constObj The constants object representing the 
            *        given property key/ value options.
            * @param {string} domId The ID of the DOM element responsible for
            *        property in the view template.
            */
            _createValue: function(modelProp, constObj, domId){
                var val = this._getKeyByValue(constObj, modelProp);
                this.$(domId).val(val);
            },

            /**
            * Takes an object and a value thought to be within the object
            * and returns the key for the given value (if found) from the
            * supplied object. Returns void if not found. Poor complexity;
            * use sparingly.
            *
            * @method _getKeyByValue
            * @param {object} obj The object to search for the value.
            * @param {number} value The value to search the object for.
            */
            _getKeyByValue: function(obj, value ) {
                // This is expensive...
                for( var prop in obj ) {
                    if( obj.hasOwnProperty( prop ) ) {
                         if( obj[ prop ] === value )
                             return prop;
                    }
                }
            },

            /**
            * Creates a select element for each value within the supplied 
            * object.
            *
            * @method _createSelect
            * @param {object} object The object to create the select elements
            *        from.
            * @param {string} domId The ID of the DOM element responsible for
            *        property in the view template.
            */
            _createSelect: function(object, domId){
                var html = '';
                for(var key in object){
                    if(object.hasOwnProperty(key)){
                        html += '<option value="' + key + '">' +
                             object[key] + '</option>';
                    }// end if
                }// end for
                this.$(domId).html(html);
            },

            /**
            * Creates a date year element for the years from 1900 to the
            * current year, minus the minimum age requirement.
            *
            * @method _createDate
            */
            _createDate: function(){
                // Days 0 - 31 (Let the server validate exact date)
                // Month 0 -12
                // Year 1900 to now
                var d = new Date();
                var curYear = d.getFullYear() - 12; // minus 13 because of age requirement
                var html = '';
                for(var i =1900; i <= curYear; i++){
                  html += '<option value="' + i + '">' +
                             i + '</option>\n';
                }
                this._getElement(this._editDobYearElement).html(html);
            },

            /**
            * Displays the account section of the view. Hides all other
            * sections.
            *
            * @method showAccountSection
            * @param {object} The default event object.
            */
            showAccountSection: function(e){
                e.preventDefault();
                this._getElement(this._profileSectionElement).hide();
                this._getElement(this._bioSectionElement).hide();
                this._getElement(this._accountSectionElement).show();
                this._getElement(this._profileShowElement).parent().removeClass(this._activeClass);
                this._getElement(this._bioShowElement).parent().removeClass(this._activeClass);
                this._getElement(this._accountShowElement).parent().addClass(this._activeClass);
            },

            /**
            * Displays the profile section of the view. Hides all other
            * sections.
            *
            * @method showProfileSection
            * @param {object} The default event object.
            */
            showProfileSection: function(e){
                e.preventDefault();
                this._getElement(this._accountSectionElement).hide();
                this._getElement(this._profileSectionElement).show();
                this._getElement(this._bioSectionElement).hide();
                this._getElement(this._accountShowElement).parent().removeClass(this._activeClass);
                this._getElement(this._bioShowElement).parent().removeClass(this._activeClass);
                this._getElement(this._profileShowElement).parent().addClass(this._activeClass);
            },

            /**
            * Displays the biography section of the view. Hides all other
            * sections.
            *
            * @method showBioSection
            * @param {object} The default event object.
            */
            showBioSection: function(e){
                e.preventDefault();
                this._getElement(this._accountSectionElement).hide();
                this._getElement(this._profileSectionElement).hide();
                this._getElement(this._bioSectionElement).show();
                this._getElement(this._accountShowElement).parent().removeClass(this._activeClass);
                this._getElement(this._bioShowElement).parent().addClass(this._activeClass);
                this._getElement(this._profileShowElement).parent().removeClass(this._activeClass);
            },

            /**
            * Updates the service with all the values currently displayed in
            * the view. This could be improved with - uploads all values
            * from all 3 sections, even if not edited.
            *
            * @method updateSubmit
            * @param {object} The default event object.
            */
            updateSubmit: function(e){
                spinner.showSpinner();
                // Bind the form to an object for insertion to the model
                var modelObj = {};
                    modelObj.id = 0;
                    modelObj.name = this._getElement(this._editFullNameElement).val();
                    modelObj.email = this._getElement(this._editEmailOneElement).val();
                    modelObj.dob_day = this._getElement(this._editDobDayElement).val();
                    modelObj.dob_month = this._getElement(this._editDobMonthElement).val();
                    modelObj.dob_year = this._getElement(this._editDobYearElement).val();
                    modelObj.gender = this._getElement(this._editGenderElement).val();

                    modelObj.pref_name = this._getElement(this._editNickNameElement).val();
                    modelObj.description = this._getElement(this._editDescriptionElement).val();
                    modelObj.height = this._getElement(this._editHeightElement).val();
                    modelObj.weight = this._getElement(this._editWeightElement).val();
                    modelObj.rel_status = this._getElement(this._editRelationshipElement).val();
                    modelObj.sexuality = this._getElement(this._editSexualityElement).val();
                    modelObj.likes_1 = this._getElement(this._editLikes1Element).val();
                    modelObj.likes_2 = this._getElement(this._editLikes2Element).val();
                    modelObj.likes_3 = this._getElement(this._editLikes3Element).val();

                    modelObj.ethnicity = this._getElement(this._editEthnicityElement).val();
                    modelObj.eye_color = this._getElement(this._editEyeColorElement).val();
                    modelObj.hair_color = this._getElement(this._editHairColorElement).val();
                    modelObj.political_views = this._getElement(this._editPolitcialViewsElement).val();
                    modelObj.religous_views = this._getElement(this._editReligousViewsElement).val();
                    modelObj.education = this._getElement(this._editEducationElement).val();
                    modelObj.pets = this._getElement(this._editPetsElement).val();
                    modelObj.work_status = this._getElement(this._editWorkStatusElement).val();

                // Prevent the form from submitting
                e.preventDefault();

                var successCallback = function successCallback(model, response){
                    spinner.hideSpinner();
                    console.log('Edit Profile update complete.');
                };

                var errorCallback = function errorCallback(model, response){
                    spinner.hideSpinner();
                    var err = JSON.parse(response.responseText);
                        err = err.description;
                    errorBar.showError(err);
                };

                // Save the model and bind the callbacks
                this.model.save(modelObj, {
                    success: successCallback,
                    error: errorCallback
                });
                // End of copy
            }
        });
        return EditProfileView;    
});