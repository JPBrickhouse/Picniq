// ---------------------------------------
// << Function to build the geocode query URL >>
// 
function buildGeoCodeQueryURL() {
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?"
    var queryParameters = { "key": "7b5d7173bf8d49dbb2bd074694d9d501" }

    // Getting an address input by the user
    queryParameters.q = $("#addressInput").val().trim()

    queryParameters.no_annotations = 1;

    console.log(queryURL + $.param(queryParameters));

    // Returning the queryURL for the geocoding() function
    return (queryURL + $.param(queryParameters))
}


// ---------------------------------------
// << Function making an AJAX call OpenCageData >>
// 
function geocoding() {

    var queryURLgeocoding = buildGeoCodeQueryURL();

    // Putting a return in front of the AJAX call
    // To return the results of the AJAX call as the return of the function geocoding()
    // Returning the coordinates of Latitude and Longitude, based on the user input search
    return ($.ajax({
        url: queryURLgeocoding,
        method: "GET"
    }).then(function (geocodeData) {
        var latitude = geocodeData.results[0].geometry.lat;
        var longitude = geocodeData.results[0].geometry.lng;
        var coordinates = [latitude, longitude];
        return coordinates;
    }))
}


// ---------------------------------------
// << Function to build the Four Square query URL >> 
// 
async function buildFourSquareQueryURL() {

    // Initializing an empty array to story the coordinates
    var coordinates = [];

    // Looking up the data attribute of the element with the ID of "eitherORSearch"
    var eitherORsearch = document.getElementById("eitherORsearch");
    var searchTYPE = eitherORsearch.getAttribute("data-searchTYPE");

    // Run a series of if statements, based on the data attribute
    
    // If an addressSearch was performed, run the geocoding function and get those coordinates
    if (searchTYPE === "AddressSearch") {
        // Awaiting the return from geocoding() prior to continuing the rest of the buildFourSquareQueryURL function
        var coordinatesGeocoding = await geocoding();
        // Use the coordinatesGeocoding as the coordinates within the buildFourSquareQueryURL function
        coordinates = coordinatesGeocoding;
    }
    // If a search was performed based on currentLocation...
    if (searchTYPE === "currentLocationSearch") {
        // If the currentLocationCoordinates are set to [0,0], it is because...
        // the user did not allow for location services
        if (currentLocationCoordinates === [0,0]) {
            return;
        }
        // Else, use the currentLocationCoordinates as the coordinates within the buildFourSquareQueryURL function
        else {
            coordinates = currentLocationCoordinates;
        }
    }

    // Getting the latitude and longitude individually from the coordinates
    var latitude = coordinates[0];
    var longitude = coordinates[1];

    // RESTAURANT QUERY URL
    var initialRestaurantQueryURL = "https://api.foursquare.com/v2/venues/explore?v=20180323&"
    var restaurantParameters = { "client_id": "V3AXUCNPQO0HDURJKVY5Y3AC4IK0KYKWRQLLOBNMCTB4PWWE" };
    restaurantParameters.client_secret = "YDOAOF5WZVS1HUEFENUD5PVOZ4FKMS0T32JFQWXG12DTF3AF";
    restaurantParameters.ll = latitude + "," + longitude;
    restaurantParameters.query = "food";
    restaurantParameters.radius = "1000"; // 1000 meters, aka, 1km
    restaurantParameters.limit = 10; // 10 results returned by default
    restaurantParameters.sortByDistance = 1; // Boolean flag to sort the results by distance instead of relevance
    var fourSquareRestaurantQueryURL = initialRestaurantQueryURL + $.param(restaurantParameters);
    console.log(fourSquareRestaurantQueryURL);

    // PARKS QUERY URL
    var initialParksQueryURL = "https://api.foursquare.com/v2/venues/search?v=20180323&"
    var parksParameters = { "client_id": "V3AXUCNPQO0HDURJKVY5Y3AC4IK0KYKWRQLLOBNMCTB4PWWE" };
    parksParameters.client_secret = "YDOAOF5WZVS1HUEFENUD5PVOZ4FKMS0T32JFQWXG12DTF3AF";
    parksParameters.ll = latitude + "," + longitude;
    parksParameters.query = "park"
    parksParameters.radius = "2500" // 1000 meters, aka, 2.5 km
    parksParameters.categoryId = "4bf58dd8d48988d163941735" // Category ID for PARKS
    parksParameters.limit = 10; // 10 results returned by default
    parksParameters.sortByDistance = 1; // Boolean flag to sort the restuls by distance instead of relevance
    var fourSquareParksQueryURL = initialParksQueryURL + $.param(parksParameters);
    console.log(fourSquareParksQueryURL);

    // RETURNING BOTH QUERY URLS
    var queryURLs = [fourSquareRestaurantQueryURL, fourSquareParksQueryURL];
    return queryURLs;
}


