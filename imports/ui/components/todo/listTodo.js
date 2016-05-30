import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Mongo} from 'meteor/mongo';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import {$} from 'meteor/jquery';
import {List} from '../../../api/collections/todo/todo.js';
import {Todo} from '../../../api/collections/todo/todo.js';
//import {Typographies} from '../../../api/collections/collections.js';
import {displayError} from '../../lib/errors.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';
import {listRenderHold} from '../../launch-screen.js';
import './listTodo.jade'

Template.listTodo.onCreated(function listTodoOnCreated() {
  this.getListId = () => FlowRouter.getParam('_id');
  this.autorun(() => {
    
    this.subscribe('lists.all',window.localStorage.getItem('guestId'));
    this.subscribe('todos.inList', this.getListId(),window.localStorage.getItem('guestId'));
  });
});
Template.listTodo.onRendered(function listTodoOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      listRenderHold.release();
    }
  });
});
Template.listTodo.helpers({
  list() {
    const instance = Template.instance();
    const listId = instance.getListId();
    return List.findOne(listId);
  },
  isEmptyList(list,typo){
    var result=[];
    if(list.system){
      switch (list.name)
      {
          case "Mes priorités":
                  switch (typo){
                     case "AVANT":result=Todo.find({priority: true,endDate:null,deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({priority: true,endDate:null,deadline:0});break;
                     case "APRES":result=Todo.find({priority: true,endDate:null,deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({priority: true,endDate:null,deadline:null});break;
                  }
            break;
          case "Tout":
                switch (typo){
                     case "AVANT":result=Todo.find({endDate:null,deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({endDate:null,deadline:0});break;
                     case "APRES":result=Todo.find({endDate:null,deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({endDate:null,deadline:null});break;
                  }
            break;
          case "Effectués":
                switch (typo){
                     case "AVANT":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:0});break;
                     case "APRES":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:null});break;
                  }
            break;
      }
    }else{
        switch (typo){
           case "AVANT":result=Todo.find({list:list._id,endDate:null,deadline:{$lt:0}});break;
           case "JourJ":result=Todo.find({list:list._id,endDate:null,deadline:0});break;
           case "APRES":result=Todo.find({list:list._id,endDate:null,deadline:{$gt:0}});break;
           case "NonDate":result=Todo.find({list:list._id,endDate:null,deadline:null});break;
        }
    }

    return result.count()>0?true:false;
  },
  currenTodoListTypo: function(list,typo){
    var result;
    if(list.system){
       switch (list.name)
      {
          case "Mes priorités":
                  switch (typo){
                     case "AVANT":result=Todo.find({priority: true,endDate:null,deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({priority: true,endDate:null,deadline:0});break;
                     case "APRES":result=Todo.find({priority: true,endDate:null,deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({priority: true,endDate:null,deadline:null});break;
                  }
            break;
          case "Tout":
                switch (typo){
                     case "AVANT":result=Todo.find({endDate:null,deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({endDate:null,deadline:0});break;
                     case "APRES":result=Todo.find({endDate:null,deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({endDate:null,deadline:null});break;
                  }
            break;
          case "Effectués":
                switch (typo){
                     case "AVANT":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:{$lt:0}});break;
                     case "JourJ":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:0});break;
                     case "APRES":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:{$gt:0}});break;
                     case "NonDate":result=Todo.find({endDate:{ $exists : true, $ne : null },deadline:null});break;
                  }
            break;
      }
    }else{
        switch (typo){
           case "AVANT":result=Todo.find({list:list._id,endDate:null,deadline:{$lt:0}});break;
           case "JourJ":result=Todo.find({list:list._id,endDate:null,deadline:0});break;
           case "APRES":result=Todo.find({list:list._id,endDate:null,deadline:{$gt:0}});break;
           case "NonDate":result=Todo.find({list:list._id,endDate:null,deadline:null});break;
        }
    }

    return result;
  },
  currentTodoList: function(list) {
    var result;
    if(list.system){
      switch (list.name)
      {
          case "Mes priorités":result=Todo.find({priority: true,endDate:null});break;
          case "Tout":result=Todo.find({endDate:null});break;
          case "Effectués":result=Todo.find({"endDate" : { $exists : true, $ne : null }});break;
      }
    }else{
      result= Todo.find({list:list._id,endDate:null});
    }

    return result;
  },
});
