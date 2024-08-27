import gw2icon from "../../../assets/expansions/gw2.png"
import hoticon from "../../../assets/expansions/hot.png"
import poficon from "../../../assets/expansions/pof.png"
import eodicon from "../../../assets/expansions/eod.png"
import sotoicon from "../../../assets/expansions/soto.png"
import jwicon from "../../../assets/expansions/jw.png"
import { useEffect, useState } from "react"
import styles from "./accountInfo.module.css"
import spinner from "../../../assets/spinner.png";
import errorImg from "../../../assets/error.png"

const abortController = new AbortController();

let expansions: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>[] = [];
let accName: string = "";
let creationDate: string = "";

type GuildInfo = {
    name: string,
    tag: string
}

const AccountInfo = ({data: data} : any) => {

    const [err, setErr] = useState(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [guildNames, setGuildNames] = useState<GuildInfo[]>([]);

    const {access, created, guilds, name} = data;

    // present the date in a simpler way
    const splitDate = created && created?.split(/\D+/);
    const finalDate = splitDate && (`${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`);

    accName = name;
    creationDate = finalDate
    expansions = access && access.map((expansion: any) => {
        switch(expansion){
            case "GuildWars2":
                return <div key={0}><img src={gw2icon}/></div>
            case "HeartOfThorns":
                return <div key={1}><img src={hoticon}/></div>
            case "PathOfFire":
                return <div key={2}><img src={poficon}/></div>
            case "EndOfDragons":
                return <div key={3}><img src={eodicon}/></div>
            case "SecretsOfTheObscure":
                return <div key={4}><img src={sotoicon}/></div>
            case "JanthirWilds":
                return <div key={5}><img src={jwicon}/></div>
            default:
                break;
        }
    }) 

    let ignore = false;

    useEffect(() =>{

    const promiseArray = [];
    const baseUrl = "https://api.guildwars2.com/v2/guild/";
    for(let i = 0; i < guilds?.length; i++){
        const guildId = guilds[i];
        const guildUrl = baseUrl + guildId;
        promiseArray.push(guildUrl);
    }

    // ake a fetch request to get information about the guilds
    // separated the fetch call 2 separate promises, so I don't setFeching to true after the first set of promises are completed
        const guildArray: GuildInfo[] = [];
        const promises = Promise.all(promiseArray.map(allGuilds => 
        fetch(allGuilds)))
        .then(responses => {
            return Promise.all(responses.map(res =>{
                if (res.ok ) {
                    setFetching(true);
                    return res.json()
                } else {
                    throw new Error(">>> ?")
                }
            }))
        })
            promises.then(data =>{
                if (!ignore) {
                    data.map(_guild=>{
                        const guildInfo = {name: _guild.name, tag: _guild.tag};
                        guildArray.push(guildInfo)
                    })
                }
            }).then(() =>{
                setFetching(false);
            }).catch((e) =>{
                console.log(e);
            })
        
            setGuildNames(guildArray);
 
        return() =>{
            abortController.abort();
            setErr(false)
            setFetching(false)
            ignore = true;
        }
    }, [])


    const Table = () => {

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
                            <td>{accName}</td>
                            <td className={styles.expansions}><>{expansions}</></td>
                            <td>{creationDate}</td>
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
                        {guildNames && guildNames.map((guild, index)=> (
                            <div key={index}>{guild.name} [{guild.tag}]</div>
                        ))}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            )
    }

    return ( 
        <>
            {fetching && !err &&
            <div className={styles.loadingDiv}>
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}

            {!fetching && err &&
            <div className={styles.errorDiv}>
                <img src={errorImg} alt="error logo" /> 
                <h2>Ooops! Looks like there was a problem!..</h2>
            </div>}


            {!fetching && !err && <Table />}
        </>
    );
}
export default AccountInfo;