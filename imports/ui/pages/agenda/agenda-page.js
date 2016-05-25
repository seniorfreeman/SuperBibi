import {
    Todos,
    Events,
    Lists
}
from '../../../api/collections/collections.js';
import {
  updateEvent,
  updateTodoDate
} from '../../../api/collections/methods.js';
import {
  displayError
} from '../../lib/errors.js';

import './event-page.js';

import './agenda-page.jade';

Template.agenda_page.onCreated(function agendaPageOnCreated() {


    this.subscribe('eventList');
    this.subscribe('lists.all');
});
Template.agenda_page.onRendered(function() {
    console.log(Events.find().count());
    var calendar = $('#agenda').fullCalendar({
        lang: 'fr',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        events(start, end, timezone, callback) {
             var todos = Todos.find().map(function(it) {
                 return {
                   id: it._id,
                   title: it.title,
                   start: it.createdAt,
                   end: it.echeance,
                   allDay: false,
                   source: it,
                   backgroundColor: 'green',
                   description: ''
                 };
               });
            var evts = Events.find().map(function(it) {
                return {
                    id: it._id,
                    title: it.title,
                    start: it.start,
                    end: it.end,
                    allDay: false,
                    source: it,
                    description: '<div><a id="deleteBtn" href="#"><i id="font-trash" class="fa fa-trash" aria-hidden="true"></i></a></div>'
                };
            });
            var allEvents = evts.concat(todos);
            callback(allEvents);
        },
        eventRender: function(event, element) {
          //$('.fc-content').append('<br/><a id="deleteBtn" href="#">Supprimer</a>');
            element.find('.fc-title').after('<br/>' + event.description);
        },
        eventDrop: function(event, delta, revertFunc, jsEvent, ui, view){
          id = event.id;
          start = event.start.format();
          end = event.end.format();
          title = event.title;
          desc = event.description;
          if(desc){
            updateEvent.call({eventId:id,start:start,end:end,title:title}, displayError);
            //updateTodoDate.call({todoId:id,start:start}, displayError);
          }
        },
        dayClick(date) {
            Session.set('eventModal', {
                type: 'add',
                date: date.format('DD/MM/YYYY HH:mm')
            });
            Modal.show("event_page", {
                title: 'add',
                event: {
                    start: date,
                    end: date,
                    title: ""
                }
            });
        },
        eventClick(event,e) {
            var actionName=$(e.target).attr('id');
            if(actionName){
              Session.set('eventModal', {
                  type: 'delete',
                  event: event._id
              });
              Modal.show("delete_alert_modal", {
                  title: 'delete',
                  description: 'êtes-vous sûr(e) de vouloir supprimer cet événement ?',
                  event: event
              });

            }else{
              Session.set('eventModal', {
                  type: 'edit',
                  event: event._id
              });
              Modal.show("edit_event_page", {
                  title: 'edit',
                  event: event
              });

            }
        }

    });
    Tracker.autorun(() => {
        Todos.find().fetch();
        Events.find().fetch();
        $('#agenda').fullCalendar('refetchEvents');
    });
});
Template.agenda_page.helpers({

    listDropDown: function(){
      return Lists.find({system:false});
    },

    onEventClicked: function() {
        return function(calEvent, jsEvent, view) {
            alert("Event clicked: " + calEvent.title);
        }
    },
    onDayClick: function(date, jsEvent, view) {
        alert("selected")
    },
    /*getConnectionIP: function() {
        Meteor.call("getConnectionIP", function(error, result) {
            if (error) {
                console.log("error", error);
            }
            if (result) {
                console.log("result", result);
                alert(result);
            }
        });
    }*/
});
