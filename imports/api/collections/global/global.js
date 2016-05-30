/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

class PartnersCollection extends Mongo.Collection {
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

class VolumeObjectsCollection extends Mongo.Collection {
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

class RoomNamesCollection extends Mongo.Collection {
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
export const Partners = new PartnersCollection('partners');
export const VolumeObjects = new VolumeObjectsCollection('volumeObjects');
export const RoomNames = new RoomNamesCollection('roomNames');
/*****************Security Region***************************/

Partners.deny({
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

VolumeObjects.deny({
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

RoomNames.deny({
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

/*****************Schema Region***************************/

Partners.schema = new SimpleSchema({
    title: {
        type: String
    },
    picture: {
        type: String
    },
    url: {
        type: String
    },
    logo: {
        type: String
    }
});

VolumeObjects.schema = new SimpleSchema({
    title: {
        type: String
    },
    value: {
        type: String
    },
    volume: {
        type: Number, 
        decimal: true
    }
});

RoomNames.schema = new SimpleSchema({
    title: {
        type: String
    },
    value: {
        type: String
    }
});

/*****************AttachSchema Region***************************/
Partners.attachSchema(Partners.schema);
VolumeObjects.attachSchema(VolumeObjects.schema);
RoomNames.attachSchema(RoomNames.schema);