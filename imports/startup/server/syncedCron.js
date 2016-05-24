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
      //return parser.text('every 1 mins');
    },
    job: function() {

      console.log('==============> démarrage du cron notification');
      Meteor.call('sendNotificationForAllUsers');
      console.log('==============> Fin du cron notification');

      return ;
    }

  });

  SyncedCron.start();

});
