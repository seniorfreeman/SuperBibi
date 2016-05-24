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
 * BotUserQuestions stocke les questions posées par les utilisateurs au chat bot
 * La collection sera analysée par la suite pour augmenter l'intelligence du bot
 *
 */
    
class BotUserQuestionsCollection extends Mongo.Collection {
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

export const BotUserQuestions = new BotUserQuestionsCollection('BotUserQuestions');

BotUserQuestions.schema = new SimpleSchema({
    userId: {
        type: String,
        optional: true
    },
    question: {
        type: String,
        optional: false
    },
    createdAt: {
        type: Date,
        optional: false
    }
});

BotUserQuestions.attachSchema(BotUserQuestions.schema);




