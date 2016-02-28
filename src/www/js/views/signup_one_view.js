define([
    'jquery',
    'underscore',
    'backbone',
    'text!tmpl/signup_page_1.html',
    'js/models/user_model',
    'js/mods/error_mod',
    'js/url_handle',
    'js/bkgd/camera_mod',
    'js/mods/popover_mod',
    'js/bkgd/file_mod',
    'js/bkgd/notify_mod',
    'js/mods/spinner_mod'
], function($, _, Backbone, signupOnePage, UserModel, errorBar, urlHandle, Camera, Popover, fileTran, notify, spinner){

        var TermsView = Backbone.View.extend({
            template: _.template(signupOnePage),
            events:{
                'submit form': 'submit',
                "click .edit_photo":"showPopover",
                "click .photo_holder":"showPopover"
            },
            imgUri: '',
            initialize: function(){
                var that = this;
                this.model = new UserModel();
                this.render = _.wrap(this.render, function(render) {
                    // this.beforeRender();
                    render.apply(this);                       
                    this.afterRender();
                }); 
                this.render();
            },
            render: function(){
                this.$el.html(this.template());
                // Backbone.Validation.bind(this, {
                //       valid: function(view, attr) {
                //         //can be used...
                //       },
                //       invalid: function(view, attr, error) {
                //         errorBar.showError(error);
                //       }
                // });  
                return this;
            },
            afterRender: function(){
                this._createDate();
            },
            _createDate: function(){
                //Days 0 - 31 (Let the server validate exact date)
                // Month 0 -12
                // Year 1900 to now
                var d = new Date();
                var curYear = d.getFullYear() - 12; // minus 13 because of age requirement
                var html = '';
                for(var i =1900; i <= curYear; i++){
                  html += '<option value="' + i + '">' +
                             i + '</option>\n';
                }//end for
                // console.log(html);
                this.$('#signup_dob_year').html(html);
            },
            getCameraLibray: function(){
                Camera.getPicture(
                    _.bind(this.cameraSuccess, this),
                    _.bind(this.cameraError, this),
                    "LIBRARY");   
            },
            getCameraNew: function(){
                Camera.getPicture(
                    _.bind(this.cameraSuccess, this),
                    _.bind(this.cameraError, this),
                    "CAMERA");
            },
            cameraSuccess: function(uri){
                this.$(".photo_holder").attr("src", uri);
                this.imgUri = uri;
            },
            cameraError: function(error){
                errorBar.showError(error);
            },
            showPopover: function(e){
                var opts, me, that, result;
                opts = ['Choose Existing', 'Take Photo'];
                me = Popover.showPopover(e, opts);
                that = this;
                result = me.one("buttonClicked", function(index){
                    switch(index.data){
                        case 1:
                            that.getCameraLibray();
                        break;
                        case 2:
                            that.getCameraNew();
                        break;
                        default:
                        // do nothing
                    } // end switch case
                });
            },
            submit: function(e) {
                //prevent the form from submitting
                e.preventDefault();

                //bind the form to an object for insertion to the model
                var modelObj = {};
                    modelObj.name = this.$('#signup_name').val();
                    modelObj.email = this.$('#signup_email').val();
                    modelObj.password = this.$('#signup_password').val();
                    modelObj.dob_day = this.$('#signup_dob_day').val();
                    modelObj.dob_month = this.$('#signup_dob_month').val();
                    modelObj.dob_year = this.$('#signup_dob_year').val();
                    modelObj.gender = this.$('#signup_gender').val();

                // Validate the data
                var isEmailValid, isNameValid, isPasswordValid;
                isEmailValid = this.model.preValidate('email', modelObj.email);
                isNameValid = this.model.preValidate('name', modelObj.name);
                isPasswordValid = this.model.preValidate('password', modelObj.password);
                console.log(this.imgUri);

                if(!isEmailValid && !isNameValid && !isPasswordValid && this.imgUri){
                    console.log('ALL VALID');
                    // No errors, continue to submit the data
                    spinner.showSpinner();
                    // pictureType paramater used to define if image
                    // is a profile picture. Updated profile picture = 2.
                    // New profile picture = 1.
                    modelObj.pictureType = 1;
                console.log(modelObj);
                var url = urlHandle.createUrlFromSegmentWithOptions('/users');
                console.log(url);
                fileTran.fileTransfer(
                    this.imgUri, 
                    url, 
                    this.fileTransferSuccess, 
                    this.fileTransferError, 
                    modelObj);
                }else{
                    //errors - display them and don't submit the form
                    console.log(isPasswordValid);
                    errorBar.showError(isEmailValid + ' ' + isNameValid + ' ' + isPasswordValid, 10000);
                    if(!this.imgUri){
                        console.log(2222);
                        errorBar.showError('Please attach a face profile picture');
                    }
                }// end if statement
            },
            fileTransferSuccess: function(response){
                console.log(response);
                console.log('REPSONSE RESPONSE:');
                console.log(response.response);
                response = JSON.parse(response.response);
                console.log(response);
                spinner.hideSpinner();
                urlHandle.addUrlTokenToStorage(response.token);
                var confirmCallback = function(){
                    urlHandle.changeUrlHash('#signup_two');
                };
                notify.showAlert('Succesfully logged in. :)',
                        confirmCallback,
                        'Welcome', 
                        'Ok', 
                        true, 
                        true);
            },
            fileTransferError: function(response){
                console.log(response);
                spinner.hideSpinner();
                var err = JSON.parse(response.responseText);
                    err = err.description;
                errorBar.showError(err);
            }
        });
        return TermsView;
});