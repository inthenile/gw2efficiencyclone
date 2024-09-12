import React, { act, useContext, useEffect, useState } from "react";
import { KeyArrayContext } from "../../../../App";
import styles from "./equipment.module.css"
import placeholder from "./../../../../assets/placeholder.png"

type ItemType = {
    default_skin: number,
    description: string,
    details: {type?: string, weight_class?: string, infix_upgrade?: { attributes: [{atttribute: string, modifier: number}]}},
    icon: string,
    name: string,
    rarity: string,
    id: number,
    slot: string,
    level?: number
}

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
        //to see how many tabs there are and save them in an array
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
                    setequippedItems(data);
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
            setequippedItems(data);
        }
        
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
            {tabs.length !== 0 && 
            <>
                <>
                    <h5>Equipment</h5>
                    <label> Equipment tab: </label>
                    <select  defaultValue={tabNumber} name="tabnum" id="tabnum" onChange={(e) => handleTabChange(e)}>
                        {tabs.map((tab, i) => (
                        <option value={tab.tab} key={i}> {tab.name ? tab.name : tab.tab} </option>
                        ))}
                    </select>
                </>
                {equippedItems && !err && <EquipmentLayout items={equippedItems} slots={slots}/>}
            </>
            }
            {!equippedItems.length && !err && <p style={{fontStyle:"italic"}}>Fetching your equipment...</p>}
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
type EquippedSlotType = {
    slot: string,
    item: ItemType[]
}
export const EquipmentLayout = ({items, slots} : EquipmentProp) =>{

    const [layout, setLayout] = useState<any>();
    const [equippedSlots, setEquippedSlots] = useState<{slot: string, item: any}[]>([]);

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

    }, [equippedSlots, setEquippedSlots])
    

    function handleMouseEnter(item: EquippedSlotType, eqIcon: any){
        const element = document.getElementById(item.slot);
        element?.classList.remove("inactiveCard");
    }
    function handleMouseExit(item: EquippedSlotType){

        const element = document.getElementById(item.slot);
        element?.classList.add("inactiveCard");

    }

    function handleIcons(equippedSlots: EquippedSlotType[]){
        let nextIcons: any = {...icons};

        for (let i = 0; i < equippedSlots.length; i++) {
            const slot = equippedSlots[i].slot;
                equippedSlots.forEach(_slot => {
                    if (_slot.slot === slot) {
                        const {item} = _slot;
                    
                        let borderColor;
                        switch(_slot.item[0]?.rarity){
                            case "Fine":
                                borderColor = "blue";
                                break;
                            case "Masterwork":
                                borderColor = "green";
                                break;
                            case "Rare":    
                                borderColor = "yellow";
                                break;
                            case "Exotic":
                                borderColor = "darkorange";
                                break;
                            case "Ascended":
                                borderColor = "fuchsia";
                                break;
                            case "Legendary":
                                borderColor = "purple";
                                break;
                            default:
                                borderColor = "white";
                    }

                    
                    nextIcons[slot] = {image: <img  onMouseEnter={() => handleMouseEnter(_slot, nextIcons[slot])}
                                                    onMouseLeave={() => handleMouseExit(_slot)} 
                                                    style={{border: `${borderColor} 2px solid`}} src={_slot.item[0]?.icon}></img>,
                                        description: <div id={_slot.slot}className="inactiveCard"> <EquipmentCard item={item[0]}/> </div>};
                } 
            })
        }
        setIcons(nextIcons);
    }

    useEffect(()=>{

        setLayout(
            <div className={styles.equipment}>
                <div className={styles.armour}>
                    <div>{icons.Helm.image}  </div>     {icons.Helm.description}
                    <div>{icons.Shoulders.image}</div>  {icons.Shoulders.description} 
                    <div>{icons.Coat.image}     </div>  {icons.Coat.description}   
                    <div>{icons.Gloves.image}   </div>  {icons.Gloves.description} 
                    <div>{icons.Leggings.image} </div>  {icons.Leggings.description} 
                    <div>{icons.Boots.image}    </div>  {icons.Boots.description} 
                </div>
                <div className={styles.weapons}>
                    <div>{icons.WeaponA1.image}</div> {icons.WeaponA1.description}
                    <div>{icons.WeaponA2.image}</div> {icons.WeaponA2.description}
                    <div>{icons.WeaponB1.image}</div> {icons.WeaponB1.description}    
                    <div>{icons.WeaponB2.image}</div> {icons.WeaponB2.description}
                </div>
                <div className={styles.trinkets}>
                    <div>{icons.Backpack.image}  </div> {icons.Backpack.description} 
                    <div>{icons.Accessory1.image}</div> {icons.Accessory1.description}   
                    <div>{icons.Accessory2.image}</div> {icons.Accessory2.description}
                    <div>{icons.Amulet.image}    </div> {icons.Amulet.description} 
                    <div>{icons.Ring1.image}     </div> {icons.Ring1.description} 
                    <div>{icons.Ring2.image}     </div> {icons.Ring2.description} 
                </div>
                <div className={styles.aquatic}>
                    <div>{icons.HelmAquatic.image}   </div>  {icons.HelmAquatic.description} 
                    <div>{icons.WeaponAquaticA.image}</div>  {icons.WeaponAquaticA.description} 
                    <div>{icons.WeaponAquaticB.image}</div>  {icons.WeaponAquaticB.description} 
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
    //function for hovering over items
export function EquipmentCard({item}: {item: ItemType}){
        const {name, icon, rarity, level, details, description} = item;
        const {type, weight_class} = details;
        
        const card = {name, icon, rarity, level, description, type, weight_class};

        console.log(card);
        return(
            <>
            <div className={styles.equipmentCard}>
                {card.name}
                <br></br>
                <img src={card.icon} alt="item icon" />
                <br></br>
                <span>Required level: {card.level}</span>
                <br></br>
                {card.rarity}
                <br></br>
           
                {card.weight_class}
                <br></br>
                {card.description}
            </div>
            </>
        )
    }
    
