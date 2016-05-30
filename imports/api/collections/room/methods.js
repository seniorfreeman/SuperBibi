import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Room} from './room.js'
import {RoomObject} from './room.js'

/*****************Todo Methods Region************************/
export const insertRoom = new ValidatedMethod({
  name: 'rooms.insert',
  validate: new SimpleSchema({
    title:{type:String}
  }).validator(),
  run({ title }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      userId = user.profile.adminUserId;

    var id = Room.insert({
      userId: userId,
      title: title
    },function(error,result){
      if(error)
        throw error;
    });
    
    return id;
  },
});

export const renameRoom = new ValidatedMethod({
  name: 'rooms.rename',
  validate: new SimpleSchema({
    roomId:{type:String},
    title:{type:String}
  }).validator(),
  run({ roomId,title }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Room.update({_id: roomId}, {$set:
      {title : title}},
      function(error,result){
        if(error)
          throw error;
    })
  },
});

export const deleteRoom = new ValidatedMethod({
  name: 'rooms.delete',
  validate: new SimpleSchema({
    roomId:{type:String}
  }).validator(),
  run({roomId}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }
    Room.remove(roomId);
    var roomObjects = RoomObject.find({roomId: roomId});
    roomObjects.forEach(function(roomObject) {
      RoomObject.remove(roomObject._id);
    });
  }
});

export const insertRoomObject = new ValidatedMethod({
  name: 'rooms.insertObject',
  validate: new SimpleSchema({
    roomId: { type: String },
    title:{type:String},
    volume:{type: Number,decimal: true}
  }).validator(),
  run({ roomId, title, volume }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    var id = RoomObject.insert({
      roomId: roomId,
      title: title,
      volume: volume,
      quantity: 1
    },function(error,result){
      if(error)
        throw error;
    });

    return id;
  },
});

export const updateRoomObject = new ValidatedMethod({
  name: 'rooms.updateObject',
  validate: new SimpleSchema({
    roomObjectId:{type:String},
    volume:{type:Number,decimal: true, optional: true},
    title:{type:String, optional: true},
    quantity:{type: Number, optional: true}
  }).validator(),
  run({ roomObjectId, volume, title, quantity }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    var obj = {};
    if(volume)
      obj.volume = volume;
    if(title)
      obj.title = title;
    if(quantity)
      obj.quantity = quantity;

    RoomObject.update({_id: roomObjectId}, {$set:
      obj
    },function(error,result){
      if(error)
        throw error;
    })
  },
});

export const deleteRoomObject = new ValidatedMethod({
  name: 'rooms.deleteObject',
  validate: new SimpleSchema({
    roomObjectId:{type:String}
  }).validator(),
  run({roomObjectId}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }
    RoomObject.remove(roomObjectId);
  }
});