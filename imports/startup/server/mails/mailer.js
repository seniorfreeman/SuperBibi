import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { TAPi18n } from 'meteor/tap:i18n';

import { Todos } from '../../../api/collections/collections.js';
import { Lists } from '../../../api/collections/collections.js';
import { Notifications } from '../../../api/collections/collections.js';
import { Rooms } from '../../../api/collections/collections.js';
import { RoomObjects } from '../../../api/collections/collections.js';

Meteor.startup(function() {

  Meteor.methods({
    sendNotificationForAllUsers: function(){
      Meteor.users.find().forEach(function(user){

        Meteor.call('sendMailNotification', user);
      });
    },
    sendMailNotification: function(currentUser) {
      console.log('sendMailNotification');

      const user = currentUser;
      /*
      var todos = [];
      var notifSent=[];
      Todos.find({}, {
        _id: 1
      }).forEach(function(doc) {
        doc['notification']=[];
        Notifications.find({userId:user._id,status:{$ne:"sent"},todoId:doc._id}).forEach(function(ntf){
          doc['notification'].push({"text":ntf.text});
          notifSent.push(ntf_id);
        });
          if(doc['notification'].length>0){
            list=Lists.findOne(doc.list);
            url=Meteor.absoluteUrl()+"List/"+list.name+"/"+list._id+"/todo/"+doc._id;
            doc["url"]=url;
            todos.push(doc);
            console.log(url);
          }
      });
      */

      var lists=[];
      Lists.find().forEach(function(lst){
        var currentTodos=[];
        Todos.find({ownerId:user._id,dateFin:null,list:lst._id}).forEach(function(todo){
          currentTodos.push({
              title:todo.title
             ,todoUrl:Meteor.absoluteUrl()+"List/"+lst.name+"/"+lst._id+"/todo/"+todo._id
          });
        });
        if(currentTodos.length>0){
          lists.push({
                      listName:lst.name
                     ,listUrl:Meteor.absoluteUrl()+"List/"+lst.name+"/"+lst._id
                     ,todosItem:currentTodos
                   });
        }
      });
      if(!lists.length) return;

      // CONTENT ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('tasksList', Assets.getText('mailsTemplates/tasksList.html'));

      var email = user.services.facebook ? user.services.facebook.email : user.emails[0].address;

      const titre = user.prenom ? user.prenom : email.substring(0, email.indexOf('@'));
      const path = Meteor.absoluteUrl();

      var contentHtml = SSR.render("tasksList", {
        emailWelcome      : user.tutoiement ? TAPi18n.__('salut') : TAPi18n.__('bonjour'),
        emailTo           : titre,
        emailContent      : TAPi18n.__('notificationsContent'),
        emailTitle        : TAPi18n.__('notificationsTitle'),
        callToActionLink  : path + "#MAPAGEDENOTIF",
        callToActionText  : TAPi18n.__('notificationsActionText'),
        path              : path,
        todos             : lists
      });

      // FOOTER ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}', contentHtml));
      var corp = SSR.render("corp", {
        path  : path,
        emailImage    : path+"emages/headNotifications.png",
        emailTitle    : TAPi18n.__('seeYouSoonTitle')
      });

      Email.send({
        to      : email,
        from    : "SuperBibi <no-reply@epicea.com>",
        subject : TAPi18n.__('notificationsTitle'),
        html    : corp
      });

    },

    sendMailAdieu : function (currentUser){

      const path = Meteor.absoluteUrl();

      const user = currentUser;

      var email = user.services.facebook ? user.services.facebook.email : user.emails[0].address;
      // CONTENT ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('seeYouSoon', Assets.getText('mailsTemplates/seeYouSoon.html'));

      var contentHtml = SSR.render("seeYouSoon", {
          emailWelcome  : user.tutoiement ? TAPi18n.__('salut') : TAPi18n.__('bonjour'),
          emailTitle    : TAPi18n.__('seeYouSoonTitle'),
          emailContent  : TAPi18n.__('seeYouSoonContent'),
        });

      // CORP ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}', contentHtml));
      var corp = SSR.render("corp", {
          path  : path,
          emailImage    : path + "emages/headSeeYouSoon.png",
          emailTitle    : TAPi18n.__('seeYouSoonTitle')
      });

      Email.send({
        to      : email,
        from    : "SuperBibi <no-reply@epicea.com>",
        subject : TAPi18n.__('seeYouSoonTitle'),
        html    : corp
      });

    },
    sendMailRequestToAFriend : function (mail, todo){

      /*
      // DEV :
        const friend = {
          "email" : "cstephan@epicea.com"
        }
        const currentUser = {
          "prenom" : "Charles"
          , "tutoiement" : true

        }
      */

      const path = Meteor.absoluteUrl();
      const user = Meteor.user();
      var url;
      var task;

      if(todo) {
        task = todo.title;
        url = "http://localhost:3000/user/" + user._id + "/mailResponse/" + mail + "/todo/" + todo._id;
      }
      else if(!isCoMover) {
        task = TAPi18n.__('helpToMove');
        url = "http://localhost:3000/user/" + user._id + "/mailResponse/" + mail;
      }
      // CONTENT ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('yesOrNo', Assets.getText('mailsTemplates/yesOrNo.html'));
      // const user = currentUser ? currentUser : Meteor.user();

      var contentHtml = SSR.render("yesOrNo", {
          emailWelcome  : user.profile.tutoiement ? TAPi18n.__('salut') : TAPi18n.__('bonjour'),
          emailTitle    : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle'),
          emailContent1  : TAPi18n.__('yesOrNoContent1'),
          emailContent2  : TAPi18n.__('yesOrNoContent2'),
          task: task,
          yesOrNoCallToActionTextPositive    : TAPi18n.__('yesOrNoCallToActionTextPositive'),
          yesOrNoCallToActionTextNegative    : TAPi18n.__('yesOrNoCallToActionTextNegative'),
          callToActionLinkPositive           : url+"?rep=true",
          callToActionLinkNegative           : url+"?rep=false",
          prenom: user.profile.prenom
        });

      // CORP ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}', contentHtml));
      var corp = SSR.render("corp", {
          path  : path,
          emailImage    : path + "emages/headYesOrNo.png",          
          emailTitle    : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle')
      });

      Email.send({
        to      : mail,
        from    : "SuperBibi <no-reply@epicea.com>",
        subject : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle'),
        html    : corp
      });
      
    },
    sendInvitationMail: function(mail) {
      const path = Meteor.absoluteUrl();
      const user = Meteor.user();
      var urlNegative = "http://localhost:3000/user/" + user._id + "/mailResponse/" + mail + "/coMover?rep=false";

      var jwt = require('jwt-simple');
      var sevenDaysHours = 7 * 24;
      var msUntilExpiration = sevenDaysHours * 60 * 60 * 1000;
      var expires = Date.now() + msUntilExpiration;
      var payload = { userId: user._id, expiration: new Date(expires) };
      var secret = mail;
      var token = jwt.encode(payload, secret);

      var urlPositive = "http://localhost:3000/signin/" + token + "?mail=" + mail;
      // CONTENT ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('invitation', Assets.getText('mailsTemplates/invitation.html'));
      // const user = currentUser ? currentUser : Meteor.user();
      var contentHtml = SSR.render("invitation", {
          emailWelcome  : user.profile.tutoiement ? TAPi18n.__('salut') : TAPi18n.__('bonjour'),
          emailTitle    : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle'),
          emailContent1  : TAPi18n.__('yesOrNoContent1'),
          emailContent2  : TAPi18n.__('yesOrNoContent2'),
          task: TAPi18n.__('helpToManage'),
          yesOrNoCallToActionTextPositive    : TAPi18n.__('yesOrNoCallToActionTextPositive'),
          yesOrNoCallToActionTextNegative    : TAPi18n.__('yesOrNoCallToActionTextNegative'),
          callToActionLinkPositive           : urlPositive,
          callToActionLinkNegative           : urlNegative,
          prenom: user.profile.prenom
        });
      // CORP ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}', contentHtml));
      var corp = SSR.render("corp", {
          path  : path,
          emailImage    : path + "emages/headYesOrNo.png",          
          emailTitle    : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle')
      });
      console.log('envoi du mail a ' + mail)
      Email.send({
        to      : mail,
        from    : "SuperBibi <no-reply@epicea.com>",
        subject : user.profile.prenom + " " + TAPi18n.__('yesOrNoTitle'),
        html    : corp
      });
    },
    sendValuationMail : function (){
      const path = Meteor.absoluteUrl();
      const user = Meteor.user();
      var email = (user.services && user.services.facebook) ? user.services.facebook.email : user.emails[0].address;

      var rooms = Rooms.find({userId:user._id}).map(function(room) {
        room.objects = RoomObjects.find({roomId: room._id});
        room.totalVolume = RoomObjects.find({roomId: room._id}).fetch().map(item => item.volume).reduce((a, b) => a + b, 0);
        return room;
      });

      // CONTENT ---------------------------------------------------------------------------------------------------------
      SSR.compileTemplate('valuation', Assets.getText('mailsTemplates/valuation.html'));
      var contentHtml = SSR.render("valuation", {
        emailContent      : TAPi18n.__('valuationMailContent'),
        rooms             : rooms
      });
      

      // CORP ---------------------------------------------------------------------------------------------------------

      SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}', contentHtml));
      var corp = SSR.render("corp", {
          path  : path,
          emailImage    : path + "emages/headVerify.png",          
          emailTitle    : TAPi18n.__('valuationMailTitle'),
      });
      
      Email.send({
        to      : email,
        from    : "SuperBibi <no-reply@epicea.com>",
        subject : TAPi18n.__('valuationMailTitle'),
        html    : corp
      });
    }

  });

});
