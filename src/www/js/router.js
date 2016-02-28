define([
  'jquery',
  'underscore',
  'backbone',
  'pageslider',
  'js/views/home_view',
  'js/views/friends_view',
  'js/views/feed_view',
  'js/views/settings_view',
  'js/views/profile_view_1',
  'js/views/edit_profile_view',
  'js/views/edit_prof_pic_view',
  'js/views/change_password_view',
  'js/views/blocks_view',
  'js/views/terms_view',
  'js/views/login_view',
  'js/views/force_logout_view',
  'js/views/signup_one_view',
  'js/views/signup_two_view',
  'js/views/post_detail_view',
  'js/views/remote_kill_view',
  'js/views/error_view'
  ], function($, _, Backbone, PageSlider, HomeView, FriendsView, FeedView, SettingsView, ProfileView, EditProfileView, EditProfilePicView, ChangePassView, BlocksView, InfoView, LoginView, ForceLogoutView, SignupOneView, SignupTwoView, PostDetailView, RemoteKillView, ErrorView){

    var Router = Backbone.Router.extend({
      routes:{
        "":"home",
        "home": "home",
        "feed": "feed",
        "friends": "friends",
        "friends/:id":"friendProfile",
        "profile/:id":"profile",
        "settings":"settings",
        "edit_profile":"editProfile",
        "edit_profile_pic": "editProfilePic",
        "change_pass": "changePass",
        "blocks": "blocks",
        "info/:show": "info",
        "login": "login",
        "forceLogout": "forceLogout",
        "remote_kill": "remoteKill",
        "signup_one": "signupOne",
        "signup_two": "signupTwo",
        "feed/:id":"postDetail",
        "error/:id":"errorPage"
      },
      initialize: function(){
          //Instantiate new slider object on '#content_wrapper' to transition primary content
          this.slider = new PageSlider($("#content_wrapper"));
          
          // //Add the content scrolling effect to the first child of '#app_container', without scrollbars
          // this.iscroll = new iScroll("app_container", { hScrollbar: false, vScrollbar: false });

          //allow pages to manually refresh the iscroll view, disable and enable it
          var that = this;
          $(document).on("refreshIscroll", function(){
            // that.iscroll.refresh();
          });
          // Below code gets the URL hashbange and works out which page we are going from and to. This is then used to look up the animation direction from the associative array
          this.result ='';
          window.onhashchange = function(e){
            if(e.oldURL.indexOf('#') > -1){
              x = e.oldURL.toString().split('#')[1];
              if(x.split('/')[1]){
                x = x.split('/')[0]+'1';
              }                      
              y = e.newURL.toString().split('#')[1];
              if(y.split('/')[1]){
                y = y.split('/')[0]+'1';
              }
              that.result = x+'to'+y;
            }
          };//End of function
      },
      changePage:function (page, backUrl, activeTabBar, flatTransition, showToolbars, swrAction, swlAction, pageTitle, noRefreshButton) {
            //use that = this pattern to pass this variable into closure
            var that = this;

            transitionDirection = 'flat';
            directions = {
              'friendstofriends1' : 'right',
              'friends1tofriends' : 'left',
              'toprofile1' : 'right',
              'profile1to' : 'left',
              'hometoprofile1' : 'right',
              'profile1tohome' : 'left',
              'feedtofeed1': 'right',
              'feed1tofeed' : 'left',
              'settingstoedit_profile' : 'right',
              'edit_profiletosettings' : 'left',
              'settingstoedit_profile_pic' : 'right',
              'edit_profile_pictosettings' : 'left',
              'settingstochange_pass' : 'right',
              'change_passtosettings' : 'left',
              'settingstoblocks' : 'right',
              'blockstosettings' : 'left',
              'logintosignup_one' : 'right',
              'signup_onetologin' : 'left',
              'feed1toprofile1' : 'left',
              'profile1tofeed1' : 'right',
              'info1tosettings' : 'left',
              'settingstoinfo1' : 'right',
              'signup_onetoinfo1' : 'right',
              'signup_onetosignup_two': 'right',
              'signup_twotosignup_one': 'left',
              'info1tosignup_one' : 'left'
            };
            if(this.result in directions){
              var transitionDirection = directions[this.result];
            }

            var outer_element = document.getElementById('content_wrapper');
            // var swipeleft = Hammer(outer_element).on('swipeleft', function(){
            //   if (typeof(swlAction)!== 'undefined'){
            //     window.location.hash = swlAction;
            //   } else if (typeof(backUrl)!== 'undefined'){
            //     window.location.hash = backUrl;
            //   }
            // });

            // var swiperight = Hammer(outer_element).on('swiperight', function(){
            //   if (typeof(swrAction)!== 'undefined'){
            //     window.location.hash = swrAction;
            //   }
            // });

            //Now check to see if showing toolbars is requested

            switch(showToolbars){
              case 1:
                //show neither header or footer
                $('.header').hide();
                $('.footer').hide();
                $('#content_wrapper').addClass("colored-background");
              break;
              case 2:
                //show just header not footer
                $('.header').show();
                $('.footer').hide();
                $('#content_wrapper').removeClass("colored-background");
              break;
              case 3:
                //show just footer not header
                $('.header').hide();
                $('.footer').show();
                $('#content_wrapper').removeClass("colored-background");
              break;
              default:
                //show both header and footer
                $('.header').show();
                $('.footer').show();
                $('#content_wrapper').removeClass("colored-background");
            }//end select statement

            //below check if the back button has been called, if not set to false
            if (typeof(backUrl)!=='undefined'){
              //first must check to see if back button already present
              $('.header .btn').unbind().remove();

              // console.log(backUrl);
              // this.slider.passStateHistory.push(backUrl);
              // this.slider.scrollHistory = [];

              $('.header').prepend('<a id ="back_button" class="btn animated fadeIn" title="Back"><img src="./assets/navigate-left.svg" alt="Back" title="Back"></a>');

              $('#back_button').on('click', function(e){
                // Make the back button send the user back to the previous page
                e.preventDefault();
                window.history.back();
              });
            }else{
              //otherwise remove the back button from the DOM if present and destroy all associated events

              $('.header .btn').unbind().remove();
            }

            //check to see if there is any suggested title, if not just place the logo there
            //remove current thing
            $('.page_title').unbind().remove();
            //check
            if (pageTitle){
              $('.header').append('<h1 class="page_title">' + pageTitle + '</h1>');
            }else{
              $('.header').append('<h1 class="page_title"><img alt="Blockhouse" src="./assets/logo.svg" /></h1>');
            }//end if for title

            //decide whether to remove refresh button
            if(!noRefreshButton){
              $('#header_refresh').unbind().remove();
              $('.header').append('<button id="header_refresh" class="ss-icon">&#x21BB;</button>');
            }else{
              $('#header_refresh').unbind().remove();
            }

            //set the pages to position absolute for page slider
            $('.page').css('position', 'absolute');
            //check if iscroll is initialised and if so, reflow the css after 'pageToAdded' and refresh
            //the iscroll object after 'pageTransitionComplete'
            // if (this.iscroll){
            //     $('body').on('pageToAdded', function(){
            //       page.offsetWidth; //reflow the css
            //     });
            //     $('body').on('pageTransitionComplete', function(){
            //       //put the pages back to position relative for iscroll
            //       $('.page').css('position', 'relative');
            //       that.iscroll.refresh();
            //   });
            //   //Below make sure that wherever the user is the next page is positioned at the top (first two zeroes- x,y) with an
            //   //animation transition of 0 seconds (third zero)
            //   // this.iscroll.scrollTo(0,0,0);
            // }//end of if statement to detect if this.iscroll instantiated
            //Now actually run the slide page function
            this.slider.slidePageDirection(page.$el, transitionDirection, backUrl);
            // this.iscroll.refresh();

            //Now finally set the active tab bar
            if(typeof(activeTabBar)!=='undefined'){
                $('.footer .active').removeClass('active');
                $('.footer ul li:nth-child('+ activeTabBar + ')').addClass('active');
            }//end if

        },
        //PAGES BELOW HERE
        home: function(){
          var homeview = new HomeView();
          this.changePage(homeview, undefined, 1, false, 4, undefined, '#feed');
        },
        friends: function(){
          var friendsView = new FriendsView();
          this.changePage(friendsView, undefined, 4, false, 4, '#feed', '#settings', 'Friends');
        },
        feed: function(){
          var feedView = new FeedView();
          this.changePage(feedView, undefined, 2, false, 4, '#home', '#friends', 'Local Feed');
        },
        settings: function(){
            var settingsView = new SettingsView();
            this.changePage(settingsView, undefined, 5, false, 4, '#friends', undefined, 'Settings', true);
        },
        profile: function(id){
          var profileView = new ProfileView({id: id});
          this.changePage(profileView, '#', 1, false, 4, '#', undefined, 'Profile');
        },
        friendProfile : function(id){
            var profileView = new ProfileView({id: id, category: "friend"});
            this.changePage(profileView, '#friends', 4, false, 4, '#friends', undefined, 'Profile');
        },
        editProfile: function(){
            var editProfileView = new EditProfileView();
            this.changePage(editProfileView, '#settings', 5, false, 4, '#settings', undefined, 'Edit Profile', true);   
        },
        editProfilePic: function(){
            var editProfilePicView = new EditProfilePicView();
            this.changePage(editProfilePicView, '#settings', 5, false, 4, '#settings', undefined, 'Edit Profile Pic', true);     
        },
        changePass: function(){
            var changePassView = new ChangePassView();
            this.changePage(changePassView, '#settings', 5, false, 4, '#settings', undefined, 'Change Password', true);        
        },
        blocks: function(){
            var blocksView = new BlocksView();
            this.changePage(blocksView, '#settings', 5, false, 4, '#settings', undefined, 'Blocks');   
        },
        info: function(show){
            var toolbar =4;
            if(show==1){
              toolbar = 2;
            }
            var infoView = new InfoView();
            this.changePage(infoView, '#settings', 5, false, toolbar, '#settings', undefined, 'Terms & Privacy', true);            
        },
        login: function(){
            var loginView = new LoginView();
            this.changePage(loginView, undefined, undefined, true, 1, undefined, undefined, undefined, true);
        },
        forceLogout: function(){
            var forceLogoutView = new ForceLogoutView();
            this.changePage(forceLogoutView, undefined, undefined, true, 2, undefined, undefined, undefined, true);
        },
        remoteKill: function(){
            var remoteKillView = new RemoteKillView();
            this.changePage(remoteKillView, undefined, undefined, true, 2, undefined, undefined, undefined, true);
        },
        signupOne: function(){
            var signupOneView = new SignupOneView();
            this.changePage(signupOneView, '#login', undefined, false, 2, '#login', undefined, "Signup", true);
        },
        signupTwo: function(){
            var signupTwoView = new SignupTwoView();
            this.changePage(signupTwoView, '#signup_one', undefined, false, 2, '#signup_one', undefined, "Signup", true); 
        },
        postDetail: function(id){
          var postDetailView = new PostDetailView({id: id});
          this.changePage(postDetailView, '#feed', 2, false, 4, '#feed', undefined, 'Post');
        },
        errorPage: function(id){
          var errorView = new ErrorView({id:id});
          this.changePage(errorView, undefined, undefined, true, 2, undefined, undefined, undefined, true);
        }

    });

    var initialize = function(){
      var router = new Router();
      Backbone.history.start();
    };

  return {
    initialize: initialize
  };

});