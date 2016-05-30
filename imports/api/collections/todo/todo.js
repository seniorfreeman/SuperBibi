/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

class TodoCollection extends Mongo.Collection {
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

class ListCollection extends Mongo.Collection {
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

class VideoCollection extends Mongo.Collection {
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

class FileCollection extends Mongo.Collection {
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

class ProductCollection extends Mongo.Collection {
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


/*****************Export Region***************************/
export const Todo = new TodoCollection('Todo');
export const List = new ListCollection('List');
export const Video = new VideoCollection('Video');
export const File = new FileCollection('File');
export const Product = new ProductCollection('Product');
export const Events = new EventsCollection('Events');

/*****************Security Region***************************/

Todo.deny({
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

List.deny({
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

Video.deny({
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

File.deny({
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

Product.deny({
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

/*****************Schema Region***************************/

Todo.schema = new SimpleSchema({
    active: {
        type: Boolean,
        defaultValue:true
    },
    name: {
        type: String,
        optional: true
    },
    list: {
        type: String
    },
    theme: {
        type: String,
        optional: true
    },
    rentingType: {
        type: String,
        optional: true
    },
    movingID: {
        type: String,
        optional: true
    },
    essential: {
        type: Boolean
    },
    priority: {
        type: Boolean
    },
    allowNotification: {
        type: Boolean
    },
    title: {
        type: String
    },
    advise: {
        type: String,
        optional: true
    },
    productsId: {
        type: [String]
    },
    filesId: {
        type: [String]
    },
    videosId: {
        type: [String]
    },
    friends: {
        type: [Object],
        optional: true
    },
    'friends.$.invite_token': {
        type: String,
        optional: true
    },
    'friends.$.name': {
        type: String,
        optional: true
    },
    'friends.$.mail': {
        type: String,
        optional: true
    },
    'friends.$.picture': {
        type: String,
        optional: true
    },
    'friends.$.state': {
        type: String,
        optional: true
    },
    stresstype: {
        type: Boolean
    },
    deadline: {
        type: Number,
        optional: true
    },
    reactiveCity: {
        type: String,
        optional: true
    },
    ownerId: {
        type: String,
        optional: true
    },
    guestId: {
        type: String,
        optional: true
    },
    endDate: {
        type: Date,
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
    friendInvitationMessage: {
        type: String,
        optional: true
    }

});

List.schema = new SimpleSchema({
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

Video.schema = new SimpleSchema({
   importId:{
        type:Number,
        optional:true
    },
    title: {
        type: String,
        optional:true
    },
    url: {
        type: String,
        optional:true
    }
});

File.schema = new SimpleSchema({
     importId:{
        type:Number,
        optional:true
    },
    title: {
        type: String,
        optional:true
    },
    description: {
        type: String,
        optional:true
    },
    defaultText: {
        type: String,
        optional:true
    },
    text: {
        type: String,
        optional:true
    },
    movingID: {
        type: String,
        optional:true
    }
});

Product.schema = new SimpleSchema({
    importId:{
        type:String,
        optional:true
    },
    title: {
        type: String,
        optional:true
    },
    description: {
        type: String,
        optional:true
    },
    apiProductId: {
        type: String,
        optional:true
    },
    altCallToActionText: {
        type: String,
        optional:true
    },
    imageUrl: {
        type: String,
        optional:true
    },
    href: {
        type: String,
        optional:true
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

/*****************AttachSchema Region***************************/
Todo.attachSchema(Todo.schema);
List.attachSchema(List.schema);
Video.attachSchema(Video.schema);
File.attachSchema(File.schema);
Product.attachSchema(Product.schema);
Events.attachSchema(Events.schema);
