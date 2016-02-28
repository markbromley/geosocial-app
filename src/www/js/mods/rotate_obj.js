/**
* Helps with modifying rotation values on an object.
*
* @class RotateObj
* @constructor
*/ 
define([
    "jquery"
], function($){
    "use strict";
    return{
        // Private Vars
        _rotateClassPrefix: "rotate_",
        _rotateFullGroupClass: "rotate_0 rotate_1 rotate_2 rotate_3",
        
        /**
        * The current rotation value.
        * 
        * @property _rotationValue
        * @type {number}
        */
        _rotationValue: 0,

        /**
        * Takes an object and rotation integer and performs the rotation on
        * the object.
        *
        * @method
        * @param {object} obj The object to rotate.
        * @param {number} rotateParam The number of times (PI/4) to rotate.
        */
        rotateObj: function(obj, rotateParam){
            if(this._rotationValue >= 3){
                this._rotationValue = 0;
            }else{
                this._rotationValue += 1;
            }
            var new_class = this._rotationValue.toString();
                new_class = this._rotateClassPrefix + new_class;
            obj.removeClass(this._rotateFullGroupClass);
            obj.addClass(new_class);
        },

        /**
        * Gets the rotation value.
        *
        * @method getRotateVal
        * @return The rotation value.
        */
        getRotateVal: function(){
            return this._rotationValue;
        }
    };// end of return object
});