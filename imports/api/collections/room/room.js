/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

class RoomCollection extends Mongo.Collection {
    insert(doc, callback) {
        const result = super.insert(doc, callback);
        return result;
    }
    update(selector, modifier, callback) {
        const result = super.update(selector, modifier, callback);
        return result;
    }
    remove(selector, callback) {
        const result = super.remove(selector, callback);
        return result;
    }
}
class RoomObjectCollection extends Mongo.Collection {
    insert(doc, callback) {
        const result = super.insert(doc, callback);
        return result;
    }
    update(selector, modifier, callback) {
        const result = super.update(selector, modifier, callback);
        return result;
    }
    remove(selector, callback) {
        const result = super.remove(selector, callback);
        return result;
    }
}



/*****************Export Region***************************/
export const Room = new RoomCollection('rooms');
export const RoomObject = new RoomObjectCollection('roomObjects');

/*****************Security Region***************************/
Room.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
});

RoomObject.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});


/*****************Schema Region***************************/
Room.schema = new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    title: {
        type: String
    }
});
RoomObject.schema = new SimpleSchema({
    roomId: {
        type: String
    },
    title: {
        type: String
    },
    volume: {
        type: Number, 
        decimal: true
    },
    quantity: {
        type: Number
    }
});


/*****************AttachSchema Region***************************/
Room.attachSchema(Room.schema);
RoomObject.attachSchema(RoomObject.schema);