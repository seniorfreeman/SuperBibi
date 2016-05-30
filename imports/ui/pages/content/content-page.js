import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';

import {
  insert,
  makeFinished,
  updateStressMode,
  updatePriority,
  updateTitle,
} from '../../../api/collections/todo/methods.js';

import {List} from '../../../api/collections/todo/todo.js';
import {Todo} from '../../../api/collections/todo/todo.js';
import {Moving} from '../../../api/collections/moving/moving.js';
import {displayError} from '../../lib/errors.js';

import '../../components/todo/todos-item.js';
import '../../components/aside/aside.js';

import '../app-not-found.js';

import '../profile/profile-page.jade';

import '../volume/volume-page.jade';
import '../trajet/trajet-page.jade';
import '../dossier/dossier-page.jade';
import '../agenda/agenda-page.jade';

import '../camion/camion-page.jade';
import '../amis/amis-page.jade';
import '../materiel/materiel-page.jade';
import '../login/login-page.jade';
import '../trajet/trajet-page.js';
import '../camion/camion-page.js';
import '../agenda/agenda-page.js';

import './content-page.jade';


Template.content_page.onCreated(function contentPageOnCreated() {
  GoogleMaps.ready('exampleMap', function(map) {
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
  this.getThemeId = () => FlowRouter.getParam('_id');
  this.autorun(() => {
    this.subscribe('Lists.all');
    Meteor.subscribe('UserMoving');

  });

  this.state = new ReactiveDict();

  this.state.setDefault({
    editing: false,
    editingTodo: false,
  });

});

Template.content_page.onRendered(function ListShowPageOnRendered() {
  GoogleMaps.load({
    key: 'AIzaSyAjem3CRhH2iX0QCCdO5ed1lF2kLeHrOZ8'
  });
});

Template.content_page.helpers({
  isStressMode:function(){
    if(!Meteor.user()) return 2;
    stressMode=Meteor.user().profile?Meteor.user().profile.stressMode:2;
    if(!stressMode)return 2;
    if(stressMode){
    return 1;
    }
    else {
      return 2
    }
  },
  listsDropDown: function(){

      return List.find({system:false});
  },
  emailLocalPart: function() {

    if(Meteor.user().profile.nom!=""){
      return Meteor.user().profile.nom;
    }else{
      const email = Meteor.user().emails[0].address;
      return email.substring(0, email.indexOf('@'));
    }

  },
  user: function(){
    return Meteor.user();
  },
  MapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(48.858093, 2.294694),
        zoom: 8
      };
    }
  },
  listIdArray() {
    var listData = Themes.find();
    var count =Themes.find().count();
    return listData ? listData : [];
  },
  todoArgs(todo) {
    const instance = Template.instance();
    return {
      todo,
      editing: instance.state.equals('editingTodo', todo._id),
      onEditingChange(editing) {
        instance.state.set('editingTodo', editing ? todo._id : false);
      },
    };
  },
  profilRaiting(){
    if(Meteor.user()){
      const properties=Object.keys(Meteor.user().profile);
      var fieldSet=0;
      properties.forEach(function(prt){
        if(Meteor.user().profile[prt])
        fieldSet=fieldSet+1
      });
    return  Math.round((fieldSet/properties.length)*100);
    }
    else{
      return 0;
    }
  },

  nbJourRestant(){

    if(!Meteor.user()) return 0;

    moving = Moving.findOne({_id:Meteor.user().profile.movingId});

    if(moving){
      var a = moment(moving.movingDate);
      var b = moment(new Date());
      var res = -a.diff(b, 'days');
      return  res < 0 ? res : "+"+res
    } else {
      return 0
    }

  },

  dateFinDem(){
    if(!Meteor.user()) return moment(new Date()).format('ddd D MMM YYYY');
    if(Meteor.user().profile.movingId){
      moving=Moving.findOne({_id:Meteor.user().profile.movingId});
      if(moving){
          return moment(moving.movingDate).format('ddd D MMM YYYY');
      }
      else{
        return moment(new Date()).format('ddd D MMM YYYY');
      }

    }
    else{
      return moment(new Date()).format('ddd D MMM YYYY');
    }
  },
  getActiveList:function(listId){
     return listId==FlowRouter.getParam('_id');
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
Template.content_page.events({
  'click nav-ul.menu-li': function(event, template) {
    event.stopPropagation();
    alert();
  },
  'click .profileLogout': function(event, template) {
    Meteor.logout();
    FlowRouter.go('App.home');
  },
  'submit .js-todo-new': function(event, template) {
    event.preventDefault();

    const $input = $(event.target).find('[type=text]');
    const $list = $(event.target).find('[id=list]');
    const $prioritaire = $(event.target).find('[id=prioritaireEdit]');
    if (!$input.val()) {
      return;
    }
    insert.call({
      list: $list.val(),
      title: $input.val(),
      priority:$prioritaire.hasClass("active"),
      guestId : window.localStorage.getItem('guestId')
    }, displayError);

    $input.val('');
    $prioritaire.removeClass('active');
  },
  'click .prioritaire': function(event, template) {
    $(event.target).parent().toggleClass('active');
    var prio=$(event.target).parent().hasClass('active')
    var todoId=$(event.target).parents('form:first').attr('id');
    if ($(event.target).parent().attr('id')=="prioritaireEdit") {
      $('#newTodo').focus();
      return false;
    }
    updatePriority.call({todoId:todoId,priority:prio},
      function(error, result){
        if(error){
          console.log(error);
        }

      });
  },
  'click #profile': function(event, template) {
    $$('body').removeClass('soft').toggleClass('aside');
  },

  'click #stressMode': function(event, template) {
    const stress=$(event.target).val();
    if(stress==1)
    {
      updateStressMode.call({stressMode:true},function(error){
        if(error){
          $('#stressMode')[0].value=2;
          displayError(error);
        }
        $(event.target).addClass("bg_green");
      });

    }else{
      updateStressMode.call({stressMode:false});
      $(event.target).removeClass("bg_green");
    }
  },
  'click .volumeShow': function(event, template) {
    FlowRouter.go('/content/volume');
  },
  'click .trajetShow': function(event, template) {
    FlowRouter.go('/content/trajet');
  },
  'click .agendaShow': function(event, template) {
    FlowRouter.go('/content/agenda');
  },
  'click .dossierShow': function(event, template) {
    FlowRouter.go('/content/dossier');
  },
  'click .profileShow': function(event, template) {
    FlowRouter.go('/content/profile');
  },
  'click .camionShow': function(event, template) {
    FlowRouter.go('/content/camion');
  },
  'click .materielShow': function(event, template) {
    window.open("http://cartons.demenager.fr");
    // FlowRouter.go('/content/materiel');
  },
  'click .amisShow': function(event, template) {
    FlowRouter.go('/content/amis');
  },
  'click .loginShow': function(event, template) {
    FlowRouter.go('/signin');
  },
  'keyDown document': function(event, template) {
    alert(event.which);
  },
  'change #list' : function(event, template) {
    $('#newTodo').focus();
  },

});
