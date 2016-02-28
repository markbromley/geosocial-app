/**
* New Post View. Responsible for the new post popover view.
*
* @class NewPostView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/new_post.html",
    "js/bkgd/camera_mod",
    "js/mods/error_mod",
    "js/bkgd/file_mod",
    "js/mods/spinner_mod",
    "js/url_handle",
    "js/ajax_error"
], function($, _, Backbone, newPostTemplate, Camera, errorBar, fileTran,
        spinner, urlHandle, ajaxError){
    "use strict";
    var profileView = Backbone.View.extend({
        // Private vars
        _animatedClass: "animated",
        _fadeInClass: "fadeIn",
        _fadeOutclass: "fadeOut",
        _hideClass: "hide",
        _bounceInUpClass: "bounceInUp",
        _bounceOutDownClass: "bounceOutDown",
        _newPostClass: "new_post",
        _chooseAgainClass: "choose_again",
        _charCountClass: "char_count",
        _mainPostElement: "main_post_comment",

        _postsUrlSegment: "/posts",
        _pictureErrorNoImageSelected: "no image selected",

        /**
        * Gets a class string from a class name e.g. prepends the period.
        *
        * @method _getClassString
        * @param {string} className The name of the class.
        * @return The class string with period prepended.
        */
        _getClassString: function(className){
            return "." + className;
        },

        /**
        * Gets elements from a class name (without period prepended).
        *
        * @method _getClassElements
        * @param {string} The class name (without period prepended).
        * @return The elements with the specified class name.
        */
        _getClassElements: function(className){
            return this.$(this._getClassString(className));
        },

        /**
        * Prepends hash to an ID to create a DOM ID selector string.
        *
        * @method _getIdString
        * @param {string} idName The name of the element ID.
        * @return A DOM ID selector string for the ID name.
        */
        _getIdString: function(idName){
            return "#" + idName;
        },

        /**
        * Gets an element by its ID.
        *
        * @method _getIdElement
        * @param {string} idName The name of the element ID to select. Does
        *        NOT include the hash.
        * @return The element to select.
        */
        _getIdElement: function(idName){
            return this.$(this._getIdString(idName));
        },

        imgUri: '',
        el: '.post_dial',
        events:{
            'click .submit'        : 'submitForm',
            'click .choose_again'  : 'addPicture',
            'click .close'         : 'closeDialogue'
        },

        /**
        * The standard template for the view.
        * 
        * @property template
        * @type {Object}
        */
        template: _.template(newPostTemplate),

        /**
        * Initialises the view.
        *
        * @method initialize
        */
        initialize: function(){
            this.render();
            this.countText();
        },

        /**
        * Renders the template for the view and animates the popover in.
        *
        * @method render
        */
        render: function(){
            this.$el.html(this.template());
            this.$el
                .removeClass(this._hideClass + " " + this._fadeOutclass)
                .addClass(this._animatedClass + " " + this._fadeInClass);
            this.$el.show();
            this._getIdElement(this._mainPostElement).focus();
            return this;
        },

        /**
        * Counts the number of characters entered by the user into the
        * post dialog. Displays the characters in the dialog too.
        *
        * @method countText
        */
        countText: function(){
            var txtArea = this.$("textarea");
            var display = this._getClassElements(this._charCountClass);
            var cacheVal = '';
            var count = function() {
                sum = 100 - $(this).val().length;
                if(sum <= 0){
                    sum = 0;
                }
                sum = sum.toString();
                display.text(sum + "/100");
            };
            txtArea.keyup(count);
            txtArea.keypress(count);
        },

        /**
        * Closes the popover dialog for the new post.
        *
        * @method closeDialogue
        * @param {object} e The event object.
        */
        closeDialogue: function(e){
            // Check if an event called the function and if so halt it
            if(e){
                e.preventDefault();
            }
            var that = this;
            this.$el.unbind();
            this.$el.removeClass(this._animatedClass + " " + this._fadeInClass);
            this.$el.addClass(this._animatedClass + " " + this._fadeOutclass);

            this._getClassElements(this._newPostClass)
                .removeClass( this._animatedClass + " " + this._bounceInUpClass);
            this._getClassElements(this._newPostClass)
                .addClass(this._animatedClass + " " + this._bounceOutDownClass);
            setTimeout(function(){
                that._getClassElements(that._newPostClass)
                    .removeClass(that._animatedClass + " " + that._bounceOutDownClass);
                that._getClassElements(that._newPostClass)
                    .addClass(that._animatedClass + " " + that._bounceInUpClass);
                that.$el.show().hide();
            }, 1000);
        },

        /**
        * Provides the option to the user to select a picture to attach to
        * their new post. Binds success/ error callbacks.
        *
        * @method addPicture
        * @param {object} e The event object.
        */
        addPicture: function(e){
            e.preventDefault();
            // Bind the callback to this view
            var callback = _.bind(this.addPictureSucccess, this);
            var errorCallback = _.bind(this.addPictureError, this);
            Camera.getPicture(callback, errorCallback, "");
        },

        /**
        * Success callback for selecting a picture to attach to a new post.
        *
        * @method addPictureSucccess
        * @param {string} uri The URI of the picture to attach to the post.
        */
        addPictureSucccess: function(uri){
            this.imgUri = uri;
            this._getClassElements(this._chooseAgainClass)
                .css("background-image", "url(" + uri + ")").html("");
        },

        /**
        * Error callback for selecting a picture to attach to a new post.
        *
        * @method addPictureError
        * @param {object} error The error object.
        */
        addPictureError: function(error){
            if(error != this._pictureErrorNoImageSelected){
                errorBar.showError(error);
            }
        },

        /**
        * Submits a new post to the service.
        *
        * @method submitForm
        * @param {object} e The event object.
        */
        submitForm: function(e){
            e.preventDefault();
            spinner.showSpinner();
            // Check to see if there is a picture being attached
            if(this.imgUri === ''){
                this.submitTextOnly();
            }else{
                this.submitWithPicture();
            }
        },

        /**
        * Submits a new post with image attached to the service.
        *
        * @method submitWithPicture
        */
        submitWithPicture: function(){
            var params = {};//need to fill this up with the correct info
            //below add the user comment to the post
            params.firstComment = this._getIdElement(this._mainPostElement).val();
            var img = this.imgUri;
            var url = urlHandle.createUrlFromSegmentWithOptions(this._postsUrlSegment);
            var success = _.bind(this.fileSuccess, this);
            var error = _.bind(this.fileError, this);
            fileTran.fileTransfer(img, url, success, error, params);
        },

        /**
        * Submits a new text-only post to the service.
        *
        * @method submitTextOnly
        */
        submitTextOnly: function(){
            var url = urlHandle.createUrlFromSegmentWithOptions(this._postsUrlSegment);
            var success = _.bind(this.textUploadSuccess, this);
            var error = _.bind(this.textUploadError, this);
            var paramModel = {};
                paramModel.firstComment = this._getIdElement(this._mainPostElement).val();
            var opts = {
                type: "POST",
                success: success,
                url: url,
                data: paramModel,
                dataType: 'json',
                error: error
            };
            $.ajax(opts);
        },

        /**
        * Success callback for uploading a new image file to the service.
        * Closes the dialog.
        *
        * @method fileSuccess
        * @param {object} The response object.
        */
        fileSuccess: function(res){
            spinner.hideSpinner();
            this.closeDialogue();
        },

        /**
        * Error callback for uploading a new image file to the service.
        * Closes the dialog.
        *
        * @method file Error
        * @param {object} err The error object.
        */
        fileError: function(err){
            // TODO: There should be some sort of 401 logout mechanism 
            // in here too ideally...
            spinner.hideSpinner();
            this.closeDialogue();
        },

        /**
        * Success callback for uploading a new text-only post to the service.
        *
        * @method textUploadSuccess
        * @param {object} The data object.
        * @param {object} The textStatus object.
        * @param {object} The jqXhr object.
        */
        textUploadSuccess: function(data, textStatus, jqXhr){
            spinner.hideSpinner();
            this.closeDialogue();
        },

        /**
        * Error callback for uploading a new text-only post to the service.
        *
        * @method textUploadError
        * @param {object} The data object.
        * @param {object} The textStatus object.
        * @param {object} The jqXhr object.
        */ 
        textUploadError: function(data, textStatus, jqXhr){
            ajaxError.postError(data, textStatus, jqXhr);
            spinner.hideSpinner();
            this.closeDialogue();
        }
    });
    return profileView;
});