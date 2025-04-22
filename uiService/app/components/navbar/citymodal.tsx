import { Modal } from "react-bootstrap";
interface citymodalprops{
  topCanvas:boolean,
  setTopCanvas:(value:boolean)=>void
}

const Citymodal:React.FC<citymodalprops>=({topCanvas,setTopCanvas})=>{
    return(
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
            {["Ahmedabad", "Surat", "Vijapur", "Visnagar", "Valsad", "Vadodara", "Mahesana"].map((item, index) => (
              <span key={index} className="city_modal" >
                {item}
              </span>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    )
}

export default Citymodal;