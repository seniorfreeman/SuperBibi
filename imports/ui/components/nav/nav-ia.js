import './nav-ia.jade'
import {Chatbot} from '/imports/chatbot/api/chatbot'

Template.nav_ia.helpers({
    create: function () {

    },
    rendered: function () {

    },
    destroyed: function () {

    },
});

Template.nav_ia.onCreated(function () {
    this.autorun(() => {
        this.subscribe('BotInteractions', Meteor.userId());
    });
});

Template.nav_ia.onRendered(() => {
    Meteor.setTimeout(() => {
        Chatbot.init(document.getElementById('ia-area'), document.getElementById('ia-input'))
    }, 5000);

});

Template.nav_ia.events({
    "click #ia-send": function (event, template) {
        Chatbot.processAnswer($('#ia-input').val());
    }

});
