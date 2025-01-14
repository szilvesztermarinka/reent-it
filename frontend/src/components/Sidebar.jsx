import React, { useState } from "react";
import { IconHome, IconBuildingSkyscraper, IconBed, IconBuildingCommunity } from "@tabler/icons-react";

function Sidebar({ onFiltersChange }) {
    const [filters, setFilters] = useState({});

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
