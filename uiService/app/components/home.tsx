'use client';
import Navbar from "./navbar/navbar"
import Carousal from "./homeScreen/carousal";
import RecommendedMovie from "./homeScreen/recommendedMovie";
import Ad from "./homeScreen/ad";
import UpcomingMovieScreen from "./homeScreen/UpcomingMovie";
import LatestMovieScreen from "./homeScreen/latestmovie";
import Footer from "./homeScreen/footer";
import { useSearch } from "./context/searchContext";
import Searchfield from "./navbar/search";
import { useCity } from "./context/cityContext";

const Homescreen = () => {
    const { showSearch } = useSearch();
    const {selectCity}=useCity();

    return (
        !showSearch ? (
            <div  key={selectCity?.id} className="container-fluid p-0">
                <Navbar />
                <Carousal />
                <LatestMovieScreen />
                {/* <RecommendedMovie /> */}
                <UpcomingMovieScreen />
                <Ad />
                <Footer />
            </div>
        ) : (
            <Searchfield />
        )
    )
}

export default Homescreen;