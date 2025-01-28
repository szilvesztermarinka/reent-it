import React, { useState } from "react";
import { IconHome, IconBuildingSkyscraper, IconBed, IconBuildingCommunity } from "@tabler/icons-react";

function Sidebar({ onFiltersChange }) {
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([]);

    const handleButtonClick = (name, value) => {
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: prevFilters[name] === value ? undefined : value };
            onFiltersChange(updatedFilters);
            return updatedFilters;
        });
    };

    const handleInputChange = ({ target: { name, value } }) => {
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value || undefined };
            onFiltersChange(updatedFilters);
            return updatedFilters;
        });
    };

    const handleSearchChange = async (event) => {
        const query = event.target.value.trim();
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=hu&accept-language=hu&addressdetails=1&namedetails=1`, {
                    headers: {
                        "User-Agent": "YourAppName/1.0 (your@email.com)",
                    },
                });
                const data = await response.json();

                const filteredResults = data
                    .map((item) => {
                        const displayName = item.display_name || "";
                        const address = item.address || {};

                        // 1. Városnév kinyerése
                        const city = address.city || address.town || address.municipality || address.village || address.county || "";

                        // 2. Kerület azonosítása a display_name-ből
                        const districtMatch = displayName.match(/(\b[IXV]+\b)\s*\.?\s*kerület/i);
                        const districtNumber = districtMatch ? districtMatch[1] : null;

                        // 3. Főváros speciális kezelése
                        const isBudapest = city.toLowerCase().includes("budapest");

                        // 4. Csak akkor adjuk meg a kerületet, ha a városnév egyezik a keresési kifejezéssel
                        if (districtNumber && isBudapest && query.toLowerCase().startsWith("budapest")) {
                            return {
                                id: item.place_id,
                                title: `Budapest ${districtNumber}. kerület`,
                                type: "Kerület",
                                original: item,
                            };
                        }

                        // 5. Egyéb városok kezelése
                        if (city && !isBudapest && displayName.toLowerCase().startsWith(query.toLowerCase())) {
                            return {
                                id: item.place_id,
                                title: city,
                                type: "Város",
                                original: item,
                            };
                        }

                        return null;
                    })
                    .filter((result) => result !== null)
                    .filter((result, index, self) => index === self.findIndex((r) => r.title === result.title));

                setAutocompleteResults(filteredResults);
            } catch (error) {
                console.error("Error fetching autocomplete results:", error);
            }
        } else {
            setAutocompleteResults([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.title);
        setAutocompleteResults([]);
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, location: suggestion.title };
            onFiltersChange(updatedFilters);
            return updatedFilters;
        });
    };

    const buttonClasses = (type) => `flex flex-col items-center p-2.5 gap-2.5 rounded-lg w-full text-xs font-medium ${filters.type === type ? "bg-main-lila text-white" : "bg-gray-100 text-main-lila"}`;

    return (
        <div className="bg-white">
            <div className="pl-16 pr-6">
                <div>
                    <p className="font-bold text-base py-4">Ingatlan típus</p>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-4 justify-items-center">
                        {[
                            { label: "Összes", icon: <IconBuildingCommunity />, value: "" },
                            { label: "Lakás", icon: <IconBuildingSkyscraper />, value: "flat" },
                            { label: "Ház", icon: <IconHome />, value: "house" },
                            { label: "Szoba", icon: <IconBed />, value: "room" },
                        ].map(({ label, icon, value }) => (
                            <div className="w-full" key={value}>
                                <button className={buttonClasses(value)} onClick={() => handleButtonClick("type", value)}>
                                    {icon}
                                    {label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">Hol keresel?</p>
                    <input type="text" name="location" value={searchQuery} onChange={handleSearchChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Keresés városra vagy címre" />
                    {autocompleteResults.length > 0 && (
                        <ul className="mt-2 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {autocompleteResults.map((result) => (
                                <li key={result.id} onClick={() => handleSelectSuggestion(result)} className="p-2 cursor-pointer hover:bg-gray-200">
                                    {result.title} - {result.type}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    {[
                        { label: "Minimum ár:", name: "price_gte", type: "number" },
                        { label: "Maximum ár:", name: "price_lte", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div className="mb-4" key={name}>
                            <label className="block font-medium text-sm">
                                {label}
                                <input type={type} name={name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
