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
        coordinates = [latitude, longitude];
        return coordinates;
    }))
}


// ---------------------------------------
// << Function to build the Four Square query URL >> 
// 
async function buildFourSquareQueryURL() {

    // Awaiting the return from geocoding() prior to continuing the rest of the buildFourSquareQueryURL function
    var coordinates = await geocoding();
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

                // Creating the image for the restaurant genre icon
                var image = $("<img>");
                image.attr("src", imageURL);

                // Creating content for the name, address, and genre
                var name = $("<h2>").text(restaurantName);
                var address = $("<p>").text("Address: " + restaurantAddress);
                var genre = $("<p>").text("Genre: " + restaurantGenre);

                // Apending everything to the div
                individualRestaurantDiv.append(name, address, genre, image);

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
            // Code for handling errors
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            var retrySearch = $("<p>").text("Please retry search")
            $("#restaurantsDiv").append(retrySearch);
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

                // Creating the image for the park icon
                var image = $("<img>");
                image.attr("src", imageURL);

                // Creating content for the name and address
                var name = $("<h2>").text(parkName);
                var address = $("<p>").text("Address: " + parkAddress);

                // Apending everything to the div
                individualParkDiv.append(name, address, image);

                // APPENDING THE DIV to the HTML
                $("#parksDiv").append(individualParkDiv);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Code for handling errors
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            var retrySearch = $("<p>").text("Please retry search")
            $("#parksDiv").append(retrySearch);
        }
    });

}

// The submit button has an event listener
// On click, it runs the fourSquareAJAXcall function
$("#submitBtn").on("click", fourSquareAJAXcall);