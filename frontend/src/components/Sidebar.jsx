import React, { useState, useEffect } from "react";
import { IconHome, IconBuildingSkyscraper, IconBed, IconBuildingCommunity, IconMapPin, IconChevronDown } from "@tabler/icons-react";
import MultiRangeSlider from "./rangeslider/multirangeslider";

function Sidebar({ onFiltersChange }) {
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const handleButtonClick = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: prevFilters[name] === value ? "" : value,
        }));
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            listingType: checked ? name : "",
        }));
    };
    useEffect(() => {
        onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    const buttonClasses = (type) =>
        `flex flex-col items-center p-2.5 gap-2.5 rounded w-full text-xs font-medium ${filters.type === type ? "bg-main-lila text-white" : "bg-gray-100 text-main-lila"
        }`;

    return (
        <div className="bg-white">
            <div className="flex flex-col gap-6 pl-16 pr-6 max-w-80 mt-4">
                <div>
                    <p className="font-bold text-base py-4">Ingatlan típus</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 justify-items-center">
                        {[
                            { label: "Összes", icon: <IconBuildingCommunity />, value: "" },
                            { label: "Lakás", icon: <IconBuildingSkyscraper />, value: "flat" },
                            { label: "Ház", icon: <IconHome />, value: "house" },
                            { label: "Szoba", icon: <IconBed />, value: "room" },
                        ].map(({ label, icon, value }) => (
                            <div className="w-full" key={value}>
                                <button
                                    className={buttonClasses(value)}
                                    onClick={() => handleButtonClick("type", value)}
                                >
                                    {icon}
                                    {label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">Hol keresel?</p>
                    <div className="flex flex-row items-center justify-between bg-gray-100 rounded px-3 py-2.5 gap-2.5 text-base">
                        <IconMapPin size={24} />
                        <input type="text" placeholder="Keresés" value={searchQuery} className="bg-transparent outline-none w-full focus:text-black" />
                        <IconChevronDown size={24} />
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">Hirdetés típus</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "Kiadó", value: "kiado" },
                            { label: "Eladó", value: "elado" },
                        ].map(({ label, value }) => (
                            <label key={value} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name={value}
                                    checked={filters.listingType === value}
                                    onChange={handleCheckboxChange}
                                    className="rounded text-main-lila focus:ring-main-lila"
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">Ár intervallum</p>
                    <MultiRangeSlider
                        min={500}
                        max={6000}
                        step={100}
                        label={false}
                        ruler={false}
                        barInnerColor="#724EE9"
                        thumbLeftColor="#724EE9"
                        thumbRightColor="#724EE9"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
