/**
 * Created by maxencecornet on 24/04/2016.
 */
import {BotInteractions} from './collections/botInteractions.js';

Meteor.publish('BotInteractions', (userId) => {
    //const userId = this.userId;
    return BotInteractions.find({userId: userId})
});
