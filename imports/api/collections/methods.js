import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Events } from './collections.js';
import { Todos } from './collections.js';
import { Lists } from './collections.js';
import { Uploads } from './collections.js';
import { Notifications } from './collections.js';
import { Rooms } from './collections.js';
import { RoomObjects } from './collections.js';

export const insert = new ValidatedMethod({
  name: 'todos.insert',
  validate: new SimpleSchema({
    list: { type: String },
    title: { type: String },
    prioritaire:{type:Boolean},
  }).validator(),
  run({ list, title,prioritaire }) {

        docTodod={
          list: list,
          typologie: null,
          links:[],
          products:[],
          documents:["5714c3a157fdd0e8ed723603"],
          videos:[],
          ownerId:this.userId,
          gestId:null,
          friends:[],
          prioritaire:prioritaire,
          stressMode:false,
          allowNotification:false,
          title:title,
          conseils:" ",
          videos:[],
          createdAt:  new Date()
          ,
        }
        Meteor.call('createTodo',docTodod);


  },
});
export const createNotification = new ValidatedMethod({
  name: 'todos.createNotification',
  validate: new SimpleSchema({
    userId: { type: String },
    status:{type:String},
    text:{type:String},
    todoId:{type:String},
  }).validator(),
  run({ userId, status,text,todoId }) {

    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Notifications.insert({
      userId: userId,
      status:status,
      text:text,
      todoId:todoId,
    },function(error,result){
      console.log(error);

    })
  },
});
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

    var id = Rooms.insert({
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

    Rooms.update({_id: roomId}, {$set:
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

    Rooms.remove(roomId);
    var roomObjects = RoomObjects.find({roomId: roomId});
    roomObjects.forEach(function(roomObject) {
      RoomObjects.remove(roomObject._id);
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

    RoomObjects.insert({
      roomId: roomId,
      title: title,
      volume: volume
    },function(error,result){
      if(error)
        throw error;
    })
  },
});
export const updateRoomObject = new ValidatedMethod({
  name: 'rooms.updateObject',
  validate: new SimpleSchema({
    roomObjectId:{type:String},
    volume:{type:Number,decimal: true}
  }).validator(),
  run({ roomObjectId,volume }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    RoomObjects.update({_id: roomObjectId}, {$set:
      {volume : volume}
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

    RoomObjects.remove(roomObjectId);
  }
});
export const updatePrioritaire = new ValidatedMethod({
  name: 'todos.updatePrioritaire',
  validate: new SimpleSchema({
    todoId:{type:String},
    prioritaire:{type:Boolean}
  }).validator(),
  run({ todoId,prioritaire }) {


    Todos.update({_id: todoId}, {$set:
      {prioritaire : prioritaire}},function(error,result){
      console.log(error);

    })
  },
});
export const updateList = new ValidatedMethod({
  name: 'todos.updateList',
  validate: new SimpleSchema({
    todoId:{type:String},
    list:{type:String}
  }).validator(),
  run({ todoId,list }) {


    Todos.update({_id: todoId}, {$set:
      {list : list}},function(error,result){
      console.log(error);

    })
  },
});
export const updateText = new ValidatedMethod({
  name: 'todos.updateText',
  validate: new SimpleSchema({
    todoId:{type:String},
    text:{type:String}
  }).validator(),
  run({ todoId,text }) {


    Todos.update({_id: todoId}, {$set:
      {title : text}},function(error,result){
      console.log(error);

    })
  },
});
export const updateAllowNotification = new ValidatedMethod({
  name: 'todos.updateAllowNotification',
  validate: new SimpleSchema({
    todoId:{type:String},
    allowNotification:{type:Boolean}
  }).validator(),
  run({ todoId,allowNotification }) {

    if (!this.userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todos.update({_id: todoId}, {$set:
      {allowNotification : allowNotification}},function(error,result){
      console.log(error);

    })
  },
});
export const updateConseils = new ValidatedMethod({
  name: 'todos.updateConseils',
  validate: new SimpleSchema({
    todoId:{type:String},
    conseils:{type:String}
  }).validator(),
  run({ todoId,conseils }) {


    Todos.update({_id: todoId}, {$set:
      {conseils : conseils}},function(error,result){
      console.log(error);

    })
  },
});
export const updateEcheance = new ValidatedMethod({
  name: 'todos.updateEcheance',
  validate: new SimpleSchema({
    todoId:{type:String},
    echeance:{type:Date}
  }).validator(),
  run({ todoId,echeance }) {



    Todos.update({_id: todoId}, {$set:
      {echeance : echeance}},function(error,result){
      console.log(error);

    })
  },
});
export const updateTodoStressMode = new ValidatedMethod({
  name: 'todos.updateTodoStressMode',
  validate: new SimpleSchema({
    todoId:{type:String},
    stressMode:{type:Boolean}
  }).validator(),
  run({ todoId,stressMode }) {

    if (!this.userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todos.update({_id: todoId}, {$set:
      {stressMode : stressMode}},function(error,result){
      console.log(error);

    })
  },
});



export const makeFinished = new ValidatedMethod({
  name: 'todos.makeFinished',
  validate: new SimpleSchema({
    todoId: { type: String }
  }).validator(),
  run({ todoId}) {
    const todo = Todos.findOne(todoId);
    newValue=new Date();
    if (todo.dateFin && todo.dateFin!=null) {
      newValue=null;
    }


    Todos.update(todoId, { $set: {
      dateFin: newValue,
    } });
  },
});
export const updateProfile = new ValidatedMethod({
  name: 'updateProfile',
  validate: new SimpleSchema({
    nom: { type: String },
    prenom: { type: String },
    address: { type: String },
    ville: { type: String },
    postalCode: { type: String },
    stressMode:{type:Boolean},
    dateDemenagement:{type: Date}

  }).validator(),
  run({ nom,prenom,address,ville,postalCode,stressMode,dateDemenagement}) {


    Meteor.users.update({_id: Meteor.userId()},{$set:
      {"profile.nom" : nom,
      "profile.prenom" :  prenom,
      "profile.address" :  address,
      "profile.postalCode":  postalCode,
      "profile.ville" :  ville,
      "profile.stressMode" :  stressMode,
      "profile.dateDemenagement":dateDemenagement
    }}
    , function (error) {
    console.log(error);
    });
  },
});
export const deleteTodo = new ValidatedMethod({
  name: 'deleteTodo',
  validate: new SimpleSchema({
    todoId:{type:String},
  }).validator(),
  run(todoId) {

    Todos.remove(todoId, function (error, result) {
      if (err instanceof Meteor.Error)
          throw err;
        else {
          console.log(result);
        }

        });
  },
});
export const deleteUser = new ValidatedMethod({
  name: 'deleteUser',
  validate: new SimpleSchema({
  }).validator(),
  run() {

    Meteor.call('sendMailAdieu', Meteor.user());

    // Meteor.users.update({'_id':Meteor.userId()},{$set: {'stressMode':'false'}});
    Meteor.users.remove({_id:Meteor.userId()});
  },
});
export const updateStressMode = new ValidatedMethod({
  name: 'updateStressMode',
  validate: new SimpleSchema({
    stressMode: { type: Boolean },

  }).validator(),
  run({ stressMode}) {

    if(!Meteor.userId())
      throw new Meteor.Error('accès refusé');
    Meteor.users.update({_id: Meteor.userId()}, {$set:
      {"profile.stressMode" : stressMode}}, function (error) {
    console.log(error);
    });
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

export const deleteFile = new ValidatedMethod({
  name: 'deleteFile',
  validate: new SimpleSchema({
    _id: { type: String },

  }).validator(),
  run({ _id}) {

    var upload = Uploads.findOne(_id);
    if (upload == null) {
      throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
    }

    UploadServer.delete(upload.path);
    Uploads.remove(_id);

  },});

export const addFriend = new ValidatedMethod({
  name: 'user.addFriend',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ name, mail, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

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
    else if(mail) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.movers': { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else
            Meteor.call('sendMailRequestToAFriend', mail, function(error, result) {
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



export const addTodoFriend = new ValidatedMethod({
  name: 'todo.addFriend',
  validate: new SimpleSchema({
    todoId:{type: String},
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ todoId, name, mail, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    if(invite_token && picture && name) {
      Todos.update({_id: todoId}, { $push: { friends: { invite_token: invite_token, name: name, picture: picture, state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(name) {
      Todos.update({_id: todoId}, { $push: { friends: { name: name, picture: '/images/perso.png' } } },
        function(error,result){
          if(error)
            throw error;
      });
    }
    else if(mail) {
      Todos.update({_id: todoId}, { $push: { friends: { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else {
            var todo = Todos.findOne({_id: todoId});
            Meteor.call('sendMailRequestToAFriend', mail, todo, function(error, result) {
            });
          }
       });
    }
    else {
      throw new Meteor.Error('paramètre manquant');
    }
  },
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

    var todo = Todos.findOne({_id: todoId});
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
        Todos.update({_id: todoId}, { $set: { friends: friends } },
          function(error,result){
            if(error)
              throw error;
        });
      }
    }
  }
});

export const addCoMover = new ValidatedMethod({
  name: 'user.addCoMover',
  validate: new SimpleSchema({
    name:{type:String, optional: true},
    mail:{type:String, optional: true},
    invite_token:{type:String, optional: true},
    picture:{type:String, optional: true}
  }).validator(),
  run({ name, mail, invite_token, picture }) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

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
    else if(mail) {
      Meteor.users.update({_id: userId}, { $push: { 'profile.coMovers': { mail: mail, picture: '/images/perso.png', state: 'pending' } } },
        function(error,result){
          if(error)
            throw error;
          else {
            Meteor.call('sendInvitationMail', mail, function(error, result) {
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
    invite_token:{type:String, optional: true}
  }).validator(),
  run({ name, mail, invite_token}) {
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    var coMovers = Meteor.user().profile.coMovers;

    var idx;
    var founded = false;

    if(invite_token) {
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

export const updateTodoDate= new ValidatedMethod({
  name: 'todos.updateTodoDate',
  validate: new SimpleSchema({
    todoId:{type:String},
    start:{type:String},
    //end:{type:String},
  }).validator(),
  run({ todoId, start }){
    var userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('accès refusé');
    }

    Todos.update({_id:todoId},{$set:{createdAt:start,userId:userId}});
  }
});
