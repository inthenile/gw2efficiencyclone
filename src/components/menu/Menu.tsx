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
    {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span id="account-info"><img src={accountIcon} />Account</span>, activeState: false, subMenu: true},
    //these are placeholders
    {element: <span><img src={bossIcon} />Bosses</span>, activeState: false, endPoint: worldBosses},
    {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false, endPoint: currencyInfo},
    {element: <span><img src={statsIcon} />Stats</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false, endPoint: wizVaultDaily},
    {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false, endPoint: wizVaultDaily},
]


const abortController = new AbortController();

const Menu = () => {
    
    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState<any>(null);
    const [menuEp, setMenuEp] = useState<EndpointType | undefined>({url:"/v2/account/wizardsvault/daily", keyReq: true});
    const [needApi, setNeedApi] = useState(false);
    const [subMenuOn, setSubMenuOn] = useState(false);
    const [burgerToggle, setBurgerToggle] = useState(false);

    useEffect(() => {
        setLoading(false);
        (mainKey === undefined || mainKey === null) ? setNeedApi(true) : setNeedApi(false);
        //when a mainkey is changed, send them to Daily menu
        handleMenuLogoClick(0)
        return () => {
        }
    }, [mainKey])

    const handleMenuLogoClick = (index: number) => {

            menuIcons.map((icon, i) =>{
                if(index === i){
                    icon.activeState = true;
                } else {
                    icon.activeState = false;
                }
            })

            if(menuIcons[index].subMenu){
                setSubMenuOn(true)
            } 
            if (!menuIcons[index].subMenu) {
                setSubMenuOn(false)
            }
            
            if (mainKey && menuIcons[index]?.endPoint) {
                let ep = menuIcons[index].endPoint;
                setLoading(true);

                const fetchRes = useFetch(ep, setLoading, setErr, abortController, mainKey)

                setMenuEp(ep);
                
                fetchRes.then(res => {
                    if(res){
                        const {data} = res;
                        setRes(data)
                    }   
                }).then(() =>{
                    setLoading(false);
                })
                .catch(() =>{
                    setLoading(false)
                    setErr(true);
                })
            }
    }

    function handleHamburgerClick(): void {
        setBurgerToggle(!burgerToggle)
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
        
            {res && !err && !loading && 
            <>
              <SubAccountInfo subMenuOn={subMenuOn} burgerToggle={burgerToggle}/>
              {!subMenuOn && <FetchedContent url={menuEp?.url} data={res}/>}
            </>  
            }

            {loading && !err && !subMenuOn &&
            <div className={styles.loadingDiv}> 
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}

                
           {!loading && err && !res &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>Ooops! Looks like there was a problem!..</h2>
            </div>}

            {needApi && !loading &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>You need to save an API key!</h2>
            </div>}
        </>
    );

}
 
export default Menu;