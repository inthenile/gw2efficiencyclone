import gw2icon from "../../../assets/expansions/gw2.png"
import hoticon from "../../../assets/expansions/hot.png"
import poficon from "../../../assets/expansions/pof.png"
import eodicon from "../../../assets/expansions/eod.png"
import sotoicon from "../../../assets/expansions/soto.png"
import jwicon from "../../../assets/expansions/jw.png"
import { useEffect, useState } from "react"
import styles from "./accountInfo.module.css"

const AccountInfo = ({data: data} : {data: any}) => {

    const {access, created, guilds, name} = data;
    
    const [iconArray, setIconArray] = useState<JSX.Element[]>([]);
    const [guildArray, setGuildArray] = useState<any[]>([]);
    const [fetching, setFetching] = useState<boolean>(true);

    useEffect(() =>{
    const abortController = new AbortController();
         //push owned expansion icons into an array and then map them
       access && access?.map((expansion:any) => {
            switch(expansion){
                case "GuildWars2":
                    setIconArray(i => [...i, <img src={gw2icon}/>])
                break;
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

        //make a fetch request to get information about the guilds and store them in an array
        for(let i=0; i < guilds?.length; i++){
            fetch(`https://api.guildwars2.com/v2/guild/${guilds[i]}`, {signal: abortController.signal})
                .then(res =>{
                    return res.json();
                }).then(data =>{
                    setGuildArray(g => [...g, data]);
                    setFetching(false);
                }).catch(e => {
                    console.log("There was an error");
                    setFetching(false);
                    if (e.name === 'AbortError') {
                        console.log('Request aborted');
                    }
                })
        }

        return() => {
            abortController.abort();
            setFetching(true);
        }
    }, [])

    // present the date in a simpler way
    const splitDate = created && created?.split(/\D+/);
    const newDate = splitDate && (`${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`);

    const expansions = iconArray && iconArray?.map((icon, index) => (
        <div key={index}>{icon}</div>
    ))


    return ( 
        <>
            {!fetching && <div className={styles.tableStyle}>
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
                            <td>{newDate}</td>
                        </tr>
                    </tbody>

                </table>
                
                <table>
                <thead>
                    <tr>
                        <th>Your Guilds</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                        {guildArray && guildArray?.map((guild, index) => (
                            <div key={index}>{guild.name} [{guild.tag}]</div>
                        ))}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>}
        </>
    );
}
export default AccountInfo;