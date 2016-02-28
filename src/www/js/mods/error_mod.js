/**
* Controls the application error bar. Allows errors to be shown and hidden
* with given timeouts.
*
* @class ErrorMod
* @constructor
*/ 
define([
	'jquery',
	'underscore'
], function($, _){
	"use strict";
	return{

		// Private vars
		_headerClass: "header",
		_entranceAnimationClass: "fadeIn",
		_exitAnimationClass: "fadeOut",
		_defaultTimeToShowErr: 6500,

		/**
		* Returns a handle to the error bar DOM object.
		*
		* @method obj
		* @return Handle to the error bar DOM object.
		*/
		obj: function(){
			return $('.error_bar');
		},

		/**
		* Shows the error bar with the specified message for the specified
		* time length. Automatically calls the hideError() method after timeout.
		*
		* @method showError
		* @param {string} message The message to display in the error bar.
		* @param {number} time The length of time to show the error bar for.
		*/
		showError: function(message, time){
			time = time || this._defaultTimeToShowErr;
			this.obj().unbind().remove();
			// Create a unique id for each error bar
			// That way, when we want to remove one we can remove the
			// correct one. We can still use the class to remove all error
			// objects at init however
			var id = Math.random().toString(36).replace(/[^a-z]+/g, '');
			// Create error object
			var error = "<div class='error_bar animated " + 
						this._entranceAnimationClass + 
						"' id='" +
						id + 
						"'><p>" +
						message +
						"</p></div>";

			$(error).insertAfter("." + this._headerClass);
			this.hideError(time, id);
		},

		/**
		* Hides the specified error bar after the specified timeout.
		*
		* @method hideError
		* @param {number} time The time to wait before hiding the error bar.
		* @param {number} id The ID of the error bar to hide.
		*/
		hideError: function(time, id){
			var that = this;
			setTimeout(function(){
				// create the specific error bar instance id
				var unique_id = '#' + id;
				$(unique_id).hide();
				$(unique_id).removeClass(this._entranceAnimationClass)
					.addClass(this._exitAnimationClass);
				$(unique_id).show();
				var deleteObj = function(){
					$(unique_id).unbind().remove();
				};
				//remove the element 
				setTimeout(deleteObj, 2500);
			}, time);
		}
	}; //end of return
});