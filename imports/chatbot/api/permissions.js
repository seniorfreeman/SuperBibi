/**
 * Created by maxencecornet on 24/04/2016.
 */
import {BotUserQuestions} from './collections/botUserQuestions.js';

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