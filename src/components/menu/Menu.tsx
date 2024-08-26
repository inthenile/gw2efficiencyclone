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
import FetchedContent from "../fetchedContent/FetchedContent.tsx";
import spinner from "../../assets/spinner.png";
import errorImg from "../../assets/error.png"
import { EndpointType } from "../../endpoints/endpointtype.tsx";

const Menu = () => {

    const keyContext = useContext(KeyArrayContext);
    const mainKey = keyContext?.isMainKey;
    const err = keyContext?.err;
    const setErr = keyContext?.setErr;
    const loading = keyContext?.loading;
    const setLoading = keyContext?.setLoading;
    const [res, setRes] = useState<any>(null);
    const [menuEp, setMenuEp] = useState<EndpointType>();
    const [needApi, setNeedApi] = useState(false);
    const [subMenuClicked, setSubMenuClicked] = useState(false); //to prevent from FetchedContent being rendered twice as it is called in both Menu and Submenu components
    const abortController = new AbortController();

    const [menuIcons, setMenuIcons] = useState<MenuIcon[]>([
        {element: <span><img src={dailyIcon}/>Dailies</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span id="account-info"><img src={accountIcon} />Account</span>, activeState: false, endPoint: accountInfo, 
                                    subMenu: <SubAccountInfo setSubMenuClicked={setSubMenuClicked} subMenuClicked={subMenuClicked}/>},
        //these are placeholders
        {element: <span><img src={bossIcon} />Bosses</span>, activeState: false, endPoint: worldBosses},
        {element: <span><img src={goldCoinIcon} />Currencies</span>, activeState: false, endPoint: currencyInfo},
        {element: <span><img src={statsIcon} />Stats</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={disciplinesIcon} />Crafting</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={activitiesIcon} />Activities</span>, activeState: false, endPoint: wizVaultDaily},
        {element: <span><img src={lotteryIcon} />Lottery</span>,  activeState: false, endPoint: wizVaultDaily},
    ])

    useEffect(() => {
        if (setLoading && setErr) {
            setLoading(false);
            setErr(false);
        }
        (mainKey === undefined || mainKey === null) ? setNeedApi(true) : setNeedApi(false);
        //when a mainkey is changed, send them to Daily menu
        handleMenuLogoClick(0)
    }, [mainKey])


  
    const handleMenuLogoClick = (index: number) => {
            
        setMenuIcons(menuIcons.map((icon, i) =>{
            if(index === i){
                return {...icon, activeState: true};
            } else {
                return {...icon, activeState: false};
            }
        }));
        
        if (mainKey && menuIcons[index].endPoint && setLoading && setErr && !menuIcons[index].activeState) {

            let ep = menuIcons[index].endPoint;
            const fetchRes = useFetch(ep, setLoading, setErr, abortController, mainKey)
            setLoading(true);
            setMenuEp(ep);
            
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
            <div className={styles.menuIcons}>
                {menuIcons && menuIcons.map((icon, index) => (     
                    !icon.activeState  
                    ? 
                    <div onClick={() => handleMenuLogoClick(index)} key={index} className={styles.inactive}>{icon.element}</div>
                    :
                    <div onClick={() => handleMenuLogoClick(index)} key={index} className={styles.active}>{icon.element}</div>
                ))}
            </div>

            {menuIcons && menuIcons.map((icon, index) => (
                icon.activeState && icon.subMenu &&
                <div key={index}>{icon.subMenu}</div>
            ))}                

            {loading && !err &&
            <div className={styles.loadingDiv}>
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}
                
            {!loading && err &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>Ooops! Looks like there was a problem!..</h2>
            </div>}

            {needApi &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>You need to save an API key!</h2>
            </div>}

            {!subMenuClicked && res && !err && !loading && menuEp && 
                <FetchedContent data={res} endpoint={menuEp} />
            }
            </>
     );
}
 
export default Menu;