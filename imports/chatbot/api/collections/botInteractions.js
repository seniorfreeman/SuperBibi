/**
 * Created by maxencecornet on 24/04/2016.
 */
/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

/**
 * BotInteractions stocke les interactions d'un utilisateur avec le chat bot (tour effectué, profilage effectué par l'IA ect);
 *
 */

class BotInteractionsCollection extends Mongo.Collection {
    insert(doc, callback) {
        const result = super.insert(doc, callback);
        return result;
    }

    update(selector, modifier) {
        const result = super.update(selector, modifier);
        return result;
    }

    remove(selector) {
        const result = super.remove(selector);
        return result;
    }
}

export const BotInteractions = new BotInteractionsCollection('BotInteractions');

const profilage = new SimpleSchema({
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    tutoiement: {
        type: Boolean,
        optional: true
    },
    movingDate: {
        type: Date,
        optional: true
    },
    newAddress: {
        type: String,
        optional: true
    },
    oldAddress: {
        type: String,
        optional: true
    },
    rentingOldAddress: {
        type: Boolean,
        optional: true
    },
    rentingNewAddress: {
        type: Boolean,
        optional: true
    },
    children: {
        type: Number,
        optional: true
    },
    animals: {
        type: Number,
        optional: true
    }
});

BotInteractions.schema = new SimpleSchema({
    userId: {
        type: String,
        optional: false
    },
    hasCompletedTour: {
        type: Boolean,
        defaultValue: false,
        optional: false
    },
    profilage: {
        type: profilage,
        defaultValue: {},
        optional: false
    }
});

BotInteractions.attachSchema(BotInteractions.schema);



