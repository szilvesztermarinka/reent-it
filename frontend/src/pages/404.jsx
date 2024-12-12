import Header from "../components/Header"
import kep from "../assets/404.png"
import { Link } from "react-router-dom";

const Notfound = () => {
    return (
        <>
            <Header />
            <div>
                <div className="flex justify-center items-center h-screen">


                    <div className="lg:p-24 md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex flex-col justify-center items-left -10 text-black-500 text-4xl text-weight-bold playwrite">Ez az oldal elérhetetlen – de az álomotthonod nem az!
                        <p className="text-xl playwrite pt-4 text-gray-500 pb-2 ">Úgy tűnik, rossz helyen jársz, de ne aggódj, a tökéletes ingatlan még vár rád. Böngéssz hirdetéseink között, és találj rá!</p>
                        <Link to={"/"} className="playwrite  text-2xl text-blue-500 ">Vissza a főoldalra!</Link>
                    </div>

                    <div className="lg:p-24 md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex flex-col justify-center items-center -10">
                        <img src={kep} alt="" />
                    </div>


                </div>
            </div>
        </>
    )
}
export default Notfound