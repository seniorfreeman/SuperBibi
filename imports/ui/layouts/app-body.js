import './app-body.html';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';



import '../components/loading.js';

const CONNECTION_ISSUE_TIMEOUT = 5000;

// A store which is local to this file?
const showConnectionIssue = new ReactiveVar(false);

Meteor.startup(() => {
  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(() => {
    // FIXME:
    // Launch screen handle created in lib/router.js
    // dataReadyHold.release();

    // Show the connection error box
    showConnectionIssue.set(true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.App_body.onCreated(function appBodyOnCreated() {

});

Template.App_body.helpers({

  connected() {
    if (showConnectionIssue.get()) {
      return Meteor.status().connected;
    }

    return true;
  },
});

Template.App_body.events({
  'click *'(event) {
    if(!$(event.target).parents().is("aside") && $('body').hasClass("aside")){
      $('body').removeClass('aside');
    }
  },
  'click nav'(event) {
    if($('body').hasClass("soft")){
      $('body').removeClass('soft');
    }
  },  
  'click .js-logout'() {
    Meteor.logout();
    FlowRouter.go('App.home');
    document.location.reload(true);
  },
  'click .section'(){
    if($('body').not('.aside')) return false;
    $('body').removeClasse('aside');
  },
  'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({ },function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },
});
