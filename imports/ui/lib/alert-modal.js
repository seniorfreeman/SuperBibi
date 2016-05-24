import './alert-modal.jade';

Template.alert_modal.onCreated(function() {

});

Template.alert_modal.onRendered(function() {
    Session.set('add_co_mover_modal_input_facebook', null);
    Session.set('add_co_mover_modal_input', null);
});

Template.alert_modal.helpers({
  title:function(){
    return Template.instance().data.title
  },
  description:function(){
    return Template.instance().data.description;
  }
});

Template.alert_modal.events({
  'click footer button.rouge': function(event, template) {
    Modal.hide();
  },
  'click footer button.vert': function(event, template) {
    Modal.hide();
  }
});
