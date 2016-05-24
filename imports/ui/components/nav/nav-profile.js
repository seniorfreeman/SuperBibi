import './nav-profile.jade';
import { Meteor } from 'meteor/meteor'
import {CoMovers} from '../../../api/collections/collections.js';

Template.nav_profile.onCreated(function() {
	Meteor.subscribe('coMovers');
});

Template.nav_profile.helpers({
  user: function() {
    return Meteor.user();
  },
  coMovers: function() {
  	return CoMovers.find();
  }
});

Template.nav_profile.events({
  "click #adminLists li.add": function(event, template) {
  	Modal.show('add_co_mover_modal');
  }
});
