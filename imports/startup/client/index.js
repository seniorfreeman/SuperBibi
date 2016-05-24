import {
    $
} from 'meteor/jquery';
import './useraccounts-configuration.js';
import './facebook.js';
import './routes.js';
import '../../chatbot/api/chatbot.js';
Meteor.startup(function() {

    $(window).bind('beforeunload', function(event) {
        console.log(Event);

        Event.preventDefault();
        Event.stopImmediatePropagation();
        Event.stopPropagation();
    });
});

window.alert = function(sMessage, title) {
    // Write your own code to execute whenever alert is called
    Modal.show('alert_modal',{title:title, description:sMessage});
    return false;

};
