/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

class MovingCollection extends Mongo.Collection {
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

class AddressCollection extends Mongo.Collection {
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
export const Moving = new MovingCollection('Moving');
export const Address = new AddressCollection('Address');
/*****************Security Region***************************/

Moving.deny({
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

Address.deny({
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

Moving.schema = new SimpleSchema({
    movingDate: {
        type: Date
    },
    oldAddressId: {
        type: String,
        optional: true
    },
    newAddressId: {
        type: String,
        optional: true
    },
    animals: {
        type: Boolean,
        optional: true
    },
    children: {
        type: Boolean,
        optional: true
    },
    oldHouseSize: {
        type: Number,
        optional: true
    },
    oldRoomCount: {
        type: Number,
        optional: true
    },
    coMovers: {
        type: [String],
        optional: true
    },
    movers: {
        type: [String],
        optional: true
    },
    rentingOldAddress: {
        type:  Number,
        allowedValues: [0, 1],
        optional: true
    },
    rentingNewAddress: {
        type:  Number,
        allowedValues: [0, 1],
        optional: true
    },
    folders: {
        type: [String],
        optional: true
    },
    roadMap: {
        type: String,
        optional: true
    },
    stillPreferedShop:{
        type: String,
        optional: true
    }

});

Address.schema = new SimpleSchema({
    type: {
        type: Number,
        allowedValues: [1, 2],
        optional: true
    },
    displayAddress: {
        type: String,
        optional: true
    },
    num: {
        type: Number,
        optional: true
    },
    address: {
        type: String,
        optional: true
    },
    addressPlus: {
        type: String,
        optional: true
    },
    postalCode: {
        type: String,
        optional: true
    },
    city: {
        type: String,
        optional: true
    },
    coordonates: {
        type: {
        	lat:Number,
        	lng:Number
        },
        optional: true
    }
});
/*****************AttachSchema Region***************************/
Moving.attachSchema(Moving.schema);
Address.attachSchema(Address.schema);
