/**
 * Created by maxencecornet on 10/05/2016.
 */
export const Questions = [
    {
        name: 'tour',
        type: 'boolean',
        tu: 'Bienvenu, je suis une intelligence artificielle, pas encore futé mais j\'apprends... Je vois que tu n\'es pas connecté, veux tu découvrir l\'app?',
        vous: '',
        additionalPositiveMethod: 'self._startTour()',
        additionalNegativeMethod: ''
    },
    {
        name: 'tourConnected',
        type: 'boolean',
        tu: 'Hello, veux tu découvrir l\'app?',
        vous: '',
        additionalMethod: 'self._startTour()'
    },
    {
        name: 'tutoiement',
        type: 'boolean',
        update: {
            collection: 'profile',
            param: 'profile.tutoiement'
        },
        tu: 'on se tutoie?',
        vous: ''
    },
    {
        name: 'firstName',
        type: 'string',
        tu: 'Super, c’est quoi ton prénom ?',
        update: {
            collection: 'users.profile',
            param: 'firstName'
        },
        vous: 'Quel est votre prénom ? '
    },
    {
        name: 'lastName',
        type: 'string',
        tu: 'et ton nom de famille ?',
        update: {
            collection: 'users.profile',
            param: 'lastName'
        },
        vous: 'Quel est votre nom de famille ?'
    },
    {
        name: 'profileFacebook',
        type: 'boolean',
        tu: 'Ok!, Est-ce que tu souhaites te connecter avec facebook?',
        vous: 'Est-ce que vous souhaitez vous connecter avec facebook?',
        additionalPositiveMethod: 'self._pushFacebookButton()'
    },
    {
        name: 'profileEmail',
        type: 'boolean',
        tu: 'Tu prefère peut-être te connecter par email ?',
        vous: 'Peut-être que vous préférez vous connecter ia email ?'
    },
    {
        name: 'email',
        type: 'string',
        update: {
            collection: 'users.profile',
            param: 'email'
        },
        tu: 'Quel est ton Addresse Email ?',
        vous: 'Quel est votre Addresse Email ?',
        additionalMethod: 'self._setInputPasswordType()'
    },
    {
        name: 'pwd',
        type: 'string',
        update: {
            collection: 'users.profile',
            param: 'password'
        },
        tu: 'Il ne te reste plus qu\'à choisir un mot de passe',
        vous: 'Il ne vous reste plus qu\'à choisir un mot de passe',
        additionalMethod: 'self._createUserAccount()'
    },
    {
        name: 'newAddress',
        update: {
            collection: 'profile',
            param: 'profile.distAdress'
        },
        tu: 'Quelle est ta nouvelle addresse ?',
        vous: 'Quelle est votre nouvelle addresse ?'
    }
    /*
     {
     name: 'oldAddress',
     update: {
     collection: 'profile',
     param: 'profile.departAdress'
     },
     tu: 'Quelle est ton ancienne addresse ?',
     vous: ''
     },
     {
     name: 'rentingNewAddress',
     tu: 'Est-tu propriétaire de ta nouvelle addresse ?',
     vous: ''
     },
     {
     name: 'rentingOldAddress',
     tu: 'Est-tu locataire de ton ancienne addresse ?',
     vous: ''
     },
     {
     name: 'children',
     tu: 'Combien as tu d\'enfants (0 si pas d\'enfants)',
     vous: ''
     },
     {
     name: 'animals',
     tu: 'Combien as tu d\'animaux (0 si pas d\'animaux) ?',
     vous: ''
     },

     {
     name: 'movingDate',
     tu: 'Quand est-ce que tu démenages ?(format : 1995-12-25)',
     vous: 'Quand est-ce que vous démenagez ?(format : 1995-12-25)'
     }
     */
];