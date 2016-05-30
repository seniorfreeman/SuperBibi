import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Profile} from './profile.js'
/*****************Todo Methods Region************************/

export const updateProfile = new ValidatedMethod({
  name: 'updateProfile',
  validate: new SimpleSchema({
    lastName: { type: String }
    , firstName: { type: String }
    , stressMode:{type:Boolean}
  }).validator(), run({ lastName,firstName,stressMode}) {
    Meteor.users.update({
      _id: Meteor.userId()
    },{
      $set:{
        "profile.lastName" : lastName
        , "profile.firstName" :  firstName
        , "profile.stressMode" :  stressMode
      }
    },function(error,result){
      console.log(error);
    })
  },
});

export const deleteUser = new ValidatedMethod({
  name: 'deleteUser',
  validate: new SimpleSchema({
  }).validator(),
  run() {
    var user = Meteor.user();
    Meteor.call('sendMailAdieu', user);

    //Meteor.users.update({'_id':user._id},{$set: {'stressMode':'false'}});
    Meteor.users.remove({_id:user._id});

    var relatedUsers = Meteor.users.find({'profile.coMovers.id': user._id});
    relatedUsers.forEach(function(relatedUser) {
      var coMovers = relatedUser.profile.coMovers;
      var founded = false;
      var idx;
      for(idx in coMovers) {
        if(coMovers[idx].id == user._id) {
          founded = true;
          break;
        }
      }
      if(founded) {
        coMovers.splice(idx, 1);
        Meteor.users.update({_id: relatedUser._id}, { $set: { 'profile.coMovers': coMovers } },
          function(error,result){
            if(error)
              throw error;
        });
      }
    });

    if(user.emails) {
      relatedUsers = Meteor.users.find({'profile.movers.mail': user.emails[0].address});
      relatedUsers.forEach(function(relatedUser) {
        var movers = relatedUser.profile.movers;
        var founded = false;
        var idx;
        for(idx in movers) {
          if(movers[idx].mail == user.emails[0].address) {
            founded = true;
            break;
          }
        }
        if(founded) {
          movers.splice(idx, 1);
          Meteor.users.update({_id: relatedUser._id}, { $set: { 'profile.movers': movers } },
            function(error,result){
              if(error)
                throw error;
          });
        }
      });

      var relatedTodos = Todo.find({ 'friends.mail': user.emails[0].address});
      relatedTodos.forEach(function(relatedTodo) {
        var friends = relatedTodo.friends;
        var founded = false;
        var idx;
        for(idx in friends) {
          if(friends[idx].mail == user.emails[0].address) {
            founded = true;
            break;
          }
        }
        if(founded) {
          friends.splice(idx, 1);
          Todo.update({_id: relatedTodo._id}, { $set: { 'friends': friends } },
            function(error,result){
              if(error)
                throw error;
          });
        }
      });
    }


  }
});

export const updateStressMode = new ValidatedMethod({
  name: 'updateStressMode',
  validate: new SimpleSchema({
    stressMode: { type: Boolean },
  }).validator(), run({ stressMode}) {
    if(!Meteor.userId()) throw new Meteor.Error('accès refusé');
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set:{
        "profile.stressMode" : stressMode
      }
    },function(error,result){
      console.log(error);

    })
  },
});

/* METTRE A JOUR SON SHOP PREFERE */
export const updatePreferedShop = new ValidatedMethod({
  name: 'updatePreferedShop',
  validate: new SimpleSchema({
    preferedShop: { type: String },
  }).validator(), run({ preferedShop}) {
    // if(!Meteor.userId()) throw new Meteor.Error('accès refusé');
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set:{
        "profile.stillPreferedShop" : preferedShop
      }
    },function(error,result){
      console.log(error);

    })
  },
});



