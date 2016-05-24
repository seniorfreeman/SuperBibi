import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    Mongo
} from 'meteor/mongo';
import {
    ReactiveDict
} from 'meteor/reactive-dict';
import {
    Tracker
} from 'meteor/tracker';
import {
    $
} from 'meteor/jquery';

import {
    displayError
} from '../../lib/errors.js';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    TAPi18n
} from 'meteor/tap:i18n';
import {
    listRenderHold
} from '../../launch-screen.js';
import '../todo/listTodo.js';
import './nav-content.jade'
import {
    Lists
} from '../../../api/collections/collections.js'
import {
    Typologies
} from '../../../api/collections/collections.js'
import {
    Todos
} from '../../../api/collections/collections.js'

Template.nav_content.onCreated(function navContentOnCreated() {
    this.todolistRnd = null;
    this.autorun(() => {
        this.subscribe('lists.all');
    });
});
Template.nav_content.onRendered(function navContentOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            listRenderHold.release();
        }
    });
    $(function() {
        // your code goes here
    });
});
Template.nav_content.helpers({
    todoLists: function() {
        return Lists.find();
    },
  avancement: function(){
    const total=Todos.find().count();
    const effectue =Todos.find({"dateFin" : { $exists : true, $ne : null }}).count();
    if(total>0){
      return Math.round((effectue/total)*100);
      }
    else {
      return 0;
    }
  },
    init: function() {
        $("a:contains('Divers')").trigger('click')
        FlowRouter.go($("a:contains('Divers')").attr('href'));


        $('#list').val($("a:contains('Divers')").parent().attr('id'))

    },
    nestedTodoCount: function(list) {
        var result;
        if (!list.system) {
            result = Todos.find({
                list: list._id,
                dateFin: null
            }).count();
        } else {
            switch (list.name) {
                case "Mes priorités":
                    result = Todos.find({
                        prioritaire: true,
                        dateFin: null
                    }).count();
                    break;
                case "Tout":
                    result = Todos.find({
                        "dateFin": null
                    }).count();
                    break;
                case "Effectués":
                    result = Todos.find({
                        "dateFin": {
                            $exists: true,
                            $ne: null
                        }
                    }).count();
                    break;
            }
        }
        return result;
    },
    todoPrio: function() {
        return Todos.find().count();
    },
    allTodoCount: function() {
        return Todos.find().count();
    },
    allTodoDoneCount: function() {
        return Todos.find({
            rang: 0
        }).count();
    },
    destroyed: function() {

    },
    renderIfJourJ: function(listName) {

        if (listName == "Jour J") {
            if (!Meteor.user()) return "Jour J";
            demenagementDate = Meteor.user().profile.dateDemenagement;
            if (demenagementDate) {
                month = moment.utc(demenagementDate).format("MMM");
                day = moment.utc(demenagementDate).format("DD");
                return day + " " + month;
            } else {
                return "Jour J";
            }
        } else {
            return listName;
        }


    },
});

Template.nav_content.events({
    "click .themelink": function(event, template) {
        $(event.currentTarget).parent().find('.active').removeClass("active");
        $(event.currentTarget).addClass('active');
        if ($(event.currentTarget).find('a:contains("Mes priorités")').length>0) {
            $("#prioritaireEdit").removeClass("star");
            $("#prioritaireEdit").addClass("star active");
        }else {
            $("#prioritaireEdit").removeClass("active");
        }
        $('body').removeClass('soft').removeClass('aside');
    }
});
