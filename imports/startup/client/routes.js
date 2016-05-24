import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Meteor } from 'meteor/meteor';

// Import to load these templates
import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/home-page.js';
import '../../ui/pages/app-not-found.js';

// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

FlowRouter.route('/List/:_id', {
  name: 'List.show',
  action() {
    BlazeLayout.render('App_body', { main: 'home_page' });
  },
});
FlowRouter.route('/List/:_id/todo/:_idTodo', {
  name: 'Todo.show',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'home_page' });
    $('body').removeClass('soft').toggleClass('aside', true);
    $('aside article').parents('form:first').attr('id', params._idTodo);
  },
});

FlowRouter.route('/content/:page', {
  name: 'side',
  action() {
    Meteor.call("getGuestLocation", function(error, result){
              data=JSON.parse(result.content);
              Session.set("locationData", data);
          });
    BlazeLayout.render('App_body', { main: 'home_page' });
    $('body').removeClass('aside').toggleClass('soft', true);
  },
});
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'home_page' });
  },
});
FlowRouter.route('/user/:userId/mailResponse/:mail', {
  name: 'User.response',
  triggersEnter: [function(context, redirect) {
    Meteor.call('confirmFriend', context.params.userId, context.params.mail, (context.queryParams.rep === 'true'), function (error, result) { 
      if(error)
        console.log(error)
    });
    redirect('/');
  }]
});
FlowRouter.route('/user/:userId/mailResponse/:mail/coMover', {
  name: 'User.response',
  triggersEnter: [function(context, redirect) {
    Meteor.call('confirmCoMover', context.params.userId, context.params.mail, (context.queryParams.rep === 'true'), function (error, result) { 
      if(error)
        console.log(error)
    });
    redirect('/');
  }]
});
FlowRouter.route('/user/:userId/mailResponse/:mail/todo/:todoId', {
  name: 'User.response',
  triggersEnter: [function(context, redirect) {
    Meteor.call('confirmTodoFriend', context.params.userId, context.params.mail, context.params.todoId, (context.queryParams.rep === 'true'), function (error, result) { 
      if(error)
        console.log(error)
    });
    redirect('/');
  }]
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin',
});

FlowRouter.route( '/signin/:token', {
  name: 'signin',
  action( params, queryParams ) {
    BlazeLayout.render('App_body', { main: 'invitation_page', params: {token: params.token, mail: queryParams.mail} });
    //ReactLayout.render( App, { yield: <Signup token={ params.token } /> } );
  }
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
  triggersEnter(context, redirect) {
    if ( !Meteor.userId() ) redirect('/');
  },
};


// FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn], {
//     except: [ 'atSignUp', 'atForgotPwd', 'atResetPwd', 'atVerifyEmail']
// });
