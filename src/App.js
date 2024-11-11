import { useEffect, useState } from "react";

function App() {
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const[city,setCity]=useState([]);
  const [locationMessage, setLocationMessage] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const API_ENDPOINT = 'https://crio-location-selector.onrender.com/countries';

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        setError("Data is not fetched");
        return;
      }
      const result = await response.json();
      setCountries(result);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async (countryName) => {
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/states`);
      if (!response.ok) {
        setError("Data is not fetched");
        return;
      }
      const result = await response.json();
      setStates(result);
    } catch (error) {
      setError(error.message);
    }
  };
  const fetchCity = async (countryName,stateName) => {
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/state=${encodeURIComponent(stateName)}/cities`);
      if (!response.ok) {
        setError("Data is not fetched");
        return;
      }
      const result = await response.json();
      setCity(result);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Update selected country and fetch states
  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedState('');
    setStates([]);
    setCity([]);
    setLocationMessage('');
    fetchStates(countryName);
  };
  const handleStateChange = (e) => {
    const stateName = e.target.value;
    // setSelectedCountry(countryName);
    setSelectedState(stateName);
    setCity([]);
    setLocationMessage('');
    fetchCity(selectedCountry,stateName);
  };
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setLocationMessage(`You selected ${cityName}, ${selectedState}, ${selectedCountry}`);
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Select Location</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <select name="country" id="country" onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        
        <select name="state" id="state" onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select name="city" id="city" disabled={!selectedCountry || !selectedState} onChange={handleCityChange}>
          <option value="">Select City</option>
          {city.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {locationMessage && <div style={{display:'flex', justifyContent:'center', padding:'20px' }}>{locationMessage}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
}

export default App;
