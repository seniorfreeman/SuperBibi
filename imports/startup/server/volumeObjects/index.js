import {VolumeObjects} from '../../../api/collections/collections.js';


var json = {};

Meteor.startup( function() {
	try {
		json = JSON.parse(Assets.getText("volumeObjects/volumeObjects.json"));
		VolumeObjects.remove({});
		for(var volumeObjectIdx in json.volumeObjects) {
			VolumeObjects.insert({title: json.volumeObjects[volumeObjectIdx].title, volume: json.volumeObjects[volumeObjectIdx].volume});
		}
	}
	catch(e) {
		console.log(e)
	}
});
