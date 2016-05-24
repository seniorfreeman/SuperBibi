/**
 * Created by maxencecornet on 24/04/2016.
 */
import {BotInteractions} from './collections/botInteractions.js';
import {insertBotInteraction} from '../api/methods.js';
import {insertBotUserQuestion} from '../api/methods.js';
import {setCompletedTour} from '../api/methods.js';
import {createUser} from '../api/methods.js';
import moment from 'moment';
import Shepherd from 'tether-shepherd'
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
        this.botInteractionId = null;
        this.onboarding = {
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
            self._askQuestion('askTour', 'Hello, je vois que tu n\'es pas connecté, veux tu découvrir l\'app?');

        } else {
            if (!BotInteractions.findOne({userId: Meteor.userId()})) {
                console.log(BotInteractions.findOne({userId: Meteor.userId()}));
                self._insertBotInteraction((err) => {
                    if (!err) {
                        self._askQuestion('askTour', 'Hello, veux tu découvrir l\'app?');
                    }
                })

            } else {
                self.botInteractionId = BotInteractions.findOne({userId: Meteor.userId()})._id;
                if (!self._hasCompletedTour()) {
                    self._askQuestion('askTour', 'Hello, veux tu découvrir l\'app?');
                } else {
                    self._askCompleteProfilage()
                }
            }
        }
    }

    _askCompleteProfilage() {
        const self = this;

        if (BotInteractions.findOne({userId: Meteor.userId()})) {
            const profilage = BotInteractions.findOne({userId: Meteor.userId()}).profilage;
            self.botInteractionId = BotInteractions.findOne({userId: Meteor.userId()})._id;

            if (!profilage.tutoiement) {
                self._askQuestion('askTutoiement', 'Est-ce que je peux vous tutoyer ?');
            } else if (!profilage.movingDate) {
                self._askQuestion('askMovingDate', 'Quand est-ce que tu démenages ?(format : 1995-12-25)');
            } else if (!profilage.newAddress) {
                self._askQuestion('askNewAddress', 'Quelle est ta nouvelle addresse ?');
            } else if (!profilage.oldAddress) {
                self._askQuestion('askOldAddress', 'Quelle est ton ancienne addresse ?');
            } else if (!profilage.rentingNewAddress) {
                self._askQuestion('askRentingNewAddress', 'Est-tu propriétaire de ta nouvelle addresse ?');
            } else if (!profilage.rentingOldAddress) {
                self._askQuestion('askRentingOldAddress', 'Est-tu locataire de ta nouvelle addresse ?');
            } else if (!profilage.children) {
                self._askQuestion('askChildren', 'Combien as tu d\'enfants (0 si pas d\'enfants)');
            } else if (!profilage.animals) {
                self._askQuestion('askAnimals', 'Combien as tu d\'animaux (0 si pas d\'animaux) ?');
            } else {
                self._askQuestion(null, 'Profil complet, merci !');
            }
        } else {
            Meteor.setInterval(() => {
                self._askCompleteProfilage();
            }, 300);
        }

    }

    processAnswer(userInput) {
        const self = this;
        self.input.value = '';

        console.log('Is a question : ' + self._isAQuestion(userInput));

        if (!self.lastQuestion) {
            return self.processQuestion(userInput);
        }

        if (self.lastQuestion === 'askTour') {
            if (self._isPositiveAnswer(userInput)) {
                console.log('processAnswer positive answer');
                self.startTour();
            } else if (self._isNegativeAnswer(userInput)) {
                console.log('processAnswer negative answer');
                if (Meteor.userId()) {
                    self._setCompletedTour();
                    self._askCompleteProfilage();
                } else {
                    self._askQuestion('askProfile', 'Ok!, Est-ce que tu souhaites créer un compte ?');
                }
            } else {
                self._answerNotUnderstood(userInput);
            }

        } else if (self.lastQuestion === 'askProfile') {
            if (self._isPositiveAnswer(userInput)) {
                self._askQuestion('askFBOrEmail', 'Super, préfère tu créer ton compte avec facebook ou avec ton email ?');
            } else if (self._isNegativeAnswer(userInput)) {
                self._askQuestion(null, 'Aucun problème ! N\'hésite pas si tu as une question');
            } else {
                self._answerNotUnderstood(userInput);
            }

        } else if (self.lastQuestion === 'askFBOrEmail') {

            if (self._isFacebookAnswer(self._formatUserInput(userInput))) {
                self._pushFacebookButton();
            } else if (self._isEmailAnswer(self._formatUserInput(userInput))) {
                self._askQuestion('askFirstName', 'Super, quel est ton prénom ?');
            } else {
                self._answerNotUnderstood(userInput);
            }

        } else if (self.lastQuestion === 'askFirstName') {
            self.onboarding.firstName = self._formatUserInput(userInput);
            self._askQuestion('askLastName', 'Quel est ton nom de famille ?');

        } else if (self.lastQuestion === 'askLastName') {
            self.onboarding.lastName = self._formatUserInput(userInput);
            self._askQuestion('askEmail', 'Quel est ton Addresse Email ?');

        } else if (self.lastQuestion === 'askEmail') {
            self.onboarding.email = self._formatUserInput(userInput);
            self._askQuestion('askConfirmation', 'Tu es bien ' + self.onboarding.firstName + ' ' + self.onboarding.lastName + ' avec pour email ' + self.onboarding.email + ' ?');
        } else if (self.lastQuestion === 'askConfirmation') {
            self.input.type = 'password';
            self._askQuestion('askPwd', 'Il ne reste plus qu\'à choisir un mot de passe');
        } else if (self.lastQuestion === 'askPwd') {
            console.log('création de compte  :' + userInput);
            self.onboarding.password = self._formatUserInput(userInput);
            self._createUserAccount();

        } else if (self.lastQuestion === 'askTutoiement') {
            if (self._isPositiveAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.tutoiement': true});
            } else if (self._isNegativeAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.tutoiement': false});
            } else {
                self._answerNotUnderstood(userInput);
            }
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askMovingDate') {
            var day = moment(userInput);
            Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.movingDate': day.toDate()});
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askNewAddress') {
            Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.newAddress': self._formatUserInput(userInput)});
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askOldAddress') {
            Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.oldAddress': self._formatUserInput(userInput)});
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askRentingNewAddress') {
            if (self._isPositiveAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.rentingNewAddress': true});
            } else if (self._isNegativeAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.rentingNewAddress': false});
            } else {
                self._answerNotUnderstood(userInput);
            }
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askRentingOldAddress') {
            if (self._isPositiveAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.rentingOldAddress': true});
            } else if (self._isNegativeAnswer(userInput)) {
                Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.rentingOldAddress': false});
            } else {
                self._answerNotUnderstood(userInput);
            }
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askChildren') {
            if (self._formatUserInput(userInput) === 0) {
                userInput = -1
            }
            Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.children': self._formatUserInput(userInput)});
            self._askCompleteProfilage();

        } else if (self.lastQuestion === 'askAnimals') {
            if (self._formatUserInput(userInput) === 0) {
                userInput = -1
            }
            Meteor.call('BotInteractions.profilage.update', self.botInteractionId, {'profilage.animals': self._formatUserInput(userInput)});
            self._askCompleteProfilage();
        }
    }

    processQuestion(userInput) {
        const self = this;

        self._insertBotUserQuestion(userInput);

        //TODO : ajout du comportement sur une question spontanée de l'utilisateur
    }

    _pushFacebookButton() {
        const self = this;
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
                // handle error
            } else {
                // successful login!
                self._insertBotInteraction(() => {
                    self._askCompleteProfilage();

                });

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

    _askQuestion(questionName, questionLabel) {
        const self = this;
        self.lastQuestion = questionName;
        self.textArea.value = questionLabel;
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

    _isFacebookAnswer(userInput) {
        const positiveAnswer = ['fb', 'Fb', 'FB', 'face', 'Face', 'facebook', 'Facebook', 'FACEBOOK', 'FAcebook'];

        return positiveAnswer.some((word) => {
            return userInput.includes(word);
        });
    }

    _isEmailAnswer(userInput) {
        const positiveAnswer = ['email', 'Email', 'EMAIL', 'EMail', 'mail', 'Mail', 'MAIL', 'MAIl', 'MAil'];

        return positiveAnswer.some((word) => {
            return userInput.includes(word);
        });
    }

    startTour() {
        console.log('start tour');
        let tour = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-theme-arrows'
            }
        });

        tour.addStep('example', {
            title: 'Example Shepherd',
            text: 'Creating a Shepherd is easy too! Just create ...',
            attachTo: '.menu',
            advanceOn: '.docs-link click'
        });

        tour.start();
    }

    _hasCompletedTour() {
        return BotInteractions.findOne({userId: Meteor.userId()}).hasCompletedTour
    }

    _insertBotInteraction(cb) {
        insertBotInteraction.call({userId: Meteor.userId()}, (err) => {
            if (err) {
                console.log(err);
                cb(err);
            }

            cb(null);
        });
    }

    _setCompletedTour() {
        setCompletedTour.call({userId: Meteor.userId(), hasCompletedTour: true}, (err) => {
            if (err) {
                console.log('Bot interaction document created');
            }
        })
    }

    _insertBotUserQuestion(userInput) {
        const self = this;
        insertBotUserQuestion.call({userId: Meteor.userId(), question: self._formatUserInput(userInput)})
            .then(() => {
                console.log('Bot interaction document created');
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
        createUser.call({
            username: username,
            email: self.onboarding.email,
            password: self.onboarding.password
        }, (error) => {
            if (!error) {
                Meteor.loginWithPassword(self.onboarding.email, self.onboarding.password, () => {
                    console.log('user Logged in succesfully');
                    self._insertBotInteraction(() => {
                        self._askCompleteProfilage();

                    });
                })
            } else {
                console.log(error.message);
                //TODO : implémentation d'un comportement en cas d'erreur durant la création de compte user
            }
        });
    };
}

export const Chatbot = new chatBot();