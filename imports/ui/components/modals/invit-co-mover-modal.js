import './invit-co-mover-modal.jade';

import {
  addFriend,
  addCoMover,
} from '../../../api/collections/profile/methods.js';
import {
  addTodoFriend
} from '../../../api/collections/todo/methods.js';
import {FBInvitFriends} from '../../../api/collections/profile/profile.js';
import {validateEmail} from '../../lib/errors.js';

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
        Modal.hide();
        setTimeout(Meteor.bindEnvironment(function() {
          Modal.show('invit_message_modal', {mode: 'coMover', mail: input.val()});
        }), 500);
        /*addCoMover.call({mail: input.val()}, function (error, result) { 
          Modal.hide();
        });*/
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
