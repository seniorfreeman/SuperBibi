import './volume-page.jade';
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import {VolumeObjects} from '../../../api/collections/collections.js';
import {Rooms} from '../../../api/collections/collections.js';
import {RoomObjects} from '../../../api/collections/collections.js';
import {
  insertRoom,
  renameRoom,
  deleteRoom,
  insertRoomObject,
  updateRoomObject,
  deleteRoomObject
} from '../../../api/collections/methods.js';



var timeouts = [];


/*----------------------- Page Cubage --------------------------*/
Template.volume_page.onCreated(function volumePageOnCreated() {
	Meteor.subscribe('volumeObjects');
	Meteor.subscribe('rooms');
});

Template.volume_page.onRendered(function volumePageOnCreated() {
  this.autorun(() => {
    var volumeTotal = 0;
    Rooms.find().forEach(function(room) {
      var volume = RoomObjects.find({roomId: room._id}).fetch().map(item => item.volume).reduce((a, b) => a + b, 0);
      volumeTotal += volume;
    });
    Session.set('volumeTotal', volumeTotal.toFixed(2));
    Session.set('nbScotchs', volumeTotal.toFixed(2));
    Session.set('nbBoxes', volumeTotal.toFixed(2));
    Session.set('carVolume', volumeTotal.toFixed(2));
    Session.set('nbArms', volumeTotal.toFixed(2));
  });
});

Template.volume_page.helpers({
	rooms: function() {
		return Rooms.find();
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
  'click .room-item.new': function(event, template) {
    template.$('input').focus();
  },
  'click .send-valuation-block .send-btn': function(event, template) {
    Meteor.call('sendValuationMail', function (error, result) { 
      template.$('.send-valuation-block .send-btn').prop('disabled', true);
    });
  } 
});
/*--------------------------------------------------------*/




/*----------------------- Pièce --------------------------*/
Template.room_item.onRendered(function() {
	this.$('.room-item-header .update').hide();
});

Template.room_item.helpers({
	settings: function() {
	    return {
			position: 'bottom',
			limit: 10,
			rules: [
				{
					// token: '',
					collection: VolumeObjects,
					field: 'title',
					matchAll: false,
					template: Template.volume_object_item,
					noMatchTemplate: Template.volume_object_no_match
				}
			]
	    };
  	},
	roomObjects: function() {
		return RoomObjects.find({roomId: this._id});
	},
	volumeTotal: function() {
		return RoomObjects.find({roomId: this._id}).fetch().map(item => item.volume).reduce((a, b) => a + b, 0);
	}
});

Template.room_item.events({
	"autocompleteselect input": function(event, template, doc) {
		insertRoomObject.call({roomId: template.data._id, title: doc.title, volume: doc.volume}, function (error, result) { 
			template.$('.room-item-new-object input').val('')
		});
	},
   'keyup .room-item-new-object input': function(event, template) {
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
    'mouseover .room-item-header input': function(event, template) {
      template.$('.room-item-header .update').show();
    },
    'mouseout .room-item-header input': function(event, template) {
      template.$('.room-item-header .update').hide();
    },
    'keyup .room-item-header input': function(event, template) {
      clearTimeout(timeouts['room-item-header-input']);
      timeouts['room-item-header-input'] = setTimeout(Meteor.bindEnvironment(function() {
        renameRoom.call({roomId: template.data._id, title: template.$('.room-item-header input').val()}, function (error, result) { 
        });
      }), 500);
    }
});
/*--------------------------------------------------------*/




/*----------------------- Objet --------------------------*/
Template.room_item_object.events({
	'click .delete': function(event, template) {
    	deleteRoomObject.call({roomObjectId: template.data._id});
    },
    'keyup input': function(event, template) {
      /*if (event.keyCode == 13) {
        event.stopPropagation();
        updateRoomObject.call({roomObjectId: template.data._id, volume: parseFloat(template.$('input').val())}, function (error, result) { 
          	if(error)
          		console.log(error)
            else {
            	template.$('input').blur();
            }
  			});
        return false;
      }*/
  if(event.keyCode < 37 || event.keyCode > 40) {
      clearTimeout(timeouts['room-item-object-input']);
      timeouts['room-item-object-input'] = setTimeout(Meteor.bindEnvironment(function() {
        updateRoomObject.call({roomObjectId: template.data._id, volume: parseFloat(template.$('input').val())}, function (error, result) { 
          if(error)
            console.log(error)
        });
      }), 500);
    }
  }
});
/*--------------------------------------------------------*/