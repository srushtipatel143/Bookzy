'use client';
import Navbar from "./navbar/navbar"
import Carousal from "./homeScreen/carousal";
import RecommendedMovie from "./homeScreen/recommendedMovie";
import Ad from "./homeScreen/ad";
import UpcomingMovie from "./homeScreen/UpcomingMovie";
import LatestMovie from "./homeScreen/latestmovie";
import Footer from "./homeScreen/footer";
import { useSearch } from "./context/searchContext";
import Searchfield from "./navbar/search";

const Homescreen = () => {
    const { showSearch } = useSearch();
    return (
        !showSearch ? (
            <div className="container-fluid p-0">
                <Navbar />
                <Carousal />
                <RecommendedMovie />
                <Ad />
                <LatestMovie />
                <UpcomingMovie />
                <Footer />
            </div>
        ) : (
            <Searchfield />
        )
    )
}

export default Homescreen;