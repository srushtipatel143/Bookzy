import { Modal } from "react-bootstrap";
import { API_USER_URL } from "../../utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const getCityRes = await axios.get(`${API_USER_URL}/getallcity`);
        console.log(getCityRes?.data?.data)
        setCity(getCityRes?.data?.data)
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const selectCity =(cityName:object)=>{
    Cookies.set("selected_city",JSON.stringify(cityName));
    setTopCanvas(false);
  }

  return (
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
            <span key={item.id} className="city_modal" onClick={()=>selectCity(item)} >
              {item.city}
            </span>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Citymodal;