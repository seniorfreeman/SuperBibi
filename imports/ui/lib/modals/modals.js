import './modals.jade'

import './header.jade'
import './inputAndTextarea.jade'
import './inputAutocomplete.jade'
import './input.jade'
import './textarea.jade'
import './textReadOnly.jade'
import './footer.jade'

import './modalOverrides.jade'


/**
	Utilisation des pages modales

	1) Créer un template contenant le template générique de modale.
	Ex:
		template(name='modalExample')
			{{> modals}}
	2) Paramètrer la modale en ajoutant des paramètres
	Ex:
		{{> modals inputAutocomplete=true modalTitle="Nouveau co-déménageur" modalDescription="" autocompleteSettings=settings inputLabel="Entrez un nom, un mail, ou choisissez un ami" cancelBtnLabel="Annuler" validBtnLabel="Ajouter"}}

	Il faut définir le type de modal à utiliser en mettant en premier paramètre soit:
		inputAndTextarea=true ou inputAutocomplete=true

	Liste des paramètres:
		globaux:
			modalTitle
			modalDescription
			cancelBtnLabel
			validBtnLabel

		inputAndTextarea:
			mailToLabel
			enterMessageLabel

		inputAutocomplete:
			autocompleteSettings (objet contenant les paramètres de l'autocomplete (cf: https://atmospherejs.com/mizzao/autocomplete) : utiliser un helper)
			inputLabel

	3) Appeler la modal en executant Modal.show('nomDuTemplate');
	Ex: Modal.show('modalExample');

	4) Récupérer et traiter les évenements via Template.nomDuTemplate.events(...)
	Ex:
		Template.modalExample.events({
		  'click footer button.rouge': function(event, template) {
		    Modal.hide();
		  }
		});

	NB: Pour fermer la modale, executez Modal.hide();


template(name='modalAlert')
	{{> modals modalTitle="couuou" inputAndTextarea=false inputAutocomplete=false validBtnLabel="ok"}}

	window.alert = function(mes){
		Modal.show('modalAlert');
		console.log(mes);
	}

	Template.modalAlert.events({
	'click footer button.vert': function(event, template) {
	  Modal.hide();
	}
	});

	Template.modalAlert.helpers({});


**/


Template.modals.onCreated(function(){});

Template.modals.helpers({});