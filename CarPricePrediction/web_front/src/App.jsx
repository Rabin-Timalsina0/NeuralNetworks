import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [accident, setAccident] = useState("");
  const [speed, setSpeed] = useState("");
  const [horsepower, setHorsepower] = useState("");
  const [engine, setEngine] = useState("");
  const [cylinder, setCylinder] = useState("");
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/brands");
        setBrands(response.data.brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    if (brands.length === 0) {
      fetchBrands();
    }
  }, []);

  const handleUpload = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        brand,
        year: Number(year),
        mileage: Number(mileage),
        fuel_type: fuel,
        transmission,
        accident: Number(accident),
        speed: Number(speed),
        horsepower: Number(horsepower),
        engine_size: Number(engine),
        cylinders: Number(cylinder),
      });
      setPrediction(response.data.price);
    } catch (error) {
      console.error("Error predicting price:", error);
    }
  };

  return (
    <div className="container">
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="">Select a car brand</option>
        {brands.map((brand_name, index) => (
          <option key={index} value={brand_name}>
            {brand_name}
          </option>
        ))}
      </select>

      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        {Array.from({ length: 50 }, (_, i) => 2025 - i).map((yearValue) => (
          <option key={yearValue} value={yearValue}>
            {yearValue}
          </option>
        ))}
      </select>

      <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
        <option value="">Select a Fuel-type</option>
        {["Diesel", "Gasoline", "Hybrid", "Plug-In Hybrid", "Electric"].map(
          (type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          )
        )}
      </select>

      <select
        value={transmission}
        onChange={(e) => setTransmission(e.target.value)}
      >
        <option value="">Select a Transmission</option>
        {["Automatic", "Manual"].map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select value={accident} onChange={(e) => setAccident(e.target.value)}>
        <option value="">Accidents</option>
        <option value={0}>No</option>
        <option value={1}>Yes</option>
      </select>

      <input
        type="number"
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        placeholder="Mileage"
      />

      <input
        type="number"
        value={speed}
        onChange={(e) => setSpeed(e.target.value)}
        placeholder="Speed"
      />
      <input
        type="number"
        value={horsepower}
        onChange={(e) => setHorsepower(e.target.value)}
        placeholder="Horsepower"
      />
      <input
        type="number"
        value={engine}
        onChange={(e) => setEngine(e.target.value)}
        placeholder="Engine Size"
      />
      <input
        type="number"
        value={cylinder}
        onChange={(e) => setCylinder(e.target.value)}
        placeholder="Cylinders"
      />

      <button onClick={handleUpload}>Predict</button>
      <h1>{prediction}</h1>
    </div>
  );
};

export default App;
