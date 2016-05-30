import './amis-page.jade';
import '../../components/partner-item.jade';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import {Todo} from '../../../api/collections/todo/todo.js';
import {Movers} from '../../../api/collections/profile/profile.js';
import {CoMovers} from '../../../api/collections/profile/profile.js';
import {FBInvitFriends} from '../../../api/collections/profile/profile.js';
import {Partners} from '../../../api/collections/global/global.js';
import {validateEmail} from '../../lib/errors.js';



import {
  addFriend,
  removeFriend,
  addTodoFriend,
  addCoMover,
  removeCoMover
} from '../../../api/collections/profile/methods.js';
import { HTTP } from 'meteor/http'

/*----------------------- Page Amis --------------------------*/
Template.amis_page.onCreated(function() {
  Meteor.subscribe('userData');
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
          Modal.show('invit_message_modal', {mode: 'friend', mail: input.val()});
          /*addFriend.call({mail: input.val()}, function (error, result) { 
            template.$('input').val('');
          });*/
        }
        else {
          addFriend.call({name: input.val()}, function (error, result) { 
            template.$('input').val('');
          });
        }
        return false;
    }
  },
  'click li.new': function(event, template) {
    Modal.show('add_co_mover_modal');
  }
});


Template.amis_page.helpers({
	todos: function() {
		return Todo.find();
	},
  coMovers: function() {
    return CoMovers.find();
  },
  movers: function() {
    return Movers.find();
  },
  partners: function() {
    return Partners.find({id:1});
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

Template.admin_friend_item.events({
  'click button': function(event, template) {
    removeCoMover.call({name: template.data.name, mail: template.data.mail, invite_token: template.data.invite_token, id: template.data.id}, function (error, result) { 
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

Template.mover_friend_item.events({
    'click button.delete': function(event, template) {
      removeFriend.call({name: template.data.name, mail: template.data.mail, invite_token: template.data.invite_token}, function (error, result) { 
      });
    },
    'click button.resend': function(event, template) {
      //Meteor.call('sendMailRequestToAFriend', template.data.mail, function(error, result) {});
      Modal.show('invit_message_modal', {mode: 'friend', mail: template.data.mail, resend: true});
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
  },
  isPending: function() {
    return this.state == "pending";
  }
});




/*--------------------------------------------------------*/




/*----------------------- Participant aux tâches --------------------------*/

Template.task_item.helpers({});

/*--------------------------------------------------------*/




/*----------------------- Partenaire --------------------------*/

Template.partner_item.onRendered(function() {});

/*--------------------------------------------------------*/