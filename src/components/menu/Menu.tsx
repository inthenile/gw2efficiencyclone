import accountIcon from "../../assets/account-icon.png";
import activitiesIcon from "../../assets/activities-icon.png";
import bossIcon from "../../assets/boss-icon.png";
import dailyIcon from "../../assets/daily-icon.png";
import disciplinesIcon from "../../assets/disciplines-icon.png";
import lotteryIcon from "../../assets/lottery-icon.png";
import statsIcon from "../../assets/stats-icon.png";
import goldCoinIcon from "../../assets/gold-coin-icon.png";
import styles from "./menu.module.css"
import { useState } from "react";

const Menu = () => {

    const [menuIcons, setMenuIcons] = useState([
        <span ><img src={dailyIcon}/>Dailies</span> ,
        <span ><img src={accountIcon} />Account</span>,
        <span ><img src={statsIcon} />Stats</span>,
        <span ><img src={bossIcon} />Bosses</span>,
        <span ><img src={disciplinesIcon} />Crafting</span>,
        <span ><img src={activitiesIcon} />Actiities</span>,
        <span ><img src={goldCoinIcon} />Currencies</span>,
        <span ><img src={lotteryIcon} />Lottery</span>,
    ])
        
    const handleMenuLogoClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        console.log(e.currentTarget);
        
    }

    return ( 
        <>
        <div className={`${styles.menuIcons}`}>
            {menuIcons && menuIcons.map((icon, index) => (
                <div onClick={handleMenuLogoClick} className={styles.inactive} key={index}>{icon}</div>
            ))}
        </div>
        </>
     );
}
 
export default Menu;