import { Session } from 'meteor/session'
import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor'
import { EJSON } from 'meteor/ejson'
import { Tracker } from 'meteor/tracker'

Meteor.startup( function() {
  Tracker.autorun(function() {
      if(Meteor.userId()) {
          Meteor.call("getAgenceInformations", "FRA99A", function(error, res) {
            if(res.data) {
              Session.set('adaCellPhone', res.data.tel);
              Session.set('adaSchedules', res.data.horaires);
            }
          });
      }
  });
  
});