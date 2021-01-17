import { Directive, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Address } from '../models/interface';
declare var google: any;

@Directive({
  selector: '[dpsAddressFinder]'
})

export class AddressFinderDirective implements OnInit {

  constructor(private mapsAPILoader: MapsAPILoader) { }
  @Input() id: string;
  @Input() country: string;
  @Output() changeAddress = new EventEmitter<Address>();

  autocomplete;

  componentForm = {
    floor: 'short_name',
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    postal_town: 'long_name',
    country: 'long_name',
    postal_code: 'short_name',
    administrative_area_level_1: 'long_name',
    administrative_area_level_2: 'long_name'
  };

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById(this.id)),
        // { types: ['geocode'], componentRestrictions: { country: 'uk' } });
        { componentRestrictions: { country: this.country } }
      );

      this.autocomplete.addListener('place_changed', () => {

        const place = this.autocomplete.getPlace();
        const newAddress: Address = {
          id: '',
          url: '',
          name: '',
          floor: '',
          address1: '',
          address2: '',
          town: '',
          state: '',
          country: '',
          postCode: '',
          coordinates: null,
          phoneNumber: ''
        };

        newAddress.name = place.name || null;
        newAddress.id = place.place_id;
        newAddress.url = place.url;
        newAddress.phoneNumber = place.international_phone_number;

        if (place.geometry && place.geometry.location) {
          newAddress.coordinates = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          };
        }

        for (let i = 0; i < place.address_components.length; i++) {
          const addressType = place.address_components[i].types[0];
          if (this.componentForm[addressType]) {
            const val = place.address_components[i][this.componentForm[addressType]];
            switch (addressType) {
              case 'floor': {
                newAddress.floor = val;
                break;
              }
              case 'street_number': {
                newAddress.address1 = val;
                break;
              }
              case 'route': {
                newAddress.address1 = !!newAddress.address1 ? `${newAddress.address1}, ${val}` : val;
                break;
              }
              case 'postal_town': {
                newAddress.town = val;
                break;
              }
              case 'locality': {
                if (!newAddress.town) {
                  newAddress.town = val;
                }
                break;
              }
              case 'administrative_area_level_1': {
                newAddress.state = val;
                break;
              }
              case 'country': {
                newAddress.country = val;
                break;
              }
              case 'postal_code': {
                newAddress.postCode = val;
                break;
              }
            }

          }
        }

        ///////////////////////////

        const displaySuggestions = function(predictions, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
          }

          predictions.forEach(function(prediction) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(prediction.formatted_address));
            document.getElementById('results').innerHTML = '';
            document.getElementById('results').appendChild(li);
          });
        };

        this.changeAddress.emit(newAddress);

        // const service = new google.maps.places.AutocompleteService();
        // service.getQueryPredictions({ input: newAddress.postCode }, displaySuggestions);

        // const geocoder = new google.maps.Geocoder;

        // if (place.geometry.viewport) {
        //   const latlng = { lat: parseFloat(place.geometry.viewport.f.f + 10000000000), lng: parseFloat(place.geometry.viewport.b.f) };
        //   const loctionAddress = geocoder.geocode({ 'location': latlng }, displaySuggestions);
        // }

        // const pyrmont = new google.maps.LatLng('51.6494557,-0.05768080000000001');

        // const map = new google.maps.Map(document.getElementById(this.elementId), {
        //   center: pyrmont,
        //   zoom: 15
        // });

        // const request = {
        //   location: pyrmont,
        //   radius: '500',
        //   types: ['establishment']
        // };

        // const nearbysearch = new google.maps.places.PlacesService(map);
        // nearbysearch.nearbySearch(request, callback);

        // function callback(results, status) {
        //   if (status === google.maps.places.PlacesServiceStatus.OK) {
        //     for (let i = 0; i < results.length; i++) {
        //       const place1 = results[i];
        //       // createMarker(results[i]);
        //     }
        //   }
        // }

        // const xhr = new XMLHttpRequest();
        // xhr.open('GET', 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.6494557,
        // -0.05768080000000001&rankby=distance&type=establishment&key=AIzaSyAnapZ0A9uXJlcDd1mXnesn2-lxpTWH1zI', true);
        // xhr.send();

        // xhr.onreadystatechange = processRequest;

        // function processRequest(e) {

        // }


        // this.service.GetCompanyAddress().subscribe(responce => console.log(responce));


        ////////////

      });

    });
  }

}
