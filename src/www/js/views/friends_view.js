/**
* Friends View. Displays the users friends.
*
* @class FriendsView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/friends_page.html",
    "text!tmpl/no_data_page.html",
    "js/collections/friend_collection",
    "js/views/indiv_friend_view",
    "js/ajax_error",
    "js/mods/spinner_mod",
    "js/views/help_view",
    "backbonesubviews"
], function($, _, Backbone, friendsTemplate, noDataTemplate, FriendCollection,
    IndividualFriendView, ajaxError, spinner, HelpView){
    "use strict";
        var FriendsView = Backbone.View.extend({
            // Private vars
            _helpObj: {
                title: "Friends (Family, Work And School)",
                message: "<p>When you visit somebody's profile you'll see a button: 'Add Friend'. You can tap this and add them as a Friend, Work Colleague, Family Member or somebody you knew from School, College or University.</p><p>Once you've added them, they'll all appear here, neatly colour coded and ordered by the category you added them under.</p>"
            },
            _renderNoDataString: "You can add friends by tapping the Add Friend button on a user\'s profile.",

            /**
            * The main template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(friendsTemplate),

            /**
            * The no data template for the view.
            * 
            * @property templateNd
            * @type {Object}
            */
            templateNd: _.template(noDataTemplate),

            /**
            * Binds callbacks and fetches collection data before calling render.
            *
            * @method initialize
            */
            initialize: function(){
                spinner.showSpinner();
                Backbone.Subviews.add(this);
                var that = this;
                // Create before and after render methods
                this.render = _.wrap(this.render, function(render) {
                    // this.beforeRender();
                    render.apply(this);                       
                    this.afterRender();
                }); 

                this.collection = new FriendCollection();
                // Fetch the users and don't render until after data 
                this.collection.fetch({
                    success: function (users) {
                        spinner.hideSpinner();
                        that.renderMain(users);                
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    },
                    afterSuccess: function(resp){
                        that.collection = new FriendCollection(resp);
                        that.renderMain(resp);
                    }
                });
            },

            /** 
            * Called after the render method has completed. Updates the count
            * for user types.
            *
            * @method afterRender
            */
            afterRender: function(){
                this.userTypeCount = 
                    this.subviews.individualFriendView.userTypeCount;
            },

            /**
            * Renders the appropriate view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            },

            /**
            * Renders the no data view.
            *
            * @method renderNoData
            * @param {string} message The message for the no data view.
            */
            renderNoData: function(message){
                this.$el.html(this.templateNd({message: message}));
                return this;
            },

            /**
            * Renders the main view template.
            *
            * @method renderMain
            * @param {object} resp The response object.
            */
            renderMain: function(resp){
                var help = new HelpView(this._helpObj);
                if(resp.length === 0){
                    this.renderNoData(this._renderNoDataString);
                }else{
                    this.render();
                }
            },

            /**
            * Renders the individual friend view for each friend in the
            * friends collection.
            *
            * @property subviewCreators
            */
            subviewCreators: {
                "individualFriendView" : function() {
                    var options = {collection: this.collection};
                    return new IndividualFriendView(options);
                }
            }
        });
        return FriendsView;
});