import { useContext, useState } from "react";
import { KeyArrayContext } from "../../../App";
import { ApiKeyType } from "../../api/apitype";
import styles from "./characters.module.css";
const abortController = new AbortController();

const Characters = ({data} : {data: any}) => {

    const keyContext = useContext(KeyArrayContext)
    const key = keyContext?.isMainKey;
    const [selectedChar, setSelectedChar] = useState<string>("")

    

    //output the character array
    const charDisplay =  
        <ul className={styles.charList}>
            {data && data?.map((char: any, i: number) => (
                <li className={styles.charListItem} key={i} onClick={() => handleCharSelect(i)}>{char}</li> 
            ))}
        </ul>
    

    function handleCharSelect(index: number){
        setSelectedChar(data[index]);
    }

    return ( 
        <div>
            {charDisplay}
            {selectedChar && <SingleCharacter character={selectedChar} apiKey={key}/>}
        </div>
     );
}
 
export default Characters;


export const SingleCharacter  = ({character, apiKey} : {character: any, apiKey: ApiKeyType | undefined | null } ) => {


    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);


    type CharacterInfo = {
        age: number,
        backstory: number[],
        bags: Object[],
        crafting?: [{active: boolean, discipline: string, rating: number}],
        created: string,
        equipment: Object[],
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

        // DO THIS MORE GRACEFULLY
       fetch(`https://api.guildwars2.com/v2/characters/${character}?access_token=${apiKey?.key}`)
       .then(res =>{
        if (res.ok) {
            return res.json();
        }
        }).then(data =>{
            console.log(data);
        }).catch(e =>{
            console.log(e);
        })

        return(
            <></>
    )
}
