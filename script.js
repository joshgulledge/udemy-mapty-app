'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// the iff is to check against older browersers
if (navigator.geolocation) {
  // this is a browser API
  navigator.geolocation.getCurrentPosition(
    function (position) {
      //   const latitude = position.coords.latitude
      const { latitude } = position.coords;
      //   ^destructoring creates a variable out of the object
      const { longitude } = position.coords;
      //   console.log(`https://www.google.com/maps/@${latitude},${longitude},`);
      const coords = [latitude, longitude];

      //   below code was copied from leaflet site, then values changed for what i needed
      const map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
    },
    function () {
      alert('Could not get current position. ');
    }
  );
}
