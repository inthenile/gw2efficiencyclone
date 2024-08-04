import styles from "./footer.module.css"

const Footer = () => {

    return ( 
        <div className={styles["footer-container"]}>
            <h1>Find me on the internet</h1>
            <a target="blank_" href="https://github.com/inthenile">GitHub</a>
            <a target="blank_" href="https://www.linkedin.com/in/salim-caliskan-724811273/">LinkedIn</a>
        </div> 
    );
}
 
export default Footer;