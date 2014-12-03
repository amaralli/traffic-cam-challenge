// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function() {
    
    //Initializes the map to central Seattle
    var mapOptions = {
        center: new google.maps.LatLng(47.6, -122.3),
        zoom: 12
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    $.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
        .done(function(data) {

            //creates a marker for each camera object
            data.forEach(function(value) {
                var location = value.location;
                var image = value.imageurl;
                var cameraLabel = value.cameralabel;
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(location.latitude),
                        lng: Number(location.longitude)
                    },
                    map: map,
                    label: cameraLabel,
                    imgURL: image.url
                });

                //pops up the information window with data about that specific camera
                var clickListener = google.maps.event.addListener(marker, 'click', function () {
                    var selectedMarker = this;
                    var location = selectedMarker.getPosition();
                    map.panTo(location);
                    infoWindow.open(map, selectedMarker);
                    var content = '<p>' + selectedMarker.label + '</p>' +
                        '<img src=' + selectedMarker.imgURL + '>'
                    infoWindow.setContent(content);
                });

                //filters out cameras that don't match the location entered in by the user
                $("#search").bind('search keyup', function () {
                    var searchTerm = this.value.toLowerCase();
                    var searchLabel = marker.label.toLowerCase();
                    if(searchLabel.indexOf(searchTerm) < 0) {
                        marker.setMap(null);
                    } else {
                        marker.setMap(map);
                    }
                });
            });
        })

        //in the event of failure
        .fail(function(error){
            console.log(error);
            alert("Warning: data failed to load. Try again.");
        });

});