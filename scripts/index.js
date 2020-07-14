const inputEls = document.querySelectorAll('select');
const clearBtn = document.getElementById('clear');
const searchBtn = document.getElementById('search');
const dataEl = document.querySelector('.data-container');
const tBodyEl = document.querySelector('.tbody');
const yearEl = document.getElementById('year');
const methodEl = document.getElementById('method');
const hostNameEl = document.getElementById('hostName');
const facilityEl = document.getElementById('facility');
const DEFAULT_OPTION_VALUE = 'EMPTY';

// https://github.com/florinpop17/app-ideas/blob/master/Projects/3-Advanced/NASA-Exoplanet-Query.md
// <br>
// https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html
// <br>

// on load
async function init() {
  let data = await initiateSearch({ isDefaultSearch: true });
  initLoad(data);
}

function initLoad(data) {
  let years = new Set();
  let facility = new Set();
  let discoveryMethod = new Set();
  let hostNames = new Set();
  let innerHtml = '';
  data.forEach((row, index) => {
    if (index > 0) {
      innerHtml += `<tr>
      
      <td class="data__col">${row[1]}</td>
      <td class="data__col">${row[2]}</td>
      <td class="data__col">${row[3]}</td>
      <td class="data__col">${row[0]}</td>
    </tr>
      `;
      years.add(row[1]);
      facility.add(row[3]);
      discoveryMethod.add(row[2]);
      hostNames.add(row[0]);
    }
  });
  tBodyEl.insertAdjacentHTML('beforeend', innerHtml);
  addOptionToElement(yearEl, years);
  addOptionToElement(facilityEl, facility);
  addOptionToElement(methodEl, discoveryMethod);
  addOptionToElement(hostNameEl, hostNames);
}

function addOptionToElement(element, optionArray) {
  optionArray.forEach((value) => {
    element.insertAdjacentHTML(
      'beforeend',
      `<option value="${value}">${value}</option>`
    );
  });
}

// Below functions are post init

function createURL() {
  let isClauseAdded = false;
  let URL =
    'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_disc,pl_discmethod,pl_facility';
  if (
    yearEl.value !== DEFAULT_OPTION_VALUE ||
    methodEl !== DEFAULT_OPTION_VALUE ||
    hostNameEl.value !== DEFAULT_OPTION_VALUE ||
    facilityEl.value !== DEFAULT_OPTION_VALUE
  ) {
    URL += '&where=';
    if (yearEl.value !== DEFAULT_OPTION_VALUE) {
      URL += `pl_disc=${yearEl.value}`;
      isClauseAdded = true;
    }
    if (methodEl.value !== DEFAULT_OPTION_VALUE) {
      URL += `${isClauseAdded ? ` and ` : ``}pl_discmethod='${methodEl.value}'`;
      isClauseAdded = true;
    }
    if (hostNameEl.value !== DEFAULT_OPTION_VALUE) {
      URL += `${isClauseAdded ? ` and ` : ``}pl_hostname='${hostNameEl.value}'`;
      isClauseAdded = true;
    }
    if (facilityEl.value !== DEFAULT_OPTION_VALUE) {
      URL += `${isClauseAdded ? ` and ` : ``}pl_facility='${facilityEl.value}'`;
      isClauseAdded = true;
    }
  }
  console.log(URL);
  return URL;
}

async function initiateSearch({ isDefaultSearch }) {
  let URL;
  console.log(isDefaultSearch);
  if (isDefaultSearch) {
    //
    URL =
      'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_disc,pl_discmethod,pl_facility&order=dec';
  } else {
    URL = createURL();
  }
  const res = await fetch(URL);
  let dataTxt = await res.text();
  dataTxtRow = dataTxt.split('\n');
  dataTxtRow.pop();
  return dataTxtRow.map((el) => el.split(','));
}

function validate() {
  return !!Array.from(inputEls).find(
    (el) => el.value.trim() !== DEFAULT_OPTION_VALUE
  );
}

function updateTable(data) {
  let innerHtml = '';
  data.forEach((row, index) => {
    if (index > 0) {
      innerHtml += `<tr>
      
      <td class="data__col">${row[1]}</td>
      <td class="data__col">${row[2]}</td>
      <td class="data__col">${row[3]}</td>
      <td class="data__col">${row[0]}</td>
    </tr>
      `;
    }
  });

  tBodyEl.innerHTML = innerHtml;
}

async function validateAndSearch() {
  if (validate()) {
    let data = await initiateSearch({ isDefaultSearch: false });

    updateTable(data);
  }
}

//event listeners

clearBtn.addEventListener('click', () => {
  inputEls.forEach((el) => (el.value = ''));
});
searchBtn.addEventListener('click', validateAndSearch);
initiateSearch();
init();
