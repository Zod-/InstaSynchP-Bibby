// ==UserScript==
// @name        InstaSynchP Bibby
// @namespace   InstaSynchP
// @description Bibby specific changes

// @version     1.0.9
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

Bibby.prototype.wallcounterNotificationOnce = function () {
  "use strict";
  var th = this,
    wallcounter = window.plugins.wallcounter;
  if (isUdef(wallcounter)) {
    return;
  }
  wallcounter.formatOutput = function (counts) {
    var output = "Wallcounter<br>";
    counts.forEach(function (count, index) {
      if (count.duration > 60 * 60) {
        output += count.format('<span style="color:red">{0}[<b>{1}</b> - {2}]</span> - ');
      } else {
        output += count.format('{0}[<b>{1}</b> - {2}] - ');
      }
      //2 counters per line
      if ((index + 1) % 2 === 0) {
        //remove " - "
        output = output.substring(0, output.length - 3);
        output += '<br>';
      }
    });
    //remove " - "
    if (counts.length % 2 === 1) {
      output = output.substring(0, output.length - 3);
    }
    return output;
  };
};

Bibby.prototype.checkCounter = function (video) {
  "use strict";
  var message, counter,
    wallcounter = window.plugins.wallcounter;
  //wallcounter not installed
  counter = wallcounter.counter[video.addedby.toLowerCase()];
  if (isUdef(counter) || counter.duration < 60 * 60) {
    //nothing to report
    return;
  }
  message = counter.format('Wallcounter {0}[{1} - {2}]');
  addErrorMessage(message);
};


Bibby.prototype.wallcounterNotification = function () {
  "use strict";
  var th = this,
    wallcounter = window.plugins.wallcounter;
  if (isUdef(wallcounter)) {
    return;
  }
  events.on(th, 'AddVideo', th.checkCounter);
};

Bibby.prototype.executeOnce = function () {
  "use strict";
  var th = this;
  th.isBibby = (window.room.roomName.toLowerCase() === 'bibby');
  if (!th.isBibby) {
    return;
  }
  th.wallcounterNotificationOnce();
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
  events.unbind('AddVideo', th.checkCounter);
};

window.plugins = window.plugins || {};
window.plugins.bibby = new Bibby('1.0.9');
