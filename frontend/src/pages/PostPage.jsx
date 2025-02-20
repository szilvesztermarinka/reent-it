import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { appAPI } from "../services/api";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState([]);

  const getAd = useCallback(async () => {
    try {
      const response = await appAPI.get(`/getAddById/${id}`);
      setAd(response.data.ad);
    } catch (error) {
      console.error(error.response.data.message || "Error getting posts");
    }
  }, [id]);

  useEffect(() => {
    if (id) getAd();
  }, [getAd, id]);

  if (ad) console.log(ad);

  return (
    <div className="flex h-screen flex-col">
      <Header />

      {ad ? (
        <div className="flex flex-1 px-16 mx-0 my-auto gap-6 mt-10">
        <div className="w-1/2 max-w-2xl">
          {/* Nagy kép */}
          {ad.images && ad.images.length > 0 && (
            <img
              src={ad.images[0]}
              alt="image"
              className="rounded-xl w-full"
            />
          )}
      
          {/* Kisképek alatta - maximum 3 darab */}
          {ad.images && ad.images.length > 1 && (
            <div className="flex flex-row gap-3 mt-4 w-full">
              {ad.images.slice(1, 4).map((image, index) => (
                <div key={index} className="w-2/6 aspect-square w-full">
                  <img
                    src={image}
                    alt="image"
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostPage;
