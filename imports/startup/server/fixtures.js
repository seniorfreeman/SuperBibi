import {Meteor} from 'meteor/meteor';
import {Todos} from '../../api/collections/collections.js';
import {Lists} from '../../api/collections/collections.js';
import {Typologies} from '../../api/collections/collections.js';
import {VolumeObjects} from '../../api/collections/collections.js';
import {Rooms} from '../../api/collections/collections.js';
import {RoomObjects} from '../../api/collections/collections.js';
import {Partners} from '../../api/collections/collections.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {

  if (Lists.find().count()===0) {

        //insert global Lists
        Lists.insert({
            "name": "Divers",
            "cssClass": "fa fa-check",
            "system": false,
            "includeHrbefor": true,
            "includeHrAfter": false
        });
        idprio = Lists.insert({
            name: "Mes priorités",
            cssClass: "fa fa-star",
            system: true,
            includeHrbefor: true,
            includeHrAfter: false
        });
        idAdministratif = Lists.insert({
            name: "Administratif",
            cssClass: "fa fa-inbox",
            system: false,
            includeHrbefor: true,
            includeHrAfter: false
        });
        iddynamic = Lists.insert({
            name: "Jour J",
            cssClass: "fa fa-inbox",
            system: false,
            includeHrbefor: false,
            includeHrAfter: false
        });
        idOrganisation = Lists.insert({
            name: "Organisation",
            cssClass: "fa fa-sitemap",
            system: false,
            includeHrbefor: false,
            includeHrAfter: false
        });

        idTout = Lists.insert({
            name: "Tout",
            cssClass: "fa fa-list",
            system: true,
            includeHrbefor: true,
            includeHrAfter: false
        });
        idEffecc = Lists.insert({
            name: "Effectués",
            cssClass: "fa fa-check",
            system: true,
            includeHrbefor: false,
            includeHrAfter: false
        });
        //insert Global Typologies
        idAvant = Typologies.insert({
            name: "Avant"
        });
        idPour = Typologies.insert({
            name: "Pour le jour J"
        });
        idAprès = Typologies.insert({
            name: "Après"
        });
        idAprès = Typologies.insert({
            name: "Non daté"
        });
        todoA = Todos.insert({
            list: idOrganisation,
            typologie: idAvant,
            links: [],
            products: [{
                imageUrl: "IMG/scotch.jpg",
                description: "4x Rouleau de scotch de déménagement",
                price: "4.00",
                url: ""
            }],
            documents: [],
            videos: ["https://www.youtube.com/embed/pqhmaWy2Il4"],
            ownerId: null,
            essentiel: true,
            friends: [],
            prioritaire: false,
            stressMode: false,
            allowNotification: false,
            title: "Acheter des cartons et de l'équipement d'emballage",
            conseils: ""
        })
        todoB = Todos.insert({
            list: idOrganisation,
            typologie: idAvant,
            links: [],
            products: [{
                imageUrl: "IMG/scotch.jpg",
                description: "4x Rouleau de scotch de déménagement",
                price: "4.00",
                url: ""
            }],
            documents: [],
            videos: ["https://www.youtube.com/embed/pqhmaWy2Il4"],
            ownerId: null,
            essentiel: true,
            friends: [],
            prioritaire: false,
            stressMode: false,
            allowNotification: false,
            title: "Réserver le véhicule utilitaire",
            conseils: ""
        });
        
        todoC = Todos.insert({
            list: idOrganisation,
            typologie: idAvant,
            links: [],
            products: [{
                imageUrl: "IMG/scotch.jpg",
                description: "4x Rouleau de scotch de déménagement",
                price: "4.00",
                url: ""
            }],
            documents: [],
            videos: ["https://www.youtube.com/embed/pqhmaWy2Il4"],
            ownerId: null,
            essentiel: true,
            friends: [],
            prioritaire: false,
            stressMode: false,
            allowNotification: false,
            title: "Organiser les tâches des bras : équipes, répartition par étage",
            conseils: ""
        })
    }

    if (Partners.find().count()===0) {
        Partners.insert({title: 'Trouvez des bras pour vous aider', picture: 'https://www.digischool.fr/images/article/10346_1.jpg', url: 'http://www.desbrasenplus.com/'})
    }
});
