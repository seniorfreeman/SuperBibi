/**
	Utilisation de alert modal
	window.alert("contenu de l'alerte");

	Utilisation du confirm modal
	window.confirm("titre du confirm", function(resultat) {
		//callback appelé lors de la confirmation avec resultat => true / false suivant choix de l'utilisateur
	});

	Utilisation du prompt modal
	window.prompt("titre du prompt", "placeholder de l'input", function(resultat) {
		//callback appelé lors de la confirmation avec resultat => valeur de l'input
	});
**/


var callback;

window.alert = function(msg){
   Modal.show('alert_modal', {title: msg});
}

window.confirm = function(title, msg, cb){
	callback = cb;
   	Modal.show('confirm_modal', {title: title});
}

window.prompt = function(title, defaultContent, cb){
	callback = cb;
   	Modal.show('prompt_modal', {title: title, inputLabel: defaultContent});
}

Template.alert_modal.helpers({
	
});

Template.alert_modal.events({
	'click footer button.vert': function(event, template) {
		Modal.hide();
	}
});

Template.confirm_modal.helpers({
	
});

Template.confirm_modal.events({
	'click footer button.rouge': function(event, template) {
		callback(false);
		Modal.hide();
	},
	'click footer button.vert': function(event, template) {
		callback(true);
		Modal.hide();
	}
});

Template.prompt_modal.helpers({
	
});

Template.prompt_modal.events({
	'click footer button.vert': function(event, template) {
		callback(template.$('input').val());
		Modal.hide();
	},
	'click footer button.rouge': function(event, template) {
		callback(null);
		Modal.hide();
	}
});