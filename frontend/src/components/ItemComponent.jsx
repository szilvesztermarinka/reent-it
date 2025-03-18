import ReactTimeAgo from "react-time-ago";
import { IconBathFilled, IconBedFilled, IconBookmark, IconDimensions, IconTrendingDown } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // useTranslation importálása

const ItemComponent = (item) => {
    console.log(item)
    const navigate = useNavigate();
    const { t } = useTranslation(); // useTranslation hook

    const formatPrice = (price) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1).replace(/\.0$/, "")} M Ft`;
        } else {
            return price.toLocaleString("hu-HU") + " Ft";
        }
    };

    const handleClick = () => {
        navigate(`/post/${item.id}`);
    };

    return (
        <div className="flex bg-white border-gray-200 border-solid border rounded-xl hover:shadow transition duration-200 cursor-pointer" onClick={handleClick}>
            <div className="mr-2 relative">
                <img src={item.images[0]} alt="Kép" className="w-36 h-36 rounded-l object-fill" />
                <div className="absolute bg-black/50 top-0 right-0 z-10 text-white px-4 py-2 rounded-es">{item.images.length}</div>
            </div>
            <div className="flex-1 flex-col p-2 justify-between flex">
                {/* Price & Address & Type */}
                <div>
                    <div className="flex justify-between flex-row">
                        <div className="flex items-end gap-1">
                            <h1 className="text-lg font-bold">
                                {formatPrice(item.price)}
                                {item.listtype === "Rent" && <span className="font-normal">/hó</span>}
                            </h1>
                            <IconTrendingDown stroke={2} size={20} className="text-green-500" />
                        </div>
                        {item.listtype === "Rent" && <div className="px-2 py-1 bg-amber-100 text-xs font-bold text-amber-500 rounded-full flex items-center">{t("rent")}</div>}
                        {item.listtype === "Buy" && <div className="px-2 py-1 bg-green-100 text-xs font-bold text-green-500 rounded-full flex items-center">{t("sale")}</div>}
                        {item.listtype === "Room" && <div className="px-2 py-1 bg-blue-100 text-xs font-bold text-blue-500 rounded-full flex items-center">{t("room")}</div>}
                    </div>
                    <p className="text-xs text-gray-500">Debrecen, Egyetem sugárút</p> {/* A helyszín lokalizálása */}
                </div>

                {/* Specs */}
                <div className="flex flex-row gap-2 mt-2">
                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconBedFilled className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">
                            {item.bedroom + item.livingroom}
                        </p>
                    </div>

                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconBathFilled className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">{item.bathroom}</p> {/* A fürdőszoba szöveg dinamikus */}
                    </div>

                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconDimensions className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">{item.size}</p> {/* Méret */}
                    </div>
                </div>

                {/* Uploaded & Save */}
                <div className="flex flex-row justify-between mt-auto">
                    <p className="text-xs text-gray-500">{<ReactTimeAgo date={Date.parse(item.createdAt)} />}</p>
                    <IconBookmark size={20} className="cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

export default ItemComponent;
