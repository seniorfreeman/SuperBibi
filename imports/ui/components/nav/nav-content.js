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
    List
} from '../../../api/collections/todo/todo.js'
import {
    Todo
} from '../../../api/collections/todo/todo.js'
import {Moving} from '../../../api/collections/moving/moving.js';

Template.nav_content.onCreated(function navContentOnCreated() {
    this.todolistRnd = null;
    this.autorun(() => {
        this.subscribe('lists.all');
        Meteor.subscribe('UserMoving');
    });
});
Template.nav_content.onRendered(function navContentOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            listRenderHold.release();
        }
    });
});
Template.nav_content.helpers({
    todoLists: function() {
        return List.find();
    },
  avancement: function(){
    const total=Todo.find().count();
    const effectue =Todo.find({"endDate" : { $exists : true, $ne : null }}).count();
    if(total>0){
      return Math.round((effectue/total)*100);
      }
    else {
      return 0;
    }
  },
    init: function() {

        var firstToTrigger = $('nav ul.menu li:first a');
        firstToTrigger.trigger('click')
        FlowRouter.go(firstToTrigger.attr('href'));
        $('#list').val(firstToTrigger.parent().attr('id'));

    },
    nestedTodoCount: function(list) {
        var result;
        if (!list.system) {
            result = Todo.find({
                list: list._id,
                endDate: null
            }).count();
        } else {
            switch (list.name) {
                case "Mes priorités":
                    result = Todo.find({
                        priority: true,
                        endDate: null
                    }).count();
                    break;
                case "Tout":
                    result = Todo.find({
                        "endDate": null
                    }).count();
                    break;
                case "Effectués":
                    result = Todo.find({
                        "endDate": {
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
        return Todo.find().count();
    },
    allTodoCount: function() {
        return Todo.find().count();
    },
    allTodoDoneCount: function() {
        return Todo.find({
            rang: 0
        }).count();
    },
    destroyed: function() {

    },
    renderIfJourJ: function(listName) {

        if (listName == "Jour J") {
            if (!Meteor.user()) return "Jour J";
            moving=Moving.findOne({_id:Meteor.user().profile.movingId});
            if(moving){
                demenagementDate = moving.movingDate;
                if (demenagementDate) {
                    month = moment.utc(demenagementDate).format("MMM");
                    day = moment.utc(demenagementDate).format("DD");
                    return day + " " + month;
                } else {
                    return "Jour J";
                }
            }
            else{
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
    }
});