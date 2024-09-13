import accountIcon from "../../assets/menu/account-icon.png";
import activitiesIcon from "../../assets/menu/activities-icon.png";
import bossIcon from "../../assets/menu/boss-icon.png";
import dailyIcon from "../../assets/menu/daily-icon.png";
import disciplinesIcon from "../../assets/menu/disciplines-icon.png";
import lotteryIcon from "../../assets/menu/lottery-icon.png";
import statsIcon from "../../assets/menu/stats-icon.png";
import goldCoinIcon from "../../assets/menu/gold-coin-icon.png";
import styles from "./menu.module.css"
import { useContext,  useEffect,  useRef,  useState } from "react";
import useFetch from "../../hooks/useFetch";
import { KeyArrayContext } from "../../App";
import { wizVaultDaily, worldBosses} from "../../endpoints/accountInfo/accointInfo";
import { currencyInfo } from "../../endpoints/currencyInfo/currencies";
import { MenuIcon } from "./menuicontype";
import spinner from "../../assets/spinner.png";
import errorImg from "../../assets/error.png"
import { EndpointType } from "../../endpoints/endpointtype.tsx";
import SubAccountInfo from "./submenus/SubAccountInfo.tsx";
import FetchedContent from "../fetchedContent/FetchedContent.tsx";
import hamburgerMenu from "../../assets/hamburger-menu.svg";

const menuIcons: MenuIcon[]  = [
    {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: true, endPoint: wizVaultDaily},
    {element: <span id="account-info"><img src={accountIcon} />Account</span>, activeState: false, subMenu: true},
    //these are placeholders
    {element: <span><img src={bossIcon} />Bosses</span>, activeState: false, endPoint: worldBosses},
    {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false, endPoint: currencyInfo},
    {element: <span><img src={statsIcon} />Stats</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false, endPoint: wizVaultDaily},
]

type Props = {
    showApi: boolean,
    setShowApi: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu = ({showApi, setShowApi} : Props) => {
    
    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;

    const menuEp = useRef<EndpointType>({url:"/v2/account/wizardsvault/daily", keyReq: true})
    
    const [needApi, setNeedApi] = useState(false);
    const [subMenuOn, setSubMenuOn] = useState(false);
    const [burgerToggle, setBurgerToggle] = useState(true);
    
    const {res, loading, err} = useFetch(menuEp.current, mainKey);
    
    useEffect(() => {
        (mainKey === undefined || mainKey === null) ? setNeedApi(true) : setNeedApi(false);
        handleMenuLogoClick(0);
    }, [mainKey])

    const handleMenuLogoClick = (index: number) => {

            menuIcons.map((icon, i) =>{
                if(index === i){
                    icon.activeState = true;
                } else {
                    icon.activeState = false;
                }
            })
            
            if(menuIcons[index].subMenu && !subMenuOn){
                setSubMenuOn(true)
            } 
            if (!menuIcons[index].subMenu && subMenuOn) {
                setSubMenuOn(false)
            }
            
            if (menuIcons[index].endPoint) {
                menuEp.current = (menuIcons[index].endPoint);
            }
            
    }

    function handleHamburgerClick(): void {
        setBurgerToggle(!burgerToggle)
    }

    //check window size to see whether the burger toggle should be available
    useEffect(() => {

        function checkWindowSize() {
            if (window.innerWidth > 500) {
                setBurgerToggle(true);
            } else {
                setBurgerToggle(false);
            }
        }
        window.addEventListener("resize", checkWindowSize)
        return () =>{
            window.removeEventListener("resize", checkWindowSize);
        }
    }, [])

     
    function handleNeedApi(): void {
        showApi ? setShowApi(false) : setShowApi(true);
    }

    return ( 
        <>
        {<img src={hamburgerMenu} alt="hamburger menu icon" className={styles.hamburgerMenu}
        onClick={() => handleHamburgerClick()}/>}

        <div className={`${burgerToggle ? styles.menuIcons : styles.menuInactive}`}>
                {menuIcons.map((icon, i) =>(
                    !icon.activeState
                    ?
                    <div onClick={() => handleMenuLogoClick(i)} key={i} className={styles.inactive}>{icon.element}</div>
                    :
                    <div onClick={() => handleMenuLogoClick(i)} key={i} className={styles.active}>{icon.element}</div>
                ))}
        </div>
        
            {
            <>
              {res && !err && !loading && subMenuOn && <SubAccountInfo subMenuOn={subMenuOn} burgerToggle={burgerToggle}/>}
              {res && !err && !loading && !subMenuOn && <FetchedContent url={menuEp.current?.url} _data={res}/>}
            </>  
            }

            {loading && !err && !subMenuOn &&
            <div className="loadingDiv"> 
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}

                
           {!loading && err && !res && !needApi &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>Ooops! Looks like there was a problem!..</h2>
            </div>}

            {needApi && !loading &&
            <div className={styles.needApiDiv} onClick={() => handleNeedApi()}>
                <img src={errorImg} alt="error logo" /> 
                <h2>You need to save an API key!</h2>
            </div>}
        </>
    );

}
 
export default Menu;