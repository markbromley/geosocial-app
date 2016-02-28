/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 */

 //define for Backbone
define(function () {

function PageSlider(container) {

    var container = container,
        currentPage,
        stateHistory = [];

    // Used to record the scroll position of previous pages
    this.scrollHistory = [];
    // this.passStateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page, flat) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page, flat);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left', flat);
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right', flat);
        }

    };

    this.slidePageDirection = function(page, from, backUrlPresent){
        // console.log(page);
        if(currentPage){
            // console.log(currentPage[0].scrollTop);
            this.backUrlPresent = backUrlPresent;

            // console.log(this.passStateHistory);
        }


        if(from == 'flat'){
            this.slidePageFrom(page, 'left', true);
        }else{
            this.slidePageFrom(page, from, false);
        }
    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from, flat) {

        container.prepend(page);
        //Below trigger for the Router.js changePage function to use as hook for CSS reflow
        $('body').trigger("pageToAdded");


        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        //below check if transition required (i.e. flat===true)
        // Position the page at the starting position of the animation
        if (flat===true){
            page.attr("class", "page flat");
        }else{
            page.attr("class", "page " + from);
        }//end of if

        currentPage.one('webkitTransitionEnd', function(e) {
            $(e.target).remove();
            //Below trigger for the iScroll object to use as hook for refresh method
            $('body').trigger("pageTransitionComplete");

        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        
        //check if the transition is set to occur (i.e. flat === undefined)
        //else use the flat transition class
        if (flat===true){
            currentPage.attr("class", "page transition flat");
            //force fire the transition end event for the current page
            //this triggers above code
            currentPage.trigger("webkitTransitionEnd");
        }else
        {
            currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        }//end of if

        if(this.scrollHistory.length > 0){
            // console.log('Trying now' + this.scrollHistory);
            // console.log(page);
            var curIndex = this.scrollHistory.length -1;
            // console.log('CURRENT: ' + this.scrollHistory[curIndex]);
            page[0].scrollTop = this.scrollHistory[curIndex];
            this.scrollHistory.pop();

        }
        if(this.backUrlPresent){
            this.scrollHistory.push(currentPage[0].scrollTop);
        }
        this.backUrlPresent = null;
        // console.log(this.scrollHistory);


        currentPage = page;
    };

}

// by MARKY MARK
return PageSlider;
});