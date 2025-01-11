import React, { useState, useEffect } from "react";
import { IconHome,IconBuildingSkyscraper,IconBed,IconBuildingCommunity} from '@tabler/icons-react';



function Sidebar({ onFiltersChange }) {
  const [filters, setFilters] = useState({});

  const handleButtonClick = (name, value) => {
    const newFilters = { ...filters };

    // Ensure one filter is always selected
    if (newFilters[name] !== value) {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

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
    <div className="w-1/5 bg-white">
   
      <div className="px-16 py-6 pr-6 ">
        
      
      <p className="font-bold text-base py-4">Ingatlan típus</p>
       
            
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 justify-items-center ">
            <div className="w-full">
          <button
            className={`flex flex-col items-center px-4 py-6 rounded-lg w-full ${filters.type === "" ? "bg-main-lila text-white" : "bg-gray-200"}`}
            onClick={() => handleButtonClick("type", "")}
          >
            <IconBuildingCommunity />
            Mind
          </button>
          </div>

          <div className="w-full">
          <button
            className={`flex flex-col items-center px-4 py-6 rounded-lg w-full ${filters.type === "flat" ? "bg-main-lila text-white" : "bg-gray-200"}`}
            onClick={() => handleButtonClick("type", "flat")}
          >
            <IconBuildingSkyscraper/>
            Lakás
          </button>
          </div>
          <div className="w-full">
          <button
            className={`flex flex-col items-center px-4 py-6 rounded-lg w-full ${filters.type === "house" ? "bg-main-lila text-white" : "bg-gray-200"}`}
            onClick={() => handleButtonClick("type", "house")}
          ><IconHome />
            Ház
          </button>
          </div>
          <div className="w-full">
          <button
            className={`flex flex-col items-center px-4 py-6 rounded-lg w-full ${filters.type === "room" ? "bg-main-lila text-white" : "bg-gray-200"}`}
            onClick={() => handleButtonClick("type", "room")}
          >
              <IconBed/>
            Szoba
          </button>
          </div>
          

          {/* <select name="type" onChange={handleInputChange}>
            <option value="">Mind</option>
            <option value="flat">Társasház</option>
            <option value="house">Családi ház</option>
          </select> */}
        </div>
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
