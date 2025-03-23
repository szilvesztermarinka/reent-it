import React, { useState, useEffect } from "react";
import ReactTimeAgo from "react-time-ago";
import { IconBathFilled, IconBedFilled, IconBookmark, IconDimensions, IconTrendingDown, IconX, IconChevronLeft, IconChevronRight, IconExternalLink } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const formatPrice = (price) => {
    return price >= 1000000 ? `${(price / 1000000).toFixed(1).replace(/\.0$/, "")} M Ft` : `${price.toLocaleString("hu-HU")} Ft`;
};

const ImageModal = ({ images, currentIndex, onClose, onNavigate }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}>
        <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="fixed top-4 right-4 flex gap-2 z-50">
                <button className="text-white bg-gray-800 p-2 rounded-full" onClick={onNavigate}>
                    <IconExternalLink size={24} />
                </button>
                <button className="text-white bg-gray-800 p-2 rounded-full" onClick={onClose}>
                    <IconX size={24} />
                </button>
            </div>

            <img src={images[currentIndex]} alt="Nagy kép" className="h-[70vh] object-contain rounded-lg" />
            {images.length > 1 && (
                <div className="flex gap-4 mt-2">
                    <button className="text-white bg-gray-800 p-2 rounded-full" onClick={() => onNavigate(-1)}>
                        <IconChevronLeft size={24} />
                    </button>
                    <button className="text-white bg-gray-800 p-2 rounded-full" onClick={() => onNavigate(1)}>
                        <IconChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    </div>
);

const ItemComponent = (item) => {
    const { t } = useTranslation();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isImageModalOpen) return;
            if (event.key === "ArrowRight") setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
            if (event.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
            if (event.key === "Escape") setIsImageModalOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isImageModalOpen, item.images.length]);

    const openImageModal = (index, event) => {
        event.stopPropagation();
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    return (
        <div className="flex bg-white border border-gray-200 rounded-xl hover:shadow transition cursor-pointer" onClick={() => window.open(`/post/${item.id}`, "_blank")}>
            <div className="mr-2 relative">
                <img src={item.images[0]} alt="Kép" className="w-36 h-36 rounded-l object-fill cursor-pointer" onClick={(e) => openImageModal(0, e)} />
                {item.images.length !== 1 && <div className="absolute bg-black/50 top-0 right-0 z-10 text-white px-4 py-2 rounded-es">{item.images.length}</div>}
            </div>
            <div className="flex-1 flex flex-col p-2 justify-between">
                <div>
                    <div className="flex justify-between">
                        <div className="flex items-end gap-1">
                            <h1 className="text-lg font-bold">
                                {formatPrice(item.price)} {item.listtype === "Rent" && <span className="font-normal">/{t("monthly")}</span>}
                            </h1>
                            <IconTrendingDown className="text-green-500" size={20} />
                        </div>
                        <div className={`px-2 py-1 text-xs font-bold rounded-full flex items-center ${item.listtype === "Rent" ? "bg-amber-100 text-amber-500" : item.listtype === "Buy" ? "bg-green-100 text-green-500" : "bg-blue-100 text-blue-500"}`}>{t(item.listtype.toLowerCase())}</div>
                    </div>
                    <p className="text-xs text-gray-500">Debrecen, Egyetem sugárút</p>
                </div>
                <div className="flex gap-2 mt-2">
                    {[
                        { icon: <IconBedFilled className="text-gray-500" />, value: item.bedroom + item.livingroom },
                        { icon: <IconBathFilled className="text-gray-500" />, value: item.bathroom },
                        { icon: <IconDimensions className="text-gray-500" />, value: item.size },
                    ].map((data, index) => (
                        <div key={index} className="px-2 py-1 bg-gray-100 flex items-center rounded gap-1">
                            {data.icon}
                            <p className="text-xs text-gray-500">{data.value}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-auto">
                    <p className="text-xs text-gray-500">
                        <ReactTimeAgo date={Date.parse(item.createdAt)} />
                    </p>
                    <IconBookmark size={20} className="cursor-pointer" />
                </div>
            </div>
            {isImageModalOpen && (
                <ImageModal
                    images={item.images}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsImageModalOpen(false)}
                    onNavigate={() => {
                        window.open(`/post/${item.id}`, "_blank");
                    }}
                />
            )}
        </div>
    );
};

export default ItemComponent;
