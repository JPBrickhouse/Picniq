# Picniq
This application is a dynamic platform, designed to provide the nearest parks and restaurants based on the users’ location.

## Deployed Application

**Picniq App!**
[https://jpbrickhouse.github.io/Picniq/](https://jpbrickhouse.github.io/Picniq/)

## Motivation
During the COVID-19 pandemic, locally-owned restaurants and bars have been forced to rethink their entire operation. While they are unable to provide the same indoor dining experiences, they are still operating via delivery and takeout. Our Picniq app opens up a new world of dining opportunities: local food delivered directly to neighborhood parks, creating a unique, socially-distant dining experience.

## Screenshots
### Landing Page
![picniq landing page](./assets/picniq-img-1.PNG)
### Results, example v1
![picniq results ](./assets/picniq-img-2.PNG)
### Results, example v2
![picniq results 2](./assets/picniq-img-3.PNG)


## Features
The Picniq allows for two forms of location input: current location (based on the user’s browser) or input address (based on any desired location). The search results are provided by FourSquare and are based on proximity, ensuring that only the nearest restaurants and parks are provided to the user. Within the results for each restaurant, a link is provided to connect the users to a delivery service.

## Code Notes:
The backbone of Picniq’s functionality was constructed with Javascript and jQuery, several APIs, and built-in browser functions:
- If a user selects their current location, the browser calculates their latitude and longitude based on their IP address. However, if the user searches by address – perhaps to search for restaurants or parks near the address of a friend! – the address is fed via AJAX call into the OpenCage Geocoder API, which returns the latitude and longitude.
- The latitude and longitude – regardless of source – is then fed (pun intended) via AJAX call into the API for FourSquare. Parsing through the results of the FourSquare API JSON allows us to return a bevy of useful information to the user. This includes, but is not limited to, the following:
    - Restaurant Name and Address
    - Genre of food (Asian, Latin American, German, etc.)
    - Whether or not delivery is offered? (Some restaurants unfortunately do not offer delivery… But for those that do – which is the majority! – a direct link is provided to the restaurant’s associated GrubHub Page.)
    - Park Name and Address
    - Helpful information regarding the location and type of park (Playground, Dog Park, Community Park)
- All this information is indispensable for the user’s pandemic picnic planning needs!
- But good data alone does not necessarily make a good app. That’s where our simple design interface has a chance to shine! Utilizing a combination of CDN libraries – PureCSS, Bootstrap, GoogleFonts – and our own CSS styles, we built a responsive webpage, displaying the content efficiently on mobile or desktop devices.
- And of course, a great website needs a clever name and great header image. Our main hero jumbotron image was sourced from Pexels, a royalty free photo website. And our app’s name – Picniq, with the Q for Quarantine – was a collaborative decision, based on our collective experiences and desires to safely socialize with our friends.

## Retrospective
### Challenges
One of our major initial challenges was our attempt to utilize the Yelp API. 
Yelp has a wealth of valuable data on restaurants, and we had hoped to display dynamic visual content beyond the basic restaurant address, delivery options, etc.
We first attempted to use Yelp via RapidAPI, a website that hosts free public and open rest APIs on behalf of major websites. This allowed us to access Yelp, but with very few available calls. Within a day, we had reached our 100 call limit, and could no longer successfully make AJAX calls.
Then we attempted to use Yelp directly. Although the documentation was not especially thorough, we managed to create viable queryURLs. Unfortunately, regardless of the caliber of our queries, due to Yelp’s API not supporting CORS (Cross Origin Response Sharing), there was no way for our Javascript code to directly request access to Yelp’s API endpoints.
Therefore, based on our current level of coding ability, the Yelp API was no longer accessible. As such, we needed to pivot to a new API containing similar data.
FourSquare stepped up to the plate and knocked it out of the park. Not only was the documentation more thorough, but it allowed significantly more AJAX calls, with the limit reset every day. The queryURLs were easy to assemble, and we were able to return a huge amount of data in the JSON response.
Even though FourSquare’s API offered us a path forward on our picnic project, we still encountered some minor frustrations. Some of the data we desired – noted as follows – was hidden behind higher tier access within the API:
Did the restaurant offer takeout?
Were their direct contact links to the restaurant website and/or phone number?
What hours was the restaurant and/or park open?
Were their photos of the restaurant and/or park available for context / reference?
An additional challenge we encountered was the functionality of the browser-based navigator.geolocation.getCurrentPosition function.
Even though this function is inherent to the browser – and theoretically should work every single time – we encountered occasional instances where it would timeout, trip an error, and not return the latitude and longitude.
Numerous SlackOverflow threads documenting this issue led us to the conclusion that the navigator.geolocation.getCurrentPosition function does occasionally fail to return, and is not a failure on our team’s part.

### Successes
Our team was fortunate to have resounding success across multiple facets of our project design.
The Picniq app is primarily based around utilizing a user’s current location and/or an input location. In the former, we sourced current location by using the browser-based navigator.geolocation.getCurrentPosition function. In the latter, we used the OpenCage Geocoder API. Both instances returned latitude and longitude, for use with our next API: FourSquare. From there, we parsed through the FourSquare data, determining key information that users require to successfully select a park and/or restaurant for their picnicking experience.
Beyond the backbone of strong data, the information displayed to the user was sleek and succinct. Our styles were built off a combination of thoughtfully applied CDNs and team generated CSS. Not only were the visuals vivacious, but the content was mobile responsive, ensuring that picnic-goers were able to utilize our app on-the-go.
All of our successes wouldn’t be possible without great teamwork and collaboration. We outlined our work, discussed our changes step-by-step, thoughtfully implemented new features and styles, and committed constantly to GitHub.
Our team is already thinking towards the future with Picniq.
There is so much more information available with the different tiers of the FourSquare API, and we anticipate leveraging that data for a more dynamic app.
And while the pandemic certainly inspired our socially distanced picnic app, we know that as the pandemic ends, Picniq will still be essential. We can inform users about events in their parks, or provide more thorough information and photos about local businesses and restaurants.
Regardless of how you picnic, use Picniq to make your gathering even better.

## API Reference
This application uses the FourSquare and OpenCage Geocoder APIs to render the results based on the user location:
[FourSquare](https://developer.foursquare.com/))
[OpenCage Geocoder](https://opencagedata.com/)

## Credits
The Picniq app was made possible with the help of FourSquare, OpenCage Geocoder, PureCSS, Bootstrap, and GoogleFonts. 

## License
[Open Source Initiative - MIT License](https://opensource.org/licenses/MIT)

Copyright 2020.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
