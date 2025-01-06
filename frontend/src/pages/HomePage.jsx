import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import ItemComponent from "../components/ItemComponent";
import Sidebar from "../components/Sidebar";
import { appAPI } from "../services/api";
import Mapbox from "../components/Mapbox";

const HomePage = () => {
    const [post, setPost] = useState([]);

    const getPosts = useCallback(async () => {
        try {
            const response = await appAPI.get(`/all-ad`);
            setPost(response.data.posts);
            console.log(response.data.posts);
            console.log(response);
        } catch (error) {
            console.error(error.response.data.message || "Error getting posts");
        }
    }, []);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <div className="overflow-hidden">
            <Header />
            <div className="flex flex-row w-full h-screen">
                {/* Sidebar/filters */}
                <Sidebar />

                {/* Posts */}
                <div className="w-1/3 h-screen m-6 flex flex-col gap-4 overflow-y-scroll">
                    {post.map((item) => (
                        <ItemComponent key={item.id} {...item} />
                    ))}
                </div>

                {/* Mapbox */}
                <div className="w-1/3 h-full">
                    <Mapbox />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
