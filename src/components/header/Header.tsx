import styles from "./header.module.css";
import logo from "../../assets/logo.png"
import { ApiKeyType } from "../api/apitype";

const Header = ({handleApiClick = () => {},
                handleLogoClick = () => {},
                keyArray,
                } :
                {handleApiClick: React.MouseEventHandler,
                handleLogoClick: React.MouseEventHandler,
                keyArray: ApiKeyType[]})  => {

                    keyArray.map((key, index) => {
                        console.log(key, index);
                        
                    })
    return ( 
        <>
            <div className={styles["header-container"]}>
                <img src={logo} alt="gw2 efficiency logo" onClick={handleLogoClick} id="gw2e-logo"/>
                <span className={styles["api-keys"]} onClick={handleApiClick}>API Keys</span>

                <span className="select-account"> Account: <select>

                <option value=""></option>
                </select>
                </span>

                <h3>Scuffed <a target="blank_" href="https://gw2efficiency.com/">gw2efficiency.com</a> clone</h3>
                <h4>Developed by <a target="blank_" href="https://github.com/inthenile">inthenile</a></h4>
            </div>
        </>
     );
}
 
export default Header;