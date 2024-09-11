import React, { useContext, useEffect, useState } from "react";
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
    slot: string,
}

type TabType = {
    name: string,
    items: {id: number, slot: string}[],
    tabNumber: number
}

const Equipment = ({charName: charName} : {charName: string}) => {

    const keyContext = useContext(KeyArrayContext)
    const key = keyContext?.isMainKey;

    const [tabs, setTabs] = useState<TabType[]>([]);
    const [tabNumber, setTabNumber] = useState<string>("1");
    const [items, setItems] = useState<ItemType[]>([]);
    const [itemIds, setItemIds] = useState<number[]>([])
    const [err, setErr] = useState(false);
    const [slots, setSlots] = useState<{slot: string, item: number}[]>([]);

    useEffect(() => {
        //to see how many tabs there are and save them in an array
        fetch(`https://api.guildwars2.com/v2/characters/${charName}/equipmenttabs?access_token=${key?.key}&tabs=all`)

        .then(res =>{
            return res.json();            
        }).then(data =>{
            data.map((x: any) => {
                setTabs(t => [...t, {items: x.equipment, name: x.name, tabNumber: x.tab}])
            })
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
            {tabs.length !== 0 && 
            <>
                <>
                    <h5>Equipment</h5>
                    <label> Equipment tab: </label>
                    <select name="tabnum" id="tabnum" onChange={(e) => handleTabChange(e)}>
                        {tabs.map((tab, i) => (
                        <option value={tab.tabNumber} key={i}> {tab.name ? tab.name : i+1} </option>
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

    const initialIcons = {
        Helm:           <img src={placeholder}></img>,
        Shoulders:     <img src={placeholder}></img>,
        Coat:          <img src={placeholder}></img>,
        Gloves:        <img src={placeholder}></img>,
        Leggings:      <img src={placeholder}></img>,
        Boots:         <img src={placeholder}></img>,
        WeaponA1 :      <img src={placeholder}></img>,
        WeaponA2 :      <img src={placeholder}></img>,
        WeaponB1 :      <img src={placeholder}></img>,
        WeaponB2 :      <img src={placeholder}></img>,
        Backpack :      <img src={placeholder}></img>,
        Accessory1 :    <img src={placeholder}></img>,
        Accessory2 :    <img src={placeholder}></img>,
        Amulet:        <img src={placeholder}></img>,
        Ring1:         <img src={placeholder}></img>,
        Ring2:         <img src={placeholder}></img>,
        HelmAquatic:   <img src={placeholder}></img>,
        WeaponAquaticA: <img src={placeholder}></img>,
        WeaponAquaticB: <img src={placeholder}></img>
     }
    const [icons, setIcons] = useState<{[key: string]: any}>(initialIcons)


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

    
    useEffect(() => {
        {equippedSlots.length && handleIcons(equippedSlots)}
        
        return() =>{
            setIcons(initialIcons)
        }

    }, [equippedSlots, setEquippedSlots])
    

    function handleIcons(equippedSlots: {slot: string, item: any}[]){
        let nextIcons: any = {...icons};
        const keys = Object.keys(icons).map(slot => {
            return slot;
        });

        for (let i = 0; i < equippedSlots.length; i++) {
            const slot = equippedSlots[i].slot;
            if (keys.includes(slot) ) {
                equippedSlots.forEach(_slot => {
                    if (_slot.slot === slot) {
                        nextIcons[slot] = <img src={_slot.item[0]?.icon} ></img>;
                    } 
                })
            }
        }
        setIcons(nextIcons);
    }

    useEffect(()=>{

        setLayout(
                <div className={styles.equipment}>
                <div className={styles.armour}>
                    {icons.Helm}
                    {icons.Shoulders}
                    {icons.Coat}
                    {icons.Gloves}
                    {icons.Leggings}
                    {icons.Boots}
                </div>
                <div className={styles.weapons}>
                    {icons.WeaponA1}
                    {icons.WeaponA2}
                    {icons.WeaponB1}
                    {icons.WeaponB2}
                </div>
                <div className={styles.trinkets}>
                    {icons.Backpack}
                    {icons.Accessory1}
                    {icons.Accessory2}
                    {icons.Amulet}
                    {icons.Ring1}
                    {icons.Ring2}
                </div>
                <div className={styles.aquatic}>
                    {icons.HelmAquatic}
                    {icons.WeaponAquaticA}
                    {icons.WeaponAquaticB}
                </div>
            </div>
            )

    }, [equippedSlots, setEquippedSlots, icons, setIcons])

    return(
        <div> 
            {equippedSlots && icons && layout && layout}
        </div>

    )
}