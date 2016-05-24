import { AccountsTemplates } from 'meteor/useraccounts:core';
import { TAPi18n } from 'meteor/tap:i18n';
import { Accounts } from 'meteor/accounts-base'


T9n.setLanguage("fr");
  TAPi18n.setLanguage("fr");
moment.locale('fr');


AccountsTemplates.configure({
  showForgotPasswordLink: true,
  texts: {
    errors: {
      loginForbidden: TAPi18n.__('Incorrect username or password'),
      pwdMismatch: TAPi18n.__('Passwords don\'t match'),
    },
    title: {
      signIn: TAPi18n.__('Sign In'),
      signUp: TAPi18n.__('Join'),
    },
  },
  //onLogoutHook: myPostLogout,
  defaultTemplate: 'Auth_page',
  defaultLayout: 'App_body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
});

AccountsTemplates.configureRoute('resetPwd');

AccountsTemplates.configureRoute('verifyEmail');

Avatar.setOptions({
  defaultImageUrl: "/images/avatar.png",
  customImageProperty: function() {
    var user = this;
    // calculate the image URL here
    return user.profile.picture;
  }
});

Accounts.ui.config({
  requestPermissions: {
     facebook: ['email', 'public_profile', 'user_friends']
  }
});
