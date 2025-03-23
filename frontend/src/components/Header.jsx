import { IconBellFilled, IconBookmarkFilled, IconLogout, IconNotes, IconSettings, IconUpload, IconUser } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import SettingsModal from "./SettingsModal";

const Header = () => {
    const { i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng); // Nyelv mentése localStorage-ba
    };

    const toggleDropDown = () => {
        setDropDownMenu((prev) => !prev);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div className="bg-white w-full py-4 px-16 border-b z-50">
            <div className="flex justify-between items-center">
                <div>
                    <Link to="/">
                        <img src="/logo.png" alt="logo" className="w-10 aspect-square" />
                    </Link>
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/upload">
                        <IconUpload />
                    </Link>
                    <IconBellFilled />
                    <IconBookmarkFilled />
                    <motion.div className="w-10 h-10 cursor-pointer relative" whileHover={{ scale: 1.02 }} onClick={toggleDropDown}>
                        <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
                    </motion.div>
                    {dropDownMenu && (
                        <div className="min-w-96 py-4 px-4 absolute top-20 right-10 bg-white rounded-md z-50 shadow" ref={dropdownRef}>
                            <div className="w-full flex gap-2 cursor-pointer items-center hover:bg-gray-100 px-4 py-4 rounded">
                                <div className="w-10 h-10">
                                    <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-bold text-black">{user.firstname + " " + user.lastname}</h1>
                                    <p className="w-full text-xs overflow-hidden text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded">
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconUser stroke={2} className="text-gray-500" />
                                </div>
                                <p className="text-black">View Profile</p>
                            </div>

                            <div className="w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded" onClick={() => setIsSettingsOpen(true)}>
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconSettings stroke={2} className="text-gray-500" />
                                </div>
                                <p className="text-black">Settings</p>
                            </div>

                            <div className="w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded">
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconNotes stroke={2} className="text-gray-500" />
                                </div>
                                <p className="text-black">My advertisements</p>
                            </div>

                            <div className="group w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded" onClick={handleLogout}>
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconLogout stroke={2} className="text-gray-500 group-hover:text-black" />
                                </div>
                                <p className="text-black">Sign Out</p>
                            </div>
                            <div className="language-switcher">
                                <button onClick={() => handleLanguageChange("en")}>English</button>
                                <button onClick={() => handleLanguageChange("hu")}>Magyar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)}/>
            )}
        </div>
    );
};

export default Header;
