/**
* Creates a popover widget responsible for selecting from a predefined set of
* options. Provides callback with the selected option.
*
* @class PopoverMod
* @constructor
*/ 
define([
"jquery"
], function($){
    "use strict";
    return{
            /**
            * Fired when a button for the popover widget is tapped.
            *
            * @event buttonClickedEvent
            */
            buttonClickedEvent: "buttonClicked",

            /**
            * Returns the popover selector.
            *
            * @method popoverSelector
            * @return The popover selector.
            */
            popoverSelector: function(){
                return $(".popover");
            },

            // Private vars
            _popoverInnerSelector: function(){
                return $(".popover_inner");
            },
            _popoverInnerButtonSelector: function(){
                return $(".popover_inner .btn");
            },
            _popoverButtonSelector: function(){
                return $(".popover .btn");
            },
            _popoverCancelButtonSelector: function(){
                return $(".popover .cancel_btn");
            },
            _getButtonHtmlString : function(name){
                return "<button class='btn'>" + name + "</button>";
            },
            _hideClass : "hide fadeOut",
            _animateClass : "animated",
            _animateOutClass: "bounceOutDown",
            _animateInClass : "inUp",
            _fadeInClass: "fadeIn",

            /**
            * Shows a new popover widget with the buttons specified by the
            * given array.
            *
            * @method showPopover
            * @param {object} e Default event.
            * @param {array} buttons The ordered list of button names (strings).
            * @return The popover object.
            */
            showPopover: function(e, buttons){
                var that, pop, popInn;
                // Don't reload the page & cache selectors
                e.preventDefault();
                that = this;
                pop = this.popoverSelector();
                popInn = this._popoverInnerSelector();

                // Add the buttons
                for (var button in buttons){
                    popInn.prepend(this._getButtonHtmlString(buttons[button]));
                }
                
                // Show the popover
                pop.removeClass(this._hideClass)
                    .addClass(this._animateClass).hide();
                popInn.removeClass(this._animateOutClass)
                    .addClass(this._animateInClass).hide();

                // Return button number
                this._popoverButtonSelector().on("click", function(e){
                    e.preventDefault();
                    // Get the index of the button where cancel is 1 etc
                    var par = that._popoverInnerButtonSelector();
                    var count = par.length - par.index(this);
                    that.hidePopover();
                    pop.trigger(that.buttonClickedEvent,count);
                });

                this._popoverCancelButtonSelector().on("click", function(e){
                    e.preventDefault();
                    that.hidePopover();
                });

                popInn.show();
                pop.show();
                return pop;
            },

            /**
            * Hides the popover widget and removes any associated callbacks.
            *
            * @method hidePopover
            * @param {object} e The default event object.
            */
            hidePopover: function(e){
                // Cache selector
                var pop = this.popoverSelector();
                this._popoverInnerButtonSelector().unbind().remove();
                pop.removeClass(this._fadeInClass);
                pop.show().hide();
                // Remove any of the associations made to the widget by 
                // views implementing it
                this._popoverInnerSelector().unbind();
            }
    };// end of return
});