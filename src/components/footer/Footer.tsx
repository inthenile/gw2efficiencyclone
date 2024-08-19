import styles from "./footer.module.css"
import partnerlogo from "../../assets/menu/partner-normal.png"
const Footer = () => {

    return ( 
        <div className={styles["footer-container"]}>

            <div className="created-by">
                <img src={partnerlogo} alt="arenanet partner logo" />
                <p>Created by David Reess (queicherius.2563) and Saskia Van Leeuwen (Morganna Bloodrush.6309)</p>
                <a>Supporters and Contributors</a>
                <p>Buying the expansion or another mule/daily account? Use this link to support us!</p>
            </div>

            <div className="support-us">
                <h4>Support the site</h4>
                <p>Supporters of the website unlock extra goodies, such as more frequent crawling, a longer history, automatic entries into the lottery and no advertisements on the entire site.</p>
                <button>Become a supporter</button>
            </div>

            <div className={styles["socials"]}>
                <h4>Find me on the internet</h4>
                <a target="_blank" href="https://github.com/inthenile">GitHub</a>
                <a target="_blank" href="https://www.linkedin.com/in/salim-caliskan-724811273/">LinkedIn</a>
            </div>

            <div className={styles["about"]}>
                <h4>About</h4>
                <p>gw2efficiency is your helpful companion for everything Guild Wars 2 related.</p>
                <a>Changelog</a>
                <a>Planned features & bug reports</a>
                <a>GW2 API Status</a>
                <a>Legal Notice</a>
            </div>
        </div> 
    );
}
 
export default Footer;