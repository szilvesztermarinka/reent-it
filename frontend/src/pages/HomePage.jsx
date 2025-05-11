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
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex min-h-0">
                <Sidebar className="fixed top-0 left-0 h-screen" onFiltersChange={handleFiltersChange} />
                {post.length > 0 ? (
                    <div className="flex-1 ml-64 md:ml-0 transition-all duration-300 flex min-h-0">
                        <div className="flex flex-1">
                            <div className="flex flex-col flex-1 overflow-y-auto m-6 gap-4">
                                <h2 className="text-lg font-bold text-gray-800">{post.length} találat</h2>
                                {post.map((item) => (
                                    <ItemComponent key={item.id} {...item} />
                                ))}
                            </div>
                            <div className="w-1/2 flex flex-col">
                                <div className="flex-1 min-h-0">
                                    <Mapbox ads={post} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                  <h2>Nincs találat</h2>
                )}
            </div>
        </div>
    );
};

export default HomePage;
