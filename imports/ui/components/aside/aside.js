import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';
import {
  insert,
  makeFinished,
  updatePriority,
  updateTitle,
  updateAllowNotification,
  updateConseils,
  updateEcheance,
  deleteTodo,
  addTodoFriend,
  removeTodoFriend
} from '../../../api/collections/todo/methods.js';

import { displayError } from '../../lib/errors.js';
import {List} from '../../../api/collections/todo/todo.js';
import {Todo} from '../../../api/collections/todo/todo.js';
import {Product} from '../../../api/collections/todo/todo.js';
import {Moving} from '../../../api/collections/moving/moving.js';
import {FBInvitFriends} from '../../../api/collections/profile/profile.js';
import {validateEmail} from '../../lib/errors.js';

import './aside.jade';

Template.aside.onCreated(function asideOnCreated() {
  this.getListId = () => FlowRouter.getParam('_id');
  this.getTodoId = () => FlowRouter.getParam('_idTodo');
  this.autorun(() => {
  this.getTodoId ();
  this.subscribe('lists.all');
  this.subscribe('todos.inList', this.getListId());
  this.subscribe('MovingData');
  });
});

Template.aside.onRendered(function(){
  $('#todoEcheance').datetimepicker({
    lang:'fr',
    timepicker:false,
    format: 'YYYY-MM-DD'
  });
});