export const updatePicture = new ValidatedMethod({
  name: 'updatePicture',
  validate: new SimpleSchema({
    picture: { type: String },

  }).validator(),
  run({ picture}) {


    Meteor.users.update({_id: Meteor.userId()}, {$set:
      {"profile.picture" : picture}}, function (error) {
        console.log(error);
    });
  },
});

export const addFriend = new ValidatedMethod({
  name: 'user.addFriend',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    message:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ name, mail, message, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }
    console.log("addFriend")
    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      userId = user.profile.adminUserId;

    if(invite_token && picture && name) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.movers': { invite_token: invite_token, name: name, picture: picture, state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(name) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.movers': { name: name, picture: '/images/perso.png' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(mail && message) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.movers': { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else
            Meteor.call('sendMailRequestToAFriend', mail, message, function(error, result) {
              console.log(error)
              console.log(result)
            });
      });
    }
    else {
      throw new Meteor.Error('paramètre manquant');
    }
  },
});

export const removeFriend = new ValidatedMethod({
  name: 'user.removeFriend',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true}
  }).validator(),
  run({ name, mail, invite_token}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      userId = user.profile.adminUserId;

    var friends = Meteor.user().profile.movers;

    var idx;
    var founded = false;

    if(invite_token) {
      for(idx in friends) {
        if(friends[idx].invite_token == invite_token) {
          founded = true;
          break;
        }
      }
    }
    else if(name) {
      for(idx in friends) {
        if(friends[idx].name == name) {
          founded = true;
          break;
        }
      }
    }
    else if(mail) {
      for(idx in friends) {
        if(friends[idx].mail == mail) {
          founded = true;
          break;
        }
      }
    }

    if(founded) {
      friends.splice(idx, 1);
      Meteor.users.update({_id: userId}, { $set: { 'profile.movers': friends } },
        function(error,result){
          if(error)
            throw error;
      });
    }
  }
});




export const addCoMover = new ValidatedMethod({
  name: 'user.addCoMover',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    message:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ name, mail, message, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      userId = user.profile.adminUserId;

    if(invite_token && picture && name) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.coMovers': { invite_token: invite_token, name: name, picture: picture, state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(name) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.coMovers': { name: name, picture: '/images/perso.png' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(mail && message) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.coMovers': { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else {
            Meteor.call('sendInvitationMail', mail, message, function(error, result) {
            });
          }
      });
    }
    else {
      throw new Meteor.Error('paramètre manquant');
    }
  },
});

export const removeCoMover = new ValidatedMethod({
  name: 'user.removeCoMover',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    id:{type:String, optional: true},
  }).validator(),
  run({ name, mail, invite_token, id}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      userId = user.profile.adminUserId;

    var coMovers = Meteor.user().profile.coMovers;

    var idx;
    var founded = false;

    if(id) {
      for(idx in coMovers) {
        if(coMovers[idx].id == id) {
          founded = true;
          break;
        }
      }
      Meteor.users.remove(id);
    }
    else if(invite_token) {
      for(idx in coMovers) {
        if(coMovers[idx].invite_token == invite_token) {
          founded = true;
          break;
        }
      }
    }
    else if(name) {
      for(idx in coMovers) {
        if(coMovers[idx].name == name) {
          founded = true;
          break;
        }
      }
    }
    else if(mail) {
      for(idx in coMovers) {
        console.log(coMovers[idx])
        if(coMovers[idx].mail == mail) {
          founded = true;
          break;
        }
      }
    }


    if(founded) {
      coMovers.splice(idx, 1);
      Meteor.users.update({_id: userId}, { $set: { 'profile.coMovers': coMovers } },
        function(error,result){
          if(error)
            throw error;
      });
    }
  }
});

