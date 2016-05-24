import { Meteor } from 'meteor/meteor';
import { Lists } from '../collections.js';
import { Todos } from '../collections.js';
import { Typologies } from '../collections.js';
import { Links } from '../collections.js';
import { Products } from '../collections.js';
import { Documents } from '../collections.js';
import {Friends} from '../collections.js';
import {Notifications} from '../collections.js';
import {Uploads} from '../collections.js';
import {Events} from '../collections.js';
import {VolumeObjects} from '../collections.js';
import {Rooms} from '../collections.js';
import {RoomObjects} from '../collections.js';
import {Partners} from '../collections.js';

Meteor.publish('eventList', function () {
    events=Events.find({userId: this.userId});
    console.log(events.count());
    return events;
});
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'services': 1, 'others': 1}});
  } else {
    this.ready();
  }
});
Meteor.publishComposite('lists.all', function() {
  const user = Meteor.users.findOne({_id: this.userId});

  return {
    find() {
      return Lists.find();
    },

    children: [{
      find(list) {
        if(this.userId){
          if(user.profile.adminUserId)
            return Todos.find({$and:[{ownerId:user.profile.adminUserId},{list:list._id}]});
          else
            return Todos.find({$and:[{ownerId:user._id},{list:list._id}]})
        }
        else {
          return Todos.find({$and:[{ownerId:null},{guestId:this.connection.clientAddress},{list:list._id}]})
        }
      },
    }],
  };

});

Meteor.publish('typologies.all', function() {
  return Typologies.find();
});

Meteor.publishComposite('todos.inList', function(list){
      const user = Meteor.users.findOne({_id: this.userId});
      return{
        find(){
              if(this.userId){
                if(user.profile.adminUserId)
                  Todos.find({$and:[{ownerId:user.profile.adminUserId},{list:list}]})
                else
                  Todos.find({$and:[{ownerId:user._id},{list:list}]})
              }
              else {
                  Todos.find({$and:[{ownerId:null},{list:list}]})
              }
        },
        children:[{
          find(todo){
              return Links.find({_id:{$in: todo.links }});
          },
          find(todo){

              return Products.find({_id:{$in: todo.productsId}});
          },
          find(todo){
              return Documents.find({_id:{$in: todo.documents }});
          },
          find(todo){
              return Friends.find({_id:{$in: todo.friends }});
          },
          find(todo){
              return Notifications.find({todoId:todo._id });
          },
        }]
      }

});

Meteor.publish("uploads", function () {
  var uploads = Uploads.find({});
  return uploads;
});

Meteor.publish('NotificationList',function(todoId){
    const user = Meteor.users.findOne({_id: this.userId});
    if(user.profile.adminUserId)
      return Notifications.find({userId:user.profile.adminUserId,todoId:todoId})
    else
      return Notifications.find({userId:user._id,todoId:todoId})
})

Meteor.publish('volumeObjects', function() {
  return VolumeObjects.find();
});

Meteor.publishComposite('rooms', function() {
  const user = Meteor.users.findOne({_id: this.userId});

  return{
        find(){
              if(this.userId){
                if(user.profile.adminUserId)
                  return Rooms.find({userId:user.profile.adminUserId})
                else
                  return Rooms.find({userId:user._id})
              }
              else {
                return Rooms.find({userId:null})
              }
        },
        children:[{
          find(room){
              return RoomObjects.find({roomId: room._id});
          }
        }]
      }
});

Meteor.publish("movers", function () {
  this.autorun(function (computation) {
    if (this.userId) {
      var user = Meteor.users.findOne({_id: this.userId});
      if(user) {
        var self = this;
        if(user.profile.adminUserId)
          user = Meteor.users.findOne({_id: user.profile.adminUserId});
        for(var idx in user.profile.movers) {
          self.added("Movers", idx, user.profile.movers[idx] );
        }
      }
    }
    this.ready();
  });
});

Meteor.publish("coMovers", function () {
  this.autorun(function (computation) {
    if (this.userId) {
      var user = Meteor.users.findOne({_id: this.userId});
      if(user) {
        var self = this;
        var user;
        if(user.profile.adminUserId)
          user = Meteor.users.findOne({_id: user.profile.adminUserId});
        for(var idx in user.profile.coMovers) {
          self.added("CoMovers", idx, user.profile.coMovers[idx] );
        }
      }
    }
    this.ready();
  });
});

Meteor.publish('partners', function() {
  return Partners.find();
});
