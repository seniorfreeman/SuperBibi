import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Mongo} from 'meteor/mongo';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import {$} from 'meteor/jquery';
import {Lists} from '../../../api/collections/collections.js';
import {Todos} from '../../../api/collections/collections.js';
import {Typologies} from '../../../api/collections/collections.js';
import {Typographies} from '../../../api/collections/collections.js';
import {displayError} from '../../lib/errors.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';
import {listRenderHold} from '../../launch-screen.js';
import './listTodo.jade'

Template.listTodo.onCreated(function listTodoOnCreated() {
  this.getListId = () => FlowRouter.getParam('_id');
  this.autorun(() => {
    this.subscribe('Typologies.all',this.getListId());
    this.subscribe('lists.all');
    this.subscribe('todos.inList', this.getListId());
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
    return Lists.findOne(listId);
  },
  isEmptyList(list,typo){
    var result=[];
    if(list.system){
      switch (list.name)
      {
          case "Mes priorités":result=Todos.find({prioritaire: true,dateFin:null,typologie:typo._id},{sort:{list:1}});break;
          case "Tout":result=Todos.find({typologie:typo._id,dateFin:null},{sort:{list:1}});break;
          case "Effectués":result=Todos.find({typologie:typo._id,"dateFin" : { $exists : true, $ne : null }},{sort:{list:1}});break;
      }
    }else{
      result= Todos.find({list:list._id,dateFin:null,typologie:typo._id});
    }

    return result.count()>0?true:false;
  },
  currenTodoListTypo: function(list,typo){
    var result;
    if(list.system){
      switch (list.name)
      {
          case "Mes priorités":result=Todos.find({prioritaire: true,dateFin:null,typologie:typo._id},{sort:{list:1}});break;
          case "Tout":result=Todos.find({typologie:typo._id,dateFin:null},{sort:{list:1}});break;
          case "Effectués":result=Todos.find({typologie:typo._id,"dateFin" : { $exists : true, $ne : null }},{sort:{list:1}});break;
      }
    }else{
      result= Todos.find({list:list._id,dateFin:null,typologie:typo._id});
    }

    return result;
  },
  listTypologies() {
    return Typologies.find();
  },
  currentTodoList: function(list) {
    var result;
    if(list.system){
      switch (list.name)
      {
          case "Mes priorités":result=Todos.find({prioritaire: true,dateFin:null},{sort:{list:1}});break;
          case "Tout":result=Todos.find({dateFin:null},{sort:{list:1}});break;
          case "Effectués":result=Todos.find({"dateFin" : { $exists : true, $ne : null }},{sort:{list:1}});break;
      }
    }else{
      result= Todos.find({list:list._id,dateFin:null});
    }

    return result;
  },
});
