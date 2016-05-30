import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import {
  ReactiveDict
} from 'meteor/reactive-dict';

import './soft.jade';

Template.soft.onCreated(function softOnCreated() {
    this.getcurrentPage = () => FlowRouter.getParam('page');
    this.currentTemplate=new ReactiveVar( "content" );
    this.autorun(() => {
      FlowRouter.watchPathChange();
      var context = FlowRouter.current();
    });

  });
Template.soft.helpers({
  templateRender: function() {
    var template=FlowRouter.getParam('page');
    if(template){

      Template.instance().currentTemplate.set( template+"_page" );
      return Template.instance().currentTemplate.get();
    }else {
      if($('body').hasClass( "soft" ))
        $('body').removeClass('aside').toggleClass('soft');
      return "";
    }
  },
});
Template.soft.events({});
