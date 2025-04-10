'use stricts';

/* eslint no-undef: 0 */
// --> OFF

/* eslint no-unused-vars: 0 */
// --> OFF

function doAutocomplete() {
  // allCountries defined in about.ejs(html)
  const autocompleteInput = document.getElementById('country');
  const autocomplete = new Awesomplete(autocompleteInput, {
    list: allCountries,
    minChars: 1,
    autoFirst: true,
  });
}

document.addEventListener('DOMContentLoaded', doAutocomplete);
