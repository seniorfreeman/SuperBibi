/**
 * Created by maxencecornet on 24/04/2016.
 */
import {BotInteractions} from './collections/botInteractions.js';
import {BotUserQuestions} from './collections/botUserQuestions.js';

BotInteractions.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

BotUserQuestions.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});