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
    // // RESTAURANT CALL
    var settingsRestaurants = {
        "async": true,
        "crossDomain": true,
        "url": yelpRestaurantQueryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "yelp-com.p.rapidapi.com",
            // The API key is below
            // We can "swap" in a new key closer to submission
            // That way we have our 100 uses still available for class demos and stuff
            "x-rapidapi-key": "d3da491a18mshb8758c6480ff147p103ddcjsnbf8dfb0cb906"
        }
    }



    // PARKS CALL
    // // PARKS CALL
    var settingsParks = {
        "async": true,
        "crossDomain": true,
        "url": yelpParksQueryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "yelp-com.p.rapidapi.com",
            // The API key is below
            // We can "swap" in a new key closer to submission
            // That way we have our 100 uses still available for class demos and stuff
            "x-rapidapi-key": "d3da491a18mshb8758c6480ff147p103ddcjsnbf8dfb0cb906"
        }
    }



    // (Maybe this is on a button click? Once we click the search button?)
    // Get the return from the Yelp Query URL builder
    // Make the AJAX call
    // Return the data from Yelp
    // DECLARE GLOBAL VARIABLES OUTSIDE THIS FUNCTION?

    $.ajax(settingsRestaurants).done(function(response) {
        console.log(response);
        // SET THE RESPONSES DIRECTLY HERE
        // OR, RETURN THEM AND PARSE THEM IN A SEPARATE FUNCTION
        for (var i=0; i < 5; i++) {
        
            // RESTAURANT NAME
            var businessName = objectWithData.business_search_results[i].business.name
            console.log(businessName)
            
            // ADDRESS
            var businessAddress = objectWithData.business_search_results[i].business.addresses.primary_language.long_form
            console.log(businessAddress);
            
            // PHONE NUMBER
            var phoneNumber = objectWithData.business_search_results[i].business.phone
            console.log(phoneNumber);
            
            // TAKEOUT?
            var takeoutLabel = objectWithData.business_search_results[i].business.localized_attributes[2].label
            var takeoutValue = objectWithData.business_search_results[i].business.localized_attributes[2].value
            console.log(takeoutLabel)
            console.log(takeoutValue)
            
            // WEBSITE URL
            var businessWebsite = objectWithData.business_search_results[i].business.url
            console.log(businessWebsite)
        }
    });

    $.ajax(settingsParks).done(function(response) {

        console.log(response);
        for (var i = 0; i < 5; i++) {

            // PARK NAME
            var businessName = response.business_search_results[i].business.name
            console.log(businessName)

            // ADDRESS
            var businessAddress = response.business_search_results[i].business.addresses.primary_language.long_form
            console.log(businessAddress);


        }
    });

}

// (Maybe this is on a button click? Once we click the search button?)
// Get the return from the Yelp Query URL builder
// Make the AJAX call
// Return the data from Yelp
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