import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IconBell, IconDeviceLaptop, IconFaceId, IconSettings } from "@tabler/icons-react";

const SettingsModal = ({ onClose }) => {
    const [selectedTab, setSelectedTab] = useState("Profile");
    const { user } = useAuth();

    const tabs = [
        { name: "Profile", icon: <IconFaceId size={20} className="mr-2 text-gray-500" /> },
        { name: "Account", icon: <IconSettings size={20} className="mr-2 text-gray-500" /> },
        { name: "Appearance", icon: <IconDeviceLaptop size={20} className="mr-2 text-gray-500" /> },
        { name: "Notification", icon: <IconBell size={20} className="mr-2 text-gray-500" /> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl h-3/4 flex relative overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 border-r p-4">
                    <h2 className="font-bold mb-4">Settings</h2>
                    <ul>
                        {tabs.map((tab) => (
                            <li key={tab.name} className={`cursor-pointer p-2 rounded flex items-center ${selectedTab === tab.name ? "bg-gray-200" : ""}`} onClick={() => setSelectedTab(tab.name)}>
                                {tab.icon} {tab.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="w-3/4 p-6 overflow-y-auto">
                    {selectedTab === "Profile" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                    <label className="block text-gray-500">Profile Picture</label>
                                    <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border mr-4" />
                                    <div>
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Change Picture</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete Picture</button>
                                    </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500">Profile Name</label>
                                <input className="w-full border p-2 rounded" type="text" defaultValue={`${user.firstname} ${user.lastname}`} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500">Username</label>
                                <input className="w-full border p-2 rounded bg-gray-100" type="text" value="@kevinuhuy" readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500">Status</label>
                                <input className="w-full border p-2 rounded" type="text" defaultValue="On duty" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-500">About Me</label>
                                <textarea className="w-full border p-2 rounded" defaultValue="Discuss only on work hour, unless you wanna discuss about music 🎵"></textarea>
                            </div>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded">Save Changes</button>
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
