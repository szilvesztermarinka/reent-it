import { useEffect } from "react";
import Header from "../components/Header";
import ItemComponent from "../components/ItemComponent";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { getPosts, post } = useAuth();

    useEffect(() => {
        getPosts();
    }, [])

    return (
        <div className="max-h-full overflow-hidden">
            <Header />
            <div className="max-w-md h-screen m-6 flex flex-col gap-4 overflow-y-scroll">
                {post.map((item) => (
                    <ItemComponent key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
