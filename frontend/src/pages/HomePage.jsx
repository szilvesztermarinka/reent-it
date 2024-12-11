import { useEffect } from "react";
import Header from "../components/Header";
import ItemComponent from "../components/ItemComponent";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { getPosts, post } = useAuth();

    useEffect(() => {
        getPosts();
    }, [post])

    return (
        <div className="max-h-full overflow-hidden">
            <Header />
            <div className="max-w-md h-screen m-6 flex flex-col gap-4 overflow-y-scroll">
                {post.map((item) => (
                    <ItemComponent key={item.id} {...item} />
                ))}
{/*                 <ItemComponent />
                <ItemComponent type="buy"/>
                <ItemComponent type="buy"/>
                <ItemComponent type="room"/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>  */}
            </div>
        </div>
    );
};

export default HomePage;
