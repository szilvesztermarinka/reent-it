import { IconBellFilled, IconBookmarkFilled, IconLogout, IconNotes, IconSettings, IconUser } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
/*         console.log(event.target); 

        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !event.target.closest(".leaflet-container") // Ne reagáljon a térképre kattintásra
        ) {
            setDropDownMenu(false);
        } */
    };

    const toggleDropDown = () => {
        setDropDownMenu((prev) => !prev);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div className="bg-white w-full py-4 px-16 border-b z-50">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black text-center">Reent</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <IconBellFilled />
                    <IconBookmarkFilled />
                    <motion.div className="w-10 h-10 cursor-pointer relative" whileHover={{ scale: 1.02 }} onClick={toggleDropDown}>
                        <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
                    </motion.div>
                    {dropDownMenu && (
                        <div className="min-w-96 py-4 px-4 absolute top-20 right-10 bg-white rounded-md z-50" ref={dropdownRef}>
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

                            <div className="w-full flex cursor-pointer items-center hover:bg-gray-100 px-4 py-2 rounded">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
