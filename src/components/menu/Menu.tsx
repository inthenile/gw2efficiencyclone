import accountIcon from "../../assets/menu/account-icon.png";
import activitiesIcon from "../../assets/menu/activities-icon.png";
import bossIcon from "../../assets/menu/boss-icon.png";
import dailyIcon from "../../assets/menu/daily-icon.png";
import disciplinesIcon from "../../assets/menu/disciplines-icon.png";
import lotteryIcon from "../../assets/menu/lottery-icon.png";
import statsIcon from "../../assets/menu/stats-icon.png";
import goldCoinIcon from "../../assets/menu/gold-coin-icon.png";
import styles from "./menu.module.css"
import { useContext,  useEffect,  useState } from "react";
import useFetch from "../../hooks/useFetch";
import { KeyArrayContext } from "../../App";
import { wizVaultDaily, accountInfo, worldBosses} from "../../endpoints/accountInfo/accointInfo";
import { currencyInfo } from "../../endpoints/currencyInfo/currencies";
import { MenuIcon } from "./menuicontype";
import SubAccountInfo from "../../components/menu/submenus/SubAccountInfo.tsx";

const Menu = () => {

    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;
    
    const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([
        
        {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={accountIcon} />Account</span>, activeState: false, endPoint: accountInfo, subMenu: SubAccountInfo()},
        {element: <span><img src={bossIcon} />Bosses</span>, activeState: false, endPoint: worldBosses},
        {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false, endPoint: currencyInfo},
        //these are placeholders // might be worked on later
        {element: <span><img src={statsIcon} />Stats</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false, endPoint: wizVaultDaily},
    ])

    
    useEffect(() => {
        //reset the menu selection after a key is changed
        setMenuIcons(menuIcons.map(icon => {
            return {...icon, activeState: false};
        }))
    }, [mainKey])


    const handleMenuLogoClick = (index: number) => {

        setMenuIcons(menuIcons.map((icon, i) =>{
            if(index === i){
                return {...icon, activeState: true};
            } else {
                return {...icon, activeState: false};
            }
        }));

        if (mainKey && menuIcons[index].endPoint && !menuIcons[index].activeState) {
            useFetch(mainKey, menuIcons[index].endPoint )
        }
    }

    return ( 
        <div className={styles.menuIcons}>
            {menuIcons && menuIcons.map((icon, index) => (     
                icon.activeState === false 
                ? 
                <div onClick={() => handleMenuLogoClick(index)} key={index} className={styles.inactive}>{icon.element}</div>
                :
                <div onClick={() => handleMenuLogoClick(index)} key={index} className={styles.active}>{icon.element}</div>
            ))}


            {menuIcons && menuIcons.map((icon, index) => (
                icon.activeState === true 
                ?
                <div key={index}>{icon.subMenu}</div>
                : 
                null
            ))}
        </div>
     );
}
 
export default Menu;
