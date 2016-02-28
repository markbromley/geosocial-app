define(['jquery',
        'underscore',
        'js/bkgd/local_storage_mod',
        'js/bkgd/session_storage_mod'
],function ($,_, perStore, tmpStore) {

newSync = function(method, model, options){
    //Declare function variables
    var value, url, encodedUrl;

    //below get the url - the underscore method checks if it's a function and invokes it to return the value if it is, otherwise, it just takes the value
    url = _.result(model, 'url');

    //below encode the url to base64- this makes it a bit tidier and more consistent
    if(url){
        encodedUrl = btoa(url + window.location.href);
    }else{
        encodedUrl = '';
    }//end of url encode

    //add the encoded URL and the latest URL to session storage for use by refresh methods etc...
    // if(url == 'http://192.168.1.243:8080/live-data')
    if(url.split("/").pop() != 'live-data'){
        tmpStore.setItem('latestTempEncodeUrl', encodedUrl);
        tmpStore.setItem('latestTempUrl', url);
    }
    
    function saveModel(id, data){
        perStore.setItem(id, data);
    }

    function checkMatch(origID, newId){
        if(origID === newId){
            return true;
        }else{
            return false;
        }
    }//end func

    function isDataStale(urlId, newData){
        //returns true if the data in local storage needs to be updated with the server data
        modCheck = perStore.getItem(urlId);
        newData = JSON.stringify(newData);
        //check if the model exists at all
        if(modCheck){
            if(modCheck == newData){
                return false;
            }else{
                return true;
            }//inner if end
        }else{
            return true;
        }
    }

    //check if its a read
    if(method === 'read'){
        //store the calling codes success callback functions
        var origSuccess, origErr;
            origSuccess = options.success;
            origErr = options.error;

        //cordova  below - use the local storage module
        value = perStore.getItem(encodedUrl);

        //below if there's a value in the localstorage use that
        if(value){
            value = JSON.parse(value);
            //call the succes function with a server 200 response
            origSuccess(value, 200);
            //after getting the value and returning the stored value, call the real sync and update the stored model as necessary
            //Replace the success function with the saveModel function for next stage

            // If the API has been provided with a postRender (afterSuccess)
            // method, call it once the full ajax has finished and update the
            // view
            if(options.afterSuccess){
                var reDisplay = options.afterSuccess;
                options.success = function(resp, status, xhr){
                    saveModel(encodedUrl, JSON.stringify(resp));
                    reDisplay(resp);
                };
            }else{
                options.success = function(resp, status, xhr){
                    saveModel(encodedUrl, JSON.stringify(resp));
                };
            }

            Backbone.sync(method, model, options);
        }else{//else if there's no value in the current store get from server and save
            //use Backbone sync
            options.success = function(resp, status, xhr){
                saveModel(encodedUrl, JSON.stringify(resp));
                origSuccess(resp, status, xhr);
            };

            Backbone.sync(method, model, options);
        }//end inner if
    }else{
        //if it's not a read request then, just use the default Backbone sync method
        Backbone.sync(method, model, options);
    }//end if
    
};//end of new Backbone sync function

return newSync;

});