// ---------------------------------------
// << Function making an AJAX call to Four Square >> 
//
async function fourSquareAJAXcall(event) {

    event.preventDefault();

    // CLEARING the previous content from the divs
    $("#restaurantsDiv").empty();
    $("#parksDiv").empty();

    // Awaiting the return from buildFourSquareQueryURL prior to continuing the rest of the fourSquareAJAXcall function
    var queryURLs = await buildFourSquareQueryURL();

    // The queryURLs to be used for the Restaurant and Parks AJAX calls
    var fourSquareRestaurantQueryURL = queryURLs[0];
    var fourSquareParksQueryURL = queryURLs[1];

    // RESTAURANT AJAX CALL
    $.ajax({
        dataType: "json",
        url: fourSquareRestaurantQueryURL,
        data: {},
        success: function (data) {
            // Code for handling API response
            console.log(data);

            // DETERMINING HOW MANY RESTAURANTS TO DISPLAY
            // (Up to a maximum of 10)
            var maximumCountRestaurants = 0
            var lengthOfResponse = data.response.groups[0].items.length;
            if (lengthOfResponse <= 10) {
                maximumCountRestaurants = lengthOfResponse
            }
            else {
                maximumCountRestaurants = 10;
            }

            // Looping through the first 10 results, parsing the data, and displaying the data on the html page
            for (var i = 0; i < maximumCountRestaurants; i++) {
                // Getting the restaurant name
                var restaurantName = data.response.groups[0].items[i].venue.name;

                // Getting the restaurant address
                var restaurantAddress = data.response.groups[0].items[i].venue.location.formattedAddress[0];

                // Running an if / else statment to confirm if the restaurant does delivery
                var doesDelivery = "";
                if (data.response.groups[0].items[i].venue.delivery != undefined) {
                    doesDelivery = "Yes"
                    var devliveryProvider = data.response.groups[0].items[i].venue.delivery.provider.name;
                    var deliveryURL = data.response.groups[0].items[i].venue.delivery.url;
                }
                else {
                    doesDelivery = "No"
                }

                // Getting the restaurant "genre"
                var restaurantGenre = data.response.groups[0].items[i].venue.categories[0].shortName;

                // Getting the icon for the restaurant "genre"
                var iconPrefix = data.response.groups[0].items[i].venue.categories[0].icon.prefix;
                var iconSuffix = data.response.groups[0].items[i].venue.categories[0].icon.suffix;
                var imageURL = iconPrefix + "64" + iconSuffix


                // BUILDING THE DIV FOR THE RESTAURANT
                var individualRestaurantDiv = $("<div>");
                individualRestaurantDiv.attr("class", "card bg-light")
                var restHeader = $("<div>");
                restHeader.attr("class", "card-header");
                restHeader.attr("id", "restHeader")
                restHeader.css("background", "red")
                var restBody = $("<div>");
                restBody.attr("class", "card-body bg-light")

                // Creating the image for the restaurant genre icon
                var image = $("<img>");
                image.attr("src", imageURL);

                // Creating content for the name, address, and genre
                var name = $("<h4>").text(restaurantName);
                name.css("margin", "0")
                var address = $("<p>").text("Address: " + restaurantAddress);
                var genre = $("<p>").text("Genre: " + restaurantGenre);

                restHeader.append(name);
                restBody.append(image, genre, address)
                // Apending everything to the div
                individualRestaurantDiv.append(restHeader, restBody);

                // Running a series of if statements to confirm if the restaurant does delivery
                // If the restaurant doesn't do delivery, display "No Delivery Offered"
                if (doesDelivery === "No") {
                    var noDeliveryURLresponse = $("<p>").text("No Delivery Offered")
                    individualRestaurantDiv.append(noDeliveryURLresponse);
                }
                // If the restaurant does delivery, display a link to the delivery restaurant
                if (doesDelivery === "Yes") {
                    var buidlingDeliveryURL = $("<a>").attr("href", deliveryURL);
                    buidlingDeliveryURL.text(devliveryProvider.toUpperCase());
                    buidlingDeliveryURL.attr("target", "_blank");
                    var yesDeliveryResponse = $("<p>").text("Delivery Offered");
                    individualRestaurantDiv.append(yesDeliveryResponse, buidlingDeliveryURL);
                }

                // APPENDING THE DIV to the HTML
                $("#restaurantsDiv").append(individualRestaurantDiv);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Code for handling errors in the Restaurants AJAX call
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            // Looking up the data attribute of the element with the ID of "eitherORSearch"
            var eitherORsearch = document.getElementById("eitherORsearch");
            var searchTYPE = eitherORsearch.getAttribute("data-searchTYPE");

            // Running if statements to determine the type of error message to display
            if (searchTYPE === "AddressSearch") {
                var retrySearch = $("<p>").text("Please retry address search")
                $("#restaurantsDiv").append(retrySearch);
            }
            if (searchTYPE === "currentLocationSearch") {
                var retrySearch = $("<p>").text("Please Refresh Page and Allow Location")
                $("#restaurantsDiv").append(retrySearch);
            }
        }
    })

    // PARKS AJAX CALL
    $.ajax({
        dataType: "json",
        url: fourSquareParksQueryURL,
        data: {},
        success: function (data) {
            // Code for handling API response
            console.log(data);

            // DETERMINING HOW MANY PARKS TO DISPLAY
            // (Up to a maximum of 10)
            var maximumCountParks = 0
            var lengthOfResponse = data.response.venues.length;
            if (lengthOfResponse <= 10) {
                maximumCountParks = lengthOfResponse
            }
            else {
                maximumCountParks = 10;
            }

            // Looping through the first 10 results, parsing the data, and displaying the data on the html page
            for (var i = 0; i < maximumCountParks; i++) {
                // Getting the park name
                var parkName = data.response.venues[i].name;

                // Getting the park address
                var parkAddress = data.response.venues[i].location.formattedAddress[0];

                // Getting the icon for the park
                var iconPrefix = data.response.venues[i].categories[0].icon.prefix;
                var iconSuffix = data.response.venues[i].categories[0].icon.suffix;
                var imageURL = iconPrefix + "64" + iconSuffix

                // BUILDING THE DIV FOR THE PARKS
                var individualParkDiv = $("<div>");
                individualParkDiv.attr("class", "card bg-light");
                parkHeader = $("<div>");
                parkHeader.attr("class", "card-header");
                parkHeader.css("background", "green");
                var parkBody = $("<div>");
                parkBody.attr("class", "card-body bg-light")
                // Creating the image for the park icon
                var image = $("<img>");
                image.attr("src", imageURL);
                // Creating content for the name and address
                var name = $("<h4>").text(parkName);
                name.css("margin", "0")
                parkHeader.append(name);
                var address = $("<p>").text("Address: " + parkAddress);
                parkBody.append(image, address);
                // Apending everything to the div
                individualParkDiv.append(parkHeader, parkBody);

                // APPENDING THE DIV to the HTML
                $("#parksDiv").append(individualParkDiv);
            }
         
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Code for handling errors in the AJAX calls
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            // Looking up the data attribute of the element with the ID of "eitherORSearch"
            var eitherORsearch = document.getElementById("eitherORsearch");
            var searchTYPE = eitherORsearch.getAttribute("data-searchTYPE");

            // Running if statements to determine the type of error message to display
            if (searchTYPE === "AddressSearch") {
                var retrySearch = $("<p>").text("Please retry address search")
                $("#parksDiv").append(retrySearch);
            }
            if (searchTYPE === "currentLocationSearch") {
                var retrySearch = $("<p>").text("Please Refresh Page and Allow Location")
                $("#parksDiv").append(retrySearch);
            }
        }
    });

}


// ---------------------------------------
// << Event listeners to run the fourSquareAJAXcall function! >> 
//
// The submitBtn button has an event listener
$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    // Shows results div on screen
    $("#resultsDiv").show();

    // Setting the data attribute of data-searchTYPE
    // This gets referenced within fourSquareAJAXcall
    var eitherORsearch = document.getElementById("eitherORsearch");
    eitherORsearch.setAttribute("data-searchTYPE", "AddressSearch")

    // Running the fourSquareAJAXcall function
    fourSquareAJAXcall(event)
});

