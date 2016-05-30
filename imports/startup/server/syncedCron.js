Meteor.startup(function(){

  SyncedCron.config({
    // Log job run details to console
    log: true,

    // Use a custom logger function (defaults to Meteor's logging package)
    logger: null,

    // Name of collection to use for synchronisation and logging
    collectionName: 'cronNotificationsHistory',

    // Default to using localTime
    utc: false,
    collectionTTL: 172800
  });

  SyncedCron.add({
    name: 'send grouped Notifications for users',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('at 9:00 pm');
    },
    job: function() {
    
      Meteor.user().forEach(function(user){
        Meteor.call('sendMailNotification', user);
      });

      return ;
    }

  });
/*
  SyncedCron.add({
    name: 'Récupérer moyenne de carburant',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 20 seconds');
    },
    job: function() {
      console.log('lancement get carburant')
       Meteor.http.call("GET", "http://donnees.roulez-eco.fr/opendata/jour')",function(error, results){
        console.log(results);
          return "Carburant Done";
       });

      
    }
  });
*/
  SyncedCron.start();

});