/**
* Edit profile Picture View. Allows users to change their profile picture.
*
* @class EditProfPicView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/edit_prof_pic_page.html",
    "js/models/user_model",
    "js/bkgd/camera_mod",
    "js/mods/popover_mod",
    "js/mods/error_mod",
    "js/bkgd/file_mod",
    "js/bkgd/notify_mod",
    "js/mods/spinner_mod",
    "js/url_handle",
    "js/views/help_view",
    "js/ajax_error"
], function($, _, Backbone, editProfilePicTemplate, UserModel, Camera, 
    Popover, errorBar, fileTran, notify, spinner, urlHandle, HelpView, ajaxError){
        "use strict";
        var EditProfilePictureView = Backbone.View.extend({
            events: {
                "click .edit_photo"     : "editProfPic",
                "click #edit_im_submit" : "submitClick"
            },
            /**
            * Used to store the URI of the updated image.
            *
            * @property imgUri
            * @type {string}
            */
            imgUri: '',
            template: _.template(editProfilePicTemplate),
            
            /**
            * Fired when device successfully returns the URI of a new image.
            *
            * @event camsuccess
            * @param {string} uri The URI of the image.
            */
            camSuccessEvent: "camsuccess",

            _helpObj: {
                title: "Change your Profile Picture",
                message: "<p>If you feel like adding that funky new selfie to your profile, then just tap here.</p><p>Please bare in mind that Blockhouse requires profile pictures to clearly show your face. You wouldn't like it if you couldn't see other peoples' faces, so don't forget to make sure, your beautiful face is nice and clear. :)</p>"
            },
            _editProfileOptionStrings: ['Choose Existing', 'Take Photo'],
            _cameraType: {
                photoLibrary: "LIBRARY",
                camera: "CAMERA"
            },
            _imageUrlSegment: "/images",
            _fileErrorMessage: "File Error",
            _editPhotoClass : "edit_photo",

            /**
            * Returns the HTML string for the thumbnail with URI.
            *
            * @method _thumbnailIconHtmlString
            * @param {string} uri The URI string of the thumbnail.
            */
            _thumbnailIconHtmlString: function(uri){
                return "<img src='" + uri + "' alt='Profile Image' title='Profile Image' />";
            },

            /**
            * Fetches the details for the current user and binds
            * associated events.
            *
            * @method initialize
            */
            initialize: function(){
                var help = new HelpView(this._helpObj);
                spinner.showSpinner();
                var that = this;
                this.model = new UserModel({id: 0});
                this.model.fetch({
                    success: function(profile){
                        spinner.hideSpinner();
                        that.render(profile);
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    }
                });
                $(document).on(this.camSuccessEvent, function(e, uri){
                    that.imgUri = uri;
                });
            },

            /**
            * Renders the template.
            *
            * @method render
            * @param {object} profile The current user profile model.
            */
            render: function(profile){
                this.$el.html(this.template(profile.toJSON()));
                return this;
            },

            /**
            * Allows the user to select a new profile picture. Displays
            * a popover to allow them to select the media type.
            *
            * @method editProfPic
            * @param {object} The button tap event.
            */
            editProfPic: function(e){
                e.preventDefault();
                var opts = this._editProfileOptionStrings;
                var me = Popover.showPopover(e, opts);
                var that = this;
                var result = Popover.popoverSelector().one(
                    Popover.buttonClickedEvent, function(index){
                    switch(index.data){
                        case 1:
                            that.getCameraLibray();
                        break;
                        case 2:
                            that.getCameraNew();
                        break;
                        default:
                        //do nothing
                    }
                });

            },

            /**
            * Provides access to the device photo library. Binds callbacks to
            * view.
            * 
            * @method getCameraLibray
            */
            getCameraLibray: function(){
                Camera.getPicture(
                    this.cameraSuccess,
                    this.cameraError,
                    this._cameraType.photoLibrary);   
            },

            /**
            * Provides access to the device camera to take a new photo. Binds
            * callbacks to the view.
            *
            * @method getCameraNew
            */
            getCameraNew: function(){
                Camera.getPicture(_.bind(this.cameraSuccess, this), 
                    _.bind(this.cameraError,this),this._cameraType.camera);
            },

            /**
            * Called on successful load of new photo.
            *
            * @method cameraSuccess
            * @param {string} uri The URI to the photo.
            */
            cameraSuccess: function(uri){
                $("." + this._editPhotoClass).html(
                    this._thumbnailIconHtmlString(uri));
                $(document).trigger(this.camSuccessEvent, [uri]);
            },

            /**
            * Called on an error trying to load a new photo.
            *
            * @method cameraError
            * @param {object} error The error object.
            */
            cameraError: function(error){
                errorBar.showError(error);
            },

            /**
            * Called when a user taps to upload their new photo.
            *
            * @method submitClick
            * @param {object} scope The scope for the function.
            */
            submitClick: function(scope){
                spinner.showSpinner();
                var url = urlHandle.createUrlFromSegmentWithOptions(
                    this._imageUrlSegment);
                var params = {};
                    params.pictureType = 2;
                fileTran.fileTransfer(
                    this.imgUri, 
                    url, 
                    _.bind(this.fileSuccess,this), 
                    _.bind(this.fileError, this), 
                    params);
            },

            /**
            * Called on successful upload to the service of a new file.
            *
            * @method fileSuccess
            * @param {object} res The response object.
            */
            fileSuccess: function(res){
                spinner.hideSpinner();
            },

            /**
            * Called on failure to upload file to the service.
            *
            * @method fileError
            * @param {object} err The error object.
            */
            fileError: function(err){
                spinner.hideSpinner();
                errorBar.showError(this._fileErrorMessage);
            }
        });
        return EditProfilePictureView;
});