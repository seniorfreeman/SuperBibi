import './invit-message-modal.jade';

import { Todo } from '../../../api/collections/todo/todo.js';
import {
  addFriend,
  addCoMover,
  updateInvitFriendMessage,
  updateInvitCoMoverMessage
} from '../../../api/collections/profile/methods.js';
import {
  addTodoFriend,
  updateInvitTodoFriendMessage
} from '../../../api/collections/todo/methods.js';


Template.invit_message_modal.helpers({
  defaultMessage: function() {
    var user = Meteor.user();
    if(user) {
      if(this.mode == 'friend') {
        if(user.profile.moverInvitationMessage)
          return user.profile.moverInvitationMessage;
        else
          return TAPi18n.__('defaultMessageFriend');
      }
      else if(this.mode == 'todoFriend') {
        var todo = Todo.findOne({_id: this.todoId});
        if(todo) {
          if(todo.friendInvitationMessage)
            return todo.friendInvitationMessage;
          else
            return TAPi18n.__('defaultMessageTodoFriend');
        }
      }
      else if(this.mode == 'coMover') {
        if(user.profile.coMoverInvitationMessage)
          return user.profile.coMoverInvitationMessage;
        else
          return TAPi18n.__('defaultMessageCoMover');
      }
    }
  }
});

Template.invit_message_modal.events({
  'click button.vert': function(event, template) {
    if(template.data.mode == 'friend') {
      console.log("addFriend")
      if(template.data.resend == true) {
        Meteor.call('sendMailRequestToAFriend', template.data.mail, template.$('textarea').val(), function(error, result) {
          if(!error)
            updateInvitFriendMessage.call({message: template.$('textarea').val()});
          $('.amis_page article .mover-friends-block .inputFriendsMover #newMoverFriend').val('');
          Modal.hide();
        });
      }
      else {
        addFriend.call({mail: template.data.mail, message: template.$('textarea').val()}, function (error, result) { 
          console.log(error)
          if(!error)
            updateInvitFriendMessage.call({message: template.$('textarea').val()});
          $('.amis_page article .mover-friends-block .inputFriendsMover #newMoverFriend').val('');
          Modal.hide();
        });
      }
    }
    else if(template.data.mode == 'todoFriend') {
      console.log("addTodoFriend")
      if(template.data.resend == true) {
        Meteor.call('sendMailRequestToAFriend', template.data.mail, template.$('textarea').val(), template.data.todoId, function(error, result) {
          if(!error)
            updateInvitTodoFriendMessage.call({todoId: template.data.todoId, message: template.$('textarea').val()});
          $('aside article > ul > li .addParticipant input').val('');
          Modal.hide();  
        });
      }
      else {
        addTodoFriend.call({todoId: template.data.todoId, mail: template.data.mail, message: template.$('textarea').val()}, function (error, result) { 
          console.log(error);
          if(!error)
            updateInvitTodoFriendMessage.call({todoId: template.data.todoId, message: template.$('textarea').val()});
          $('aside article > ul > li .addParticipant input').val('');
          Modal.hide();
        });
      }
    }
    else if(template.data.mode == 'coMover') {
      console.log("addCoMover")
      if(template.data.resend == true) {
        Meteor.call('sendInvitationMail', template.data.mail, template.$('textarea').val(), function(error, result) {
          if(!error)
            updateInvitCoMoverMessage.call({message: template.$('textarea').val()});
          Modal.hide();
        });
      }
      else {
        addCoMover.call({mail: template.data.mail, message: template.$('textarea').val()}, function (error, result) { 
          console.log(error)
          if(!error)
            updateInvitCoMoverMessage.call({message: template.$('textarea').val()});
          Modal.hide();
        });
      }
    }
  },
  'click button.rouge': function(event, template) {
    Modal.hide();
  }
})