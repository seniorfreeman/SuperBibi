import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Moving } from '../../api/collections/moving/moving.js';

import './franchises-template.jade';


Template.franchise_page.onCreated(function softOnCreated() {});

Template.franchise_page.helpers({
   usersFind: function() {
   		var users = Meteor.users.find({});
   		console.log(users);
        return users;
    }
});

Template.franchise_page.events({});
