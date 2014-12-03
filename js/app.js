// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box


$(document).ready(function() {
    var mapOptions = {
        center: new google.maps.LatLng(47.6, -122.3),
        zoom: 12
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //google.maps.event.addDomListener(window, 'load', initialize);

    var infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    $.getJSON("http://data.seattle.gov/resource/65fc-btcc.json", function(data) {
        //NEED TO SHOW AN ALERT IF THIS FAILS
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

            var clickListener = google.maps.event.addListener(marker, 'click', function () {
                var selectedMarker = this;
                var location = selectedMarker.getPosition();
                map.panTo(location);
                infoWindow.open(map, selectedMarker);
                var content = '<p>' + selectedMarker.label + '</p>' +
                    '<img src=' + selectedMarker.imgURL + '>'
                infoWindow.setContent(content);
            });

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

    });

});