// ==UserScript==
// @name        InstaSynchP Bibby
// @namespace   InstaSynchP
// @description Bibby specific changes

// @version     1.0.3
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
      var text = "{0}[<b>{2}</b> - {1}] - ";
      if (count.duration > 60 * 60) {
        text = '<span style="color:red">{0}[<b>{2}</b> - {1}]</span> - ';
      }
      output += text.format(
        count.origName,
        count.count,
        utils.secondsToTime(count.duration)
      );
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

Bibby.prototype.wallcounterNotification = function () {
  "use strict";
  var th = this,
    wallcounter = window.plugins.wallcounter;
  if (isUdef(wallcounter)) {
    return;
  }

  function checkCounter(video) {
    var message, counter;
    //wallcounter not installed
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
  }

  events.on(th, 'AddVideo', checkCounter);
};

Bibby.prototype.executeOnce = function () {
  "use strict";
  var th = this;
  th.wallcounterNotificationOnce();
};

Bibby.prototype.postConnect = function () {
  "use strict";
  var th = this;
  if (window.room.roomName.toLowerCase() !== 'bibby') {
    return;
  }
  th.wallcounterNotification();
};


Bibby.prototype.resetVariables = function () {
  "use strict";
  var th = this;
  events.unbind('AddVideo', th.wallcounterNotification);
};

window.plugins = window.plugins || {};
window.plugins.bibby = new Bibby('1.0.3');
