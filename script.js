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

class WorkOut {
  date = new Date();
  // not the usaul way to make an id bit will work for this
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // array [lat, lng]
    this.distance = distance; // miles
    this.duration = duration; // minutes
  }
} // -------- end WorkOut --------

class Running extends WorkOut {
  type = 'running';

  constructor(coords, distance, duration, stepMin) {
    super(coords, distance, duration);
    this.stepMin = stepMin;
    this.calPace();
  }

  calPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
} // -------- end Running --------

class Cycling extends WorkOut {
  type = 'cycling';

  constructor(coords, distance, duration, elavationGain) {
    super(coords, distance, duration);
    this.elavationGain = elavationGain;
    this.calSpeed();
  }

  calSpeed() {
    this.speed = this.distance / (this.duration * 60);
    //  ^ * 60 to get hours out of minutes
    return this.speed;
  }
} // -------- end Cycling --------

// const run1 = new Running([49, 42], 3, 52, 55);
// const bike1 = new Cycling([48, 42], 12, 18, 30);

// console.log(run1);
// console.log(bike1);

class App {
  #map;
  #mapEvent;
  #workOuts = [];

  // this method is called immediatly when new instance is created--
  // --use that to call functions we need at app start up
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

    // helper functions
    const validInputs = (...inputs) => inputs.every(i => Number.isFinite(i));
    // ^loops over the inputs as an array, returns true only if true for all values
    const allPositive = (...inputs) => inputs.every(i => i > 0);

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    // ^ the + is a shorthand converstion to a number
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workOut;

    // determine which workout object to make
    if (type === 'running') {
      const stepMin = +inputCadence.value;

      // check if data is valid. guard clause
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(stepMin)
        !validInputs(distance, duration, stepMin) ||
        !allPositive(distance, duration, stepMin)
      ) {
        alert('Must enter positive numbers only.');
      } // -------- end Guard Clause --------

      workOut = new Running([lat, lng], distance, duration, stepMin);
    } // -------- end type running --------

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // check if data is valid. guard clause
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(elevation)
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        alert('Must enter positive numbers only.');
      } // -------- end Guard Clause

      workOut = new Cycling([lat, lng], distance, duration, elevation);
    } // -------- end type cycling --------

    this.#workOuts = workOut;
    // console.log(workOut);

    // work out marker
    this.makeWorkOutMarker(workOut);

    // clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
  } // ------ end _newWorkout ------

  makeWorkOutMarker(workout) {
    // this is from leaflet documentation
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('workout')
      .openPopup();
  }
} // ------ end class App ------

const app = new App();
