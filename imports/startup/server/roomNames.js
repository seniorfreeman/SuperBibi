import {RoomNames} from '../../api/collections/global/global.js';


var json = {};

Meteor.startup( function() {
	try {
		json = JSON.parse(Assets.getText("roomNames/roomNames.json"));
		RoomNames.remove({});
		for(var roomNamesIdx in json.roomNames) {
			RoomNames.insert({title: json.roomNames[roomNamesIdx].title, value: json.roomNames[roomNamesIdx].value});
		}
	}
	catch(e) {
		console.log(e)
	}
});
