// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// Set up some rate limiting and other important security settings.
import './security.js';

//
import './Accounts-config.js'

// This defines all the collections, publications and methods that the application provides as an API to the client.
import './register-api.js';

//
import './social-config.js';

//
import './upload-config.js';

//
import './mails/index.js';

import './syncedCron.js';
//
import './volumeObjects/index.js';

Meteor.startup( function() {
  //process.env.HTTP_FORWARDED_COUNT=1;
});
