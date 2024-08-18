import accountIcon from "../../assets/account-icon.png";
import activitiesIcon from "../../assets/activities-icon.png";
import bossIcon from "../../assets/boss-icon.png";
import dailyIcon from "../../assets/daily-icon.png";
import disciplinesIcon from "../../assets/disciplines-icon.png";
import lotteryIcon from "../../assets/lottery-icon.png";
import statsIcon from "../../assets/stats-icon.png";
import goldCoinIcon from "../../assets/gold-coin-icon.png";
import styles from "./menu.module.css"
import { ReactElement, useContext,  useEffect,  useState } from "react";
import useFetch from "../../hooks/useFetch";
import { KeyArrayContext } from "../../App";
import { EndpointType } from "../../endpoints/endpointtype";
import { wizVaultDaily, accountInfo, worldBosses} from "../../endpoints/accountInfo/accointInfo";
import { currencyInfo } from "../../endpoints/currencyInfo/currencies";
import { charactersInfo } from "../../endpoints/charactersInfo/charactersInfo";

const Menu = () => {

    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;

    type MenuIcon = {
        element: ReactElement,
        activeState: boolean
        endPoint: EndpointType,
    }

    useEffect(() => {
        //reset the menu selection after a key is changed
        setMenuIcons(menuIcons.map(icon => {
            return {...icon, activeState: false};
        }))
    }, [mainKey])

    const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([
        
        {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={accountIcon} />Account</span>, activeState: false, endPoint: accountInfo},
        {element: <span><img src={statsIcon} />Stats</span>, activeState: false, endPoint: charactersInfo},
        {element: <span><img src={bossIcon} />Bosses</span>, activeState: false, endPoint: worldBosses},
        {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false, endPoint: currencyInfo},
        //these three are placeholders
        {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false, endPoint: wizVaultDaily},
    ])

    //make different component(s) for submenus?

    const handleMenuLogoClick = (index: number) => {

        setMenuIcons(menuIcons.map((icon, i) =>{
            if(index === i){
                return {...icon, activeState: true};
            } else {
                return {...icon, activeState: false};
            }
        }));

        if (mainKey && !menuIcons[index].activeState) {
            useFetch(mainKey, menuIcons[index].endPoint )
        }
    }

    return ( 
        <>
        <div className={`${styles.menuIcons}`}>
            {menuIcons && menuIcons.map((icon, index) => (
                icon.activeState === false 
                ? 
               <div onClick={() => handleMenuLogoClick(index)} className={styles.inactive} key={index}>{icon.element}</div>
               :
               <div onClick={()=> handleMenuLogoClick(index)} className={styles.active} key={index}>{icon.element}</div>
            ))}
        </div>
        </>
     );
}
 
export default Menu;