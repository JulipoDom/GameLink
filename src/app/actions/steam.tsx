"use server";

const key = process.env.STEAM_KEY

let steamid:string

async function getSteamId(link:string){

    if (!link){
        console.log("error: link inexistent");
        return;
    }
    try{
        let res
        if(link.search("/id/") == -1){
            res = link.slice(36).replaceAll("/", "")
            console.log(res);
            steamid = res
            return
        }else {
            console.log("fof");
            
            const id = link.slice(30).replaceAll("/", "")
            res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${id}`)
                .then(response => {return response.json()}).catch((e) => console.log(e))
            console.log(res.response.steamid)
    
            steamid = res.response.steamid
            return
        }
    }catch(err){
        console.log(err);
        return
    }
}

export interface Game {
    appid:                        number;
    name:                         string;
    playtime_forever:             number;
}


export async function  getGames(){
    let gamesId = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamid}&include_appinfo=true&format=json`)
        .then(response => {return response.json()}).catch((e) => console.log(e))
    if(!gamesId){
        console.log('error 0001');
        
        return []
    }
    let games = gamesId.response.games.map((game:Game) => {
        return {appid: game.appid, name: game.name, playtime: game.playtime_forever, logo: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
    })
    return games
}

export async function getSteamUser(link:string){
    await getSteamId(link)
    if(!steamid) return;

    return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
        .then(response => {return response.json()}).catch((e) => console.log(e))
}