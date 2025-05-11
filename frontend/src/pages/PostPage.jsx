import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { appAPI } from "../services/api";
import { useParams } from "react-router-dom";
import {
    IconBathFilled,
    IconBedFilled,
    IconBrandYoutube,
    IconChevronLeft,
    IconChevronRight,
    IconX
} from "@tabler/icons-react";

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
    const { t } = useTranslation();

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
                <div className="w-full lg:w-1/2">
                    <div onClick={(e) => openImageModal(0, e)} className="cursor-pointer">
                        {ad.images?.[0] && <img src={ad.images[0]} alt="thumbnail" className="rounded-xl w-full object-cover aspect-square" />}
                    </div>
                    <div className="flex mt-4 gap-2">
                        {ad.images?.slice(1, 4).map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt=""
                                className="w-1/3 rounded-lg object-cover cursor-pointer"
                                onClick={(e) => openImageModal(index + 1, e)}
                            />
                        ))}
                    </div>
                    {ad.address && (
                        <div className="mt-4 bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-bold">Cím</h2>
                            <p className="text-gray-700">{ad.address.city}, {ad.address.street} {ad.address.houseNumber}</p>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{ad.price} Ft</h1>
                            <p className="text-gray-500">Havonta</p>
                        </div>
                        <div className={`px-2 py-1 text-base font-bold rounded-full flex items-center ${ad.listtype === "Rent" ? "bg-amber-100 text-amber-500" : ad.listtype === "Buy" ? "bg-green-100 text-green-500" : "bg-blue-100 text-blue-500"}`}>{t(ad.listtype)}</div>
                    </div>
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
                    {ad.user && (
                        <div className="mt-6 bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold">Hirdető</h2>
                            <p className="text-gray-700"><span className="font-semibold">Név:</span> {ad.user.name}</p>
                            <p className="text-gray-700"><span className="font-semibold">Email:</span> {ad.user.email}</p>
                        </div>
                    )}
                    {ad.reviews && ad.reviews.length > 0 && (
                        <div className="mt-6 bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold">Vélemények</h2>
                            {ad.reviews.map((review, index) => (
                                <div key={index} className="mt-2 border-t pt-2">
                                    <p className="text-gray-800 font-semibold">{review.name}</p>
                                    <p className="text-gray-600 italic">"{review.text}"</p>
                                    {review.date && <p className="text-gray-500 text-sm mt-1">{review.date}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {ad.similarAds && ad.similarAds.length > 0 && (
                <div className="container mx-auto px-6 pb-10">
                    <h2 className="text-2xl font-bold mb-4">Ez is érdekelhet</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {ad.similarAds.map((similarAd, index) => (
                            <div key={index} className="bg-white rounded-lg shadow p-4">
                                <img src={similarAd.images?.[0]} alt="" className="w-full h-48 object-cover rounded-md mb-2" />
                                <h3 className="font-semibold text-lg">{similarAd.price} Ft</h3>
                                <p className="text-sm text-gray-600">{similarAd.address?.city}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {isImageModalOpen && (
                <ImageModal
                    images={ad.images}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsImageModalOpen(false)}
                    onNavigate={(dir) => setCurrentImageIndex((prev) => (prev + dir + ad.images.length) % ad.images.length)}
                />
            )}
        </div>
    );
};

export default PostPage;