import {VolumeObjects} from '../../api/collections/global/global.js';


var json = {};

Meteor.startup( function() {
	try {
		json = JSON.parse(Assets.getText("volumeObjects/volumeObjects.json"));
		VolumeObjects.remove({});
		for(var volumeObjectIdx in json.volumeObjects) {
			VolumeObjects.insert({title: json.volumeObjects[volumeObjectIdx].title, value: json.volumeObjects[volumeObjectIdx].value, volume: json.volumeObjects[volumeObjectIdx].volume});
		}
	}
	catch(e) {
		console.log(e)
	}
});
