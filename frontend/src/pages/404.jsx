import Header from "../components/Header"
import kep from "../assets/404kep.png"

const Notfound = () => {
    return (
        <>
            <Header />
            <div>
                <div className="flex justify-center items-center h-screen">


                    <div className="lg:p-24 md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex flex-col justify-center items-center -10 text-blue-500 text-4xl text-weight-bold playwrite">Sajnos ez az oldal nem található!</div>

                    <div className="lg:p-24 md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex flex-col justify-center items-center -10">
                        <img src={kep} alt="" />
                    </div>


                </div>
            </div>
        </>
    )
}
export default Notfound