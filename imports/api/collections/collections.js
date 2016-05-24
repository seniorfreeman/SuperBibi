/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/
class EventsCollection extends Mongo.Collection {
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
class ListsCollection extends Mongo.Collection {
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
class TypologiesCollection extends Mongo.Collection {
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
class LinksCollection extends Mongo.Collection {
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
class ProductsCollection extends Mongo.Collection {
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
class DocumentsCollection extends Mongo.Collection {
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
class TodosCollection extends Mongo.Collection {
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
class NotificationsCollection extends Mongo.Collection {
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
class RoomsCollection extends Mongo.Collection {
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
class RoomObjectsCollection extends Mongo.Collection {
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
export const Lists = new ListsCollection('Lists');
export const Typologies = new TypologiesCollection('Typologies');
export const Links = new LinksCollection('Links');
export const Products = new ProductsCollection('Products');
export const Documents = new DocumentsCollection('Documents');
export const Friends = new FriendsCollection('Friends');
export const Todos = new TodosCollection('Todos');
export const Notifications = new NotificationsCollection('Notifications');
export const Uploads = new Mongo.Collection('uploads');
export const Events = new EventsCollection('Events');
export const VolumeObjects = new VolumeObjectsCollection('volumeObjects');
export const Rooms = new RoomsCollection('rooms');
export const RoomObjects = new RoomObjectsCollection('roomObjects');
export const FBInvitFriends = new FBInvitFriendsCollection(null);
export const Movers = new MoversCollection('Movers');
export const CoMovers = new CoMoversCollection('CoMovers');
export const Partners = new PartnersCollection('partners');
Events.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

Events.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return false;
  },
});
Todos.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return false;
    },
});
Todos.allow({
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
Typologies.deny({
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
Links.deny({
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
Products.deny({
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
Documents.deny({
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
Notifications.deny({
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

Rooms.deny({
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

RoomObjects.allow({
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

Lists.schema = new SimpleSchema({
    name: {
        type: String
    },
    cssClass: {
        type: String
    },
    system: {
        type: Boolean
    },
    includeHrbefor: {
        type: Boolean
    },
    includeHrAfter: {
        type: Boolean
    }
});
Typologies.schema = new SimpleSchema({
    name: {
        type: String
    },
});
Links.schema = new SimpleSchema({
    title: {
        type: String
    },
    url: {
        type: String
    },
});
Products.schema = new SimpleSchema({
    id_product: {
        type: String
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    url: {
        type: String
    },
});
Documents.schema = new SimpleSchema({
    id_product: {
        type: String
    },
    url: {
        type: String
    },
});
Friends.schema = new SimpleSchema({
    userId: {
        type: String
    },
    status: {
        type: String
    },
});
Notifications.schema = new SimpleSchema({
    userId: {
        type: String
    },
    status: {
        type: String
    },
    text: {
        type: String
    },
    todoId: {
        type: String
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset();
            }
        }
    },
});
Todos.schema = new SimpleSchema({
    list: {
        type: String
    },
    typologie: {
        type: String
    },
    links: {
        type: [String]
    },
    products: {
        type: [{
            imageUrl: {
                type: String
            },
            description: {
                type: String
            },
            price: {
                type: Number
            },
            url: {
                type: String
            },
        }]
    },
    documents: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    ownerId: {
        type: String,
        optional: true
    },
    guestId: {
        type: String,
        optional: true
    },
    friends: {
        type: [{
            name: {
                type: String,
                optional: true
            }
        }]
    },
    prioritaire: {
        type: Boolean
    },
    stressMode: {
        type: Boolean
    },
    allowNotification: {
        type: Boolean
    },
    essentiel: {
        type: Boolean,
        optional: true
    },
    dateFin: {
        type: Date,
        optional: true
    },
    echeance: {
        type: Date,
        optional: true
    },
    title: {
        type: String
    },
    conseils: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset();
            }
        }
    },
});
VolumeObjects.schema = new SimpleSchema({
    title: {
        type: String
    },
    volume: {
        type: Number,
        decimal: true
    }
});
Rooms.schema = new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    title: {
        type: String
    }
});
RoomObjects.schema = new SimpleSchema({
    roomId: {
        type: String
    },
    title: {
        type: String
    },
    volume: {
        type: Number,
        decimal: true
    }
});
Partners.schema = new SimpleSchema({
    picture: {
        type: String
    },
    url: {
        type: String
    },
    title: {
        type: String
    }
});
Events.schema= new SimpleSchema({
    userId:{
        type:String
    },
    start:{
        type:String
    },
    end:{
        type:String
    },
    title:{
        type:String
    }
});
Lists.attachSchema(Lists.schema);
Typologies.attachSchema(Typologies.schema);
Links.attachSchema(Links.schema);
Products.attachSchema(Products.schema);
Documents.attachSchema(Documents.schema);
Friends.attachSchema(Friends.schema);
Notifications.attachSchema(Notifications.schema);
//Todos.attachSchema(Todos.schema);
VolumeObjects.attachSchema(VolumeObjects.schema);
//Rooms.attachSchema(Rooms.schema);
//RoomObjects.attachSchema(RoomObjects.schema);
Partners.attachSchema(Partners.schema);
Events.attachSchema(Events.schema);
