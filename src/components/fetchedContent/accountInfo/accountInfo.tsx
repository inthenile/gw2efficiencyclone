import gw2icon from "../../../assets/expansions/gw2.png"
import hoticon from "../../../assets/expansions/hot.png"
import poficon from "../../../assets/expansions/pof.png"
import eodicon from "../../../assets/expansions/eod.png"
import sotoicon from "../../../assets/expansions/soto.png"
import jwicon from "../../../assets/expansions/jw.png"
import { useEffect, useState } from "react"
import styles from "./accountInfo.module.css"

const AccountInfo = ({data: data} : {data: any}) => {

    const {access, created, guild_leader, guilds, name} = data;
    
    const [iconArray, setIconArray] = useState<JSX.Element[]>([<img src={gw2icon}/>]);

    useEffect(() =>{
       access.map((expansion:any) => {
            switch(expansion){
                case "HeartOfThorns":
                    setIconArray(i => [...i, <img src={hoticon}/>])
                break;
                case "PathOfFire":
                    setIconArray(i => [...i, <img src={poficon}/>])
                break;
                case "EndOfDragons":
                    setIconArray(i => [...i, <img src={eodicon}/>])
                break;
                case "SecretsOfTheObscure":
                    setIconArray(i => [...i, <img src={sotoicon}/>])
                break;
                case "JanthirWilds":
                    setIconArray(i => [...i, <img src={jwicon}/>])
                break;
            }
        })
    }, [])
    const expansions = iconArray && iconArray.map((icon, index) => (
        <div key={index}>{icon}</div>
    ))
    return ( 

        <div className={styles.tableStyle}>

        <h1>Your account overview:</h1>
        <table> 
            <thead>
                <tr>
                    <th>Account name</th>
                    <th>Expansions</th>
                    <th>Created on</th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{name}</td>
                    <td className={styles.expansions}>{expansions}</td>
                    <td>{created}</td>
                </tr>
            </tbody>
        </table>

        
            <br />
            <br />  {created}
            <br />  {guild_leader}
            <br />  {guilds}
            <br />
        </div>

    );
}
export default AccountInfo;