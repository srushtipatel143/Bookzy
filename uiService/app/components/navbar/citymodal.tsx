import { Modal } from "react-bootstrap";
import { API_USER_URL } from "../../utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useCity } from "../context/cityContext";
import Select from "react-select";

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

interface CityOption {
  label: string;
  value: number;
  fullData: CityType;
}

const Citymodal: React.FC<citymodalprops> = ({ topCanvas, setTopCanvas }) => {
  const [city, setCity] = useState<CityType[]>([]);
  const { selectCity, setSelectCity } = useCity();
  const [cityOption, setCityOption] = useState<CityOption[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleChange = async (inputValue: string) => {
    try {
      if (inputValue.length>0) {
        const getCityRes = await axios.get(`${API_USER_URL}/searchcity/${inputValue}`);
        const options = getCityRes.data.data.map((item: any) => ({
          label: item.city,
          value: item.id,
          fullData: item,
        }));
        setCityOption(options);
        setIsMenuOpen(inputValue.length > 0);
      }
      else {
        setCityOption([])
        setIsMenuOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Modal show={topCanvas} onHide={() => setTopCanvas(false)} backdrop={true} contentClassName="custom_modal">
        <Modal.Header className="border-0" >
          <form style={{ width: "100%" }}>
            <div className="input-group">
              <Select
                className="w-100 search-input1"
                placeholder="Search for your city"
                options={cityOption}
                onChange={(selectedOption: any) => {
                  if (selectedOption) {
                    selectCityFunction(selectedOption.fullData);
                  }
                }}
                menuIsOpen={isMenuOpen}
                onInputChange={(inputValue) => {
                  handleChange(inputValue)
                }}
                noOptionsMessage={() => "No Results found"}
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "14px"
                  }),
                  noOptionsMessage: (base) => ({
                    ...base,
                    color: "#d71921",
                    textAlign: "left",
                    paddingLeft: "10px",
                    fontSize: "14px"
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: "14px"
                  })
                }}
              />
            </div>
          </form>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "14px" }}>
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