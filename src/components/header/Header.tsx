import styles from "./header.module.css";
import logo from "../../assets/logo.png"

const Header = ({handleApiClick = () => {}}) => {

    return ( 
        <>
            <div className={styles["header-container"]}>
                <img src={logo} alt="" />
                <span className={styles["api-keys"]} onClick={handleApiClick}>API Keys</span>
                <h3>Scuffed <a target="blank_" href="https://gw2efficiency.com/">gw2efficiency.com</a> clone</h3>
                <h4>Developed by <a target="blank_" href="https://github.com/inthenile">inthenile</a></h4>
            </div>


        </>
     );
}
 
export default Header;