import accountIcon from "../../assets/account-icon.png";
import activitiesIcon from "../../assets/activities-icon.png";
import bossIcon from "../../assets/boss-icon.png";
import dailyIcon from "../../assets/daily-icon.png";
import disciplinesIcon from "../../assets/disciplines-icon.png";
import lotteryIcon from "../../assets/lottery-icon.png";
import statsIcon from "../../assets/stats-icon.png";
import goldCoinIcon from "../../assets/gold-coin-icon.png";
import styles from "./menu.module.css"
import { ReactElement, useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { KeyArrayContext } from "../../App";

const Menu = () => {

    const keyContext = useContext(KeyArrayContext)
    
    type MenuIcon = {
        element: ReactElement,
        activeState: boolean
    }

    const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([
        {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: false},
        {element: <span><img src={accountIcon} />Account</span>, activeState: false},
        {element: <span><img src={statsIcon} />Stats</span>, activeState: false},
        {element: <span><img src={bossIcon} />Bosses</span>, activeState: false},
        {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false},
        {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false},
        {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false},
        {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false},
    ])
        

    const handleMenuLogoClick = (index: number) => {

        setMenuIcons(menuIcons.map((icon, i) =>{
            if(index === i){
                console.log(icon.activeState);
                return {...icon, activeState: true};
            } else {
                return {...icon, activeState: false};
            }
        }));
        console.log(menuIcons);
        
        if (keyContext?.keyArray.length) {
            useFetch(keyContext.keyArray[0])
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