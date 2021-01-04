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

// let map, mapEvent;  -Dont need after we set everything into classes

class App {
  #map;
  #mapEvent;

  // this method is called immediatly when new instance is created
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
  } // ------ end constructor ------

  _getPosition() {
    // the iff is to check against older browersers
    if (navigator.geolocation) {
      // this is a browser API
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        //   ^since the function calls the _loadMap function, we need to set the 'this'--
        // -- keyword or it will be undefined when we call it. becuase the function calls it
        function () {
          alert('Could not get current position. ');
        }
      );
    }
  } // ------ end _getPosition ------

  _loadMap(position) {
    //   const latitude = position.coords.latitude
    const { latitude } = position.coords;
    //   ^destructoring creates a variable out of the object
    const { longitude } = position.coords;
    //   console.log(`https://www.google.com/maps/@${latitude},${longitude},`);
    const coords = [latitude, longitude];

    //   below code was copied from leaflet site, then values changed for what i needed
    this.#map = L.map('map').setView(coords, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //   this is the 'event listner' that we use on the map
    this.#map.on('click', this._showForm.bind(this));
  } // ------ end _loadMap ------

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
    // console.log(mapEvent);
  } // ------ end _showForm ------

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    // diplay marker

    // clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';

    //   adding marker
    const { lat, lng } = this.#mapEvent.latlng;

    // this is from leaflet documentation
    L.marker([lat, lng])
      .addTo(this.#map)
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
  } // ------ end _newWorkout ------
} // ------ end class App ------

const app = new App();
