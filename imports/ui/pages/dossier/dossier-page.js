import './dossier-page.jade';

import {
  updateFolder,
  updateRoadmap
} from '../../../api/collections/profile/methods.js';

import Docxtemplater from 'docxtemplater';
import JSZipUtils from 'jszip-utils';

var timeouts = [];

Template.dossier_page.onCreated(function() {

});

Template.dossier_page.helpers({
	addressChangeToggleData: function(){
		var user = Meteor.user();
		var value = user ? user.profile.folders.addressChange.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateFolder.call({addressChange: val}, function (error, result) { 
			  		console.log(error)
			  		console.log(result)
			    });
			  }
		}};
	},
	addressChangeContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.folders.addressChange.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	dayOffToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.folders.dayOff.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateFolder.call({dayOff: val}, function (error, result) { 
			    });
			  }
		}};
	},
	dayOffContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.folders.dayOff.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	neighboorsToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.folders.neighboors.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateFolder.call({neighboors: val}, function (error, result) { 
			    });
			  }
		}};
	},
	neighboorsContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.folders.neighboors.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	waterAndFoodToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.roadmap.waterAndFood.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateRoadmap.call({waterAndFood: val}, function (error, result) { 
			    });
			  }
		}};
	},
	waterAndFoodContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.roadmap.waterAndFood.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	musicToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.roadmap.music.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateRoadmap.call({music: val}, function (error, result) { 
			    });
			  }
		}};
	},
	musicContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.roadmap.music.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	stopWaterAndElectricityToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.roadmap.stopWaterAndElectricity.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateRoadmap.call({stopWaterAndElectricity: val}, function (error, result) { 
			    });
			  }
		}};
	},
	stopWaterAndElectricityContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.roadmap.stopWaterAndElectricity.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	gasUpToggleData: function(){
	  	var user = Meteor.user();
		var value = user ? user.profile.roadmap.gasUp.enabled : false;
		return {
			value: value,
			options: {
			  atts: {},
			  classLabel: "",
			  labelOn: 'ON',
			  labelOff: 'OFF',
			  label: '',
			  value: false,
			  onChanged: function(val, obj){
			  	updateRoadmap.call({gasUp: val}, function (error, result) { 
			    });
			  }
		}};
	},
	gasUpContent: function() {
		var user = Meteor.user();
		var value = user ? user.profile.roadmap.gasUp.content : '';
		if(value != '')
			return value;
		else
			return false;
	},
	roadmapUri: function() {
		return null;
	}
});

Template.dossier_page.events({
	'click table tr td:nth-child(1)' : function(event, template) {
		var tr = $(event.target).closest('tr');
		var i = $(event.target);

		if(tr && i) {
			if (!i.is( "i" ))
				i = i.find('i');
			tr.toggleClass('opened');
			i.toggleClass('fa-chevron-right')
			i.toggleClass('fa-chevron-down')
		}
	},
	'keyup .address-change-textarea': function(event, template) {
      clearTimeout(timeouts['address-change-textarea']);
      timeouts['address-change-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateFolder.call({addressChangeContent: template.$('.address-change-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .day-off-textarea': function(event, template) {
      clearTimeout(timeouts['day-off-textarea']);
      timeouts['day-off-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateFolder.call({dayOffContent: template.$('.day-off-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .neighboors-textarea': function(event, template) {
      clearTimeout(timeouts['neighboors-textarea']);
      timeouts['neighboors-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateFolder.call({neighboorsContent: template.$('.neighboors-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .water-and-food-textarea': function(event, template) {
      clearTimeout(timeouts['water-and-food-textarea']);
      timeouts['water-and-food-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoadmap.call({waterAndFoodContent: template.$('.water-and-food-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .music-textarea': function(event, template) {
      clearTimeout(timeouts['music-textarea']);
      timeouts['music-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoadmap.call({musicContent: template.$('.music-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .stop-water-and-electricity-textarea': function(event, template) {
      clearTimeout(timeouts['stop-water-and-electricity-textarea']);
      timeouts['stop-water-and-electricity-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoadmap.call({stopWaterAndElectricityContent: template.$('.stop-water-and-electricity-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
	'keyup .gas-up-textarea': function(event, template) {
      clearTimeout(timeouts['gas-up-textarea']);
      timeouts['gas-up-textarea'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoadmap.call({gasUpContent: template.$('.gas-up-textarea').val()}, function (error, result) { 
		});
      }), 500);
    },
    'click .my-documents td:nth-child(3) button.download': function(event, template) {
    	var tr = $(event.target).closest('tr');
    	var title = tr.find('td:nth-child(2) div').html();
    	var content;
    	var user = Meteor.user();
    	var doc;
    	if(user) {
    		var folders = user.profile.folders;
	    	for(var idx in folders) {
	    		if(idx == tr.attr('class').split(' ')[0]) {
	    			content = (folders[idx].content != '') ? folders[idx].content : TAPi18n.__(idx + 'Default');
		    	}
	    	}
	    	if(content) {
				JSZipUtils.getBinaryContent("/docxTemplates/document.docx",function(err,docContent){
				    if (err) { throw e};
				    doc=new Docxtemplater(docContent);
				    doc.setData( {
				    	"name":"Mon super document",
				        "title": title,
				        "content": content
				        }
				    )
				    doc.render()
				    out=doc.getZip().generate({type:"blob"})
				    saveAs(out, title.toLowerCase().replace(/[^a-zA-Z0-9]/g,'_') + ".docx")
				});
			}
		}
    },
    'click .my-documents-download': function(event, template) {
    	var user = Meteor.user();
    	var documents = [];
    	if(user) {
	    	var folders = user.profile.folders;
	    	for(var idx in folders) {
	    		if(folders[idx].enabled) {
	    			var content = (folders[idx].content != '') ? folders[idx].content : TAPi18n.__(idx + 'Default');
		    		documents.push({title: TAPi18n.__(idx), content: content});
		    	}
	    	}
			JSZipUtils.getBinaryContent("/docxTemplates/documents.docx",function(err,content){
			    if (err) { throw e};
			    doc=new Docxtemplater(content);
			    doc.setData( {
			    	"name":"Mes super documents",
			        "title":"test de titre",
			        "documents": documents
			        }
			    )
			    doc.render()
			    out=doc.getZip().generate({type:"blob"})
			    saveAs(out,"mes_documents.docx")
			});
		}
    },
    'click .roadmap-download': function(event, template) {
    	var user = Meteor.user();
    	var tasks = [];
    	if(user) {
	    	var roadmap = user.profile.roadmap;
	    	for(var idx in roadmap) {
	    		if(roadmap[idx].enabled) {
	    			var content = (roadmap[idx].content != '') ? roadmap[idx].content : TAPi18n.__(idx + 'Default');
		    		tasks.push({title: TAPi18n.__(idx), content: content});
		    	}
	    	}
	    	JSZipUtils.getBinaryContent("/docxTemplates/roadmap.docx",function(err,content){
			    if (err) { throw e};
			    doc=new Docxtemplater(content);
			    doc.setData( {
			    	"name":"Ma super feuille de route",
			        "title":"test de titre",
			        "tasks":tasks
			        }
			    )
			    doc.render()
			    out=doc.getZip().generate({type:"blob"})
			    saveAs(out,"ma_feuille_de_route.docx")
			});
	    }
		
    }
});