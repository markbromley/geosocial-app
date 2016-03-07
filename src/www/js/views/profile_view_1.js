define([
    'jquery',
    'underscore',
    'backbone',
    'text!tmpl/profile_page_1.html',
    'js/models/user_model',
    'js/mods/popover_mod',
    'js/mods/feedback_mod',
    'js/views/indiv_my_post_view',
    'js/url_handle',
    'js/ajax_error',
    'js/mods/spinner_mod',
    'js/views/help_view',
    'backbonesubviews'

], function($, _, Backbone, profileTemplate, UserModel, Popover, Feedback, IndividualMyPostView, urlHandle, ajaxError, spinner, helpView){

        var ProfileView = Backbone.View.extend({
            events:{
                'click #friend_popup':'showFriendPopover',
                'click #report_popup': 'showReportPopover',
                'click #block_popup': 'showBlockPopover',
                'click #info_show' : 'showInfoSection',
                'click #post_show' : 'showPostSection'
            },
            template: _.template(profileTemplate),
            isFriend: false,
            initialize: function(options){
                spinner.showSpinner();
                //add space for the subview
                // Backbone.Subviews.add(this);
                var that = this;
                this.options = options;
                //user model
                this.model = new UserModel({id: this.options.id});

                this.model.fetch({
                    success: function(profile){
                        spinner.hideSpinner();
                        that.render(profile);
                    },
                   error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    },
                    afterSuccess: function(resp){
                        that.model = new UserModel(resp);
                        that.render(that.model);
                    }
                });
            },
            render: function(profile){
                var helpObj = {};
                    helpObj.title = "The Profile";
                    helpObj.message = "<p>People's profiles show everything they want you to know about them.</p><p>You can follow people you know by tapping 'Add Friend'.</p><p>If you don't want a user to be able to see you again, you can block them by tapping 'Block'.</p><p>You can also report profiles you feel are offensive by tapping 'Report'.</p>";
                var help = new helpView(helpObj);
                profile = profile.toJSON();
                this.postGroup = profile.posts;
                this.$el.html(this.template(profile));
                //hide the all posts section
                this.$('#all_posts_section').hide();
                // If this is a friend type, alter the friend button
                if(profile.rel_type){
                    this._alterFriendButton(profile);
                }
                return this;
            },
            _alterFriendButton: function(profile){
                this.isFriend = true;
                this.$("#friend_popup").removeClass("ss-adduser").addClass("friend").addClass(profile.rel_type.toLowerCase()).text(profile.rel_type.charAt(0).toUpperCase() + profile.rel_type.slice(1));
            },
            // subviewCreators:{
            //  "individualMyPostView" : function(){
            //      var options ={collection: this.postGroup};
            //      return new IndividualMyPostView(options);
            //  }
            // },
            showInfoSection: function(e){
                e.preventDefault();
                this.$('#all_posts_section').hide();
                this.$('#info_section').show();
                this.$('#post_show').parent().removeClass('active');
                this.$('#info_show').parent().addClass('active');
                $(document).trigger('refreshIscroll'); //reflow the css
            },
            showPostSection: function(e){
                e.preventDefault();
                this.$('#all_posts_section').show();
                this.$('#info_section').hide();
                this.$('#info_show').parent().removeClass('active');
                this.$('#post_show').parent().addClass('active');
                $(document).trigger('refreshIscroll'); //reflow the css
            },
            showFriendPopover: function(e){
                e.preventDefault();
                if(this.isFriend){
                    console.log('This is a friend');
                    // this._removeFriend();
                    var opts = ['Remove from Friends'];
                    var me = Popover.showPopover(e, opts);
                    var that = this;
                    var result = me.one("buttonClicked", function(index){
                        if(index.data == 1){
                            console.log('Remove Friend');
                            that._removeFriend();
                        }
                    });
                }else{
                    var opts = ['Add Friend or Buddy', 'Add Family', 'Add Work Colleague', 'Add College, University or School Friend'];
                    var me = Popover.showPopover(e, opts);
                    var that = this;
                    var result = me.one("buttonClicked", function(index){
                        switch(index.data){
                        case 1:
                            that.newBuddy();
                        break;
                        case 2:
                            that.newFamily();
                        break;
                        case 3:
                            that.newColleague();
                        break;
                        case 4:
                            that.newCollege();
                        break;
                        default:
                        //do nothing
                        }
                    });
                }//end if
            },
            showReportPopover: function(e){
                e.preventDefault();
                var opts = ['Report User'];
                var me = Popover.showPopover(e, opts);
                var that = this;
                var result = $('.popover').one("buttonClicked", function(index){
                    if(index.data===1){
                            that.reportUser();
                    }
                });
            },
            showBlockPopover: function(e){
                e.preventDefault();
                var opts = ['Block User'];
                var me = Popover.showPopover(e, opts);
                var that = this;
                var result = $('.popover').one("buttonClicked", function(index){
                    if(index.data===1){
                            that.blockUser();
                    }
                });
            },
            newRelation: function(relType, relName, success){

                var obj = {};
                    obj.user_id = this.options.id;
                    obj.rel_type = relType;

                var url_segment = '/friends';
                var url = urlHandle.createUrlFromSegmentWithOptions(url_segment);
                var that = this;
                var outerSuccess = function(){
                    success(relName);
                };

                $.post( url,
                        obj,
                        outerSuccess,
                        'json'
                        );
            },
            relationSuccess: function(type){
                // below should update above method instead...
                obj = {};
                obj.rel_type = type;
                this._alterFriendButton(obj);
                Feedback.showFeedback(true);
            },
            _generalSuccess: function(){
                Feedback.showFeedback(true);
            },
            newBuddy: function(){
                this.newRelation(4, 'Buddy', _.bind(this.relationSuccess, this));
            },
            newFamily: function(){
                this.newRelation(3, 'Family', _.bind(this.relationSuccess, this));
            },
            newColleague: function(){
                this.newRelation(2, "Colleague",_.bind(this.relationSuccess, this));
            },
            newCollege: function(){
                this.newRelation(1, 'College', _.bind(this.relationSuccess, this));
            },
            blockUser: function(){
                var successWrapper = function(){
                    this._generalSuccess();
                    urlHandle.goBackN(1);
                };
                var success = _.bind(successWrapper, this);
                var obj = {};
                    obj.user_id = this.options.id;
                var url_segment = '/blocks';
                var url = urlHandle.createUrlFromSegmentWithOptions(url_segment);
                $.post( url,
                        obj,
                        success,
                        'json'
                        );
            },
            _removeFriend: function(){
                var success = _.bind(this._generalSuccess, this);
                var url_segment = '/friends/' + this.options.id;
                var url = urlHandle.createUrlFromSegmentWithOptions(url_segment);
                $.ajax( {url: url,
                        type: 'DELETE',
                        success: success,
                        dataType: 'json'
                        });
            },
            reportUser: function(){
                var success = _.bind(this.relationSuccess, this);
                var obj = {};
                    obj.user_id = this.options.id;

                var url_segment = '/reports';
                var url = urlHandle.createUrlFromSegmentWithOptions(url_segment);


                $.post( url,
                        obj,
                        success,
                        'json'
                        );
            }
        });
        return ProfileView;
});