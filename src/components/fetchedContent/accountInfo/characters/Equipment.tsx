import { useContext, useEffect, useState } from "react";
import { KeyArrayContext } from "../../../../App";
import styles from "./equipment.module.css"
import placeholder from "./../../../../assets/placeholder.png"

type ItemType = {
    default_skin: number,
    description: string,
    details?: {infix_upgrade?: { attributes: [{atttribute: string, modifier: number}]}},
    icon: string,
    name: string,
    rarity: string,
    id: number,
    slot?: string,
}

const Equipment = ({charName: charName} : {charName: string}) => {

    const keyContext = useContext(KeyArrayContext)
    const key = keyContext?.isMainKey;
    const [tabAmount, setTabAmount] = useState<string[]>();
    const [tabNumber, setTabNumber] = useState<string>("1");
    const [items, setItems] = useState<ItemType[]>([]);
    const [itemIds, setItemIds] = useState<number[]>([])
    const [err, setErr] = useState(false);
    const [slots, setSlots] = useState<{slot: string, item: number}[]>([]);

    useEffect(() => {
        //to see how many tabs there are and save them in an array
        fetch(`https://api.guildwars2.com/v2/characters/${charName}/equipmenttabs?access_token=${key?.key}&v=latest`)
        .then(res =>{
            return res.json();            
        }).then(data =>{
            console.log(data);
            setTabAmount(data);
        })
    }, [])
    useEffect(() =>{
        fetchEquipmentTabs()
        return() => {
            setItems([]);
            setSlots([]);
            setErr(false);
        }
    }, [tabNumber, setTabNumber])

    useEffect(() => {
        fetchItems(itemIds);
    }, [itemIds, setItemIds])

    function fetchItems(itemIds: number[]){
        if (itemIds.length) {
            fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}`)
            .then(res =>{
                if (res.ok) {
                    return res.json();
                }
            }).then(data =>{
                
                const duplicateItems = itemIds.filter((item, i) => itemIds.indexOf(item) !== i)
                
                if (duplicateItems.length) {
                    checkDuplicates(data, duplicateItems);
                } else {
                    setItems(data);
                }
            })

    }

    }
    //DUPLLICATE IDS ARE CAUSING PROBLEMS: multiple objects with the same item ids are not fetched with the fetchItems function
    //with this function we create duplicates if the same id exists in our array
    function checkDuplicates(data: ItemType[], duplicateItems: number[]){
        
            data.filter((item) => {
                duplicateItems.forEach(element => {
                    if(item.id === element){
                        data.push(item);
                    }
                });
                
            })
            setItems(data);
        }
    function fetchEquipmentTabs(){
        fetch(`https://api.guildwars2.com/v2/characters/${charName}/equipmenttabs/${tabNumber}?access_token=${key?.key}&v=latest`)
            .then(res =>{
                return res.json();
            }).then(data =>{
                if (data.equipment.length === 0) {
                    setErr(true);
                } else {
                    data.equipment.map((item:any)=> {
                        console.log(item);
                        setItemIds(i => [...i, item.id]);
                        setSlots((i: any) => [...i, {slot:item.slot, item:item.id}])
                    });
                }             
            })
    }

    function handleTabChange(e: React.ChangeEvent<HTMLSelectElement>){
        setTabNumber(e.target.value);
        setItemIds([]);
    }

    return (
        <>
            {tabAmount && 
            <>
                <>
                    <h5>Equipment</h5>
                    <label> Equipment tab: </label>
                    <select name="tabnum" id="tabnum" onChange={(e) => handleTabChange(e)}>
                        {tabAmount.map((num, i) => (
                        <option value={num} key={i}> {num} </option>
                        ))}
                    </select>
                </>
                {items && !err && <EquipmentLayout items={items} slots={slots}/>}
            </>
            }
            {!items?.length && !err && <p style={{fontStyle:"italic"}}>Fetching your equipment...</p>}
            {err && <p>No items found</p>}
        </>
        
    )
}
export default Equipment;

