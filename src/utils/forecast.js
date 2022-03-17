const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=157e10ba335356754afa5e4bc4ce4888&query=${latitude}, ${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to the weather service!', undefined);
    } else if (body.error) {
      callback(body.error.info, undefined);
    } else {
      callback(
        undefined,
        `The weather is currently ${body.current.weather_descriptions[0].toLowerCase()}. It is ${
          body.current.temperature
        }\u00B0C.`
      );
    }
  });
};

module.exports = forecast;
