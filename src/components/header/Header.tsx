import styles from "./header.module.css";
import logo from "../../assets/logo.png"
import { useContext, useEffect, useState } from "react";
import { KeyArrayContext } from "../../App";

const Header = ({handleApiClick = () => {},
                handleLogoClick = () => {},
                } :
                {handleApiClick: React.MouseEventHandler,
                handleLogoClick: React.MouseEventHandler,
                })  => {
    
    const keyContext = useContext(KeyArrayContext);
    const keyArray = keyContext?.keyArray;

    const [optionChange, setOptionChange] = useState(false)
    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setOptionChange(!optionChange);
    }

    //run this when the a new api key option is swapped
    useEffect(() => {
        console.log("option changed");
        
    }, [optionChange])

    return ( 
            <div className={styles["header-container"]}>
                <img src={logo} alt="gw2 efficiency logo" onClick={handleLogoClick} id="gw2e-logo"/>
                <span className={styles["api-keys"]} onClick={handleApiClick}>API Keys</span>

                <span className="select-account"> Account: <select onChange={(e) => handleOptionChange(e)}>

                {keyArray && keyArray.map((key, index) => (
                    <option key={index} value={key.key}>{key.accountName}</option>
                ))}
                </select>
                
                </span>
                <h3>Scuffed <a target="_blank" href="https://gw2efficiency.com/">gw2efficiency.com</a> clone</h3>
                <h4>Developed by <a target="_blank" href="https://github.com/inthenile">inthenile</a></h4>
            </div>
     );
}
 
export default Header;