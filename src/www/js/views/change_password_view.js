/**
* Change Password View. Allows users to change their password.
*
* @class ChangePasswordView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/change_password_page.html",
    "js/url_handle",
    "js/mods/error_mod",
    "js/mods/feedback_mod",
    "js/ajax_error",
    "js/views/help_view",
    "js/mods/spinner_mod"
], function($, _, Backbone, changePassPage, urlHandle, errorBar, feedBack, 
    ajaxError, HelpView, spinner){
    "use strict";
        var ChangePassView = Backbone.View.extend({
            events:{
                "submit form" : "submitNewPassword"
            },
            template: _.template(changePassPage),

            // Private vars
            _helpObj: {
                title: "Change Password",
                message: "<p>If you need to update your password, enter your current password here, type your new password once and then confirm your new password.</p><p>Your password should be at least 8 characters long and contain numbers and letters to make it super secure.</p><p>Make sure you never give your password to anyone else.</p>"
            },

            _currentPasswordElement: "current_password",
            _newPasswordElement: "new_password",
            _newConfPasswordElement: "new_conf_password",

            _changePasswordUrlSegment: "/change-password",

            /**
            * Gets an an element from the DOM from its ID.
            *
            * @method _getElement
            * @param {string} id
            * @return The DOM element.
            */
            _getElement: function(id){
                return $("#" + id);
            },

            /*
            * Displays a help view and initialises view.
            *
            * @method initialize
            */
            initialize: function(){
                var help = new HelpView(this._helpObj);
                this.render();
            },

            /**
            * Renders the template for the view.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            },

            /**
            * Called when the form submit is tapped. Submits the updated
            * credentials to the service.
            *
            * @method submitNewPassword
            * @param {object} The event object.
            */
            submitNewPassword: function(e){
                e.preventDefault();
                spinner.showSpinner();
                //Avoid Backbone for password
                var passwordModel = {};
                    passwordModel.current_password = 
                        this._getElement(this._currentPasswordElement).val();
                    passwordModel.new_password = 
                        this._getElement(this._newPasswordElement).val();
                    passwordModel.confirm_new_password = 
                        this._getElement(this._newConfPasswordElement).val();

                var url = urlHandle.createUrlFromSegmentWithOptions(
                        this._changePasswordUrlSegment);
                var success = this.submitSuccess;
                var error = this.submitError;

                var opts ={
                    type:"POST",
                    success: success,
                    url: url,
                    data: passwordModel,
                    dataType: 'json',
                    error: error
                };
                $.ajax(opts);
            },

            /**
            * Callback for error occurring on password submission to service.
            *
            * @method submitError
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            submitError: function(data, textStatus, jqXhr){
                spinner.hideSpinner();
                ajaxError.postError(data, textStatus, jqXhr);
                if(data.response && data.description){
                    data = JSON.parse(data.response);
                    errorBar.showError(data.description);
                }
            },

            /**
            * Called after password successfully updated on the service.
            *
            * @method submitSuccess
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            submitSuccess: function(data, textStatus, jqXhr){
                spinner.hideSpinner();
                feedBack.showFeedback(true);
            }
        });
        return ChangePassView;
});