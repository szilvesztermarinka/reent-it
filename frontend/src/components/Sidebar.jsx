import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IconHome, IconBuildingSkyscraper, IconBed, IconBuildingCommunity, IconMapPin, IconChevronDown,} from "@tabler/icons-react";
import { useTranslation } from "react-i18next"; // useTranslation importálása


function Sidebar({ onFiltersChange, sidebarOpen,}) {
    const { t } = useTranslation(); // useTranslation hook
    const [searchParams, setSearchParams] = useSearchParams(); // URL paraméterek kezelése
    const locationQuery = searchParams.get("city") || "";

    // Szűrők frissítése URL paraméterekben
    const updateParam = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    const handleButtonClick = (name, value) => {
        updateParam(name, searchParams.get(name) === value ? "" : value);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        updateParam("listtype", checked ? name : "");
    };

    const handleLocationChange = (e) => {
        updateParam("city", e.target.value);
    };

    // Szűrőváltozások továbbítása
    useEffect(() => {
        onFiltersChange(searchParams);
    }, [searchParams, onFiltersChange]);

    const buttonClasses = (type) => {
        const propertyType = searchParams.get("propertyType");
        const isAllSelected = !propertyType; // Ha nincs propertyType beállítva, akkor az "all" van kijelölve
        const isActive = propertyType === type || (type === "" && isAllSelected);
        return `flex flex-col items-center p-2.5 gap-2.5 rounded w-full text-xs font-medium ${isActive ? "bg-main-green-400 text-white" : "bg-gray-100 text-main-green-400"}`;
    };

    //flex flex-col gap-6 pl-16 pr-6 max-w-80 mt-4
    return (
        <div className={`fixed md:relative z-20 h-full bg-white transition-all duration-300 ease-in-out border-r
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-64'}
            flex flex-col gap-6 pl-16 pr-6 max-w-80 mt-1`}>
           
            <div className={`${!sidebarOpen ? 'hidden md:block' : ''}`}>
                <div>
                    <p className="font-bold text-base py-4">{t("property_type")}</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 justify-items-center">
                        {[
                            { label: t("all"), icon: <IconBuildingCommunity />, value: "" },
                            { label: t("flat"), icon: <IconBuildingSkyscraper />, value: "Apartment" },
                            { label: t("house"), icon: <IconHome />, value: "House" },
                            { label: t("room"), icon: <IconBed />, value: "Room" },
                        ].map(({ label, icon, value }) => (
                            <div className="w-full" key={value}>
                                <button className={buttonClasses(value)} onClick={() => handleButtonClick("propertyType", value)}>
                                    {icon}
                                    {label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>




                <div>
                    <p className="font-bold text-base py-4">{t("search_location")}</p> {/* Nyelvi kulcs */}
                    <div className="flex flex-row items-center justify-between bg-gray-100 rounded px-3 py-2.5 gap-2.5 text-base">
                        <IconMapPin size={24} />
                        <input type="text" placeholder={t("search_placeholder")} value={locationQuery} onChange={handleLocationChange} className="bg-transparent outline-none w-full focus:text-black" />
                        <IconChevronDown size={24} />
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">{t("listing_type")}</p> {/* Nyelvi kulcs */}
                    <div className="flex flex-col gap-2">
                        {[
                            { label: t("rent"), value: "Rent" },
                            { label: t("sale"), value: "Sale" },
                        ].map(({ label, value }) => (
                            <label key={value} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name={value} checked={searchParams.get("listtype") === value} onChange={handleCheckboxChange} className="rounded text-main-green-400 focus:ring-main-green-400" />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-bold text-base py-4">{t("price_range")}</p> {/* Nyelvi kulcs */}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
