export type ItemType = {
    default_skin?: number,
    description: string,
    details: 
        {
            type?: string,
            weight_class?: string,
            max_power?: number,
            min_power?: number
            defense?: number
        },
    icon: string,
    name?: string,
    rarity: string,
    id: number,
    slot?: string,
    level?: number
    flags?: string[]
}

export function findItemColor(rarity: string){
    switch(rarity){
        case "Fine":
            return "blue";
        case "Masterwork":
            return "green";
        case "Rare":    
            return "yellow";
        case "Exotic":
            return "darkorange";
        case "Ascended":
            return "#e768cc";
        case "Legendary":
            return "#7f17b3";
        default:
            return "white";
    }
}

    //component for hovering over items
export function ItemCard({item, leftPos, topPos, styles}: {item: ItemType, leftPos: number, topPos:number, styles: CSSModuleClasses }){
        const {name, icon, rarity, level, details, description, flags} = item;
        const {type, weight_class, defense, max_power, min_power} = details;
        const textColor = findItemColor(rarity)
        const itemStatus: string[] = []
        flags?.map(flag => {
            switch (flag) {
                case "AccountBound":
                    itemStatus.push(flag)
                    break;
                case "Unique":
                    itemStatus.push(flag)
                    break;
                case "SoulBindOnUse":
                    itemStatus.push(flag)
                    break;
            }
        })
        
        function sanitiseDescription(description: string){
            //This function removes the <c=@flavour> </c> from the text
            //this is a custom text color from ArenaNet. Slicing it out and giving it the colour it actually receives from this markup
            const originalText = description;
            if (description?.includes("<br>")) {
                const startPos = description.indexOf("<")
                const endPos = startPos + 4;
                const restOfDesc = description.slice(endPos+11, -4)
                description = description.slice(0, startPos)
                //this is to be able to give the flavour text its blue color, while keeping the previous description white, as it should be
                if (originalText.includes("<br>") && originalText.includes("<c=@flavor")){
                    return <p className={styles.cardDescription}> {description} <br/> <span style={{color: "#34b4eb"}}>{restOfDesc}</span> </p>
                }
            }

            if(description?.includes("<c=@flavor>") && !description.includes("<br>")){
                const startPos = description.indexOf("<")
                const endPos = startPos + 11;
                const restOfDesc = description.slice(endPos, -4)
                const startOfDesc = description.slice(0, startPos);
                return <p className={styles.cardDescription}> {startOfDesc}  <span style={{color: "#34b4eb"}}>{restOfDesc}</span> </p>
            } else {
                return <p className={styles.cardDescription} style={{color: "white"}}> {description} </p>
            }
        }   
        const newDescription = sanitiseDescription(description);
        const weaponStrength = `${details.min_power} - ${details.max_power}`

        return(
            <div className={styles.itemCard} style={{top: `${topPos}px`, left:`${leftPos}px`, border: `1px ${textColor} solid`}}>
                <div className={styles.iconAndName}>
                    <div className={styles.cardIcon}><img src={icon} alt="item icon" /></div>
                    <div className={styles.cardName}><h1 style={{color: textColor}}>{name}</h1></div>
                </div>
                {min_power && max_power && <p className={styles.cardStrength}>Weapon Strength: <span style={{color: "green"}}>{weaponStrength}</span></p>}
                {defense !== 0 && defense !== undefined && <p className={styles.cardDefense}> Defense: <span style={{color: "green"}}> {details.defense}</span></p>}
                <p className={styles.cardRarity} style={{color: textColor}}>{rarity}</p>
                {level !== 0 && <p className={styles.cardLevel}>Required level: {level}</p>}
                {weight_class && <p className={styles.cardWeigthClass}>{weight_class}</p>}
                {type && <p className={styles.cardType}>{type}</p>}
                {newDescription && newDescription}
                {itemStatus && itemStatus.map((status: string, i: number) => (
                        <p key={i} className={styles.cardStatus}>{status}</p>
                ))}
            </div>
        )
    }
    
function checkHeight(element: HTMLElement | null): number {
        //This function decides what part of the screen the absolutely position card should appear
        //so that it never has any overflow into height or width
        const height = element?.firstElementChild?.clientHeight;
        const screenHeight = window.innerHeight;
        const elementPosBottom = element?.getBoundingClientRect().bottom;
        const heightReq = screenHeight < (elementPosBottom ? elementPosBottom : 0) + (height? height:0);
        return heightReq ? -380 : 0;
    }
function checkWidth(element: HTMLElement | null): number {
        //This function decides what part of the screen the absolutely position card should appear
        //so that it never has any overflow into height or width
        const width = element?.firstElementChild?.clientWidth;
        const screenWidth = window.innerWidth;
        const elementPosRight = element?.getBoundingClientRect().right;
        const widthReq = screenWidth < (elementPosRight ? elementPosRight : 0) + (width ? width : 0);
        return widthReq ? -300 : -15;
    }
export function handleMouseEnter(index: number, setTopPos: React.Dispatch<React.SetStateAction<number>>, setLeftPos: React.Dispatch<React.SetStateAction<number>>){
        const element = document.getElementById(String(index));
        element?.classList.remove("inactiveCard");
        element?.classList.add("activeCard");
        const top = checkHeight(element);
        const left = checkWidth(element);
        setTopPos(top);
        setLeftPos(left);
    }
export function handleMouseExit(index: number){
        const element = document.getElementById(String(index));
        element?.classList.add("inactiveCard");
        element?.classList.remove("activeCard");
    }
    