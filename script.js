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

let map, mapEvent;

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
      map = L.map('map').setView(coords, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //   this is the 'event listner' that we use on the map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
        // console.log(mapEvent);
      });
    },
    function () {
      alert('Could not get current position. ');
    }
  );
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // diplay marker

  // clear input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';

  //   adding marker
  const { lat, lng } = mapEvent.latlng;

  // this is from leaflet documentation
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('WorkOut Location')
    .openPopup();
});

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
