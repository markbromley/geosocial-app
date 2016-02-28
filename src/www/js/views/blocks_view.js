/**
* ViewController for the blocks page. Allows users to see profile titles
* of people who they have blocked and allows them to unblock.
*
* @class BlocksView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/blocks_page.html",
    "text!tmpl/no_data_page.html",
    "js/collections/block_collection",
    "js/views/indiv_block_view",
    "js/ajax_error",
    "js/mods/popover_mod",
    "js/url_handle",
    "js/mods/spinner_mod",
    "js/mods/feedback_mod",
    "js/views/help_view",
    "backbonesubviews"
], function($, _, Backbone, blocksTemplate, noDataTemplate, BlockCollection, 
    IndividualBlockView, ajaxError, Popover, urlHandle, spinner, feedback, HelpView){
        "use strict";
        var BlocksView = Backbone.View.extend({

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(blocksTemplate),

            /**
            * The no data template for the view.
            * 
            * @property templateNd
            * @type {Object}
            */
            templateNd: _.template(noDataTemplate),

            /**
            * The collection of users for the object. Populated on load.
            * 
            * @property users
            * @type {Object}
            */
            users: {},

            // Private vars
            _helpObj: {
                title : "Blocked Profiles",
                message : "<p>If you want to 'unblock' people, then just tap" +
                          "on their profile picture here and then tap unblock.</p>"
            },
            _unBlockuserEvent: "UnBlockUser",
            _renderNoDataMessage: "If you want to block a user, tap the block" +
                                  " button on a user's profile.",
            _blocksUrlSegment: "/blocks/",

            /**
            * Populates the blocks collection with the latest data and
            * renders view.
            *
            * @method initialize
            */
            initialize: function(){
                var help = new HelpView(this._helpObj);
                spinner.showSpinner();
                Backbone.Subviews.add(this);

                var that = this;
                this.$el.on(this._unBlockuserEvent, function(e, id){
                    e.preventDefault();
                    that._showUnblockPopover(e, id);
                });

                // Create a new collection for the users
                this.collection = new BlockCollection();
                // Fetch the users and don't render the view until the 
                // success function has fired because is asynchronous 
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
                        that.collection = new BlockCollection(resp);
                        that.renderMain(resp);
                    }
                });
            },

            /**
            * Renders the view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            },

            /**
            * Renders alternate view in case of there being no blocks data.
            *
            * @method renderNoData
            * @param {string} message The message to display if there is no data.
            */
            renderNoData: function(message){
                this.$el.html(this.templateNd({message: message}));
                return this;
            },

            /**
            * Renders the blocks view.
            *
            * @method renderMain
            * @param {array} users The users currently blocked.
            */
            renderMain: function(users){
                if(users.length === 0){
                    this.renderNoData(this._renderNoDataMessage);
                }else{
                    this.users = users;
                    this.render();
                }
            },

            /**
            * Renders the individual block view for each block in the
            * blocks collection.
            *
            * @property subviewCreators
            */
            subviewCreators: {
                "individualBlockView" : function() {
                    var options = {collection: this.collection};
                    return new IndividualBlockView(options);
                }
            },

            /**
            * Displays a popover, giving the user the option to unblock the
            * selected user.
            *
            * @method _showUnblockPopover
            * @param {object} e The event object.
            * @param {string} id The user to unblock ID.
            */
            _showUnblockPopover: function(e, id){
                e.preventDefault();
                var opts = ['Unblock User'];
                var me = Popover.showPopover(e, opts);
                var that = this;
                var result = me.one(Popover.buttonClickedEvent, function(index){
                    if(index.data === 1){
                        that._unBlockUser(id);
                    }
                });
            },

            /**
            * Attempts to unblock the user with the specified ID.
            *
            * @method _unBlockUser
            * @param {string} id The ID of the user to unblock.
            */
            _unBlockUser: function(id){
                // TODO: This isn't a success response, just a successful 
                // connection to the server
                var success = feedback.showFeedback(true);
                var url_segment = this._blocksUrlSegment + id;
                var elId = '#' + id;
                $(elId).unbind().remove();
                var url = urlHandle.createUrlFromSegmentWithOptions(url_segment);
                $.ajax( {url: url,
                        type: 'DELETE',
                        success: success,
                        dataType: 'json'
                        });
            }
        });
        return BlocksView;
});