/*****************Import Region************************/
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Events} from './todo.js';
import {Todo} from './todo.js'
import {Moving} from '../moving/moving.js'
/*****************Todo Methods Region************************/

export const insert = new ValidatedMethod({
  name: 'todo.insert',
  validate: new SimpleSchema({
						     list: { type: String }
						    ,title: { type: String }
						    ,priority:{type:Boolean}
						    ,guestId: { type: String }
  				}).validator(),
				run({ list, title,priority,guestId }) {
				        var userId = this.userId;
				        const user = Meteor.users.findOne({_id: this.userId});
				        if(user && user.profile.adminUserId)
				          userId = user.profile.adminUserId;

				      doc={
				      	    active					:true
				      	    ,name					:null
				      	    ,list					:list
				      	    ,theme					:null
				      	    ,rentingType			:null
				      	    ,movingID				:user?user.movingID:null
				      	    ,essential				:false
				      	    ,priority				:priority
				      	    ,allowNotification		:false
				      	    ,title					:title
				      	    ,advise					:null
				      	    ,productsId				:[]
				      	    ,filesId				:[]
				      	    ,videosId				:[]
				      	    ,friendsId				:[]
				      	    ,stresstype				:false
				      	    ,deadline				:null
				      	    ,reactiveCity			:null
				      	    ,ownerId				:userId
				      	    ,guestId				:guestId
				      	};

				      	Todo.insert(doc
				      				,function(error,result){
				      					if(error){
				      						throw error;
				      					}
				      				}
				      	);
				},
});

export const updatePriority = new ValidatedMethod({
  name: 'todo.updatePriority',
  validate: new SimpleSchema({
    todoId:{type:String},
    priority:{type:Boolean}
  }).validator(),
  run({ todoId,priority }) {


    Todo.update({_id: todoId}, {$set:
      {priority : priority}},function(error,result){
      console.log(error);

    })
  },
});

export const updateList = new ValidatedMethod({
  name: 'todo.updateList',
  validate: new SimpleSchema({
    todoId:{type:String},
    list:{type:String}
  }).validator(),
  run({ todoId,list }) {

    Todo.update({_id: todoId}, {$set:
      {list : list}},function(error,result){
      console.log(error);

    })
  },
});

export const updateTitle = new ValidatedMethod({
  name: 'todo.updateTitle',
  validate: new SimpleSchema({
    todoId:{type:String},
    title:{type:String}
  }).validator(),
  run({ todoId,title }) {


    Todo.update({_id: todoId}, {$set:
      {title : title}},function(error,result){
      console.log(error);

    })
  },
});

