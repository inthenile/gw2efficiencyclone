import React, {useContext, useEffect, useState } from "react";
import { KeyArrayContext } from "../../../../App";
import styles from "./equipment.module.css"
import itemCardStyles from "./../../itemcard.module.css"
import placeholder from "./../../../../assets/placeholder.png"
import { ItemCard, ItemType, findItemColor } from "../../ItemType";
import useItemFetch from "../../../../hooks/useItemFetch";
import { handleMouseEnter, handleMouseExit } from "../../ItemType";

type TabType = {
    name: string,
    equipment: {id: number, slot: string}[],
    tab: number,
}


const Equipment = ({charName: charName} : {charName: string}) => {

    const keyContext = useContext(KeyArrayContext)
    const key = keyContext?.isMainKey;

    const [tabs, setTabs] = useState<TabType[]>([]);
    const [tabNumber, setTabNumber] = useState<string>();
    const [equippedItems, setequippedItems] = useState<ItemType[]>([]);
    const [itemIds, setItemIds] = useState<number[]>([])
    const [err, setErr] = useState(false);
    const [slots, setSlots] = useState<{slot: string, item: number}[]>([]);

    useEffect(() => {
        fetch(`https://api.guildwars2.com/v2/characters/${charName}?access_token=${key?.key}&v=latest`)
        .then(res =>{
            return res.json();            
        }).then(data =>{
            const {active_equipment_tab} = data;
            const {equipment_tabs} = data;
            
            setTabNumber(active_equipment_tab)
            equipment_tabs.map((tab: TabType) => {
                setTabs(t => [...t, {equipment: tab.equipment, name: tab.name, tab: tab.tab}]);
            })
        })
    }, [])

    useEffect(() =>{
        fetchEquipmentTabs()
            return() => {
                setequippedItems([]);
                setSlots([]);
                setErr(false);
            }
    }, [tabNumber, setTabNumber])

    useEffect(() => {
        useItemFetch(itemIds, setequippedItems);
    }, [itemIds, setItemIds])
    
    function fetchEquipmentTabs(){
        if (tabNumber) {
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
    }

    function handleTabChange(e: React.ChangeEvent<HTMLSelectElement>){
        setTabNumber(e.target.value);
        setItemIds([]);
    }

    return (
        <>
            {tabs.length !== 0 && slots &&
            <>
                <div style={{textAlign: "center"}} >
                    <h5 style={{textAlign: "center"}}>Equipment</h5>
                    <label> Equipment tab: </label>
                    <select  defaultValue={tabNumber} name="tabnum" id="tabnum" onChange={(e) => handleTabChange(e)}>
                        {tabs.map((tab, i) => (
                        <option value={tab.tab} key={i}> {tab.name ? tab.name : tab.tab} </option>
                        ))}
                    </select>
                </div>

                {equippedItems && !err && <EquipmentLayout items={equippedItems} slots={slots}/>}
            </>
            }
            {!equippedItems.length && !err && <p style={{fontStyle:"italic", textAlign:"center"}}>Fetching your equipment...</p>}
            {err && <p style={{textAlign:"center"}}>No items found</p>}
        </>
        
    )
}
export default Equipment;

type EquipmentProp = {
    items: ItemType[],
    slots: {slot:string, item:number}[]
}
export type EquippedSlotType = {
    slot: string,
    item: ItemType[]
}
export const EquipmentLayout = ({items, slots} : EquipmentProp) =>{

    const [layout, setLayout] = useState<any>();
    const [equippedSlots, setEquippedSlots] = useState<{slot: string, item: any}[]>([]);
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);

    const initialIcons = {
        Helm:           {image: <img src={placeholder}></img>, description:""},
        Shoulders:      {image: <img src={placeholder}></img>, description:""},
        Coat:           {image: <img src={placeholder}></img>, description:""},
        Gloves:         {image: <img src={placeholder}></img>, description:""},
        Leggings:       {image: <img src={placeholder}></img>, description:""},
        Boots:          {image: <img src={placeholder}></img>, description:""},
        WeaponA1 :      {image: <img src={placeholder}></img>, description:""},
        WeaponA2 :      {image: <img src={placeholder}></img>, description:""},
        WeaponB1 :      {image: <img src={placeholder}></img>, description:""},
        WeaponB2 :      {image: <img src={placeholder}></img>, description:""},
        Backpack :      {image: <img src={placeholder}></img>, description:""},
        Accessory1 :    {image: <img src={placeholder}></img>, description:""},
        Accessory2 :    {image: <img src={placeholder}></img>, description:""},
        Amulet:         {image: <img src={placeholder}></img>, description:""},
        Ring1:          {image: <img src={placeholder}></img>, description:""},
        Ring2:          {image: <img src={placeholder}></img>, description:""},
        HelmAquatic:    {image: <img src={placeholder}></img>, description:""},
        WeaponAquaticA: {image: <img src={placeholder}></img>, description:""},
        WeaponAquaticB: {image: <img src={placeholder}></img>, description:""}
     }
    const [icons, setIcons] = useState<{[key: string]: any}>(initialIcons)
     
    useEffect(()=>{
        {items.length && slots.map((slot) => {
           setEquippedSlots(s => [...s, {slot: slot.slot, item: items.filter(item => {
                return item.id === slot.item;
           })}]);
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
    }, [equippedSlots, setEquippedSlots, leftPos, topPos])
    

    function handleIcons(equippedSlots: EquippedSlotType[]){
        let nextIcons: any = {...icons};
        
        equippedSlots.forEach((_slot, i) => {
            const borderColor = findItemColor(_slot.item[0].rarity)
            nextIcons[_slot.slot] = {image: <img    onMouseEnter={() => handleMouseEnter(i, setTopPos, setLeftPos)} 
                                                    onMouseLeave={() => handleMouseExit(i)} 
                                                    style={{border: `${borderColor} 2px solid`, width: "50px"}} src={_slot.item[0]?.icon}></img>,
                                    description: <span id={String(i)}  className="inactiveCard" style={{position: "relative"}}> <ItemCard topPos={topPos} leftPos={leftPos} item={_slot.item[0]} styles={itemCardStyles}/> </span>};
            })
            setIcons(nextIcons);
        }

    useEffect(()=>{
        setLayout(
            <div className={styles.equipment}>
                <div className={styles.armour}>
                    {icons.Helm.image}     {icons.Helm.description}
                    {icons.Shoulders.image}  {icons.Shoulders.description} 
                    {icons.Coat.image}       {icons.Coat.description}   
                    {icons.Gloves.image}     {icons.Gloves.description} 
                    {icons.Leggings.image}   {icons.Leggings.description} 
                    {icons.Boots.image}      {icons.Boots.description} 
                </div>
                <div className={styles.weapons}>
                    {icons.WeaponA1.image} {icons.WeaponA1.description}
                    {icons.WeaponA2.image} {icons.WeaponA2.description}
                    {icons.WeaponB1.image} {icons.WeaponB1.description}     
                    {icons.WeaponB2.image} {icons.WeaponB2.description}
                </div>
                <div className={styles.trinkets}>
                    {icons.Backpack.image}   {icons.Backpack.description} 
                    {icons.Accessory1.image} {icons.Accessory1.description}   
                    {icons.Accessory2.image} {icons.Accessory2.description}
                    {icons.Amulet.image}     {icons.Amulet.description} 
                    {icons.Ring1.image}      {icons.Ring1.description} 
                    {icons.Ring2.image}      {icons.Ring2.description} 
                </div>
                <div className={styles.aquatic}>
                    {icons.HelmAquatic.image}     {icons.HelmAquatic.description} 
                    {icons.WeaponAquaticA.image}  {icons.WeaponAquaticA.description} 
                    {icons.WeaponAquaticB.image}  {icons.WeaponAquaticB.description} 
                </div>
            </div>
            )

    }, [equippedSlots, setEquippedSlots, icons, setIcons])

    return(
        <div> 
            {equippedSlots.length > 0 && layout && layout}
        </div>

    )
}
  
