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
        <div className="overflow-hidden">
            <Header />
            <div className="flex flex-row w-full h-screen">
                {/* Sidebar/filters */}
                <Sidebar onFiltersChange={handleFiltersChange} />

                {/* Posts */}
                <div className="w-1/3 h-screen m-6 flex flex-col gap-4 overflow-y-scroll">
                    {post.map((item) => (
                        <ItemComponent key={item.id} {...item} />
                    ))}
                </div>

                {/* Mapbox */}
                <div className="w-1/3 h-full">
                    <Mapbox ads={post} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
