/*****************Import Region************************/
import {
    Mongo
} from 'meteor/mongo';
import {
    SimpleSchema
} from 'meteor/aldeed:simple-schema';

/*****************Collections Region************************/

class KeywordCollection extends Mongo.Collection {
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

class SyntagmeCollection extends Mongo.Collection {
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

class ActionCollection extends Mongo.Collection {
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

class BoatUserQuestionsCollection extends Mongo.Collection {
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
export const Keyword = new KeywordCollection('Keyword');
export const Syntagme = new SyntagmeCollection('Syntagme');
export const Action = new ActionCollection('Action');
export const BoatUserQuestions = new ActionCollection('BoatUserQuestions');

/*****************Security Region***************************/

Keyword.deny({
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

Syntagme.deny({
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

Action.deny({
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

BoatUserQuestions.deny({
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

Keyword.schema = new SimpleSchema({
    words: {
        type: String
    },
    epigraphClass: {
        type: String
    }

});

Syntagme.schema = new SimpleSchema({
    keywordId: {
        type: String
    },
    mimiqueClass: {
        type: String
    },
    type: {
        type: String
    },
    question: {
        type: String
    }

});

Action.schema = new SimpleSchema({
    syntagmeId: {
        type: String
    },
    functionName: {
        type: String
    },
    params: {
        type: String
    }
});

BoatUserQuestions.schema = new SimpleSchema({
    userId: {
        type: String
    },
    question: {
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

/*****************AttachSchema Region***************************/
Keyword.attachSchema(Keyword.schema);
Syntagme.attachSchema(Syntagme.schema);
Action.attachSchema(Action.schema);