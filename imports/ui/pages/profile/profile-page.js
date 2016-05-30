import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Mongo} from 'meteor/mongo';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import {$} from 'meteor/jquery';

import {
  updateProfile,
  updatePicture,
  deleteUser,
  updatePreferedShop,
  updateStressMode,
} from '../../../api/collections/profile/methods.js';
import {
  createOrUpdateMovingDate,
  updateCreateMovingAddress,
  updateAnimal,
  updateChildren,
  updateRentingOldAddress,
  updateRentingNewAddress,
} from '../../../api/collections/moving/methods.js';
import {List} from '../../../api/collections/todo/todo.js';
import {Moving} from '../../../api/collections/moving/moving.js';
import {Address} from '../../../api/collections/moving/moving.js';

import './profile-page.jade';

Template.profile_page.onCreated(function profilePageOnCreated() {
  Meteor.subscribe('uploads');
  Meteor.subscribe("userData");
  Meteor.subscribe('lists.all');
  Meteor.subscribe('MovingData');
  Meteor.subscribe('UserMoving');
  Meteor.subscribe('MovingAdress');
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
  movingDate:function(){
    if(Meteor.user()){
      console.log('client--->'+Moving.find().count());
    moving=Moving.findOne({_id:Meteor.user().profile.movingId})
    if(moving){
      return moving.movingDate;
    }
  }
  },
  movingData:function(){
    if(Meteor.user()){
     
    moving=Moving.findOne({_id:Meteor.user().profile.movingId})
   return moving;
  }},
  getAddress: function(id){
      adr=Address.findOne({_id:id});
      if(adr){
        return adr.displayAddress;
      }
      else{
        return "";
      }
    }
});


Template.profile_page.events({
  'input input': function(event) {
    event.preventDefault();
   _stressMode = $('#stressMode').val()>0;
    _nom= $('#nom').val() ? $('#nom').val() : "";
    _prenom= $('#prenom').val() ? $('#prenom').val() : "";
    switch($(event.target).attr('id')){
      case 'nom' :
           updateProfile.call({
                                lastName: _nom,
                                firstName: _prenom,
                                stressMode:_stressMode
                              }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;
      case 'prenom' :
           updateProfile.call({
                                lastName: _nom,
                                firstName: _prenom,
                                stressMode:_stressMode
                              }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;      
      case 'departAdress':
            isOld=false;
            displayAddress="";
            typeMoving=1;
            if($(event.target).attr('id')=='departAdress'){
              isOld=true;
              displayAddress=$('#departAdress').val();
              typeMoving=Number.parseInt($('#typeDeparture').val());
             }
            else{
                isOld=false;
                displayAddress=$('#distAdress').val(); 
                typeMoving=Number.parseInt($('#typeArrival').val());
            }

           updateCreateMovingAddress.call({
                          isOld:isOld
                          , type: typeMoving
                          , displayAddress: displayAddress
                          , num:null
                          , address:null
                          , addressPlus:null
                          , postalCode:null
                          , city:null
                          , coordonates:null
                          }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;
      case 'distAdress':
            isOld=false;
            displayAddress="";
            typeMoving=1;
            if($(event.target).attr('id')=='departAdress'){
              isOld=true;
              displayAddress=$('#departAdress').val();
              typeMoving=Number.parseInt($('#typeDeparture').val());
             }
            else{
                isOld=false;
                displayAddress=$('#distAdress').val(); 
                typeMoving=Number.parseInt($('#typeArrival').val());
            }

           updateCreateMovingAddress.call({
                          isOld:isOld
                          , type: typeMoving
                          , displayAddress: displayAddress
                          , num:null
                          , address:null
                          , addressPlus:null
                          , postalCode:null
                          , city:null
                          , coordonates:null
                          }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;
      case 'dateDemenagement' :
            if(!$('#dateDemenagement').val()) break;
           createOrUpdateMovingDate.call({
                                movingDate: new Date($('#dateDemenagement').val())
                              }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;
      case 'stressMode' :
           updateStressMode.call({
                                stressMode: $('#stressMode').val()>0
                              }, function(error,result) {
                                if(error){
                                  console.log(error);
                                }
            });
      break;
    }
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
      FlowRouter.go('App.home');
  },
  'click [data-action=seDeconnecter]': function(){
    Meteor.logout();
    FlowRouter.go('App.home');
  },
  'click [data-action=testNotification]': function (event) {
    Meteor.call('sendMailNotification', Meteor.user());
  },
});