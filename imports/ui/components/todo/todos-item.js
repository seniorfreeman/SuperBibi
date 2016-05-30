import {
  Template
} from 'meteor/templating';
import {
  SimpleSchema
} from 'meteor/aldeed:simple-schema';
import {
  $
} from 'meteor/jquery';
import {
  _
} from 'meteor/underscore';

import './todos-item.jade';

import {
  insert,
  makeFinished,
  updateTitle,
  updateList,
} from '../../../api/collections/todo/methods.js';
import '../aside/aside.js'
import {List,Todo} from '../../../api/collections/todo/todo.js';
import {Moving} from '../../../api/collections/moving/moving.js';
import {
  displayError
} from '../../lib/errors.js';
Template.Todos_item.onCreated(function todosItemOnCreated() {
  this.autorun(() => {
    this.subscribe('lists.all',window.localStorage.getItem('guestId'));

  Meteor.subscribe('UserMoving');
  });
});

Template.Todos_item.helpers({
  currentTodo() {
    return Todo.findOne({_id:Template.instance().data._id});
  },
  checkedClass(todo) {
    return todo.checked && 'checked';
  },
  editingClass(editing) {
    return editing && 'editing';
  },
  listDropDown: function(){
    return List.find({system:false});
  },
  isListSelected(list){
    return list._id==this.list;
  },
  renderIfJourJ:function(listName){

    if(listName=="Jour J"){
      if(!Meteor.user()) return "Jour J";
       moving=Moving.findOne({_id:Meteor.user().profile.movingId});
       if(moving){
       demenagementDate = moving.movingDate;
      if(demenagementDate){
          month=moment.utc(demenagementDate).format("MMM");
          day=moment.utc(demenagementDate).format("DD");
           return day+" "+month;
           }
           else{
            return "Jour J";
           }

      }
      else{
        return "Jour J";
      }
    }else{
      return listName;
    }


  },
});

Template.Todos_item.events({
  'click input[type=text]' (event) {
    event.stopPropagation();
    task = Template.instance().data;


    var listname = FlowRouter.getParam('name');
    var listid = FlowRouter.getParam('_id');
    FlowRouter.go('/list/' + listid + '/todo/' + task._id);
    $('body').removeClass('soft').toggleClass('aside', true);

    $('aside article').parents('form:first').attr('id', task._id);
  },

  'focus input[type=text]' () {},

  'blur input[type=text]' () {},

  'keydown input[type=text]' (event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },

  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once
  // every 300ms)
  'keyup input[type=text]': _.throttle(function todosItemKeyUpInner(event) {
    var todoId = $(event.target).parents('form:first').attr('id');
    //$('aside header textarea').val(event.target.value);
    updateTitle.call({
      todoId: todoId,
      title: event.target.value,
    }, displayError);
  }, 300),

  'click input[type=checkbox]' (event) {
    
    if($(event.target).attr('name')=="itemChecked"){
      const $currentTodo =$(event.target).attr('data'); 
      makeFinished.call({
        todoId: $currentTodo
      });
    }
  },
  'click checkbox'(event){
      alert($(event.target).attr('data'));
  },
  'change #todolist' (event) {
    //event.stopPropagation();
    const $currentTodo = $(event.target).attr('data');
    const val=$(event.target).val();
    updateList.call({
      todoId: $currentTodo,
      list:val
    });
  },
  'keypress input' (event) {
          if (event.charCode == 13) {
              alert(event.target);
              event.stopPropagation();
              return false;
          }
      },
});
