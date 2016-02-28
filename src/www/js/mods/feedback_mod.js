/**
* Feedback View. Displays small feedback view to user indicating success
* or failure (usually for a user interaction).
*
* @class FeedbackMod
* @constructor
*/ 
define(
[
    "jquery",
    "underscore"
], function($,_){
    "use strict";
    return{
        // Private vars
        _feedbackboxElem: function(){
            return $(".feedback_box");
        },
        _feedbackDoneIcon: "&#x1F44D",
        _feedbackDoneMessage : "Done",
        _feedbackErrorIcon: "&#x1F44E",
        _feedbackErrorMessage: "Error",

        _showClass: "fadeIn",
        _hideClass: "fadeOut",

        _headerClass: "header",

        /**
        * Generates a HTML string containing the icon and message supplied.
        *
        * @method _createFeedbackMessage
        * @param {string} icon
        * @param {string} message
        * @return The HTML string.
        */
        _createFeedbackMessage: function(icon, message){
            return "<div class='feedback_box animated fadeIn'><p class='ss-icon'>" +
                    icon + "</p><p>" + message + 
                    "</p></div>";
        },

        /**
        * Displays the feedback view to the user.
        *
        * @method showFeedback
        * @param {boolean} success A flag to indicate if the action was
                 successful. Determines the message displayed to the user.
        * @param {number} time The time to wait in seconds before hiding the
        *        feedback message. 
        */
        showFeedback: function(success, time){
            var feedback_message, feedback_icon, feedback;

            if (time===undefined){
                time = 1500;
            }
            this._feedbackboxElem().unbind().remove();

            if (success){
                feedback_icon = this._feedbackDoneIcon;
                feedback_message = this._feedbackDoneMessage;
            }else{
                feedback_icon = this._feedbackErrorIcon;
                feedback_message = this._feedbackErrorMessage;
            }
            feedback = this._createFeedbackMessage(feedback_icon, feedback_message);
            $(feedback).insertAfter("." + this._headerClass);

            setTimeout(_.bind(this.hideFeedback, this), time);
        },

        /**
        * Hides the feedback view and deletes the root HTML element.
        *
        * @method hideFeedback
        */
        hideFeedback: function(){
            this._feedbackboxElem().hide();
            this._feedbackboxElem().removeClass(this._showClass).addClass(this._hideClass);
            this._feedbackboxElem().show();
            var deleteObj = function(){
                this._feedbackboxElem().unbind().remove();
            };
            // Remove the element 
            setTimeout(deleteObj, 2000);
        }
    }; //end of return
});