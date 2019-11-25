# Hotel Searching Tool

[Click here to view the website]( https://belli29.github.io/fe-interactive-development/)


## Tutorial

1. Select a country. Map will zoom in
2. Select a city (autocomplete object is already set to restrict to the country selected)
3. Maps will show all the results in the area and a table will be automatically generated below
4. Use the radio button to filter results by rating
5. Click on the result on the map or in the table to generate an information window with more details

### Purpose

The hotel searching tool allows to search for hotels based on Google Maps API. 

The user will be able to filter the results by "rating" and to see details of each result

### Functionality/Technologies

The project is based on Google Maps API which is called at the bottom of the Index file.

The API is used by the callback function initMap() in my [attachd Javascript file](https://github.com/belli29/fe-interactive-development/blob/master/assets/js/maps.js).

The main technology used is Javascript. I also used Jquery, when possible, in order to simplify the sintax of my code.


The website is fully responsive and thought to "look good" on different devices. 

In particular the following devices were tested:

* Pixel 2 / Pixel XL
* Galaxy S5
* Iphone (5/6/7/8 (plus), X)
* Ipad (Pro)
* Laptop with HiDPI screen
* Laptop with MDPI screen
* Apple Imac 21.5"

I have made use of Bootstrap 4 and this allowed me to achieve my result writing less code.


## Testing

Automatic testing has being carried out through Jasmine ([see file](https://github.com/belli29/fe-interactive-development/tree/master/assets/spec)).

Unfortunately I was not really able to carry out all the tests I wanted thorugh Jasmine. Most of the tests were carried out manually.

Down below a table with some of the tests:


## Acknowledgments

The base of this project was the [Google Maps API tutorials] (https://developers.google.com/maps/documentation/javascript/tutorial).
I also took inspiration from a similar [project](https://github.com/benhasselgren/ifd-milestone-project-pages).
I built up on this base to develop my project.


