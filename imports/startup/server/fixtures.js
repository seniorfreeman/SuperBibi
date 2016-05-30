import {Meteor} from 'meteor/meteor';
import {Todo} from '../../api/collections/todo/todo.js';
import {List} from '../../api/collections/todo/todo.js';
import {VolumeObjects} from '../../api/collections/global/global.js';
import {Room} from '../../api/collections/room/room.js';
import {RoomObject} from '../../api/collections/room/room.js';
import {Partners} from '../../api/collections/global/global.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    
    if (List.find().count()===0) {

        //insert global Lists
        List.insert({
            "name": "Vide poche",
            "cssClass": "fa fa-inbox",
            "system": false,
            "includeHrbefor": true,
            "includeHrAfter": false
        });
        idprio = List.insert({
            "name": "Mes priorités",
            "cssClass": "fa fa-star",
            "system": true,
            "includeHrbefor": false,
            "includeHrAfter": false
        });
        idAdministratif = List.insert({
            "name": "Administratif",
            "cssClass": "fa fa-files-o",
            "system": false,
            "includeHrbefor": true,
            "includeHrAfter": false
        });
        iddynamic = List.insert({
            "name": "Jour J",
            "cssClass": "fa fa-calendar-times-o",
            "system": false,
            "includeHrbefor": false,
            "includeHrAfter": false
        });
        idOrganisation = List.insert({
            "name": "Organisation",
            "cssClass": "fa fa-sitemap",
            "system": false,
            "includeHrbefor": false,
            "includeHrAfter": false
        });

        idTout = List.insert({
            "name": "Tout",
            "cssClass": "fa fa-list",
            "system": true,
            "includeHrbefor": true,
            "includeHrAfter": false
        });
        idEffecc = List.insert({
            "name": "Effectués",
            "cssClass": "fa fa-check",
            "system": true,
            "includeHrbefor": false,
            "includeHrAfter": false
        });
    }

    
    if (Partners.find().count()===0) {
        Partners.insert({id:1, title: 'Trouvez des bras pour vous aider', picture: '../IMG/dbepBanner.jpg', url: 'http://www.desbrasenplus.com/',logo:'../IMG/dbenp.png'});
        Partners.insert({id:2, title: 'Un partenaire pour votre stockage ?', picture: '../IMG/hbBanner.jpg', url: 'http://www.homebox.fr/',logo:'../IMG/hb_logo.png'});
    }
});
