/**
 * Created by maxencecornet on 24/04/2016.
 */
import {insertBotUserQuestion} from '../api/methods.js';
import {createUser} from '../api/methods.js';
import {Questions} from '../api/questions.js'
import moment from 'moment';
import Domlight from  'domlight'
import {_} from 'meteor/underscore';

/**
 * La métode principale est init(textArea) qui démarre le bot
 * 2 args : la zone de texte (textArea) de la widget, et l'input (input)
 */

class chatBot {
    constructor() {
        this.textArea = null;
        this.input = null;
        this.lastQuestion = null;
        this.askedQuestion = [];
        this.hasCompletedTour = false;
        this.onboarding = {
            tutoiement: null,
            firstName: null,
            lastName: null,
            email: null,
            password: null
        };
    }

    init(textArea, input) {
        const self = this;
        self.textArea = textArea;
        self.input = input;

        if (!Meteor.userId()) {
            self._askQuestion(Questions[0]);
        } else {
            self.askedQuestion = Meteor.user().profile.askedQuestion;
            self.onboarding.tutoiement = Meteor.user().profile.tutoiement;
            self._askNextQuestion();
        }

    }

    _askNextQuestion() {
        let i = 0;
        const self = this;

        for (i = 0; i < Questions.length; i++) {
            if (!_.contains(self.askedQuestion, Questions[i].name)) {
                self._askQuestion(Questions[i]);
                return;
            }
        }
    }

    processAnswer(userInput) {
        const self = this;
        self.input.value = '';

        if (!self.lastQuestion) {
            return self.processQuestion(userInput);
        }

        var question = _.find(Questions, function (question) {
            return question.name === self.lastQuestion
        });

        if (question.type === 'boolean') {
            if (self._isPositiveAnswer(userInput)) {
                if (question.additionalPositiveMethod) {
                    eval(question.additionalPositiveMethod);
                }
                if (question.update) {
                    self._updateProfile(question.update.collection, question.update.param, true, question.name);
                }
            } else if (self._isNegativeAnswer(userInput)) {
                if (question.additionalNegativeMethod) {
                    eval(question.additionalNegativeMethod);
                }
                if (question.update) {
                    self._updateProfile(question.update.collection, question.update.param, false, question.name);
                }

            } else {
                self._answerNotUnderstood(userInput);
            }
        }

        if (question.type === 'string') {

            if (question.update) {
                self._updateProfile(question.update.collection, question.update.param, self._formatUserInput(userInput), question.name);
            }

            if (question.additionalMethod) {
                eval(question.additionalMethod);
            }

        }

        self._askNextQuestion();

        /* Question --> méthode positive / méthode négative
         // face -->  self._pushFacebookButton();

         //movingDate
         var day = moment(userInput);
         Meteor.call('AI.methods.updateProfile', self.botInteractionId, {'profilage.movingDate': day.toDate()});

         */
    }

    processQuestion(userInput) {
        const self = this;

        self._insertBotUserQuestion(userInput);
        //TODO : ajout du comportement sur une question spontanée de l'utilisateur
    }

    _pushFacebookButton() {
        const self = this;
        self.askedQuestion.push('profileEmail', 'email', 'pwd');
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
                // handle error
            } else {
                // successful login!
                self._syncProfile({
                    'profile.prenom': self.onboarding.firstName,
                    'profile.nom': self.onboarding.lastName,
                    'profile.askedQuestion': self.askedQuestion,
                    'profile.tutoiement': self.tutoiement
                });
                self.input.type = 'text';
            }
        });
    }

    _isAQuestion(userInput) {
        const questionHints = ['?', 'Comment', 'comment', '??'];

        return questionHints.some((word) => {
            return userInput.includes(word);
        });
    }

    _answerNotUnderstood() {
        const self = this;
        self.textArea.value = 'Désolé je n\'ai pas compris du tout'
    }

    _askQuestion(question) {
        const self = this;
        self.lastQuestion = question.name;
        self.askedQuestion.push(question.name);

        if (self.onboarding.tutoiement === false) {
            self.textArea.value = question.vous;
        } else {
            self.textArea.value = question.tu;
        }
    }

    _setInputPasswordType() {
        const self = this;
        self.input.type = 'password';
    }

    _sendMessage(message) {
        const self = this;
        self.textArea.value = message;
    }

    _isPositiveAnswer(userInput) {
        const positiveAnswer = ['yes', 'Yes', 'oui', 'Oui', 'OUi', 'OUI', 'Ouai', 'OUai', 'OUAI'];

        return positiveAnswer.some((word) => {
            return userInput.includes(word);
        });
    }

    _isNegativeAnswer(userInput) {
        const positiveAnswer = ['no', 'No', 'non', 'Non', 'NOn', 'NON', 'nan', 'Nan', 'NAn', 'NAN'];

        return positiveAnswer.some((word) => {
            return userInput.includes(word);
        });
    }

    _startTour() {
        const self = this;
        console.log('start tour');

        //self._tourAddStep('#ia', 'Je suis disponible à tout moment en appuyant sur le bouton IA ');
        //self._tourAddStep('#call-ia', '');

        self.askedQuestion.push('tourConnected');
        self._setCompletedTour();
    }

    _tourAddStep(step, text) {
        const self = this;
        self._sendMessage(text);
        Domlight($(step), {
            fadeDuration: 300,
            hideOnClick: true,
            hideOnEsc: true,
            findOnResize: true
        });

    }

    _hasCompletedTour() {
        return Meteor.user().profile.hasCompletedTour;
    }

    _setCompletedTour() {
        const self = this;
        if (Meteor.userId()) {
            Meteor.user().profile._hasCompletedTour = true;
            Meteor.call('AI.methods.setCompletedTour');
        } else {
            self.hasCompletedTour = true;
        }
    }

    _updateProfile(collection, key, value, questionName) {
        const self = this;
        if (!Meteor.userId()) {

            self.onboarding[key.slice(8)] = value;
        } else {
            Meteor.call('AI.methods.updateProfile', collection, key, value);
            Meteor.call('AI.methods.updateAskedQuestion', questionName);
        }
    }

    _syncProfile(set) {
        Meteor.call('AI.methods.syncProfile', set);
    }

    _insertBotUserQuestion(userInput) {
        const self = this;
        insertBotUserQuestion.call({userId: Meteor.userId(), question: self._formatUserInput(userInput)})
            .then(() => {
                console.log('Bot user question created');
            })
            .catch((err) => {
                console.error('Bot interaction document failed ' + err.message);
            })
    }

    _formatUserInput(input) {
        var formattedInput = input.trim();
        formattedInput = formattedInput.replace(/ /g, '');
        return formattedInput;
    }

    _createUserAccount() {
        const self = this;
        const username = self.onboarding.firstName + ' ' + self.onboarding.lastName;
        console.log(self.onboarding);
        createUser.call({
            username: username,
            email: self.onboarding.email,
            password: self.onboarding.password
        }, (error) => {
            if (!error) {
                Meteor.loginWithPassword(self.onboarding.email, self.onboarding.password, () => {
                    console.log('user Logged in succesfully');
                    self._syncProfile({
                        'profile.prenom': self.onboarding.firstName,
                        'profile.nom': self.onboarding.lastName,
                        'profile.askedQuestion': self.askedQuestion,
                        'profile.tutoiement': self.tutoiement
                    });
                    self.input.type = 'text';
                })
            } else {
                console.log(error.message);
                //TODO : implémentation d'un comportement en cas d'erreur durant la création de compte user
            }
        });
    };
}

export const Chatbot = new chatBot();