// Core NodeJS Modules
const path = require('path');

// NPM Packages
const express = require('express');
const hbs = require('hbs');

// Project Files
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for express config
const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectory));

app.get('', (req, res) => {
  res.render('index', {
    pageTitle: 'Homepage',
    title: 'Weather',
    name: 'Dakouri Kobri',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About',
    title: 'About',
    imageUrl: 'img/Tara.jpg',
    alt: "Tara Gueye - Miss Côte d'Ivoire",
    name: 'Dakouri Kobri',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    pageTitle: 'Help',
    title: 'Help!',
    helpText:
      'On this page, you will find all the FAQ and their related answers. If you have any extra question, please, feel free to contact us!',
    name: 'Dakouri Kobri',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'Please, provide an address!' });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error !== undefined || forecastData === undefined) {
          return res.send({ error });
        }

        res.send({
          location,
          forecast: forecastData,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'Please, provide a search term!',
    });
  }

  console.log('Query:', req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404-error', {
    title: '404 Error',
    errorMessage: 'Help Article Not Found',
  });
});

app.get('*', (req, res) => {
  res.render('404-error', {
    title: '404 Error',
    errorMessage: 'Page Not Found',
  });
});

const PORT = 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}!`));
