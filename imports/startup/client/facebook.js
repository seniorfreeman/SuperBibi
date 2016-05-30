import {FBInvitFriends} from '../../api/collections/profile/profile.js';

import { Session } from 'meteor/session'
import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor'
import { EJSON } from 'meteor/ejson'
import { Tracker } from 'meteor/tracker'

Meteor.startup( function() {
  Tracker.autorun(function() {
      if(Meteor.userId()) {
          Meteor.call('getAccessToken', function(error, token) {
            if(token) {
              accessToken = token;
              Session.set('accessToken', token);
              HTTP.get( 'https://graph.facebook.com/v2.6/' + Meteor.user().profile.serviceId + '/invitable_friends?fields=name,picture&limit=1000&access_token=' + accessToken, { /* options */ }, function (error, result) { 
                if(!error && result.statusCode == 200) {
                  result = EJSON.parse(result.content);
                  for(var idx in result.data) {
                    FBInvitFriends.insert(result.data[idx]);
                  }
                }
              });
            }
          });
      }
  });
  
});