import { Accounts } from 'meteor/accounts-base';
import '../../api/collections/profile/profile.js'
//import { Demenagement } from '../../api/collections/collections.js';
import { Room } from '../../api/collections/room/room.js';
import { RoomObject } from '../../api/collections/room/room.js';

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    forbidClientAccountCreation : false,
    enforceEmailVerification: false,
    enablePasswordChange: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
});

Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.resetPassword  = function(token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};


Accounts.onCreateUser(function(options, user) {
    if (!options.profile)
      options.profile = {}

     //--------------SI USER INVITE--------------------------------
    if(options.profile.invitation_token) {
      var jwt = require('jwt-simple');
      try {
        var decoded = jwt.decode(options.profile.invitation_token, user.emails[0].address);
        if(decoded.expiration < new Date()) {
          throw new Meteor.Error(403, 'token expiré');
        }
        options.profile.adminUserId = decoded.userId;

        Meteor.users.find({'profile.coMovers.mail': user.emails[0].address}).forEach(function(adminUser) {
          var coMovers = adminUser.profile.coMovers;
          for(var idx in coMovers) {
            if(coMovers[idx].mail == user.emails[0].address) {
              coMovers[idx] = {id: user._id};
            }
          }
          Meteor.users.update({_id: adminUser._id}, { $set: { 'profile.coMovers': coMovers } },
            function(error,result){
              if(error)
                throw error;
          });
        });
      }
      catch(e) {
        throw new Meteor.Error(403, 'Problème de token');
      }
    }
    //-----------------------------------------------------------------

    //---------------- DOSSIERS-----------------
    options.profile.folders = {};
    options.profile.folders.addressChange = { enabled: false, content: '' };
    options.profile.folders.dayOff = { enabled: false, content: '' };
    options.profile.folders.neighboors = { enabled: false, content: '' };

    options.profile.roadmap = {};
    options.profile.roadmap.waterAndFood = { enabled: false, content: '' };
    options.profile.roadmap.music = { enabled: false, content: '' };
    options.profile.roadmap.stopWaterAndElectricity = { enabled: false, content: '' };
    options.profile.roadmap.gasUp = { enabled: false, content: '' };
    //------------------------------------------

    if (!user.services.facebook) {

    } else {

      result = Meteor.http.get("https://graph.facebook.com/v2.0/me?fields=id,first_name,last_name,gender,email,name,friends,picture,location{location{city,country,region,state,zip,latitude,longitude,name}}",{params:{access_token: user.services.facebook.accessToken}});

      if(result.error)
        console.log(result.error);

      tmpprofile = _.pick (result.data, ['id', 'gender', 'first_name','last_name','email','picture','location']);

      console.log(tmpprofile.location);

      options.profile.lastName = tmpprofile.last_name;
      options.profile.firstName = tmpprofile.first_name;
      options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
      options.profile.serviceId = user.services.facebook.id; 

    }


    //--------------AJOUT DES PIECES ET OBJETS PAR DEFAUTS--------------------------------
    setTimeout(Meteor.bindEnvironment(function() {
      try {
        var json = JSON.parse(Assets.getText("defaultVolumes.json"));
        var oldRoomCount = 2; // <= variable par defaut TODO: récupérer via mongo
        var configuration = json[''+oldRoomCount];
        for(var defaultVolumesIdx in configuration) {
          var roomTitle = configuration[defaultVolumesIdx].title;
          var roomId = Room.insert({
            userId: user._id,
            title: roomTitle
          },function(error,roomId){
            if(error)
              console.log(error);
          });
          if(roomId) {
            for(var defaultVolumeObjectsIdx in configuration[defaultVolumesIdx].volumeObjects) {
              var objectTitle = configuration[defaultVolumesIdx].volumeObjects[defaultVolumeObjectsIdx].title;
              var objectVolume = configuration[defaultVolumesIdx].volumeObjects[defaultVolumeObjectsIdx].volume;
              var objectQuantity = configuration[defaultVolumesIdx].volumeObjects[defaultVolumeObjectsIdx].quantity;
              RoomObject.insert({
                roomId: roomId,
                title: objectTitle,
                volume: parseFloat(objectVolume),
                quantity: parseInt(objectQuantity)
              },function(error,result){
                if(error)
                  console.log(error);
              });
            }
          }
        }
      }
      catch(e) {
        console.log(e)
      }
    }), 100);
    //---------------------------------------------------------------------------------------
    user.profile = options.profile;
    return user;
});
Meteor.methods({
  '_accounts/unlink/service': function (userId, serviceName) {
    Accounts.unlinkService(userId, serviceName);
  }
});
