import { Accounts } from 'meteor/accounts-base';
import { TAPi18n } from 'meteor/tap:i18n';

Accounts.emailTemplates.resetPassword.subject = function(user, url) {    
    return TAPi18n.__('pwdRebuildTitle');
};

Accounts.emailTemplates.resetPassword.html = function(user, url) {
    
	const path = Meteor.absoluteUrl();

	// CORPS ---------------------------------------------------------------------------------------------------------

	SSR.compileTemplate('pwdRebuild', Assets.getText('mailsTemplates/simpleCallToAction.html'));
	
	var email = user.services.facebook ? user.services.facebook.email : user.emails[0].address;
	const titre = user.prenom ? user.prenom : email.substring(0, email.indexOf('@'));

	var contentHtml = SSR.render("pwdRebuild", {
		emailWelcome      : user.tutoiement ? TAPi18n.__('salut') : TAPi18n.__('bonjour'),
		emailTo           : titre,
		emailTitle        : TAPi18n.__('pwdRebuildTitle'),
		emailContent      : TAPi18n.__('pwdRebuildContent'),
		callToActionLink  : url,
		callToActionText  : TAPi18n.__('pwdRebuildActionText'),
		path              : path
	});
	
	// FOOTER ---------------------------------------------------------------------------------------------------------

	SSR.compileTemplate('corp', Assets.getText('mailsTemplates/corp.html').replace('{{contentHtml}}',contentHtml));
	var corp = SSR.render("corp", {
		path  : path,
	    emailImage    : path+"emages/headPwdRebuild.png",
		emailTitle  : TAPi18n.__('pwdRebuildTitle')
	});
	
    return corp;
};