//LAYOUT FOR EQUIPMENT DISPLAY
type EquipmentProp = {
    items: ItemType[],
    slots: {slot:string, item:number}[]
}
export const EquipmentLayout = ({items, slots} : EquipmentProp) =>{

    const [layout, setLayout] = useState<any>();
    const [equippedSlots, setEquippedSlots] = useState<{slot: string, item: any}[]>([]);

    const allSlots: string[] = [
        "Helm", "Shoulders", "Gloves", "Coat", "Leggings", "Boots",
        "WeaponA1", "WeaponA2", "WeaponB1", "WeaponB2",
        "Backpack", "Accessory1", "Accessory2", "Amulet", "Ring1", "Ring2",
        "HelmAquatic", "WeaponAquaticA", "WeaponAquaticB"
    ]

    useEffect(()=>{
        {items.length && slots.map((slot) => {
           allSlots.includes(slot.slot) ? setEquippedSlots(s => [...s, {slot: slot.slot, item: items.filter(item => {
                return item.id === slot.item;
           })}]) : null;
        })}
        return() => {
            setEquippedSlots([]);
        }
    }, [items])

    let helmIcon =                  <img src={placeholder}></img>
    let shoulderIcon =              <img src={placeholder}></img>
    let chestIcon =                 <img src={placeholder}></img>
    let glovesIcon =                <img src={placeholder}></img>
    let legsIcon =                  <img src={placeholder}></img>
    let bootsIcon =                 <img src={placeholder}></img>
    let weapona1icon =              <img src={placeholder}></img>
    let weapona2icon =              <img src={placeholder}></img>
    let weaponb1icon =              <img src={placeholder}></img>
    let weaponb2icon =              <img src={placeholder}></img>
    let backIcon =                  <img src={placeholder}></img>
    let accessory1icon =            <img src={placeholder}></img>
    let accessory2icon =            <img src={placeholder}></img>
    let amuletIcon =                <img src={placeholder}></img>
    let ring1Icon =                 <img src={placeholder}></img>
    let ring2Icon =                 <img src={placeholder}></img>
    let aquaticHelmIcon =           <img src={placeholder}></img>
    let weaponaquaticaIcon =        <img src={placeholder}></img>
    let weaponaquaticbIcon =        <img src={placeholder}></img>

    useEffect(()=>{
        equippedSlots?.map(slot => {
            //REFACTOR THIS
            if (slot.slot === "Helm")           helmIcon =              <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Shoulders")      shoulderIcon =          <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Gloves")         glovesIcon =            <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Coat")           chestIcon =             <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Leggings")       legsIcon =              <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Boots")          bootsIcon =             <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponA1")       weapona1icon =          <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponA2")       weapona2icon =          <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponB1")       weaponb1icon =          <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponB2")       weaponb2icon =          <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Backpack")       backIcon=               <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Accessory1")     accessory1icon =        <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Accessory2")     accessory2icon=         <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Amulet")         amuletIcon=             <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Ring1")          ring1Icon =             <img src={slot.item[0].icon} ></img>
            if (slot.slot === "Ring2")          ring2Icon =             <img src={slot.item[0].icon} ></img>
            if (slot.slot === "HelmAquatic")    aquaticHelmIcon=        <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponAquaticA") weaponaquaticaIcon =    <img src={slot.item[0].icon} ></img>
            if (slot.slot === "WeaponAquaticB") weaponaquaticbIcon =    <img src={slot.item[0].icon} ></img>
        })

        setLayout(
                <div className={styles.equipment}>
                <div className={styles.armour}>
                    {helmIcon}
                    {shoulderIcon}
                    {glovesIcon}
                    {chestIcon}
                    {legsIcon}
                    {bootsIcon}
                </div>
                <div className={styles.weapons}>
                    {weapona1icon}
                    {weapona2icon}
                    {weaponb1icon}
                    {weaponb2icon}
                </div>
                <div className={styles.trinkets}>
                    {backIcon}
                    {accessory1icon}
                    {accessory2icon}
                    {amuletIcon}
                    {ring1Icon}
                    {ring2Icon}
                </div>
                <div className={styles.aquatic}>
                    {aquaticHelmIcon}
                    {weaponaquaticaIcon}
                    {weaponaquaticbIcon}
                </div>
            </div>
            )

    }, [equippedSlots, setEquippedSlots])

    return(
        <div> 
            {layout}
        </div>

    )
}