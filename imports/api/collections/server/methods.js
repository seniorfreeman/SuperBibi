import { Todos } from '../collections.js';
import { Notifications } from '../collections.js';
import { Typologies } from '../collections.js';


Meteor.startup(function() {
    Future = Npm.require('fibers/future');
    Meteor.methods({

        unlinkService: function(serviceName) {
            result = Meteor.http.get("https://graph.facebook.com/v2.6/me/permissions", {
                params: {
                    access_token: Meteor.user().services.facebook.accessToken,
                    format: "json",
                    method: "delete",
                    pretty: 0,
                    suppress_http_code: 1
                }
            });
            if (result.error) console.log(result.error);
            else {
                console.log(result);
            }
            Meteor.call('_accounts/unlink/service', Meteor.userId(), serviceName);
        },

        getListFriends: function(){
            gruntPermission = Meteor.http.get("https://graph.facebook.com/v2.6/me/permissions/user_friends", {
                params: {
                    access_token: Meteor.user().services.facebook.accessToken
                }
            });
            console.log(gruntPermission.data);
            //result = Meteor.http.get("https://graph.facebook.com/v2.6/me/invitable_friends?fields=name,picture.width(300),email", {
            result = Meteor.http.get("https://graph.facebook.com/v2.6/me/friends", {
                params: {
                    access_token: Meteor.user().services.facebook.accessToken
                }
            });

            console.log(result.data);

        },
        createTodo: function(doc){

                guestId=Meteor.call("getConnectionIP");;
                typologie=Typologies.findOne({name:"Non daté"});
                if(!Meteor.userId()){
                    doc['guestId']=guestId;
                }
                else {
                    dateDem=Meteor.user().profile.dateDemenagement

                    typologie=Typologies.findOne({name:"Pour le jour J"});
                    var now = moment();
                    var dem = moment(dateDem);

                    if (now < dem) {
                      typologie=Typologies.findOne({name:"Avant"});
                    } else{
                      typologie=Typologies.findOne({name:"Après"});
                    }

                }

                doc.typologie= typologie._id
                Todos.insert(doc,function(error,result){
                    if(error)throw new Meteor.Error("Créate Tod failed:"+error);
                    else {
                        const todo=Todos.findOne({_id:result}) ;
                        if(!todo.ownerId) return;
                        const notifText="Une Tâche intitulée :"+title +", vient d’être créer à la date du :"+ moment().utc( todo.createdAt, "YYYY-MM-DD" ).format('YYYY-MM-DD');
                        Notifications.insert({
                            todoId:todo._id,
                            status:'Added',
                            text:notifText,
                            userId:todo.ownerId
                        });
                    }
                });

            },
            getOffres:function(departLocation){
                var reponse = [];
                    resultat= Meteor.http.call("POST", "http://www.ada.fr/api/json/offres",
                        { params :{
                            "login": "superbibi",
                            "pwd": "adademenagement",
                            "origine": "",
                            "type": "vu",
                            "localisation": departLocation,
                            "debut": "2016-11-11 12:13",
                            "fin": "2016-11-11 12:13",
                            "distance": ""
                        },
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                    var agenceLocation = Meteor.http.call("Get", "https://maps.googleapis.com/maps/api/geocode/json?address="+resultat.data.agence.cp +"+"+resultat.data.agence.adresse1+"+"+resultat.data.agence.ville);
                    resultat.data.agence['agenceLocation']={
                        lat: agenceLocation.data.results[0].geometry.location.lat,
                        lng: agenceLocation.data.results[0].geometry.location.lng
                    };
                    return resultat;
            },
        getGuestLocation:function(){
            var ip = this.connection.clientAddress;
                if (ip === '127.0.0.1') {
                    try {
                        this.unblock();
                        ip = Meteor.http.call("Get",'https://ip.appspot.com/').content;
                    } catch(e) {
                        throw new Meteor.Error('[user-location] Couldn\'t get user IP');
                    }
                }
            var location =Meteor.http.call("Get",'http://freegeoip.net/json/'+ip);
            return location;
        },
        getAccessToken : function() {
            try {
              return Meteor.user().services.facebook.accessToken;
            } catch(e) {
              return null;
            }
        },
        confirmFriend : function(userId, mail, confirm) {
            if (!userId) {
              throw new Meteor.Error('accès refusé');
            }
            var user = Meteor.users.findOne({_id: userId});
            if(!user) {
              throw new Meteor.Error('user not found');
            }

            var friends = user.profile.movers;
            var founded = false;
            var idx;
            for(idx in friends) {
              if(friends[idx].mail == mail) {
                founded = true;
                break;
              }
            }
            if(founded) {
              if(confirm)
                friends[idx].state = "accepted";
              else
                friends[idx].state = "refused";
              Meteor.users.update({_id: userId}, { $set: { 'profile.movers': friends } },
                function(error,result){
                  if(error)
                    throw error;
              });
            }
        },
        getGuestLocation:function(){
            var ip = this.connection.clientAddress;
                if (ip === '127.0.0.1') {
                    try {
                        this.unblock();
                        ip = Meteor.http.call("Get",'https://ip.appspot.com/').content;
                    } catch(e) {
                        throw new Meteor.Error('[user-location] Couldn\'t get user IP');
                    }
                }
            var location =Meteor.http.call("Get",'http://freegeoip.net/json/'+ip);
            return location;
        },
        deleteAllTodosSession:function(){
            var gusetIp= this.connection.clientAddress;
            Todos.remove({guestId:gusetIp})
        },
        recoverTodosSession:function(){
            var gusetIp= this.connection.clientAddress;
            var userId=Meteor.userId();
            if(userId){
                try {
                       Todos.updateMany(
                          { guestId:gusetIp},
                          { $set: { ownerId : userId, guestId:null} }
                       );
                    } catch (e) {
                         throw new Meteor.Error(e);
                    }
            }
		},
        confirmTodoFriend : function(userId, mail, todoId, confirm) {
            var todo = Todos.findOne({_id: todoId});
            if(todo) {
              var friends = todo.friends;
              var founded = false;
              var idx;
              for(idx in friends) {
                if(friends[idx].mail == mail) {
                  founded = true;
                  break;
                }
              }
              if(founded) {
                if(confirm)
                  friends[idx].state = "accepted";
                else
                  friends[idx].state = "refused";
                Todos.update({_id: todoId}, { $set: { friends: friends } },
                  function(error,result){
                    if(error)
                      throw error;
                });
              }
            }
      },
      confirmCoMover : function(userId, mail, confirm) {
            if (!userId) {
              throw new Meteor.Error('accès refusé');
            }
            var user = Meteor.users.findOne({_id: userId});
            if(!user) {
              throw new Meteor.Error('user not found');
            }

            var coMovers = user.profile.coMovers;
            var founded = false;
            var idx;
            for(idx in coMovers) {
              if(coMovers[idx].mail == mail) {
                founded = true;
                break;
              }
            }
            if(founded) {
              if(confirm)
                coMovers[idx].state = "accepted";
              else
                coMovers[idx].state = "refused";
              Meteor.users.update({_id: userId}, { $set: { 'profile.coMovers': coMovers } },
                function(error,result){
                  if(error)
                    throw error;
              });
            }
        },
        createInvitedUser: function(mail, password, token) {
            Accounts.createUser({
                email : mail,
                password : password,
                profile  : {
                    invitation_token: token
                }
            });
        },

        getConnectionIP: function () {

           // No need to make others wait
           this.unblock();

           // Locals
           var conn        = this.connection;
           var ipPublic    = conn.clientAddress;
           var ipSource    = conn.httpHeaders['x-forwarded-for'].split(',')[0]
                           || ipPublic;
           var prox        = (process.env.HTTP_FORWARDED_COUNT)
                           ? parseInt(process.env.HTTP_FORWARDED_COUNT)
                           : 0;
           // Determine IP to log
           return (prox) ? ipSource : ipPublic;

       },
    });
});
