"use server";

const key = process.env.STEAM_KEY

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
        }

        const id = link.slice(30).replaceAll("/", "")
        res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${id}`)
            .then(response => {return response.json()}).catch((e) => console.log(e))
        console.log(res.response.steamid)

        return res.response.steamid

        }catch(err){
            console.log(err);
            return
        }
    }

export default async function GetSteamUser(link:string){
    const steamid = await getSteamId(link)
    console.log
    if(!steamid) return;

    return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
        .then(response => {return response.json()}).catch((e) => console.log(e))
}