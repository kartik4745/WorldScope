const countriesContainer = document.getElementById("countries");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region");
const sortSelect = document.getElementById("sort");
const loader = document.getElementById("loader");
const noResults = document.getElementById("noResults");
const themeToggle = document.getElementById("themeToggle");

let allCountries = [];


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => func(), delay);
  };
}


async function fetchCountries() {
  try {
    loader.style.display = "block";

    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags");
    const data = await res.json();

    allCountries = data;
    displayCountries(allCountries);
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = "none";
  }
}


function displayCountries(countries) {
  countriesContainer.innerHTML = "";

  if (countries.length === 0) {
    noResults.style.display = "block";
    return;
  } else {
    noResults.style.display = "none";
  }

  countries.forEach(country => {
    const div = document.createElement("div");
    div.className = "country";

    div.innerHTML = `
      <img src="${country.flags?.svg || ''}" />
      <h3>${country.name?.common}</h3>
      <p><b>Capital:</b> ${country.capital?.[0] || "N/A"}</p>
      <p><b>Population:</b> ${country.population.toLocaleString()}</p>
      <p><b>Region:</b> ${country.region}</p>
    `;

    countriesContainer.appendChild(div);
  });
}


function filterCountries() {
  let filtered = [...allCountries];

  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(c =>
      c.name.common.toLowerCase().includes(searchValue)
    );
  }

  if (regionFilter.value) {
    filtered = filtered.filter(c => c.region === regionFilter.value);
  }

  if (sortSelect.value === "asc") {
    filtered.sort((a, b) => a.population - b.population);
  } else if (sortSelect.value === "desc") {
    filtered.sort((a, b) => b.population - a.population);
  }

  displayCountries(filtered);
}


searchInput.addEventListener("input", debounce(filterCountries, 300));
regionFilter.addEventListener("change", filterCountries);
sortSelect.addEventListener("change", filterCountries);


fetchCountries();
