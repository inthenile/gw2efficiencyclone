import styles from "./header.module.css";

const Header = ({handleApiClick = () => {}}) => {

    return ( 
        <>
            <div className={styles["header-container"]}>
                <h1>Scuffed <a target="blank_" href="https://gw2efficiency.com/">gw2efficiency.com</a> clone</h1>
                <span className={styles["api-keys"]} onClick={handleApiClick}>API Keys</span>
                <h4>Developed by <a target="blank_" href="https://github.com/inthenile">inthenile</a></h4>
            </div>
        </>
     );
}
 
export default Header;