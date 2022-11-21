import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountry';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input',debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    event.preventDefault();
    const countryToSearch = event.target.value.trim();
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    if (!countryToSearch) {
        return;
    }
    fetchCountries(countryToSearch)
        .then(countries => {
         if (countries.length > 10) {
                 Notify.info('Too many matches found. Please enter a more specific name.');
            }
            
            else if (countries.length === 1) {
        createContryList(countries);
            }
            else {
                createCountrtiesList(countries);
            }
            // createCountrtiesList(countries);
            
        })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
    

};

 
function createContryList(country) {
    const markup = country.map(({ flags, name, capital, population, languages }) => {
       return `<img width="60px" height="50px" src='${flags.svg}' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${
              name.official
            }</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            )}</p></li>
        </ul>`;
    })  
    .join('');
  refs.countryInfo.innerHTML = markup;
}


function createCountrtiesList(countries) {
    const markup = countries
    .map(({ flags, name }) => {
      return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" width = 60px height = 50px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
    })
    .join('');

  refs.countryInfo.innerHTML = markup;
};

