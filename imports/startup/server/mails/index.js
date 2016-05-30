import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'Mon Super Déménagement';

Accounts.emailTemplates.from = Accounts.emailTemplates.siteName + ' <no-reply@epicea.com>';

//import './mails/config.js';
Meteor.startup( function() {
	process.env.MAIL_URL = "smtp://SMTP_Injection:132c4d4b4c95516afba9ce5f43fc8a60009c9a00@smtp.sparkpostmail.com:2525";
});

import './mailer.js';

import './verifyAccount.js';

// This file configures the Accounts package to define the UI of the reset password email.
import './resetPassword.js';
