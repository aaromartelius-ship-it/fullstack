import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    if (!capital || !apiKey) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Failed to fetch weather', error)
      })
  }, [capital, apiKey])

  if (!weather) {
    return <p>Loading weather data...</p>
  }

  const iconCode = weather.weather[0]?.icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      {iconCode && <img src={iconUrl} alt={weather.weather[0]?.description} />}
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const languages = country.languages ? Object.values(country.languages) : []
  const capital = country.capital ? country.capital[0] : null

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png || country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="160"
      />

      {capital && <Weather capital={capital} />}
    </div>
  )
}

const CountryList = ({ countries, handleShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => handleShowCountry(country.name.common)}>
              show
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  }

  return <p>No matches found</p>
}

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleShowCountry = (countryName) => {
    setQuery(countryName)
  }

  const filteredCountries = query.trim() === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      {query.trim() !== '' && (
        <CountryList
          countries={filteredCountries}
          handleShowCountry={handleShowCountry}
        />
      )}
    </div>
  )
}

export default App