# Backbone-subview - Simple subview manager
[![Build Status](https://travis-ci.org/ValeriiVasin/backbone-subview.svg?branch=master)](https://travis-ci.org/ValeriiVasin/backbone-subview)


# Benefits
* Automatically cleans up subviews when a parent view is removed
* Simplified communication between views in hierarchy (from child to parent)

# Installation
NPM:
```
npm install backbone-subview --save
```

Bower:
```bash
bower install backbone-subview --save
```

# Usage
Extend base view with `backbone-subview`:

```js
var Backbone = require('backbone');
var BackboneSubview = require('backbone-subview');

var View = Backbone.View.extend(BackboneSubview);

module.exports = View;
```

## intiSubview(SubView:Backbone.View[, options:Object][, params: Object])
Instantiate subviews inside the view, where:

* `SubView` - child view
* `options` - usual Backbone.View options, e.g. `el`, `model`, `collection` etc.
* `params` - subview initialization params, see below

```js
// file: ListView.js

// base view
var View = require('lib/view');
var ListItemView = require('./ListItem');

var ListView = View.extend({
  tagName: 'ul',

  render: function() {
    this.collection.each(function(model) {
      this.$el.append(
        // initialize subview and add it to the DOM
        this.initSubview(ListItemView, { model: model })
          .render().el
      );
    }, this);
  }
});
```

Available `params`:

`params.remove`: `true|false|'content'` - remove strategy that will be used to remove subview (when `.remove()` method of the subview or `.destroySubviews()` of the parent view is called). Default - **true**.

`true` - usual view .remove() strategy - undelegates events and removes view root element. Should be used when subview creates own root element.

`false` - undelegates events and **does not** affect layout. Should be used if subview, for example, - just listens to events on existed layout.

`'content'` - undelegates events and destroy content inside of root view element. Root view element **will not** be removed. Should be used when subview is initialized in the placeholder inside of the parent view, which should not be removed after subview is. For example, to allow render subview again.

```js
var ProfileHeaderView = require('./ProfileHeaderView');
var KeyNavigationView = require('./KeyNavigation');

var ProfileView = View.extend({
  render: function() {

    // placeholder for profile header view is already on the page
    // cleanup only content after .destroySubviews() will be called
    this.initSubview(ProfileHeaderView, {
      el: this.$('.js-profile-header')
    }, { remove: 'content' }).render();

    // KeyNavigationView is applied for whole profile view and just tracks
    // keypresses. It just adds events to provided element and should not affect
    // layout after remove
    this.initSubview(KeyNavigationView, { el: this.el }, { remove: false });
  }
});
```

If all subviews are instantiated this way - it is possible to control their life cycle and properly remove all of them if view is destroyed.

## In-component communication
By default, using Backbone, it is possible to `listenTo` view events only in direct parent view. And it's not possible to listen to any nested subviews events deeper. With `backbone-subview` it is possible to listen to any triggered child events using `bubbleEvents`.

```js
// Search.js
var SearchView = View.extend({
  // listen to subviews events
  bubbleEvents: {
    'UserSearchResult:selectUser': '_onUserSearchResultSelected'
  },

  _onUserSearchResultSelected: function(payload) {
    // do smth with user `payload.user`
  }
});

// UserSearchResultView.js - deep nested view
var UserSearchResultView = View.extend({
  events: {
    'click': '_onSearchResultClick'
  },

  _onSearchResultClick: function() {
    // trigger event that could be handled by any parent view
    this.trigger('UserSearchResult:selectUser', { user: this.model });
  }
});
```

`bubbleEvents` allows to listen to child events without extra pain. Child events will be automatically proxied to any parent view that requests them, like DOM events.

Global event bus is not needed for in-component communication and views are more isolated.

**Notice:** Bubble events handlers will be automatically bound to `this` as usual Backbone events handlers.

**Notice:** All subviews should be created with `this.initSubview()`, otherwise child/parent channel will be lost and communication will not be possible.

**Best practices**

* It is better to prefix all view events with the `View` namespace. It helps to understand from what nested subview the event is coming.
* It is better to use object for the payload. This will allow to extend payload without any issues in the future.

## destroySubviews([Backbone.View|Array(Backbone.View)])
Destroy all instantiated subviews:

```js
this.destroySubviews();
```

or exact subview:

```js
this.destroySubviews(this._subview.popover);
```

or few subviews:

```js
this.destroySubviews([this._subview.popover, this._subview.profile]);
```

During the destroy `.remove()` method will be called for each subview that is going to be destroyed.

Example:

```js
var ItemView = require('./ItemView');
var ListView = View.extend({
  template: listViewTemplateFn,

  render: function() {
    // destroy all subviews
    this.destroySubviews();

    // render markup
    this.$el.html(
      this.template({ item: this.model.toJSON() })
    );

    // instantiate subview
    this.initSubview(ItemView, {
      el: this.$('.js-selector')
    });
  }
});
```

**Notice:** Subview will be automatically destroyed if `remove()` is called on parent view.
