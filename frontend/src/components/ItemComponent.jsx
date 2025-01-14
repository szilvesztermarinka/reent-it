import ReactTimeAgo from "react-time-ago";
import { IconBathFilled, IconBedFilled, IconBookmark, IconDimensions, IconTrendingDown } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const ItemComponent = (item) => {
    const navigate = useNavigate();

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
        <div className="flex bg-white p-2 shadow rounded-xl hover:shadow-md transition duration-200 cursor-pointer" onClick={handleClick}>
            <div className="mr-4">
                <img src={item.images[0]} alt="Kép" className="w-36 h-36 rounded-l" />
            </div>
            <div className="flex-1 flex-col justify-between flex">
                {/* Price & Address & Type */}
                <div>
                    <div className="flex justify-between flex-row">
                        <div className="flex items-end gap-1">
                            <h1 className="text-lg font-bold">
                                {formatPrice(item.price)}
                                {item.type === "rent" && <span className="font-normal">/hó</span>}
                            </h1>
                            <IconTrendingDown stroke={2} size={20} className="text-green-500" />
                        </div>
                        {item.type === "rent" && <div className="px-2 py-1 bg-amber-100 text-xs font-bold text-amber-500 rounded-full flex items-center">Kiadó</div>}
                        {item.type === "buy" && <div className="px-2 py-1 bg-green-100 text-xs font-bold text-green-500 rounded-full flex items-center">Eladó</div>}
                        {item.type === "room" && <div className="px-2 py-1 bg-blue-100 text-xs font-bold text-blue-500 rounded-full flex items-center">Eladó</div>}
                    </div>
                    <p className="text-xs text-gray-500">Debrecen, Egyetem sugárút</p>
                </div>

                {/* Specs */}
                <div className="flex flex-row gap-2 mt-2">
                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconBedFilled className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">
                            {item.bedroom}+{item.livingroom}
                        </p>
                    </div>

                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconBathFilled className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">1</p>
                    </div>

                    <div className="px-2 py-1 bg-gray-100 flex flex-row items-center rounded gap-1">
                        <IconDimensions className="text-gray-500" size={20} />
                        <p className="text-xs text-gray-500">51m2</p>
                    </div>
                </div>

                {/* Uploaded & Save */}
                <div className="flex flex-row justify-between mt-auto">
                    <p className="text-xs text-gray-500">{<ReactTimeAgo date={Date.parse(item.createdAt)} locale="hu-HU" />}</p>
                    <IconBookmark size={20} className="cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

export default ItemComponent;
