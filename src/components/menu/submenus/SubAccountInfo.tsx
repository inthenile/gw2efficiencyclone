import { useContext, useEffect, useState } from "react";
import { MenuIcon } from "../menuicontype";
import { KeyArrayContext } from "../../../App";
import walletIcon from "../../../assets/subMenus/account/wallet.png"
import guildsIcon from "../../../assets/subMenus/account/guilds.png"
import bankIcon from "../../../assets/subMenus/account/bank.png"
import charactersIcon from "../../../assets/subMenus/account/characters.png"
import sharedInventoryIcon from "../../../assets/subMenus/account/sharedinventory.png"
import accountOverview from "../../../assets/subMenus/account/accountOverview.png";
import { bankInfo, walletInfo, sharedInventoryInfo, guildInfo, accountInfo } from "../../../endpoints/accountInfo/accointInfo";
import { charactersInfo } from "../../../endpoints/charactersInfo/charactersInfo";
import styles from "../menu.module.css";
import useFetch from "../../../hooks/useFetch";
import { EndpointType } from "../../../endpoints/endpointtype";
import spinner from "../../../assets/spinner.png";
import errorImg from "../../../assets/error.png"
import FetchedContent from "../../fetchedContent/FetchedContent";

const subMenuIcons: MenuIcon[] = [

    {element: <span><img src={accountOverview}/> Overview </span>, activeState: true, endPoint: accountInfo},
    {element: <span><img src={charactersIcon}/> Characters </span>, activeState: false, endPoint: charactersInfo},
    //guild info requires guiild id to be passed, find a solution for it!!!!
    {element: <span><img src={guildsIcon} /> Guilds </span>, activeState: false, endPoint: guildInfo},
    {element: <span><img src={walletIcon} /> Wallet </span>, activeState: false, endPoint: walletInfo},
    {element: <span><img src={bankIcon} /> Bank </span>, activeState: false, endPoint: bankInfo},
    {element: <span><img src={sharedInventoryIcon} /> Shared Inventory </span>, activeState: false, endPoint: sharedInventoryInfo},
]


type Props = {
    subMenuOn: boolean,
    burgerToggle: boolean
}

const SubAccountInfo = ({subMenuOn, burgerToggle} : Props) => {
        
    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;

    const [menuEp, setMenuEp] = useState<EndpointType>({url:"/v2/account", keyReq: true});

    const {res, loading, err} = useFetch(menuEp, mainKey)
    console.log(res, loading,err);
    //if the main Account icon is clicked while having another submenu (other than overview) is selected - this will reset the selection to overview.
    useEffect(() => {
        document.getElementById("account-info")?.addEventListener("click", () => handleSubMenuLogoClick(0))

        return() => {
            document.getElementById("account-info")?.removeEventListener("click", () => handleSubMenuLogoClick(0))
         }
    }, [])

    const handleSubMenuLogoClick = (index: number) => {
        subMenuIcons.map((icon, i) =>{
            if(index === i){
                icon.activeState = true;
            } else {
                icon.activeState = false;
            }
        });
        if (mainKey && subMenuIcons[index].endPoint) {
            setMenuEp(subMenuIcons[index].endPoint)
        }
}

return ( 
        <>
        <div className={`${burgerToggle ? styles.subMenuIcons : styles.menuInactive}`}>
            {subMenuOn && subMenuIcons && subMenuIcons.map((sMenu, index) => (
                sMenu.activeState === false
                ?
                <div key={index} onClick={() => handleSubMenuLogoClick(index)} className={styles.inactive}> {sMenu.element} </div>
                :
                <div key={index} onClick={ () => handleSubMenuLogoClick(index)} className={styles.active}> {sMenu.element} </div>
            ))}
        </div>

        {res && !loading && !err && subMenuOn &&
        <FetchedContent url={menuEp?.url} data={res} />}
        
        {loading && !err && subMenuOn &&
            <div className={styles.loadingDiv}>
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}
                
           {!loading && err &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>Ooops! Looks like there was a problem!..</h2>
            </div>}

        </>
     );
}
 
export default SubAccountInfo;

