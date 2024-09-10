import { useContext, useEffect, useState } from "react";
import { KeyArrayContext } from "../../../../App";
import { ApiKeyType } from "../../../api/apitype";
import styles from "./characters.module.css";
import warriorIcon from     "./../../../../assets/classes/warrior.png"
import guardIcon from       "./../../../../assets/classes/guardian.png"
import revIcon from         "./../../../../assets/classes/revenant.png"
import engiIcon from        "./../../../../assets/classes/engineer.png"
import rangerIcon from      "./../../../../assets/classes/ranger.png"
import thiefIcon from       "./../../../../assets/classes/thief.png"
import mesmerIcon from      "./../../../../assets/classes/mesmer.png"
import elementalistIcon from"./../../../../assets/classes/elementalist.png"
import necroIcon from       "./../../../../assets/classes/necromancer.png"
import spinner from "../../../../assets/spinner.png";
import Equipment  from "./Equipment";

const Characters = ({data} : {data: any}) => {

    const keyContext = useContext(KeyArrayContext)
    const key = keyContext?.isMainKey;
    const [selectedChar, setSelectedChar] = useState<string>("")

    const [loading, setLoading] = useState(false);
    
    //output the character array
    const charDisplay =  
        <ul className={styles.charList}>
            {data && data?.map((char: any, i: number) => (
                <li className={styles.charListItem} key={i} onClick={() => handleCharSelect(i)}>{char}</li> 
            ))}
        </ul>
    

    function handleCharSelect(index: number){
        setLoading(true);
        setSelectedChar(data[index]);
    }


    return ( 
        <div>
            {!loading && !selectedChar && charDisplay}
            {selectedChar && <SingleCharacter character={selectedChar} apiKey={key} setLoading={setLoading} setSelectedChar={setSelectedChar}/>}

            {loading &&
            <div className="loadingDiv"> 
                <img src={spinner} alt="loading logo" /> 
                <h2>Loading...</h2>
            </div>}
        </div>
     );
}
 
export default Characters;


export const SingleCharacter  = ({character, apiKey, setLoading, setSelectedChar} 
    : 
    {character: any, apiKey: ApiKeyType | undefined | null, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setSelectedChar: React.Dispatch<React.SetStateAction<string>>} ) => {

    const [err, setErr] = useState(false);

    function handleGoBack() {
        setSelectedChar("");
        setLoading(false);
    }

    const abortController = new AbortController();

    type CharacterInfo = {
        age: number,
        backstory: number[],
        bags: [{id: number, size: number, inventory: [{id: number, count: number}]}],
        crafting?: [{active: boolean, discipline: string, rating: number}],
        created: string,
        equipment: [{binding: string, bound_to: string, id: number, slot: string, stats:{attributes:{}, id:number }}],
        equipment_pvp?: Object,
        flags?: [],
        gender: string,
        guild: string,
        level: number,
        name: string,
        profession: string
        race: string,
        recipes?: number[],
        skills: [] ,
        specializations: Object[],
        title: number,
        training?: [],
        wvw_abilities?: [{id: number, rank: number}]
    }

    const [infoArray, setInfoArray] = useState<CharacterInfo>();

    useEffect(() => {
        fetch(`https://api.guildwars2.com/v2/characters/${character}?access_token=${apiKey?.key}`, {signal: abortController.signal})
        .then(res =>{
             if (res.ok) {
                 return res.json();
             }
         }).then(data =>{
             const charInfo = {
                 age: data.age,
                 backstory: data.backstory,
                 bags: data.bags,
                 crafting: data.crafting,
                 created: data.created,
                 equipment: data.equipment,
                 equipment_pvp: data.equipment.pvp,
                 gender: data.gender,
                 guild: data.guild,
                 level: data.level,
                 name: data.name,
                 profession: data.profession,
                 race: data.race,
                 recipes: data.recipes,
                 skills: data.skills,
                 specializations: data.specilizations,
                 title: data.title,
                 training: data.training,
                 wvw_abilities: data.wvw_abilities
             }
             setInfoArray(charInfo);
             setLoading(false)
         }).catch(()=>{
             setLoading(false);
             setErr(true);
             abortController.abort();
         })
    }, [])
      
        //depending on the profession, assign the appropriate icon to it
        let professionIcon; 
        infoArray?.profession === "Elementalist" ? professionIcon =  <img src={elementalistIcon} alt="elementalist icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Mesmer" ? professionIcon = <img src={mesmerIcon} alt="mesmer icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Necromancer" ? professionIcon = <img src={necroIcon} alt="necromancer icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Thief" ? professionIcon =  <img src={thiefIcon} alt="thief icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Ranger" ? professionIcon = <img src={rangerIcon} alt="ranger icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Engineer" ? professionIcon =  <img src={engiIcon} alt="engineer icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Warrior" ? professionIcon = <img src={warriorIcon} alt="warrior icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Revenant" ? professionIcon = <img src={revIcon} alt="revenant icon" className={styles.professionIcon}></img> : "";
        infoArray?.profession === "Guardian" ? professionIcon = <img src={guardIcon} alt="guardian icon" className={styles.professionIcon}></img> : "";

        const splitDate = infoArray && infoArray.created?.split(/\D+/);
        const finalDate = splitDate && (`${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`);

        console.log(infoArray);

        //some calculations
        const playedHour = infoArray ? infoArray.age / (60*60) : 0;
        const playedMinute = infoArray ? infoArray.age / (60) : 0;
        const leftoverMins = playedMinute % 60;
        
        const inventorySize = infoArray?.bags.reduce((total, currValue) => {
            currValue !== null ? total += currValue.size : total += 0;
            return total;
        }, 0);
        //don't count null (empty) inventory spaces 
        const usedSpace = infoArray?.bags.reduce((total, currValue) => {
            if (currValue?.inventory.map(item => {
                item !== null ? total += 1 : total += 0;
            })) {
            }
            return total;
        }, 0);
        const bagSize = infoArray?.bags.length;
        const maxBagSize = 15;


        return(
            <div>
                {infoArray && !err &&
                <>
                    <div className={styles.buttonWrapper}>
                        <div onClick={() => handleGoBack()} className={styles.backButton}>&lt; Character selection</div>
                        
                    </div>

                    <div className={styles.mainInfo}>

                        {professionIcon}

                        <div className={styles.statistics}>
                            <p style={{fontWeight: "bolder"}}> {infoArray.name} </p>
                            <p>{`Level ${infoArray.level} ${infoArray.race} ${infoArray.profession} `}</p>
                            <p>{`Created at ${finalDate}`}</p>
                            <p>{playedHour > 0 ? `Played: ${Math.floor(playedHour)} hours` : ""} {`${(Math.floor(leftoverMins))} minutes`}</p>
                            <p>{`Inventory: ${usedSpace} / ${inventorySize}`}</p>
                            <p>{`Bag size: ${bagSize}/${maxBagSize}`}</p>
                        </div>

                        <div className={styles.disciplines}>
                            <h5>Disciplines</h5>
                            {infoArray.crafting?.map((discipline, i) => (
                                <div key={i} style={discipline.active ? {opacity:1} : {opacity:0.5}}>{`${discipline.discipline}: ${discipline.rating}`} </div>
                            ))}
                        </div>

                        <div className={styles.equipment}>
                            <>
                            {<Equipment charName={infoArray.name} />}
                            </>
                        </div>
                    </div>
 
                </>
                    }
            </div>
    )
}
