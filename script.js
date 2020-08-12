// ---------------------------------------
// << Function to build the geocode query URL >>
// 
function buildGeoCodeQueryURL() {
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?"

    var queryParameters = { "key": "7b5d7173bf8d49dbb2bd074694d9d501" }

    // NEED an INPUT parameter on the HTML document corresponding to the ID of addressInput
    // This should be the search button value (the address the user searches)

    queryParameters.q = "300 East Randolph, Chicago"
        // queryParameters.q = $("#addressInput").val().trim()

    queryParameters.no_annotations = 1;

    console.log(queryURL + $.param(queryParameters));
    return (queryURL + $.param(queryParameters))
}


// ---------------------------------------
// << Function making an AJAX call OpenCageData >>
// 
function geocoding() {

    var queryURLgeocoding = buildGeoCodeQueryURL();

    // Putting a return in front of the AJAX call
    // To return the results of the AJAX call as the return of the function geocoding()
    return ($.ajax({
        url: queryURLgeocoding,
        method: "GET"
    }).then(function(geocodeData) {
        var latitude = geocodeData.results[0].geometry.lat;
        var longitude = geocodeData.results[0].geometry.lng;
        coordinates = [latitude, longitude];
        return coordinates;
    }))
}


// ---------------------------------------
// << Function to build the Yelp query URL >> 
// 
async function buildYelpQueryURL() {

    // Awaiting the return from geocoding() prior to continuing the rest of the buildWeatherQueryURL function
    var coordinates = await geocoding();
    console.log(coordinates);

    var latitude = coordinates[0];
    var longitude = coordinates[1];

    // INPUT PARAMETERS FROM THE USER
    // - inputRadius = radius in kilometers
    var inputRadius = 5

    var yelpRestaurantQueryURL = "https://yelp-com.p.rapidapi.com/search/nearby/" + latitude + "/" + longitude + "?offset=0&radius=" + inputRadius + "&term=Restaurants";
    var yelpParksQueryURL = "https://yelp-com.p.rapidapi.com/search/nearby/" + latitude + "/" + longitude + "?offset=0&radius=" + inputRadius + "&term=Parks";

    var queryURLs = [yelpRestaurantQueryURL, yelpParksQueryURL];
    console.log(queryURLs)
    return queryURLs;
}
// Get the return from the OpenCageData AJAX call function
// (aka, get the latitude and longitude)
// Take input from radio buttons (aka, checked or unchecked)
// Build the Yelp query URL
// Return the Yelp query URL


// ---------------------------------------
// << Function making an AJAX call to Yelp >> 
//

async function yelpAJAXcall() {

    var queryURLs = await buildYelpQueryURL();
    var yelpRestaurantQueryURL = queryURLs[0];
    var yelpParksQueryURL = queryURLs[1];

    // RESTAURANT CALL
    var settingsRestaurants = {
        "async": true,
        "crossDomain": true,
        "url": yelpRestaurantQueryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "yelp-com.p.rapidapi.com",
            // "x-rapidapi-key": "8d77924a53mshdbbbe2b4fb69b1ep172438jsn0a5abec1324a"
        }
    }

    // PARKS CALL
    var settingsParks = {
        "async": true,
        "crossDomain": true,
        "url": yelpParksQueryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "yelp-com.p.rapidapi.com",
            // "x-rapidapi-key": "8d77924a53mshdbbbe2b4fb69b1ep172438jsn0a5abec1324a"
        }
    }

    // RESTAURANT CALL
    $.ajax(settingsRestaurants).done(function(response) {
        console.log(response);

        for (var i=0; i < 5; i++) {
        
            // RESTAURANT NAME
            var businessName = response.business_search_results[i].business.name
            
            // ADDRESS
            var businessAddress = response.business_search_results[i].business.addresses.primary_language.long_form
            
            // PHONE NUMBER
            var businessPhone = response.business_search_results[i].business.phone
            
            // TAKEOUT?
            var takeoutLabel = response.business_search_results[i].business.localized_attributes[2].label
            var takeoutValue = response.business_search_results[i].business.localized_attributes[2].value
            
            // WEBSITE URL
            var businessURL = response.business_search_results[i].business.url

            // PHOTO

            // BUILDING THE DIV
            var individualRestaurantDiv = $("<div>");
            var restaurantName = $("<h2>").text("Restaurant: " + businessName);
            var restaurantAdress = $("<p>").text("Addres: " + businessAddress);
            var restaurantPhone = $("<p>").text("Phone: " + businessPhone);
            var takeOutText = $("<p>").text(takeoutLabel + "? " + takeoutValue);
            var restaurantURL = $("<a>").attr("href",businessURL);
            restaurantURL.text(restaurantName);
            restaurantURL.attr("target","_blank");
            // PHOTO
            individualRestaurantDiv.append(restaurantName,restaurantAdress,restaurantPhone,takeOutText,restaurantURL);

            // APPENDING THE DIV
            $("#restaurantsDiv").append(individualRestaurantDiv);
        }
    });

    // PARKS CALL
    $.ajax(settingsParks).done(function(response) {
        console.log(response);

        for (var i = 0; i < 5; i++) {

            // PARK NAME
            var businessName = response.business_search_results[i].business.name

            // ADDRESS
            var businessAddress = response.business_search_results[i].business.addresses.primary_language.long_form

            // URL
            var businessURL = response.business_search_results[i].url;

            // PHOTO
            var businessPhoto = response.business_search_results[i].business.photos[0].url_prefix + "o.jpg"

            // BUILDING THE DIV
            var individualParkDiv = $("<div>");
            var parkName = $("<h2>").text("Park: " + businessName);
            var parkAddress = $("<p>").text("Addres: " + businessAddress);
            var parkURL = $("<a>").attr("href",businessURL);
            parkURL.text(businessName);
            parkURL.attr("target","_blank");
            var parkPhoto = $("<img>").attr("src",businessPhoto);

            individualParkDiv.append(parkName, parkAddress,parkURL,parkPhoto);
            
            // APPENDING THE DIV
            $("#parksDiv").append(individualParkDiv);
        }
    });

}

// (Maybe this is on a button click? Once we click the search button?)
// Get the return from the Yelp Query URL builder
// Make the AJAX call
// Return the data from Yelp


// ID = "submitBtn"
// Add an event listener for the click to run this function
yelpAJAXcall();




// ---------------------------------------
// << Function to parse through all the data >>
// 
// Get the return from the AJAX call to Yelp
// (aka, get the data from Yelp)
// Parse through the data
// Return the parsed data


// ---------------------------------------
// << Function to display the data
//
// Get the return from the parsed data function
// Display everything
// - Restaurant
// ---- Menu (aka, genre of food)
// ---- Price ($ symbols)
// ---- Rating (stars)
// ---- Open? (Based on the times listed on the website compared to current time)
// ---- Image / Icon
// - Parks
// ---- Park times
// ---- Dog Friendly?
// ---- Image / Icon