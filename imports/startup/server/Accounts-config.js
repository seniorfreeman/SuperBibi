import { Accounts } from 'meteor/accounts-base';
import { Demenagement } from '../../api/collections/collections.js';

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    forbidClientAccountCreation : false,
    enforceEmailVerification: false,
    enablePasswordChange: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
});

Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.resetPassword  = function(token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.onCreateUser(function(options, user) {
    if (!options.profile)
      options.profile = {}

    if(options.profile.invitation_token) {
      var jwt = require('jwt-simple');
      try {
        var decoded = jwt.decode(options.profile.invitation_token, user.emails[0].address);
        if(decoded.expiration < new Date()) {
          throw new Meteor.Error(403, 'token expiré');
        }
        else
          console.log("non expiré")
        options.profile.adminUserId = decoded.userId;
        
      }
      catch(e) {
        throw new Meteor.Error(403, 'Problème de token');
      }
    }

    if (!user.services.facebook) {
      options.profile.nom = "";
      options.profile.prenom = "";
      options.profile.address = "";
      options.profile.postalCode = "";
      options.profile.ville = "";
      options.profile.picture = "";
      options.profile.services = "";
      options.profile.serviceId = "";
      options.profile.coMovers = [];
      options.profile.movers = [];
      options.profile.stressMode = false;
      options.profile.dateDemenagement = null;
      options.profile.departAdress = null;
      options.profile.distAdress = null;
      user.profile = options.profile ;

    } else {

      result = Meteor.http.get("https://graph.facebook.com/v2.0/me?fields=id,first_name,last_name,gender,email,name,friends,picture,location{location{city,country,region,state,zip,latitude,longitude,name}}",{params:{access_token: user.services.facebook.accessToken}});

      if(result.error)
        console.log(result.error);

      tmpprofile = _.pick (result.data, ['id', 'gender', 'first_name','last_name','email','picture','location']);

      console.log(tmpprofile.location);

      options.profile.nom = tmpprofile.last_name;
      options.profile.prenom = tmpprofile.first_name;
      options.profile.address = "";
      options.profile.postalCode = tmpprofile.location?tmpprofile.location.zip:"";
      options.profile.ville = tmpprofile.location?tmpprofile.location.city:"";
      options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
      options.profile.services = "facebook";
      options.profile.serviceId = user.services.facebook.id;
      options.profile.stressMode = false;
      options.profile.dateDemenagement = null;
      options.profile.departAdress = null;
      options.profile.distAdress = null;
      user.profile = options.profile;

    }

    return user;
});

Meteor.methods({
  '_accounts/unlink/service': function (userId, serviceName) {
    Accounts.unlinkService(userId, serviceName);
  }
});
