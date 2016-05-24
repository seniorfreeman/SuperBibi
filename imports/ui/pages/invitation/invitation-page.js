import './invitation-page.jade'

import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.invitation_page.onCreated(function() {

});

Template.invitation_page.helpers({

});

Template.invitation_page.events({
	'submit form': function(event, template) {
		event.preventDefault();
		if(template.data.params && template.$('input').val() != '') {
			var params = template.data.params();
		    Meteor.call('createInvitedUser', params.mail, template.$('input').val(), params.token, function(error, result) {
		    	if(!error) {
		    		Meteor.loginWithPassword(params.mail, template.$('input').val(), function(err, res) {
		    			if(!err) {
		    				FlowRouter.go('/');
		    			}
		    		});
		    	}
		    	else
		    		console.log(error)
		    });
		}
	}
});