export const updateFolder = new ValidatedMethod({
  name: 'user.updateFolder',
  validate: new SimpleSchema({
    'addressChange': {
      type: Boolean,
      optional: true
    },
    'addressChangeContent': {
      type: String,
      optional: true
    },
    'dayOff': {
      type: Boolean,
      optional: true
    },
    'dayOffContent': {
      type: String,
      optional: true
    },
    'neighboors': {
      type: Boolean,
      optional: true
    },
    'neighboorsContent': {
      type: String,
      optional: true
    }
  }).validator(),
  run({ addressChange, addressChangeContent,dayOff, dayOffContent, neighboors, neighboorsContent }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }
    
    var obj = {};
    if(addressChange !== undefined)
      obj['profile.folders.addressChange.enabled'] = addressChange;
    if(addressChangeContent !== undefined)
      obj['profile.folders.addressChange.content'] = addressChangeContent;
    if(dayOff !== undefined)
      obj['profile.folders.dayOff.enabled'] = dayOff;
    if(dayOffContent !== undefined)
      obj['profile.folders.dayOff.content'] = dayOffContent;
    if(neighboors !== undefined)
      obj['profile.folders.neighboors.enabled'] = neighboors;
    if(neighboorsContent !== undefined)
      obj['profile.folders.neighboors.content'] = neighboorsContent;

    Meteor.users.update({_id: userId}, {$set: obj
      },function(error,result){
        if(error)
          console.log(error);
    });
  },
});

export const updateRoadmap = new ValidatedMethod({
  name: 'user.updateRoadmap',
  validate: new SimpleSchema({
    'waterAndFood': {
      type: Boolean,
      optional: true 
    },
    'waterAndFoodContent': {
      type: String,
      optional: true 
    },
    'music': {
      type: Boolean,
      optional: true
    },
    'musicContent': {
      type: String,
      optional: true 
    },
    'stopWaterAndElectricity': {
      type: Boolean,
      optional: true
    },
    'stopWaterAndElectricityContent': {
      type: String,
      optional: true 
    },
    'gasUp': {
      type: Boolean,
      optional: true
    },
    'gasUpContent': {
      type: String,
      optional: true 
    }
  }).validator(),
  run({ waterAndFood, waterAndFoodContent, music, musicContent, stopWaterAndElectricity, stopWaterAndElectricityContent, gasUp, gasUpContent }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    var obj = {};
    if(waterAndFood !== undefined)
      obj['profile.roadmap.waterAndFood.enabled'] = waterAndFood;
    if(waterAndFoodContent !== undefined)
      obj['profile.roadmap.waterAndFood.content'] = waterAndFoodContent;
    if(music !== undefined)
      obj['profile.roadmap.music.enabled'] = music;
    if(musicContent !== undefined)
      obj['profile.roadmap.music.content'] = musicContent;
    if(stopWaterAndElectricity !== undefined)
      obj['profile.roadmap.stopWaterAndElectricity.enabled'] = stopWaterAndElectricity;
    if(stopWaterAndElectricityContent !== undefined)
      obj['profile.roadmap.stopWaterAndElectricity.content'] = stopWaterAndElectricityContent;
    if(gasUp !== undefined)
      obj['profile.roadmap.gasUp.enabled'] = gasUp;
    if(gasUpContent !== undefined)
      obj['profile.roadmap.gasUp.content'] = gasUpContent;

    Meteor.users.update({_id: userId}, {$set: obj
      },function(error,result){
        if(error)
          console.log(error);
    });
  },
});

export const updateInvitFriendMessage = new ValidatedMethod({
  name: 'user.updateInvitFriendMessage',
  validate: new SimpleSchema({
    'message': {
      type: String
    }
  }).validator(),
  run({ message }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Meteor.users.update({_id: userId}, { $set: { 'profile.moverInvitationMessage': message } },
      function(error,result){
        
    });
  }
});

export const updateInvitCoMoverMessage = new ValidatedMethod({
  name: 'user.updateInvitCoMoverMessage',
  validate: new SimpleSchema({
    'message': {
      type: String
    }
  }).validator(),
  run({ message }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Meteor.users.update({_id: userId}, { $set: { 'profile.coMoverInvitationMessage': message } },
      function(error,result){
        
    });
  }
});