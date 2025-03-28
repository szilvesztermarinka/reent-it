import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { appAPI } from "../services/api";
import { useParams } from "react-router-dom";
import { IconBathFilled, IconBedFilled, IconBrandYoutube, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";

const ImageModal = ({ images, currentIndex, onClose, onNavigate }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
        <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="fixed top-4 left-4 z-50 bg-black/50 p-2 text-white">
                <p>
                    {currentIndex + 1}/{images.length}
                </p>
            </div>
            <div className="fixed top-4 right-4 flex gap-2 z-50 bg-black/50 p-2">
                <button
                    className="text-white p-2 rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                    <IconX size={24} />
                </button>
            </div>
            <img src={images[currentIndex]} alt="Nagy kép" className="h-[70vh] object-contain rounded-lg" />
            {images.length > 1 && (
                <div className="flex gap-4 mt-2 bg-black/50 p-2">
                    <button
                        className="text-white p-2 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(-1);
                        }}>
                        <IconChevronLeft size={24} />
                    </button>
                    <button
                        className="text-white p-2 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(1);
                        }}>
                        <IconChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    </div>
);

const PostPage = () => {
    const { id } = useParams();
    const [ad, setAd] = useState({});
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isImageModalOpen || !ad.images || ad.images.length === 0) return;
            if (event.key === "ArrowRight") setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
            if (event.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
            if (event.key === "Escape") setIsImageModalOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isImageModalOpen, ad.images]);

    const openImageModal = (index, event) => {
        event.stopPropagation();
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    const getAd = useCallback(async () => {
        try {
            const response = await appAPI.get(`/getAddById/${id}`);
            setAd(response.data.ad || {});
        } catch (error) {
            console.error(error.response?.data?.message || "Error getting posts");
        }
    }, [id]);

    useEffect(() => {
        if (id) getAd();
    }, [getAd, id]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2" onClick={(e) => openImageModal(0, e)}>
                    {ad.images?.[0] && <img src={ad.images[0]} alt="thumbnail" className="rounded-xl w-full object-cover aspect-square" />}
                    <div className="flex mt-4 gap-2">
                        {ad.images?.slice(1, 4).map((image, index) => (
                            <img key={index} src={image} alt="" className="w-1/3 rounded-lg object-cover" />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <h1 className="text-3xl font-bold">{ad.price} Ft</h1>
                    <p className="text-gray-500">Havonta</p>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Áttekintés</h2>
                        <div className="grid grid-cols-2 gap-4 mt-3 bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center gap-2">
                                <IconBedFilled /> <p>{ad.rooms} szoba</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconBathFilled /> <p>{ad.bathrooms} fürdőszoba</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p>{ad.size} m²</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p>{ad.furnished ? "Bútorozott" : "Nem bútorozott"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Leírás</h2>
                        <p className="text-gray-700 mt-2">{ad.description}</p>
                    </div>
                    {ad.video && (
                        <a href={ad.video} className="mt-4 flex items-center text-red-500 font-bold gap-2">
                            <IconBrandYoutube /> Videó megtekintése
                        </a>
                    )}
                </div>
            </div>
            {isImageModalOpen && <ImageModal images={ad.images} currentIndex={currentImageIndex} onClose={() => setIsImageModalOpen(false)} onNavigate={(dir) => setCurrentImageIndex((prev) => (prev + dir + ad.images.length) % ad.images.length)} />}
        </div>
    );
};

export default PostPage;
