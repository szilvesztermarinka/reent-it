import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import ItemComponent from "../components/ItemComponent";
import Sidebar from "../components/Sidebar";
import { appAPI } from "../services/api";
import Mapbox from "../components/Mapbox";
import { IconFilter,IconMap } from "@tabler/icons-react";

const HomePage = () => {
  const [post, setPost] = useState([]);
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);

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
        <Sidebar
          className="fixed top-0 left-0 h-screen"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onFiltersChange={handleFiltersChange}
        />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 ml-0 md:ml-0 transition-all duration-300 flex min-h-0">
          <div className="flex flex-1">
            <div className="flex flex-col flex-1 overflow-y-auto m-3 mt-3 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  ><IconFilter size={18} />
                    Szűrők
                  </button>

                  <h2 className="text-lg font-bold text-gray-800">
                    {post.length} találat
                  </h2>
                </div>
              </div>
              {post.map((item) => (
                <ItemComponent key={item.id} {...item} />
              ))}
            </div>
            <div className={`w-full ${showMapMobile ? 'flex' : 'hidden'} lg:flex lg:w-1/2 flex-col`}>
              <div className="flex-1 min-h-1  ">
                <Mapbox ads={post} />
              </div>
            </div>
          </div>
        </div>
      </div>


      {post.length > 0 && (
        <button
        className="fixed bottom-6 right-6 z-40 bg-white border border-gray-300 shadow-lg rounded-full p-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 lg:hidden"
        onClick={() => setShowMapMobile(!showMapMobile)}
      >
          <IconMap />
          {showMapMobile ? "Bezárás" : "Térkép"}
        </button>
      )}

    </div>
  );
};

export default HomePage;
