import './volume-page.jade';
import '../../components/partner-item.jade';

import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { VolumeObjects } from '../../../api/collections/global/global.js';
import { RoomNames } from '../../../api/collections/global/global.js';
import { Room } from '../../../api/collections/room/room.js';
import { RoomObject } from '../../../api/collections/room/room.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {
  insertRoom,
  renameRoom,
  deleteRoom,
  insertRoomObject,
  updateRoomObject,
  deleteRoomObject
} from '../../../api/collections/room/methods.js';


import {Partners} from '../../../api/collections/global/global.js';

import {removeDiacritics} from '../../lib/string.js';

var timeouts = [];

/*----------------------- Page Cubage --------------------------*/
Template.volume_page.onCreated(function() {
	Meteor.subscribe('volumeObjects');
  Meteor.subscribe('roomNames');
	Meteor.subscribe('rooms');
  Meteor.subscribe('partners');
});

Template.volume_page.onRendered(function() {
  this.autorun(() => {

    var volumeTotal = 0;

    Room.find().forEach(function(room) {
      RoomObject.find({roomId: room._id}).forEach(function(obj){
              volumeTotal += obj.volume*obj.quantity;
      });
    });

    var nbrArms = (Math.round(volumeTotal/6));

    var carVolume;
    if (volumeTotal >= 0 && volumeTotal <= 3) {carVolume = 3
      } else if (volumeTotal > 3 && volumeTotal <= 5) {carVolume = 5
      } else if (volumeTotal > 5 && volumeTotal <= 7) {carVolume = 7
      } else if (volumeTotal > 7 && volumeTotal <= 9) {carVolume = 9
      } else if (volumeTotal > 9 && volumeTotal <= 12) {carVolume = 12
      } else if (volumeTotal > 12 && volumeTotal <= 15) {carVolume = 15
      } else { carVolume = 22;}
    
    var nbScotchs = Math.round(volumeTotal/8);
    var nbBoxes = Math.round(volumeTotal*0.75);// 3m2 pour un carton

    Session.set('volumeTotal', +(volumeTotal.toFixed(2)));
    Session.set('nbScotchs', +nbScotchs);
    Session.set('nbBoxes', + nbBoxes);
    Session.set('carVolume', +carVolume);
    Session.set('nbArms', +nbrArms);

  });
});

Template.volume_page.helpers({
	rooms: function() {
		return Room.find();
	},
  volumeTotal: function() {
    return Session.get('volumeTotal');
  },
  nbScotchs: function() {
    return Session.get('nbScotchs');
  },
  nbBoxes: function() {
    return Session.get('nbBoxes');
  },
  carVolume: function() {
    return Session.get('carVolume');
  },
  nbArms: function() {
    return Session.get('nbArms');
  },
  labelNewRoom: function() {
    return TAPi18n.__('labelNewRoom');
  },
  roomTitleSettings: function() {
    return {
    position: 'bottom',
    limit: 10,
    rules: [
      {
        // token: '',
        collection: RoomNames,
        field: 'title',
        matchAll: false,
        template: Template.volume_object_item,
        noMatchTemplate: Template.volume_object_no_match,
        selector: function(match) {
          regex = new RegExp(removeDiacritics(match), 'i')
          return {'value': regex}
        }
      }
    ]
    };
  },
  partners: function() {
    return Partners.find({id:2});
  },
  adaCellPhone: function() {
    return Session.get('adaCellPhone');
  }
});

Template.volume_page.events({
  "submit .room-item.new form": function(event, template) {
  	event.preventDefault();
  	insertRoom.call({title: $('.room-item.new form input').val()}, function (error, result) { 
  		$('.room-item.new form input').val('');
  		$('.room-item#' + result + ' .room-item-new-object input').focus();
  	});
  },
  "autocompleteselect .room-item.new form input": function(event, template, doc) {
    template.$('.room-item.new form').submit();
  },
  'click .room-item.new': function(event, template) {
    template.$('.room-item.new input').focus();
  },
  'click .send-valuation-block .send-btn': function(event, template) {
    Meteor.call('sendValuationMail', function (error, result) { 
      template.$('.send-valuation-block .send-btn').prop('disabled', true);
    });
  },
  'click li.scotch, li.boxes' : function (event, template) {
    window.open("http://cartons.demenager.fr");
  },
  'click li.carVolume' : function (event, template) {
    FlowRouter.go('/content/camion');
  },
  'click li.bras' : function (event, template) {
    FlowRouter.go('/content/amis');
  }

});
/*--------------------------------------------------------*/




/*----------------------- Pièce --------------------------*/

