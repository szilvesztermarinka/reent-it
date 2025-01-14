import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import ItemComponent from "../components/ItemComponent";
import Sidebar from "../components/Sidebar";
import { appAPI } from "../services/api";
import Mapbox from "../components/Mapbox";

const HomePage = () => {
    const [post, setPost] = useState([]);
    const [filters, setFilters] = useState({});

    const getPosts = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await appAPI.get(`/all-ad?${queryParams}`);
            setPost(response.data.ads);
        } catch (error) {
            console.error(error.response.data.message || "Error getting posts");
        }
    }, [filters]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <div className="h-screen">
            <Header />
            <div className="flex flex-row w-full h-full">
                <Sidebar className="fixed top-0 left-0 h-screen" onFiltersChange={handleFiltersChange} />

                <div className="flex-1 ml-64 md:ml-0 transition-all duration-300">
                    <div className="flex flex-row h-full">
                        <div className="flex flex-col flex-1 overflow-y-scroll m-6 gap-4">
                            {post.map((item) => (
                                <ItemComponent key={item.id} {...item} />
                            ))}
                        </div>
                        <div className="w-1/2 h-full">
                            <Mapbox ads={post} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
