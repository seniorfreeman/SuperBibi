/**
 * Created by maxencecornet on 24/04/2016.
 */
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {BotUserQuestions} from './collections/botUserQuestions.js';

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
    'AI.methods.setCompletedTour': function () {
        console.log('should set complete tour');

    },
    'AI.methods.updateProfile': function (collection, key, value) {
        const userId = this.userId;
        const set = {};
        set[key] = value;

        Meteor.users.update({_id: userId}, {$set: set}, (err) => {
            if (!err) {
                console.info('AI.methods.updateProfile succesfully');
            } else {
                console.error('AI.methods.updateProfile error : ' + err.message);
            }

        })

    },
    'AI.methods.updateAskedQuestion': function (questionName) {
        const userId = this.userId;

        Meteor.users.update({_id: userId}, {$push: {'profile.askedQuestion': questionName}}, (err) => {
            if (!err) {
                console.info('AI.methods.updateAskedQuestion succesfully');
            } else {
                console.error('AI.methods.updateAskedQuestion error : ' + err.message);
            }
        })

    },
    'AI.methods.syncProfile': function (set) {
        const userId = this.userId;

        Meteor.users.update({_id: userId}, {$set: set}, (err) => {
            if (!err) {
                console.info('AI.methods.syncProfile succesfully');
            } else {
                console.error('AI.methods.syncProfile error : ' + err.message);
            }

        })
    }
});
