import { Meteor } from 'meteor/meteor';
import { List} from '../todo/todo.js';
import { Todo } from '../todo/todo.js';
import { Video } from '../todo/todo.js';
import {File } from '../todo/todo.js';
import {Events} from '../todo/todo.js';
import { Product } from '../todo/todo.js';
import { Moving,Address } from '../moving/moving.js';
import {Uploads} from '../upload/upload.js';
import {VolumeObjects} from '../global/global.js';
import {RoomNames} from '../global/global.js';
import {Room} from '../room/room.js';
import {RoomObject} from '../room/room.js';
import {Partners} from '../global/global.js';


Meteor.publish('eventList', function () {
    events=Events.find({userId: this.userId});
    console.log(events.count());
    return events;
});
Meteor.publish("userData", function () {
  if (this.userId) {
    const user = Meteor.users.findOne({_id: this.userId});
    var ids = [];
    for(var idx in user.profile.coMovers) {
      var id = user.profile.coMovers[idx].id;
      if(id)
        ids.push(user.profile.coMovers[idx].id);
    }
    return Meteor.users.find({$or: [{_id: user._id},{_id: { "$in": ids }}]},
                             {fields: {'profile': 1, 'others': 1}});
  } else {
    this.ready();
  }
});
Meteor.publishComposite('lists.all', function(guestId) {
  const user = Meteor.users.findOne({_id: this.userId});

  return {
    find() {
      return List.find();
    },

    children: [{
      find(list) {
        if(this.userId){
          if(user.profile.adminUserId)
            return Todo.find({$and:[{ownerId:user.profile.adminUserId},{list:list._id}]});
          else
            return Todo.find({$and:[{ownerId:user._id},{list:list._id}]})
        }
        else {
          return Todo.find({$and:[{ownerId:null},{guestId:guestId},{list:list._id}]})
        }
      },
    }],
  };

});


Meteor.publishComposite('Todos.inList', function(list,guestId){
      const user = Meteor.users.findOne({_id: this.userId});
      return{
        find(){
              if(this.userId){
                if(user.profile.adminUserId){
                  Todo.find({$and:[{ownerId:user.profile.adminUserId},{list:list}]})
                } else {
                  Todo.find({$and:[{ownerId:user._id},{list:list}]})
                  /*Todo.find({$and:[
                    {$or:[{ownerId:user._id},{list:list}]}
                    ,{$or:[{guestId:guestId},{list:list}]}
                  ]})
                  */
                }
              } else {
                  Todo.find({$and:[{guestId:guestId},{list:list}]})
              }
        },
        children:[{
          find(todo){
              return video.find({_id:{$in: todo.videosId }});
          },
          find(todo){

              return Product.find({_id:{$in: todo.productsId}});
          },
          find(todo){
              return file.find({_id:{$in: todo.filesId }});
          },
        }]
      }

});

Meteor.publish("uploads", function () {
  var uploads = Uploads.find({});
  return uploads;
});


Meteor.publish('volumeObjects', function() {
  return VolumeObjects.find();
});

Meteor.publish('roomNames', function() {
  return RoomNames.find();
});

Meteor.publishComposite('rooms', function() {
  const user = Meteor.users.findOne({_id: this.userId});

  return{
        find(){
              if(this.userId){
                if(user.profile.adminUserId)
                  return Room.find({userId:user.profile.adminUserId})
                else
                  return Room.find({userId:user._id})
              }
              else {
                return Room.find({userId:null})
              }
        },
        children:[{
          find(room){
              return RoomObject.find({roomId: room._id});
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
          if(user.profile.coMovers[idx].id) {
            var coMover = Meteor.users.findOne({_id: user.profile.coMovers[idx].id});
            if(coMover)
              self.added("CoMovers", idx, {id: coMover._id, mail: coMover.emails[0].address, picture: coMover.profile.picture, name: coMover.profile.prenom, state: 'accepted'} );
          }
          else
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
Meteor.publishComposite('MovingData', function() {
  const user = Meteor.users.findOne({_id: this.userId});
  if(!user) return;
    if(!user.profile.movingId)return null;
  return{
        find(){
              console.log('=============>'+Moving.find({_id:user.profile.movingId}).count())
             return Moving.find({_id:user.profile.movingId})

        },
        children:[{
          find(moving){
            console.log('A=============>'+Address.find( {$or: [ { _id: moving.newAddressId }, { _id: moving.oldAddressId } ] }))
              return Address.find( {$or: [ { _id: moving.newAddressId }, { _id: moving.oldAddressId } ] });
          }
        }]
      }
});
Meteor.publish('UserMoving', function() {
 const user = Meteor.users.findOne({_id: this.userId});
    if(!user || !user.profile.movingId)return null;
  return Moving.find({_id:user.profile.movingId});
});
Meteor.publish('MovingAdress', function() {
  const user = Meteor.users.findOne({_id: this.userId});
    if(!user || !user.profile.movingId)return null;
    moving=Moving.findOne({_id:user.profile.movingId})
  return Address.find( {$or: [ { _id: moving.newAddressId }, { _id: moving.oldAddressId } ] });
});
