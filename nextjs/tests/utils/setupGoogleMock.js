import { GEOCODE_RESULT } from './googlePayloads';

/**
 * Copied from: https://github.com/hibiken/react-places-autocomplete/blob/dbb297486d21740dd1f15ec35fb3b45f7eebcb61/src/tests/helpers/setup.js#L40
 */

class GeocoderMock {
  geocode({ address, placeId }, callback) {
    if (address) {
      this._geocodeAddress(address, callback);
    } else if (placeId) {
      this._geocodePlaceID(placeId, callback);
    } else {
      callback({}, 'ZERO_RESULTS');
    }
  }

  _geocodeAddress(address, callback) {
    if (address.startsWith('San Francisco')) {
      callback(GEOCODE_RESULT['San Francisco'], 'OK');
    } else {
      callback([], 'ZERO_RESULTS');
    }
  }

  _geocodePlaceID(placeId, callback) {
    if (placeId === 'ChIJIQBpAG2ahYAR_6128GcTUEo') {
      callback(GEOCODE_RESULT['San Francisco'], 'OK');
    } else {
      callback([], 'ZERO_RESULTS');
    }
  }
}

class AutocompleteServiceMock {
  getPlacePredictions(_filters, callback) {
    callback([], 'OK');
  }
}

export const setupGoogleMock = () => {
  /*** Mock Google Maps JavaScript API ***/
  const google = {
    maps: {
      places: {
        AutocompleteService: AutocompleteServiceMock,
        PlacesServiceStatus: {
          INVALID_REQUEST: 'INVALID_REQUEST',
          NOT_FOUND: 'NOT_FOUND',
          OK: 'OK',
          OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
          REQUEST_DENIED: 'REQUEST_DENIED',
          UNKNOWN_ERROR: 'UNKNOWN_ERROR',
          ZERO_RESULTS: 'ZERO_RESULTS',
        },
      },
      Geocoder: GeocoderMock,
      GeocoderStatus: {
        ERROR: 'ERROR',
        INVALID_REQUEST: 'INVALID_REQUEST',
        OK: 'OK',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        ZERO_RESULTS: 'ZERO_RESULTS',
      },
    },
  };
  global.window.google = google;
};
