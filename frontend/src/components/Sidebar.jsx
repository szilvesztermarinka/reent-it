import React, { useState, useEffect } from "react";

function Sidebar({ onFiltersChange }) {
  const [filters, setFilters] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newFilters = { ...filters };
    if (!value) {
      delete newFilters[name];
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="w-1/3 bg-white">
      <h1>Ingatlan Szűrő</h1>
      <div>
        <label>
          Típus:
          <select name="type" onChange={handleInputChange}>
            <option value="">Mind</option>
            <option value="flat">Társasház</option>
            <option value="house">Családi ház</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Minimum ár:
          <input type="number" name="price_gte" onChange={handleInputChange} />
        </label>
      </div>
      <div>
        <label>
          Maximum ár:
          <input type="number" name="price_lte" onChange={handleInputChange} />
        </label>
      </div>
      <div>
        <label>
          Keresés:
          <input
            type="text"
            name="title_contains"
            onChange={handleInputChange}
          />
        </label>
      </div>
    </div>
  );
}

export default Sidebar;