// The locationBtn button has an event listener
$("#locationBtn").on("click", function (event) {
    event.preventDefault();

    // Shows results div on screen
    $("#resultsDiv").show();

    // Setting the data attribute of data-searchTYPE
    // This gets referenced within fourSquareAJAXcall
    var eitherORsearch = document.getElementById("eitherORsearch");
    eitherORsearch.setAttribute("data-searchTYPE", "currentLocationSearch");

    // Running the fourSquareAJAXcall function
    fourSquareAJAXcall(event)
});

// Button that allows user to hide and show the results divs
$("#restaurantsToggle").click(function(){
    $("#restaurantsDiv").toggle(); 
    var restaurantsDiv = $("#restaurantsdiv")
});
$("#parksToggle").click(function(){
    $("#parksDiv").toggle();
});

// ---------------------------------------
// << Function that runs immediately whent the page opens >> 
// If the user allows location services, it stores currentLocationCoordinates
// If the user doesn't allow location services, they can still search by address
// Location determination based on Mozilla documentation:
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

let currentLocationCoordinates = [0,0];
function currentLocation() {
    function success(pos) {
        var crd = pos.coords;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        currentLocationCoordinates = [crd.latitude, crd.longitude];
    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`)
        currentLocationCoordinates = [0,0];
    }
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
}
currentLocation()