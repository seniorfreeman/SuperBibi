/**
 * Created by maxencecornet on 24/04/2016.
 */
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {BotInteractions} from './collections/botInteractions.js';
import {BotUserQuestions} from './collections/botUserQuestions.js';

export const insertBotInteraction = new ValidatedMethod({
    name: 'BotInteractions.insert',
    validate: new SimpleSchema({
        userId: {type: String}
    }).validator(),
    run({userId}) {

        const newBotInteraction = BotInteractions.insert({
            userId: userId
        }, (error, result) => {
            if (error)
                console.log(error);
            else {
                console.info('newBotInteraction successfully inserted : ' + result);
            }
        });

    }
});

export const setCompletedTour = new ValidatedMethod({
    name: 'BotInteractions.updateTour',
    validate: new SimpleSchema({
        userId: {type: String},
        hasCompletedTour: {type: Boolean}
    }).validator(),
    run({userId, hasCompletedTour}) {

        const newBotInteraction = BotInteractions.update({userId: userId}, {
            $set: {
                hasCompletedTour: hasCompletedTour
            }
        }, (error, result) => {
            if (error)
                console.log(error);
            else {
                console.info('newBotInteraction successfully inserted : ' + result);
            }
        });

    }
});

export const createUser = new ValidatedMethod({
    name: 'BotInteractions.createUser',
    validate: new SimpleSchema({
        username: {type: String},
        email: {type: String},
        password: {type: String}
    }).validator(),
    run({username, email, password,}) {

        return Accounts.createUser({
            username: username,
            email: email,
            password: password
        });
    }
});

export const insertBotUserQuestion = new ValidatedMethod({
    name: 'BotUserQuestions.insert',
    validate: new SimpleSchema({
        userId: {type: String, optional: true},
        question: {type: String}
    }).validator(),
    run({userId, question}) {

        const newBotUserQuestion = BotUserQuestions.insert({
            userId: userId,
            question: question,
            createdAt: new Date()
        }, (error, result) => {
            if (error)
                console.log(error);
            else {
                console.info('newBotInteraction successfully inserted : ' + result);
            }
        });

    }
});

Meteor.methods({
    'BotInteractions.profilage.update': (botInteractionId, updatedParam) => {
        check(botInteractionId, String);
        check(updatedParam, Object);

        BotInteractions.update({_id: botInteractionId}, {$set: updatedParam}, (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('BotInteractions.profilage.update sucess : ' + result);
            }
        })
    }
});
