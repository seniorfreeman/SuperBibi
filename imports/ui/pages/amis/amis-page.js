import './amis-page.jade';

import { Session } from 'meteor/session'
import {Todos} from '../../../api/collections/collections.js';
import {Movers} from '../../../api/collections/collections.js';
import {CoMovers} from '../../../api/collections/collections.js';
import {FBInvitFriends} from '../../../api/collections/collections.js';
import {Partners} from '../../../api/collections/collections.js';
import {validateEmail} from '../../lib/errors.js';
import {
  addFriend,
  removeFriend,
  addCoMover,
  removeCoMover
} from '../../../api/collections/methods.js';
import { HTTP } from 'meteor/http'

/*----------------------- Page Amis --------------------------*/
Template.amis_page.onCreated(function() {
  Meteor.subscribe('movers');
  Meteor.subscribe('coMovers');
  Meteor.subscribe('partners');
});

Template.amis_page.events({
  "autocompleteselect input": function(event, template, doc) {
    console.log(Session.get('accessToken'))
    console.log(doc)
    HTTP.post( 'https://graph.facebook.com/v2.6/' + Meteor.user().profile.serviceId + '/apprequests?access_token=' + Session.get('accessToken') + '&message=Salut dis moi si tu lis ca&to=' + doc.id, {  }, function (error, result) { 
      console.log(error)
      console.log(result)
    });
    addFriend.call({name: doc.name, picture: doc.picture.data.url, invite_token: doc.id}, function (error, result) { 
      template.$('input').val('');
    });
  },
  'keyup input': function(event, template) {
    var input = template.$('input');
    if (event.keyCode == 13 && input.val() != '' && template.$('.-autocomplete-container').children().length == 0) {
        event.stopPropagation();
        if(validateEmail(input.val())) {
          addFriend.call({mail: input.val()}, function (error, result) { 
            template.$('input').val('');
          });
        }
        else {
          addFriend.call({name: input.val()}, function (error, result) { 
            template.$('input').val('');
          });
        }
        return false;
    }
  },
  'click .admin-block li.new': function(event, template) {
    Modal.show('add_co_mover_modal');
  }
});


Template.amis_page.helpers({
	todos: function() {
		return Todos.find();
	},
  coMovers: function() {
    return CoMovers.find();
  },
  movers: function() {
    return Movers.find();
  },
  partners: function() {
    return Partners.find();
  },
  settings: function() {
    return {
    position: 'bottom',
    limit: 10,
    rules: [
      {
        // token: '',
        collection: FBInvitFriends,
        field: 'name',
        matchAll: false,
        template: Template.friend_item,
        noMatchTemplate: Template.friend_no_match
      }
    ]
    };
  }
});

/*--------------------------------------------------------*/




/*----------------------- Co-déménagé --------------------------*/

Template.admin_friend_item.onRendered(function() {
	this.$('button').hide();
});

Template.admin_friend_item.events({
	'mouseover > li': function(event, template) {
    template.$('button').show();
  },
  'mouseout > li': function(event, template) {
    template.$('button').hide();
  },
  'click button': function(event, template) {
    removeCoMover.call({name: template.data.name, mail: template.data.mail, invite_token: template.data.invite_token}, function (error, result) { 
    });
  }
});

Template.admin_friend_item.helpers({
  isOk: function() {
    return this.state == "accepted";
  },
  isNotOk: function() {
    return this.state == "refused";
  },
  pending: function() {
    return this.state == "pending";
  }
});

/*--------------------------------------------------------*/




/*----------------------- Déménageur --------------------------*/

Template.mover_friend_item.onRendered(function() {
	this.$('button').hide();
});

Template.mover_friend_item.events({
	'mouseover > li': function(event, template) {
      template.$('button').show();
    },
    'mouseout > li': function(event, template) {
      template.$('button').hide();
    },
    'click button': function(event, template) {
      removeFriend.call({name: template.data.name, mail: template.data.mail, invite_token: template.data.invite_token}, function (error, result) { 
      });
    }
});

Template.mover_friend_item.helpers({
  isMailOrInvitation: function() {
    if(this.invite_token || this.mail)
      return true;
    else
      return false;
  },
  state: function() {
    if(this.state == "accepted") {
      return TAPi18n.__('accepted');
    }
    else if(this.state == "refused") {
      return TAPi18n.__('refused');
    }
    else if(this.state == "pending") {
      return TAPi18n.__('pending');
    }
  }
});




/*--------------------------------------------------------*/




/*----------------------- Participant aux tâches --------------------------*/

Template.task_item.onRendered(function() {
	this.$('.go-to-task').hide();
});

Template.task_item.events({
	'mouseover > li': function(event, template) {
      template.$('.go-to-task').show();
    },
    'mouseout > li': function(event, template) {
      template.$('.go-to-task').hide();
    }
});

Template.task_item.helpers({
});

/*--------------------------------------------------------*/




/*----------------------- Partenaire --------------------------*/

Template.partner_item.onRendered(function() {
	
});

/*--------------------------------------------------------*/


/*----------------------- Modal nouveau co-déménageur --------------------------*/

Template.add_co_mover_modal.onRendered(function() {
    Session.set('add_co_mover_modal_input_facebook', null);
    Session.set('add_co_mover_modal_input', null);
});

Template.add_co_mover_modal.helpers({
  settings: function() {
    return {
    position: 'bottom',
    limit: 10,
    rules: [
      {
        // token: '',
        collection: FBInvitFriends,
        field: 'name',
        matchAll: false,
        template: Template.friend_item,
        noMatchTemplate: Template.friend_no_match
      }
    ]
    };
  }
});

Template.add_co_mover_modal.events({
  'click footer button.rouge': function(event, template) {
    Modal.hide();
  },
  'click footer button.vert': function(event, template) {
    var fbFriend = Session.get('add_co_mover_modal_input_facebook');
    if(fbFriend != null) {
      addCoMover.call({name: fbFriend.name, picture: fbFriend.picture.data.url, invite_token: fbFriend.id}, function (error, result) { 
        Modal.hide();
      });
    }
    else {
      var input = template.$('input');
      if(validateEmail(input.val())) {
        addCoMover.call({mail: input.val()}, function (error, result) { 
          Modal.hide();
        });
      }
      else {
        addCoMover.call({name: input.val()}, function (error, result) { 
          Modal.hide();
        });
      }
    }
  },
  "autocompleteselect input": function(event, template, doc) {
    Session.set('add_co_mover_modal_input_facebook', doc)
    Session.set('add_co_mover_modal_input', template.$('input').val());
  },
  'keyup input': function(event, template) {
    if(template.$('input').val() != Session.get('add_co_mover_modal_input')) {
      Session.set('add_co_mover_modal_input_facebook', null);
    }
  }
});

/*--------------------------------------------------------*/