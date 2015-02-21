// ==UserScript==
// @name        InstaSynchP Bibby
// @namespace   InstaSynchP
// @description Bibby specific changes

// @version     1.0.1
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
}

Bibby.prototype.wallcounterNotification = function (video) {
  var wallcounter = window.plugins.wallcounter,
    message, counter;
  if (isUdef(wallcounter)) {
    //wallcounter not installed
    return;
  }
  counter = wallcounter.counter[video.addedby.toLowerCase()];
  if (isUdef(counter) || counter.duration < 60 * 60) {
    //nothing to report
    return;
  }
  message = 'Wallcounter {0}[{1} - {2}]'.format(
    counter.origName,
    window.utils.secondsToTime(counter.duration),
    counter.count);
  addErrorMessage(message);
};

UserSpy.prototype.postConnect = function () {
  "use strict";
  var th = this;
  if(window.room.roomName.toLowerCase() !== 'bibby'){
    return;
  }
  //add events after we connected so it doesn't spam the chat
  events.on(th, 'AddVideo', th.wallcounterNotification);
};


Bibby.prototype.resetVariables = function () {
  "use strict";
  var th = this;
  events.unbind('AddVideo', th.wallcounterNotification);
};

window.plugins = window.plugins || {};
window.plugins.bibby = new Bibby('1.0.1');
