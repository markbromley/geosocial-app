/**
* Terms & Conditions View.
*
* @class TermsView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/terms_page.html"
], function($, _, Backbone, termsPage){
    "use strict";
    var TermsView = Backbone.View.extend({

        template: _.template(termsPage),

        /**
        * Sets up the view.
        *
        * @method initialize
        */
        initialize: function(){
            this.render();
        },

        /**
        * Renders the terms view.
        *
        * @method render
        */
        render: function(){
            this.$el.html(this.template());
            return this;
        }
    });
    return TermsView;
});