Template.aside.helpers({
    currentTodo: function() {
      var k = Todo.findOne({_id:FlowRouter.getParam('_idTodo')});
      // console.log(k)
      return k;
    },
    getProduct(id){
      return Product.find(id);
    },
    allowNotification: function() {
      todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});
      if(!todo) return 2;
      if(todo.allowNotification){
        return 1;
      }else {
        return 2;
      }
    },
    formatDate:function(dte){
        return moment(dte).format('YYYY-MM-DD');
    },
    baseUrl(){
      return Meteor.absoluteUrl()
    },
    friends: function(){
      var todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});
      if(todo) {
        return todo.friends;
      }
    },
    taskParticipantAutocomplete: function() {
      return TAPi18n.__('taskParticipantAutocomplete');
    },
    getDeadLineDate:function(){
      var todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});
      var user=Meteor.user();

      if(todo) {
          if(user && user.profile.movingId){
              moving=Moving.findOne({_id:user.profile.movingId})
              if(todo.deadline){
                  return moment(moving.movingDate).add(todo.deadline, 'days').format('YYYY-MM-DD')
              }
              else{
                  return moment(new Date()).add(todo.deadline, 'days').format('YYYY-MM-DD');
              }
          }
          else{
            return  moment(new Date()).format('YYYY-MM-DD');
          }
        return todo.friends;
      }
      else{
        return  moment(new Date()).format('YYYY-MM-DD');
      }
    },
    getProducts:function(){
     var todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});

      if(todo) {
        products=todo.productsId;
        return Product.find({_id:{$in:{products}}});
      }

    },
    getVideos:function(){
     var todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});

      if(todo) {
        videos=todo.videosId;
        return Video.find({_id:{$in:{videos}}});
      }

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
Template.aside.events({
  "click #allowNotification": function(event, template) {
    var todoId = FlowRouter.getParam('_idTodo');
    const allow = $(event.target).val() ? true : false;
    if(allow){
        $(event.target).addClass("bg_green");
    }else{
      $(event.target).removeClass("bg_green");
    }
    updateAllowNotification.call({
      todoId: todoId,
      allowNotification: allow,
    }, displayError);
  },
  "click #prioritaire": function(event, template) {
    $(event.target).parent().toggleClass('active');
    var prio=$(event.target).parent().hasClass('active')
    var todoId=FlowRouter.getParam('_idTodo');
    updatePriority.call({todoId:todoId,priority:prio});
  },
  "change #todoEcheance": function(event, template) {
    var todoId=FlowRouter.getParam('_idTodo');
    updateEcheance.call({
      todoId: todoId,
      echeance: new Date(event.target.value),
    }, displayError);
  },
  "click  .bckBtn": function(event, template) {
    $("body").removeClass("aside");
  },
  "click #btnMoving": function(event, template){
    var date = moment(new Date()).format('YYYY-MM-DD');
    var todo= Todo.findOne({_id:FlowRouter.getParam('_idTodo')});
    var user=Meteor.user();
    if(user && user.profile.movingId){
      moving=Moving.findOne({_id:user.profile.movingId})
      if(todo.deadline){
          date = moment(moving.movingDate).add(todo.deadline, 'days').format('YYYY-MM-DD')
      }
      else{
          date = moment(new Date()).add(todo.deadline, 'days').format('YYYY-MM-DD');
      }
    }
    $('#todoEcheance').val(date);
  },
  "keyup  #conseils":  _.throttle(function todostiTleKeyUpInner(event) {
    var todoId=FlowRouter.getParam('_idTodo');
    updateConseils.call({
      todoId: todoId,
      conseils: event.target.value,
    }, displayError);
  }, 300),
  'keyup #todoTitle': _.throttle(function todostiTleKeyUpInner(event) {
    var todoId=FlowRouter.getParam('_idTodo');
    updateTitle.call({
      todoId: todoId,
      title: event.target.value,
    }, displayError);
  }, 300),
  'click #deleteTodo':function(event){
      var todoId=$(event.target).attr('data');
      Todo.remove(todoId);
      deleteTodo.call({
        todoId: todoId
      }, displayError);
      $('body').removeClass('soft').toggleClass('aside');
  },
  "autocompleteselect .addParticipant input": function(event, template, doc) {
    /*HTTP.post( 'https://graph.facebook.com/v2.6/' + Meteor.user().profile.serviceId + '/apprequests?access_token=' + Session.get('accessToken'), {  }, function (error, result) {
        console.log(error)
      console.log(result)
    });*/
    addTodoFriend.call({todoId: FlowRouter.getParam('_idTodo'), name: doc.name, picture: doc.picture.data.url, invite_token: doc.id}, function (error, result) {
      template.$('input').val('');
    });
  },
  'keyup .addParticipant input': function(event, template) {
    var input = template.$('.addParticipant input');
    if (event.keyCode == 13 && input.val() != '' && template.$('.addParticipant .-autocomplete-container').children().length == 0) {
        event.stopPropagation();
        if(validateEmail(input.val())) {
          Modal.show('invit_message_modal', {mode: 'todoFriend', todoId: FlowRouter.getParam('_idTodo'), mail: input.val()});
          /*addTodoFriend.call({todoId: FlowRouter.getParam('_idTodo'), mail: input.val()}, function (error, result) {
            template.$('.addParticipant input').val('');
          });*/
        }
        else {
          addTodoFriend.call({todoId: FlowRouter.getParam('_idTodo'), name: input.val()}, function (error, result) {
            template.$('.addParticipant input').val('');
          });
        }
        return false;
    }
  },
  'click input[type=checkbox]' (event) {

    if($(event.target).attr('name')=="asideChecked"){
      const $currentTodo =$(event.target).attr('data');
      makeFinished.call({
        todoId: $currentTodo
      });
      event.stopPropagation();
    }
  },
});


/* ---------------------------- Todo Friend ---------------------------- */

Template.todo_friend.events({
  "click button.delete": function(event, template) {
    removeTodoFriend.call({todoId: FlowRouter.getParam('_idTodo'), name: template.data.name, mail: template.data.mail, invite_token: template.data.invite_token}, function (error, result) {
    });
  },
  "click button.resend": function(event, template) {
    Modal.show('invit_message_modal', {mode: 'todoFriend', mail: template.data.mail, todoId: FlowRouter.getParam('_idTodo'), resend: true});
  }
});

Template.todo_friend.helpers({
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

/* --------------------------------------------------------------------- */
