import {
    Events
} from '../../../api/collections/todo/todo.js';
import {
  addEvent,
  updateEvent,
  deleteEvent
} from '../../../api/collections/todo/methods.js';
import {
  displayError
} from '../../lib/errors.js';
import '../../lib/modals/header.jade'
import '../../lib/modals/footer.jade'

import './event-page.jade';


Template.event_page.onCreated(function() {

});
Template.edit_event_page.onCreated(function() {

});
Template.delete_alert_modal.onCreated(function() {

});

Template.event_page.onRendered(function(){
  $( '.datetimepicker' ).datetimepicker({
    lang:'fr',
    timepicker:true,
    format: 'YYYY-MM-DD HH:mm:ss'
  });
});
Template.edit_event_page.onRendered(function(){
  $( '.datetimepicker' ).datetimepicker({
    lang:'fr',
    timepicker:true,
    format: 'YYYY-MM-DD HH:mm:ss'
  });
});
Template.delete_alert_modal.onRendered(function() {
    Session.set('add_co_mover_modal_input_facebook', null);
    Session.set('add_co_mover_modal_input', null);
});
Template.event_page.helpers({
  cancelBtnLabel: function() {
    return "Annuler";
  },
  validBtnLabel: function() {
    return "Valider";
  },
  modalTitle: function() {
    return Template.instance().data.title;
  },
  modalDescription: function() {
    return "";
  },
  event:function(){
    return Template.instance().data.event;
  },
  formatMoment(date){
    return date.format('YYYY-MM-DD HH:mm:ss');
    //return date;
  },
});
Template.edit_event_page.helpers({
  cancelBtnLabel: function() {
    return "Annuler";
  },
  validBtnLabel: function() {
    return "Valider";
  },
  modalTitle: function() {
    return Template.instance().data.title;
  },
  modalDescription: function() {
    return "";
  },
  event:function(){
    return Template.instance().data.event;
  },
  formatMoment(date){
    return date.format('YYYY-MM-DD HH:mm:ss');
    //return date;
  },
});
Template.delete_alert_modal.helpers({
  title:function(){
    return Template.instance().data.title
  },
  description:function(){
    return Template.instance().data.description;
  }
});
Template.event_page.events({
  'click footer button.rouge': function(event, template) {
    Modal.hide();
  },
  'click footer button.vert': function(event, template) {
    start=$('#start').val();
    end=$('#end').val();
    title=$('#title').val();
    if(!moment(start).isBefore(end)){
      Modal.hide();
      alert("Veuillez vérifier la date fin de l'événement");
    }else{
      addEvent.call({start:start,end:end,title:title}, displayError);
      Modal.hide();
      $('#agenda').fullCalendar('refetchEvents');
    }
  }
});
Template.edit_event_page.events({
  'click footer button.rouge': function(event, template) {
    Modal.hide();
  },
  'click footer button.vert': function(e, template) {
    var event=Template.instance().data.event;

    id=event.id;
    start=$('#start').val();
    end=$('#end').val();
    title=$('#title').val();
    updateEvent.call({eventId:id,start:start,end:end,title:title}, displayError);
    Modal.hide();
    $('#agenda').fullCalendar('refetchEvents');
  }
});
Template.delete_alert_modal.events({
  'click footer button.rouge': function(event, template) {
    Modal.hide();
  },
  'click footer button.vert': function(e, template) {
    var event=Template.instance().data.event;
    id=event.id;
    deleteEvent.call({eventId:id}, displayError);
    Modal.hide();
    $('#agenda').fullCalendar('refetchEvents');
  }
});
