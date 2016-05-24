import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Mongo} from 'meteor/mongo';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import {$} from 'meteor/jquery';

import {
  updateProfile,
  updateStressMode,
  updatePicture,
  unlinkService,
  deleteUser,
} from '../../../api/collections/methods.js';

import {Lists} from '../../../api/collections/collections.js';

import './profile-page.jade';

Template.profile_page.onCreated(function profilePageOnCreated() {
  Meteor.subscribe('uploads');
  Meteor.subscribe("userData");
  this.subscribe('lists.all');
});

Template.profile_page.helpers({
  uploadPictureCallbacks: function() {
    return {
      finished: function(index, fileInfo, context) {
        updatePicture.call({
          picture: fileInfo.url
        }, function(error) {
          if(error)
            console.log(error);
          else 
            $('.done').trigger('click');
        });
        console.log("index ", index);
        console.log("fileInfo ", fileInfo);
        console.log("context ", context);
      }

    }
  },
  someStuff: function() {
    // this is data that will be passed to the server with the upload
    return {}
  },
  user: function() {
    return Meteor.user();
  },
  isStressMode:function(){
    if(!Meteor.user()) return 0;
    stressMode = Meteor.user().profile.stressMode?1:0;
    return stressMode
    
  },
  isLinkedFacebook: function() {
    if(Meteor.user().profile.services=="facebook")
      return true;
    else
      return false;
  },
  profilePicture: function() {
    picture = Meteor.user().profile.picture;
    if (!picture || picture == "")
      picture = "/images/avatar.png"
    return picture;
  },
  formatDate:function(dte){
    if(dte!=null)
      return moment(dte).format('YYYY-MM-DD');
      else return null;
  },
});


Template.profile_page.events({
  'input input': function(event) {
    event.preventDefault();
    _stressMode = $('#stressMode').val()>0;
    _nom= $('#nom').val() ? $('#nom').val() : "";
    _prenom= $('#prenom').val() ? $('#prenom').val() : "";
    _address= $('#addresse').val() ? $('#addresse').val() : "";
    _postalCode= $('#postalCode').val() ? $('#postalCode').val() : "";
    _ville= $('#ville').val() ? $('#ville').val() : "";
    _dateDemenagement=$('#dateDemenagement').val() ? $('#dateDemenagement').val() : ""
    updateProfile.call({
      nom: _nom,
      prenom: _prenom,
      address: _address,
      postalCode: _postalCode,
      ville: _ville,
      stressMode:_stressMode,
      dateDemenagement:_dateDemenagement?new Date(_dateDemenagement):null
    }, function(error,result) {
      if(error){
        console.log(error);
      }else {
        list=Lists.findOne({name:"Jour J"});
        if(list){
        }
      }

    });
  },
  'change .jqUploadClass':function(event){
    $('.start').trigger('click');
  },
  'click [data-action=deleteProfile]': function(event) {
      event.preventDefault();
      deleteUser.call({});
      FlowRouter.go('App.home');
  },
  'click [data-action=unLinkFaceBook]': function() {
      Meteor.call("unlinkService",{serviceName:'facebook'});
      Meteor.logout();
      window.location.assign("http://www.superbibi.fr");
  },
  'click [data-action=seDeconnecter]': function(){
    Meteor.logout();
    window.location.assign("http://www.superbibi.fr");
  },
  'click [data-action=testNotification]': function (event) {
    Meteor.call('sendMailNotification', Meteor.user());
  },
});