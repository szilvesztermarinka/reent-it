import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IconBell, IconDeviceLaptop, IconFaceId, IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const SettingsModal = ({ onClose }) => {
    const [selectedTab, setSelectedTab] = useState("Profile");
    const { user } = useAuth();
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    const tabs = [
        { name: "Profile", icon: <IconFaceId size={30} className="text-gray-500" /> },
        { name: "Account", icon: <IconSettings size={30} className="text-gray-500" /> },
        { name: "Appearance", icon: <IconDeviceLaptop size={30} className="text-gray-500" /> },
        { name: "Notification", icon: <IconBell size={30} className="text-gray-500" /> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl h-3/4 flex relative overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 border-r p-4">
                    <h2 className="font-bold mb-4">Settings</h2>
                    <ul>
                        {tabs.map((tab) => (
                            <li
                                key={tab.name}
                                className={`cursor-pointer p-4 rounded flex flex-col items-center justify-center ${selectedTab === tab.name ? "bg-gray-200" : ""}`}
                                onClick={() => setSelectedTab(tab.name)}
                            >
                                {tab.icon}
                                {/* Az alábbi sor fogja eltüntetni a szöveget mobil nézetben */}
                                <span className="hidden md:inline mt-2">{tab.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="w-3/4 p-6 overflow-y-auto">
                    {selectedTab === "Profile" && (
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="block text-gray-500">Profile Picture</label>
                                <div className="flex flex-row items-center gap-4">
                                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border mr-4" />
                                    <div>
                                        <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2 sm:text-sm sm:px-3 sm:py-2">Change Picture</button>
                                        <button className="bg-red-500 text-white text-xs px-2 py-1 rounded sm:text-sm sm:px-3 sm:py-2">Delete Picture</button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500 mb-2">Profile Name</label>
                                <input className="w-full border p-2 rounded" type="text" defaultValue={`${user.firstname} ${user.lastname}`} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500 mb-2">About Me</label>
                                <textarea className="w-full border p-2 rounded" placeholder="Mesélj magadról..."></textarea>
                            </div>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded">Save Changes</button>
                        </div>
                    )}
                    {selectedTab === "Appearance" && (
                        <div>
                            <label className="block text-gray-500 mb-2">Language</label>
                            <select className="w-full border p-2 rounded" value={localStorage.getItem("language")} onChange={(e) => handleLanguageChange(e.target.value)}>
                                <option value="en">English</option>
                                <option value="hu">Magyar</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Close button */}
                <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