export const updateAllowNotification = new ValidatedMethod({
  name: 'todo.updateAllowNotification',
  validate: new SimpleSchema({
    todoId:{type:String},
    allowNotification:{type:Boolean}
  }).validator(),
  run({ todoId,allowNotification }) {

    if (!this.userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todo.update({_id: todoId}, {$set:
      {allowNotification : allowNotification}},function(error,result){
      console.log(error);

    })
  },
});

export const updateConseils = new ValidatedMethod({
  name: 'todo.updateConseils',
  validate: new SimpleSchema({
    todoId:{type:String},
    conseils:{type:String}
  }).validator(),
  run({ todoId,conseils }) {


    Todo.update({_id: todoId}, {$set:
      {advise : conseils}},function(error,result){
      console.log(error);

    })
  },
});

export const updateEcheance = new ValidatedMethod({
  name: 'todo.updateEcheance',
  validate: new SimpleSchema({
    todoId:{type:String},
    echeance:{type:Date}
  }).validator(),
  run({ todoId,echeance }) {

  	var deadline=null

    if (this.userId) {

    	var moving=	Moving.findOne({_id:Meteor.user().movingId});
    	if(moving && moving.movingDate){
    		var a = moment(moving.movingDate);
      		var b = moment(echeance);
      		deadline=a.diff(b, 'days')
    	}
    }

    Todo.update({_id: todoId}, {$set:
      {deadline : deadline}},function(error,result){
      console.log(error);

    })
  },
});

export const updateTodotressMode = new ValidatedMethod({
  name: 'todo.updateTodotressMode',
  validate: new SimpleSchema({
    todoId:{type:String},
    stressMode:{type:Boolean}
  }).validator(),
  run({ todoId,stressMode }) {

    if (!this.userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todo.update({_id: todoId}, {$set:
      {stresstype : stressMode}},function(error,result){
      console.log(error);

    })
  },
});

export const makeFinished = new ValidatedMethod({
  name: 'todo.makeFinished',
  validate: new SimpleSchema({
    todoId: { type: String }
  }).validator(),
  run({ todoId}) {
    const todo = Todo.findOne(todoId);
    newValue=new Date();
    if (todo.endDate && todo.endDate!=null) {
      newValue=null;
    }


    Todo.update(todoId, { $set: {
      endDate: newValue,
    } });
  },
});
export const deleteTodo = new ValidatedMethod({
  name: 'deleteTodo',
  validate: new SimpleSchema({
    todoId:{type:String},
  }).validator(),
  run(todoId) {

    Todo.remove(todoId, function (error, result) {
      if (err instanceof Meteor.Error)
          throw err;
        else {
          console.log(result);
        }

        });
  },
});

export const addTodoFriend = new ValidatedMethod({
  name: 'todo.addFriend',
  validate: new SimpleSchema({
    todoId:{type: String},
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    message:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ todoId, name, mail, message, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    if(invite_token && picture && name) {
      Todo.update({_id: todoId}, { $push: { friends: { invite_token: invite_token, name: name, picture: picture, state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(name) {
      Todo.update({_id: todoId}, { $push: { friends: { name: name, picture: '/images/perso.png' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(mail && message) {
      Todo.update({_id: todoId}, { $push: { friends: { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else {
            var todo = Todo.findOne({_id: todoId});
            Meteor.call('sendMailRequestToAFriend', mail, message, todo, function(error, result) {
            });
          }
       });
    }
    else {
      throw new Meteor.Error('paramètre manquant');
    }
  }
});

export const removeTodoFriend = new ValidatedMethod({
  name: 'todo.removeFriend',
  validate: new SimpleSchema({
    todoId:{type: String},
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true}
  }).validator(),
  run({ todoId, name, mail, invite_token}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    var todo = Todo.findOne({_id: todoId});
    if(todo) {
      var friends = todo.friends;
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
        Todo.update({_id: todoId}, { $set: { friends: friends } },
          function(error,result){
            if(error)
              throw error;
        });
      }
    }
  }
});

export const updateInvitTodoFriendMessage = new ValidatedMethod({
  name: 'user.updateInvitTodoFriendMessage',
  validate: new SimpleSchema({
    'todoId': {
      type: String
    },
    'message': {
      type: String
    }
  }).validator(),
  run({ todoId, message }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todo.update({_id: todoId}, { $set: { 'friendInvitationMessage': message } },
        function(error,result){

    });
  }
});

export const addEvent= new ValidatedMethod({
  name: 'events.addEvent',
  validate: new SimpleSchema({
    start:{type:String},
    end:{type:String},
    title:{type:String}
  }).validator(),
  run({ start, end, title }){
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Events.insert({start:start,end:end,title:title,userId:userId});
  }
});

export const updateEvent= new ValidatedMethod({
  name: 'events.updateEvent',
  validate: new SimpleSchema({
    eventId:{type:String},
    start:{type:String},
    end:{type:String},
    title:{type:String}
  }).validator(),
  run({ eventId, start, end, title }){
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Events.update({_id:eventId},{$set:{start:start,end:end,title:title,userId:userId}});
  }
});

export const deleteEvent= new ValidatedMethod({
  name: 'events.deleteEvent',
  validate: new SimpleSchema({
    eventId:{type:String}
  }).validator(),
  run({ eventId }){
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Events.remove({_id:eventId});
  }
});
