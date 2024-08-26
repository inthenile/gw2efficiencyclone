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
import FetchedContent from "../../fetchedContent/FetchedContent";

const SubAccountInfo = ({setSubMenuClicked : setSubMenuClicked,
                        subMenuClicked: subMenuClicked
                        } :
                        {setSubMenuClicked: React.Dispatch<React.SetStateAction<boolean>>
                            subMenuClicked: boolean   
                        }
) => {

    console.log();
    
    
    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;
    const err = keyContext?.err;
    const setErr = keyContext?.setErr;
    const loading = keyContext?.loading;
    const setLoading = keyContext?.setLoading;
    const [res, setRes] = useState<any>(null);
    const [menuEp, setMenuEp] = useState<EndpointType>();
    const abortController = new AbortController();

    const [subMenuIcons, setSubMenuIcons] = useState<MenuIcon[]>([

        {element: <span><img src={accountOverview}/> Overview </span>, activeState: true, endPoint: accountInfo},
        {element: <span><img src={charactersIcon}/> Characters </span>, activeState: false, endPoint: charactersInfo},
        //guild info requires guiild id to be passed, find a solution for it!!!!
        {element: <span><img src={guildsIcon} /> Guilds </span>, activeState: false, endPoint: guildInfo},
        {element: <span><img src={walletIcon} /> Wallet </span>, activeState: false, endPoint: walletInfo},
        {element: <span><img src={bankIcon} /> Bank </span>, activeState: false, endPoint: bankInfo},
        {element: <span><img src={sharedInventoryIcon} /> Shared Inventory </span>, activeState: false, endPoint: sharedInventoryInfo},
    ])

    //if the main Account icon is clicked while having another submenu (other than overview) is selected - this will reset the selection to overview.
    useEffect(() => {
        document.getElementById("account-info")?.addEventListener("click", () => handleSubMenuLogoClick(0))
        setSubMenuClicked(false);
        return() => {
            document.getElementById("account-info")?.removeEventListener("click", () => handleSubMenuLogoClick(0))
            setSubMenuClicked(false)
            console.log("unmounting");
         }
    }, [])


    const handleSubMenuLogoClick = (index: number) => {
       
        if(!subMenuClicked){
            setSubMenuClicked(true)
        }
        
        setSubMenuIcons(subMenuIcons.map((icon, i) =>{
            if(index === i){
                return {...icon, activeState: true};
            } else {
                return {...icon, activeState: false};
            }
        }));
        
    if (mainKey && subMenuIcons[index].endPoint && setLoading && setErr) {
        let ep = subMenuIcons[index].endPoint;
        const fetchRes = useFetch(ep, setLoading, setErr, abortController, mainKey)
        setLoading(true);
        setMenuEp(ep)
        fetchRes.then(res => {
            if(res){
                const {data} = res;
                setRes(data)
            }
        }).catch(() =>{
            setLoading(false)
            setErr(true);
        })        
    }
}

return ( 
        <>
        <div className={styles.subMenuIcons}>
            {subMenuIcons && subMenuIcons.map((sMenu, index) => (
                sMenu.activeState === false
                ?
                <div key={index} onClick={() => handleSubMenuLogoClick(index)} className={styles.inactive}> {sMenu.element} </div>
                :
                <div key={index} onClick={ () => handleSubMenuLogoClick(index)} className={styles.active}> {sMenu.element} </div>
            ))}
        </div>
        {res && !err && !loading && menuEp &&   
            <FetchedContent data={res} endpoint={menuEp} />
        }
        </>
     );
}
 
export default SubAccountInfo;
