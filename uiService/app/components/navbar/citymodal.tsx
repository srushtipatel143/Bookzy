import { Modal } from "react-bootstrap";
import { API_USER_URL } from "../../utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useCity } from "../context/cityContext";

interface citymodalprops {
  topCanvas: boolean,
  setTopCanvas: (value: boolean) => void
}

interface CityType {
  id: number;
  city: string;
  state: string;
  country: string;
}

const Citymodal: React.FC<citymodalprops> = ({ topCanvas, setTopCanvas }) => {
  const [city, setCity] = useState<CityType[]>([]);
  const { selectCity, setSelectCity } = useCity();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const getCityRes = await axios.get(`${API_USER_URL}/getallcity`);
        setCity(getCityRes?.data?.data)
        const selectedCity = Cookies.get("selected_city");
        if (selectedCity) {
          const cityData = JSON.parse(selectedCity);
          setSelectCity({ id: cityData.id, city: cityData.city });
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchCities();
  }, []);

  const selectCityFunction = (cityObj: CityType) => {
    Cookies.set("selected_city", JSON.stringify(cityObj), { expires: 3650 });
    setSelectCity({ id: cityObj.id, city: cityObj.city });
    setTopCanvas(false);
  };

  return (
    <div>
      <Modal show={topCanvas} onHide={() => setTopCanvas(false)} backdrop={true} contentClassName="custom_modal">
        <Modal.Header className="border-0" >
          <form style={{ width: "100%" }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search for Cinemas and Movies"
                aria-label="Search"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  borderRadius: "0px",
                  height: "3rem",
                }}
              />
            </div>
          </form>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {city.map((item) => (
              <span key={item.id} className={`${item.id === selectCity?.id ? "selected_city" : "city_modal"}`} onClick={() => selectCityFunction(item)} >
                {item.city}
              </span>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  )
}

export default Citymodal;