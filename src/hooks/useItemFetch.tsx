import { ItemType } from "../components/fetchedContent/ItemType";
import placeholder from "./../assets/placeholder.png"

export default function useItemFetch(itemIds: {id: number; i: number}[],
                                    setItems: React.Dispatch<React.SetStateAction<ItemType[]>>,
                                    setUsedSpace: React.Dispatch<React.SetStateAction<number>> ){


        if (itemIds.length > 0) {
            const allItems: ItemType[] = []
            fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds.map(item => item.id)}`)
            .then(res =>{
                if (res.ok) {
                    return res.json();
                }
            }).then(data =>{
                const emptyItem: ItemType = {icon: placeholder, level: 0, description: "This slot appears to be empty", rarity: "", id:0, details: { description: ""}}
                setUsedSpace(data.length); //used inventory/bank space
                //DUPLLICATE IDS ARE CAUSING PROBLEMS: multiple objects with the same item ids are not fetched with the fetchItems function
                //here I deal with duplicate items (as well as empty slots, which are essentially multiple items themselves)
                //get the items that are in the data, place them on their index on itemIds.
                //then get the items that ARE NOT in data (these are the empty spaces, put placeholders in their index on itemIds)
                itemIds.map(_item => {
                data.map((item: ItemType) => {
                        if (_item.id === item.id) {
                            allItems.splice(_item.i, 0, item)
                        }
                    })  
                    if (_item.id === 0) {
                        allItems.splice(_item.i, 0, emptyItem)
                    }
                })
                setItems(allItems);
            })
        }
}

