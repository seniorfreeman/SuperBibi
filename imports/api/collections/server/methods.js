import {List, Todo,Video,File,Product } from '../todo/todo.js';


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
            getAgenceInformations: function(id) {
              var reponse = [];
              resultat= Meteor.http.call("GET", "http://www.ada.fr/api/json/agence?agence=" + id,
                { 
                  params :{
                  },
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }
              );
              return resultat;
            },
        getGuestLocation:function(){
            // var ip = this.connection.clientAddress;
            //     if (ip === '127.0.0.1') {
            //         try {
            //             this.unblock();
            //             ip = Meteor.http.call("Get",'https://ip.appspot.com/').content;
            //         } catch(e) {
            //             throw new Meteor.Error('[user-location] Couldn\'t get user IP');
            //         }
            //     }
            // var location =Meteor.http.call("Get",'http://freegeoip.net/json/'+ip);
            // return location;
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

            if(user.profile.adminUserId)
                user = Meteor.users.findOne({_id: user.profile.adminUserId});

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
              Meteor.users.update({_id: user._id}, { $set: { 'profile.movers': friends } },
                function(error,result){
                  if(error)
                    throw error;
              });
            }
        },
        confirmTodoFriend : function(userId, mail, todoId, confirm) {
            var todo = Todo.findOne({_id: todoId});
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
                Todo.update({_id: todoId}, { $set: { friends: friends } },
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

            if(user.profile.adminUserId)
                user = Meteor.users.findOne({_id: user.profile.adminUserId});

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
       importProducts:function(){
            try {
                console.log('=====>Import Product');
                allProducts = JSON.parse(Assets.getText("todos/products.json"));
                Product.remove({});
                for(var index in allProducts) {
                  Product.insert({
                    importId:allProducts[index].ID,
                    title:allProducts[index].title ,
                    description:allProducts[index].description ,
                    apiProductId:allProducts[index].apiProductId,
                    altCallToActionText:allProducts[index].altCallToActionText,
                    imageUrl:allProducts[index].image_url,
                    href:allProducts[index].href
                  })
                 }
              }
              catch(e) {
                console.log(e)
              }
       },
       importVideos:function(){
              try {
                console.log('=====>Import Video');
                allVideos = JSON.parse(Assets.getText("todos/videos.json"));
                Video.remove({});
                for(var index in allVideos) {
                  Video.insert({
                    importId:allVideos[index].ID,
                    title:allVideos[index].title ,
                    url:allVideos[index].media_url 
                  })
                 }
              }
              catch(e) {
                console.log(e)
              }
       },
       importKeyWords:function(){
        
       },
       importTodos:function(guestId){
          try {
           
            console.log('=====>Import Todo');

                allTodos = JSON.parse(Assets.getText("todos/Todos.json"));
                console.log('=====>Import Todo['+allTodos.length+']');
                 Todo.remove({guestId:guestId})
                for(var index in allTodos) {
                  list=List.findOne({'name': {'$regex': allTodos[index].list,$options:'i'}});
                  
                  Ids=[];
                  videosId=[];
                  productId=[];
                  if(allTodos[index].videosId && allTodos[index].videosId!=""){
                    Ids=allTodos[index].videosId.toString().split(' ');
                    videosId=Video.find({importId:{$in:{Ids}}},{_id:1});
                  }
                  
                  if(allTodos[index].videosId && allTodos[index].videosId!=""){
                    Ids=allTodos[index].productsId.toString().split(' ');
                    productId=Video.find({importId:{$in:{Ids}}},{_id:1});
                  }

                  if(list) {
                    
                      doc={
                        active          :Boolean(allTodos[index].active)
                        ,name         :allTodos[index].name
                        ,list         :list._id
                        ,theme          :allTodos[index].theme
                        ,rentingType      :allTodos[index].rentingType
                        ,movingID       :null
                        ,essential        :false
                        ,priority       :Boolean(allTodos[index].priority)
                        ,allowNotification    :false
                        ,title          :allTodos[index].name
                        ,advise         :allTodos[index].advise
                        ,productsId       :productId
                        ,filesId        :[]
                        ,videosId       :videosId
                        ,friendsId        :[]
                        ,stresstype       :Boolean(allTodos[index].stressType)
                        ,deadline       :allTodos[index].deadline
                        ,reactiveCity     :allTodos[index].reactiveCity
                        ,ownerId        :null
                        ,guestId        :guestId
                    };
                    
                      Todo.insert(doc,function(error,result){if(error)condole.log(error);})
                      
                }
                else{
                  console.log('Error=====>'+allTodos[index].list);
                 }
                }
               
              }
              catch(e) {
                console.log('Error=====>'+e);
              }
       },
       restoreDataToConnected:function(guestId,userId){
            Todo.update({guestId:guestId},{$set:{ownerId:userId,guestId:null}},{multi:true});
       },
       eventsOnHooksInit : function(){},
    });
});