Template.room_item.helpers({
	roomTitleSettings: function() {
    return {
		position: 'bottom',
		limit: 10,
		rules: [
			{
				// token: '',
				collection: RoomNames,
				field: 'title',
				matchAll: false,
				template: Template.volume_object_item,
				noMatchTemplate: Template.volume_object_no_match,
        selector: function(match) {
          regex = new RegExp(removeDiacritics(match), 'i')
          return {'value': regex}
        }
			}
		]
    };
	},
  volumeObjectSettings: function() {
    return {
    position: 'bottom',
    limit: 10,
    rules: [
      {
        // token: '',
        collection: VolumeObjects,
        field: 'value',
        matchAll: false,
        template: Template.volume_object_item,
        noMatchTemplate: Template.volume_object_no_match,
        selector: function(match) {
          regex = new RegExp(removeDiacritics(match), 'i')
          return {'value': regex}
        }
      }
    ]
    };
  },
	roomObjects: function() {
		return RoomObject.find({roomId: this._id});
	},
	volumeTotal: function() {
    var sum = 0;
		RoomObject.find({roomId: this._id}).forEach(function(obj){
            sum = sum + obj.volume*obj.quantity;
    });
    return +(sum.toFixed(2));
	}
});

Template.room_item.events({
	"autocompleteselect input#newVolumeObject": function(event, template, doc) {
		insertRoomObject.call({roomId: template.data._id, title: doc.title, volume: doc.volume}, function (error, result) { 
			template.$('.room-item-new-object input').val('')
		});
	},
   'keyup .room-item-new-object input#newVolumeObject': function(event, template) {
        if (event.keyCode == 13 && template.$('.room-item-new-object input').val() != '' && template.$('.-autocomplete-container').children().length == 0) {
            event.stopPropagation();
            insertRoomObject.call({roomId: template.data._id, title: template.$('.room-item-new-object input').val(), volume: 0}, function (error, result) { 
      				template.$('.room-item-new-object input').val('')
      			});
            return false;
        }
    },
    'click .room-item-header .delete': function(event, template) {
    	deleteRoom.call({roomId: template.data._id}, function (error, result) { 
		  });
    },
    'keyup .room-item-header input': function(event, template) {
      clearTimeout(timeouts['room-item-header-input']);
      timeouts['room-item-header-input'] = setTimeout(Meteor.bindEnvironment(function() {
        if(template.$('.room-item-header input').val() != '' && template.$('.room-item-header .-autocomplete-container').children().length == 0) {
          renameRoom.call({roomId: template.data._id, title: template.$('.room-item-header input').val()}, function (error, result) { 
          });
        }
      }), 500);
    },
    "autocompleteselect .room-item-header input": function(event, template, doc) {
      renameRoom.call({roomId: template.data._id, title: doc.title}, function (error, result) { 
      });
      clearTimeout(timeouts['room-item-header-input']);
    },
    "focusout .room-item-header input": function(event, template) {
      renameRoom.call({roomId: template.data._id, title: template.$('.room-item-header input').val()}, function (error, result) { 
      });
    }
});
/*--------------------------------------------------------*/




/*----------------------- Objet --------------------------*/
Template.room_item_object.events({
	'click .delete': function(event, template) {
  	deleteRoomObject.call({roomObjectId: template.data._id});
  },
  'keyup input.object-quantity': function(event, template) {
    if(event.keyCode < 37 || event.keyCode > 40) {
      clearTimeout(timeouts['room-item-object-input-quantity']);
      timeouts['room-item-object-input-quantity'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoomObject.call({roomObjectId: template.data._id, quantity: parseInt(template.$('input.object-quantity').val())}, function (error, result) { 
          if(error)
            console.log(error)
        });
      }), 500);
    }
  },
  'keyup input.object-title': function(event, template) {
    if(event.keyCode < 37 || event.keyCode > 40) {
      clearTimeout(timeouts['room-item-object-input-title']);
      timeouts['room-item-object-input-title'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoomObject.call({roomObjectId: template.data._id, title: template.$('input.object-title').val()}, function (error, result) { 
          if(error)
            console.log(error)
        });
      }), 500);
    }
  },
  'keyup input.object-volume': function(event, template) {
    if(event.keyCode < 37 || event.keyCode > 40) {
      clearTimeout(timeouts['room-item-object-input-volume']);
      timeouts['room-item-object-input-volume'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoomObject.call({roomObjectId: template.data._id, volume: parseFloat(template.$('input.object-volume').val())}, function (error, result) { 
          if(error)
            console.log(error)
        });
      }), 500);
    }
  }
});
/*--------------------------------------------------------*/