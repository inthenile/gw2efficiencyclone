import { useEffect } from "react";
import { ItemType, ItemCard, findItemColor } from "../ItemType";

const SharedInventoryInfo = ({data:data} :  any) => {
    

    useEffect(() =>{

        console.log(data);



    },[])


    return ( 
        <div>Shared inventory here</div>
     );
}
 
export default SharedInventoryInfo;