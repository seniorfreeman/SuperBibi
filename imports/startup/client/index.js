import {$} from 'meteor/jquery';
import './useraccounts-configuration.js';
import './facebook.js';
import './ada.js';
import './routes.js';
import '../../chatbot/api/chatbot.js';
import '../../api/collections/profile/profile.js';
Meteor.startup( function() {
  Hooks.init();
  Hooks.onLoggedIn = function (){
  alert(Meteor.guestId);
  Meteor.call('restoreDataToConnected',Meteor.guestId,Meteor.userId(), function (error, result) {console.log(error);});
  };
  // this.session(tempDisableBeforeUnload) = false;
  //
  // $(window).on('beforeunload', function()
  // {
  //    if (!this.session(tempDisableBeforeUnload))
  //    {
  //       return ('Quitter cette page, vous perdrez toutes vos informations, vous êtes sûr?');
  //
  //    }
  //    else
  //    {
  //       //reset
  //       this.session(tempDisableBeforeUnload) = false;
  //       return;
  //    }
  // });

    var who =  window.localStorage.getItem('guestId') || function(){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      var res = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
      window.localStorage.setItem('guestId',res);
      return res;
    }()
    Meteor.guestId = who;
   Meteor.call('importTodos',Meteor.guestId, function (error, result) {console.log(error);});
  
});


