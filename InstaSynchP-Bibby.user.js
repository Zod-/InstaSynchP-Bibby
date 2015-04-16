// ==UserScript==
// @name        InstaSynchP Bibby
// @namespace   InstaSynchP
// @description Bibby specific changes

// @version     1.1.0
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Bibby
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// ==/UserScript==

function Bibby(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Bibby';
  this.settings = [{
    'label': 'Wallcounter limit notifications',
    'id': 'wallcounter-hide',
    'type': 'checkbox',
    'default': false,
    'section': ['Bibby']
  }];
  this.isBibby = false;
}

Bibby.prototype.overwriteWallCreateFormat = function () {
  "use strict";
  var th = this,
    wallcounter = window.plugins.wallcounter;
  if (isUdef(wallcounter)) {
    return;
  }
  var oldCreateFormat = wallcounter.Wall.prototype.createFormat;
  wallcounter.Wall.prototype.createFormat = function () {
    var thth = this;
    if (thth.duration > 60 * 60) {
      return '<span style="color:red">' + oldCreateFormat.apply(thth, arguments) + '</span>';
    } else {
      return oldCreateFormat.apply(thth, arguments);
    }
  };
};

Bibby.prototype.checkWall = function (video) {
  "use strict";
  var message;
  var wall;
  var wallcounter = window.plugins.wallcounter;
  var addedby = video.addedby.toLowerCase();

  if (isUdef(wallcounter) || thisUser().username.toLowerCase() === addedby) {
    return;
  }
  wall = wallcounter.getWallsForUsernames(addedby)[0];
  if (wall.duration < 60 * 60) {
    return;
  }
  message = wall.format('Wallcounter {0}', '{1}', '{2}');
  addErrorMessage(message);
};


Bibby.prototype.wallcounterNotification = function () {
  "use strict";
  var th = this;
  events.on(th, 'AddVideo', th.checkWall);
};

Bibby.prototype.executeOnce = function () {
  "use strict";
  var th = this;
  th.isBibby = (window.room.roomName.toLowerCase() === 'bibby');
  if (!th.isBibby) {
    return;
  }
  th.overwriteWallCreateFormat();
};

Bibby.prototype.postConnect = function () {
  "use strict";
  var th = this;
  if (!th.isBibby) {
    return;
  }
  th.wallcounterNotification();
};


Bibby.prototype.resetVariables = function () {
  "use strict";
  var th = this;
  events.unbind('AddVideo', th.checkWall);
};

window.plugins = window.plugins || {};
window.plugins.bibby = new Bibby('1.1.0');
