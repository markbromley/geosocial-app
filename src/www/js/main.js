require.config({
    baseUrl: "",
    paths:{
        'text': 'js/libs/text/text',
        'jquery': 'js/libs/intel-appframework/appframework',
        'underscore': 'js/libs/underscore/underscore-min',
        'backbone': 'js/internal-libs/bb_adapt',
        'fastclick' : 'js/libs/fastclick/lib/fastclick',
        'pageslider' : 'js/internal-libs/pageslider',
        'backbonesubviews': 'js/libs/backbonesubviews',
        'bbvalidation': 'js/libs/backbone.validation/src/backbone-validation-amd'
    },
    waitSeconds: 500,
    shim:{
        'jquery' : {
             'exports':'$'
          },
        'pageslider':{
            'deps':['jquery'],
            'exports':'PageSlider'
        },
        'backbonesubviews':{
            'deps':['backbone']
        }
    },
    //below for dev purposes-- allows to refresh url append to datetimes stamp and prevent default caching when in Webkit browser
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['jquery', 'underscore', 'backbone','js/app'
],function($, _, Backbone, App){
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady(){
            App.initialize();

        }

        //currently force trigger for development only
        if(navigator.globalization===undefined){
            $(document).trigger('deviceready');
        }

});