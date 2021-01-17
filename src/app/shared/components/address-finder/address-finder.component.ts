
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Address } from '../../models/interface';
declare var google: any;

@Component({
  selector: 'dps-address-finder',
  templateUrl: './address-finder.component.html',
  styleUrls: ['./address-finder.component.scss']
})
export class AddressFinderComponent implements OnInit {

  constructor(private mapsAPILoader: MapsAPILoader) { }
  @Output() changeAddress = new EventEmitter<Address>();
  @Input() addressFindId = 'address_Find';
  autocomplete;
  newAddress: Address = {
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

  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    postal_town: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  ngOnInit() {
    // this.addressInput =  as HTMLInputElement;
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById(this.addressFindId)),
        { types: ['geocode'], componentRestrictions: { country: 'uk' } });

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();

        this.newAddress.address1 = '';
        this.newAddress.address2 = '';
        this.newAddress.town = '';
        this.newAddress.country = '';
        this.newAddress.postCode = '';

        for (let i = 0; i < place.address_components.length; i++) {
          const addressType = place.address_components[i].types[0];
          if (this.componentForm[addressType]) {
            const val = place.address_components[i][this.componentForm[addressType]];
            switch (addressType) {
              case 'street_number': {
                this.newAddress.address1 = val;
                break;
              }
              case 'route': {
                this.newAddress.address1 = this.newAddress.address1 + ', ' + val;
                break;
              }
              case 'postal_town': {
                this.newAddress.town = val;
                break;
              }
              case 'locality': {
                if (!this.newAddress.town) {
                  this.newAddress.town = val;
                }
                break;
              }
              case 'country': {
                this.newAddress.country = val;
                break;
              }
              case 'postal_code': {
                this.newAddress.postCode = val;
                break;
              }
            }

          }
        }
        this.changeAddress.emit(this.newAddress);
      });

    });
  }

  onInputKeyDown(event: KeyboardEvent) {
    const inp = String.fromCharCode(event.keyCode);
    if (event.code === 'Space') { // ignow spece key form perent component
      event.preventDefault();
      event.stopPropagation();
      const input = document.getElementById(this.addressFindId) as HTMLInputElement;
      input.value += event.key;
    }

  }

}
