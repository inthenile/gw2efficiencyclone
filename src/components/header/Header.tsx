import styles from "./header.module.css";
import logo from "../../assets/menu/logo.png"
import { useContext, useEffect } from "react";
import { KeyArrayContext } from "../../App";
import { ApiKeyType } from "../api/apitype";

const Header = ( {showApi, setShowApi} : {showApi: boolean, setShowApi: React.Dispatch<React.SetStateAction<boolean>>})  => {
    
    const keyContext = useContext(KeyArrayContext);
    const savedKeys = keyContext?.keyArray;
    const mainKey = keyContext?.isMainKey;
    const setMainKey = keyContext?.setIsMainKey;

    let selectedKey: ApiKeyType[];

    function handleApiClick(){
        setShowApi(!showApi)
        if (!document.getElementById("gw2e-logo")?.classList.contains("active")) {
          document.getElementById("gw2e-logo")?.classList.add("active");
        } else {
          document.getElementById("gw2e-logo")?.classList.remove("active");
        }
    }
      function handleLogoClick(){
        if (showApi) {
          setShowApi(false)
          document.getElementById("gw2e-logo")?.classList.remove("active");
        }
      }
    
    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        savedKeys?.map((key) => {
            key.mainKey = false;
        })
        
        if (setMainKey && mainKey && savedKeys) {
            setMainKey({key: e.target.value, mainKey:true});
            
        }
        //update the selected key value on both the key table as well as the dropdown menu
        if (savedKeys) {
        
        selectedKey = savedKeys?.filter(k => {
            if(k.key === e.target.value){
                return k;
            }
        })
        selectedKey[0].mainKey = true;
        }
    }

    useEffect(() => {
      
        const apiKeyList = JSON.stringify(savedKeys);
        localStorage.setItem("savedKeys", apiKeyList);
        
},[savedKeys, mainKey])

    return ( 
            <div className={styles["header-container"]}>
                <img src={logo} alt="gw2 efficiency logo" onClick={handleLogoClick} id="gw2e-logo"/>
                <span className={styles["api-keys"]} onClick={handleApiClick}>API Keys</span>
                <span className="select-account"> Account: 
                        <select id="select" onChange={(e) => handleOptionChange(e)} defaultValue={mainKey?.key} >
                    {savedKeys && savedKeys.map((key, index) => (
                        <option key={index} value={key.key}> {key.accountName} </option>
                    ))}
                    </select>
                </span>
                <h3><a target="_blank" href="https://gw2efficiency.com/">gw2efficiency.com</a> clone</h3>
                <h4>Developed by <a target="_blank" href="https://github.com/inthenile">inthenile</a></h4>
            </div>
     );
}
 
export default Header;