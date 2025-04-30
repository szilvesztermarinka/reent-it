import { IconBookmark, IconLogout, IconNotes, IconSettings, IconUpload, IconUser, } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link,} from "react-router";
import SettingsModal from "./SettingsModal";


const Header = () => {
    const { user, logout } = useAuth();
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);
  

    const toggleDropDown = () => {
        setDropDownMenu((prev) => !prev);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div className="bg-white w-full py-4 px-8 md:px-16 border-b z-50">
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
                    <motion.div className="w-10 h-10 cursor-pointer relative" whileHover={{ scale: 1.02 }} onClick={toggleDropDown}>
                        <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
                    </motion.div>
                    {/*  in-mw-96 py-4 px-4 absolute top-20 right-10 bg-white rounded-md z-50 shadow  */}
                    {dropDownMenu && (
                        <div className="in-mw-72 py-3 px-3 text-sm absolute top-20 right-10 bg-white rounded-md z-50 shadow 
                          md:min-w-96 md:py-4 md:px-4 md:text-md" ref={dropdownRef}>
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

                            <div className="w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded">
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconBookmark stroke={2} className="text-gray-500" />
                                </div>
                                <p className="text-black">Saved ads</p>
                            </div>

                            <div className="group w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded" onClick={handleLogout}>
                                <div className="w-10 h-10 items-center justify-center flex">
                                    <IconLogout stroke={2} className="text-gray-500 group-hover:text-black" />
                                </div>
                                <p className="text-black">Sign Out</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Settings Modal */}
            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        </div>
    );
};

export default Header;
