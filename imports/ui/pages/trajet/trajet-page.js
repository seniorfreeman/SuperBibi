import './trajet-page.jade';

Template.trajet_page.onCreated(function trajetPageOnCreated() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
        // Add a marker to the map once it's ready
       var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });

    });
    
});

Template.trajet_page.onRendered(function() {
    /*this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("input")
            .geocomplete()
            .bind("geocode:result", function(event, result){
            console.log(result);
          });
        }
    });
    */
    GoogleMaps.load({
        key : 'AIzaSyAjem3CRhH2iX0QCCdO5ed1lF2kLeHrOZ8'
    });

    if (Meteor.user()){
        $('input#from').val(Meteor.user().profile.address);
    }
    
});

Template.trajet_page.helpers({
    exampleMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
             return {
                center: new google.maps.LatLng(45.75801, 4.8001016)
                , zoom: 8
                , test: new google.maps.DirectionsRenderer({})
                , streetViewControl: false
                , mapTypeControl: false
            };
        }

    },
    getDepartureLocation:function(){
        if(Meteor.user()){
            return Meteor.user().profile.departAdress;
        }else {
            // result=""
            // location= Meteor.call("getGuestLocation", function(error, result){
            //     data=JSON.parse(result.content);
            //     $('#from').val(data.country_name+','+ data.city + data.zip_code);
            // });
            return result;
        }
    },
    getArrivalLocation:function(){
        if(Meteor.user()){
            return Meteor.user().profile.distAdress;
        }else {
            return "";

        }
    },
});
var markerArray = [];
var markerArray2 = [];
Template.trajet_page.events({
    'click #showItinerary' : function(){
        $("#itineraire").toggleClass('itineraire');
    },
    'change input#to': function() {
        
            // var markerArray = [];

            // Instantiate a directions service.
            var directionsService = new google.maps.DirectionsService;

            // Create a map and center it on Manhattan.
            var map = GoogleMaps.maps.exampleMap.instance

            // Create a renderer for directions and bind it to the map.
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

            // Instantiate an info window to hold step text.
            var stepDisplay = new google.maps.InfoWindow;

            // Display the route between the initial start and end selections.
            calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
            // Listen to change events from the start and end lists.
            var onChangeHandler = function() {
                calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
            };

            document.getElementById('from').addEventListener('change', onChangeHandler);
            document.getElementById('to').addEventListener('change', onChangeHandler);
        
    },
    'change input#from': function() {

            for (var i = 0; i < markerArray2.length; i++) {
                markerArray2[i].setMap(null);
            }
            // Calling our Meteor server's function
            // and simply storing data into current session
            Meteor.call('getOffres', document.getElementById('from').value, function(error, response) {

                var markers = [];
                // Instantiate an info window to hold step text.
                var stepDisplay = new google.maps.InfoWindow;
                var map =GoogleMaps.maps.exampleMap.instance;
                var text = "agence: "+response.data.agence.nom +": "+ response.data.agence.cp +" "+response.data.agence.adresse1+" "+response.data.agence.ville;
                var marker = new google.maps.Marker;
                marker.setMap(GoogleMaps.maps.exampleMap.instance);
                marker.setPosition(response.data.agence['agencelocation']);
                markerArray2.push(marker);
                attachInstructionText(stepDisplay, marker, text, map)
            });

        if ((document.getElementById('to').value.length < 3)) return false;
            for (var i = 0; i < markerArray2.length; i++) {
                markerArray2[i].setMap(null);
            }
    
    },
    'click input#proches': function() {
        //var markersremove = Session.get('markers');
        if (!document.getElementById('proches').checked) {
            for (var i = 0; i < markerArray2.length; i++) {
                markerArray2[i].setMap(null);
            }
        }
        if (document.getElementById('proches').checked) {
            // Calling our Meteor server's function
            // and simply storing data into current session
            Meteor.call('getOffres', document.getElementById('from').value, function(error, response) {

                var markers = [];
                var marker = new google.maps.Marker;
                marker.setMap(GoogleMaps.maps.exampleMap.instance);

                marker.setPosition({
                    lat: response.data.agence.agenceLocation.lat,
                    lng: response.data.agence.agenceLocation.lng
                });

                console.log(response)
                marker.setPosition(response.data.agence['agencelocation']);

                markerArray2.push(marker);
            });
        }
    }

});

function setmarkers(wspostion) {
    var markers = [];
    wspostion.forEach(function(pos) {
        var marker = new google.maps.Marker;
        marker.setMap(GoogleMaps.maps.exampleMap.instance);
        marker.setPosition({
            lat: pos.lat,
            lng: pos.lng
        });
        markerArray.push(marker);

    });
    return markerArray;
}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
        origin: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        travelMode: google.maps.TravelMode.DRIVING

    }, function(response, status) {

        if(status == 'OK'){
            
            var rep = response.routes[0].legs[0];
            $(".distance p,.distance h2 span").html(rep.distance.text);
            
            var prix = Math.round(rep.distance.value / 1000 * 6)/100; 
            $('.carburant p,.carburant h2 span').html(prix + ' € ');
            
            var temps = rep.duration.text;
            $('.temps p,.temps h2 span').html(temps);
            
            // 'Le coût en carburant reste une estimation de 6€ par 100km : ' +             // Meteor.call('getPrixcarburant', function(error, responseprix) {
            //     xmlDoc = $.parseXML(responseprix.content );
            //     console.log(xmlDoc)
            //     $xml = $( xmlDoc ),
            //     $prixxml = $xml.find( "gas_type" )[0].innerHTML;
            //
            //     var prix = ((parseInt(response.routes[0].legs[0].distance.text)) / 100) * ($prixxml *6);
            //     $('#carburant').html('Le coût en carburant reste une estimation de 6€ par 100km : ' + prix + ' € ');
            // });

        }
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
            /*document.getElementById('warnings-panel').innerHTML =
                '<b>' + response.routes[0].warnings + '</b>';*/
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    
    var itineraire="";

    for (var i = 0; i < myRoute.steps.length; i++) {

        var manoeuvre = myRoute.steps[i].maneuver ?  myRoute.steps[i].maneuver : 'none';
        var time = Math.round(myRoute.steps[i].duration.value/60);
        var plurals = time > 1 ? " minutes" : " minute";
        var timeRedac = "<div class='timing'> pendant " + time + plurals + "</div>";
        if(!time) timeRedac = "";

        itineraire += "<li><i class=" + manoeuvre + "></i>" + myRoute.steps[i].instructions + timeRedac + "</li>";
        var marker = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);

        attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
   
    }

    $('#itineraireTextuel').html(itineraire);
}

function attachInstructionText(stepDisplay, marker, text, map) {

    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
