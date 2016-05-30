/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/
class FriendsCollection extends Mongo.Collection {
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

class FBInvitFriendsCollection extends Mongo.Collection {
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

class MoversCollection extends Mongo.Collection {
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

class CoMoversCollection extends Mongo.Collection {
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
export const Friends = new FriendsCollection('Friends');
export const FBInvitFriends = new FBInvitFriendsCollection(null);
export const Movers = new MoversCollection('Movers');
export const CoMovers = new CoMoversCollection('CoMovers');


/*****************Security Region***************************/
Friends.deny({
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
Schema = {};

Schema.Profile = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    firstName: {
        type: String,
        optional: true
    },
    stressMode: {
        type: Boolean,
        optional: true,
        defaultValue:false
    },
    hasCompletedTour: {
        type: Boolean,
        optional: true,
        defaultValue:false
    },
    tutoiement: {
        type: String,
        optional: true
    },
    serviceId: {
        type: String,
        optional: true
    },
    cellNumber: {
        type: String,
        optional: true
    },
    picture: {
        type: String,
        optional: true
    },
    botPositionSaved: {
        type: String,
        optional: true
    },
    stillPreferedShop: {
        type: String,
        optional: true
    },
    age: {
        type: Number,
        optional: true
    },
    movingId: {
      type: String,
      optional: true
    },
    folders: {
      type: Object,
      blackbox: true,
      optional: true
    },
    roadmap: {
      type: Object,
      blackbox: true,
      optional: true
    },
    movers: {
      type: [Object],
      blackbox: true,
      optional: true
    },
    coMovers: {
      type: [Object],
      blackbox: true,
      optional: true
    },
    moverInvitationMessage: {
      type: String,
      optional: true
    },
    coMoverInvitationMessage: {
      type: String,
      optional: true
    }
});

Schema.user = new SimpleSchema({
  _id:{
    type: String,
    regEx: SimpleSchema.RegEx.Id
  	},  
  username: {
    type: String,
    optional: true
	},
  emails: {
    type: [Object],
    optional: true
	},
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
	},
  "emails.$.verified": {
    type: Boolean
	},
  createdAt: {
    type: Date,
    denyUpdate: true
	},
  profile: {
    type: Schema.Profile,
    optional: true
	},
  services: {
    type: Object,
    optional: true,
    blackbox: true
	},
  askedQuestion: {
    type: [String],
    optional: true
	},
  status:{
    type: Object,
    optional: true,
    blackbox: true  
    }
}
);


Friends.schema = new SimpleSchema({
    userId: {
        type: String
    },
    status: {
        type: String
    },
});

/*****************AttachSchema Region***************************/
Meteor.users.attachSchema(Schema.user);
Friends.attachSchema(Friends.schema);

Meteor.users.publicFields = {
_id:1,  
  username:1,
  emails:1,
  profile:1,
  services:0,
  movingId:1,
  askedQuestion:1,
};