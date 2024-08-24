const AccountInfo = ({data: data} : {data: any}) => {

    const result = <h1>"This is the account Info"</h1>;
    
    const{access, age, commander, created,
        daily_ap, fractal_level,
        guild_leader, guilds,
        id, monthly_ap,
        name, world, wvw_rank
    } = data;
    
    return ( 
        <>
            {result}
            <p>Hello </p>{name}
            

        </>
     );
}
 
export default AccountInfo ;