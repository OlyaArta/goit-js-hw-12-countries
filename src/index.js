import './sass/main.scss';
import _ from 'lodash.debounce';
import API from './js/api';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { notice } from '@pnotify/core';
import countryCard from './templates/country-card.hbs'
import countryList from './templates/country-list.hbs'

const refs = {
    input: document.getElementById('input-id'),
    countriesList: document.getElementById('countries'),
};

refs.input.addEventListener('input', _(onSearch, 1000));

function onSearch(e) {
    const searchQuery = e.target.value;

    refs.countriesList.innerHTML = "";

    if (searchQuery.trim() === '') {
        return;
    }
    
    API.fetchCountry(searchQuery)
        .then((countries) => {
            if (countries.length > 10) {
                error({
                    title: `Too many matches found.`,
                    text: `We found ${countries.length} countries. Please enter a more specific query!`,
                    styling: 'brighttheme',
                    delay: 2000,
                  });
                  return;
            };
            if (countries.status === 404) {
                notice({
                    text: `Error: enter more correctly`,
                    styling: `brighttheme`,
                    delay: 2000,
                });
                return;
            };
            /*if  (!countries) {
                error({
                    title: `Error`,
                    styling: 'brighttheme',
                    delay: 2000,
                });
                return countries.json();
            };*/
            if  (countries.length >= 2 && countries.length <= 10) {
                const countriesHTML = countryList(countries);
                refs.countriesList.innerHTML = countriesHTML;
                return;
            };
            if (countries.length === 1) {
                const countryMarkup = countryCard(countries);
                refs.countriesList.innerHTML = countryMarkup;
                return;
            };
        })
       /* .then(resp => {
            if (!resp.ok) {
                throw Error(`is not ok: ` + resp.status);
            }
           return resp.json() 
        })*/
        .catch(console.error)
        .finally(() => (e.target.value = ''));
}