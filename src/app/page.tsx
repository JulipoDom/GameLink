"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useTransition } from "react"
import { getSteamUser, getGames } from "./actions/steam";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card
} from "@/components/ui/card"
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";


export default function Home() {

  interface SteamUser {
      response: Response;
  }

  interface Response {
      players: Player[];
  }

  interface Player {
    steamid:                  string;
    communityvisibilitystate: number;
    profilestate:             number;
    personaname:              string;
    profileurl:               string;
    avatar:                   string;
    avatarmedium:             string;
    avatarfull:               string;
    avatarhash:               string;
    lastlogoff:               number;
    personastate:             number;
    primaryclanid:            string;
    timecreated:              number;
    personastateflags:        number;
    gameextrainfo:            string;
    gameid:                   string;
    loccountrycode:           string;
  }

  interface Game {
    appid: number
    name: string,
    logo: string,
    playtime: number
  }

  const [games, setGames] = useState<Game[]>([])

  const [isPending, startTransition] = useTransition()

  const [steamlink, setSteamlink] = useState<string>("")

  const [steamUser, setSteamUser] = useState<SteamUser>()

  const { toast } = useToast()
  
  const { setTheme } = useTheme()

  async function handleSetGames(){
    const games:Game[] = await getGames()
    setGames(games.sort((a, b) => b.playtime - a.playtime))
  }

  useEffect(() => {
    if(steamUser){
      handleSetGames()
    }
  }, [steamUser])

  async function handleGetUser(){
    const usr = await getSteamUser(steamlink)
    if (!usr) {
      toast({
        title: "Sintax Error",
        description: "The link is uncorrectly writen, you may correct it!"
      })
      return
    }
    setSteamUser(usr)
    toast({
      title: "Sucess",
      description: "The account has been linked!!"
    })
  }

  return (
    <div>
      <div className="h-screen w-full flex justify-center items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => startTransition(() => setTheme("light"))}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startTransition(() => setTheme("dark"))}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startTransition(() => setTheme("system"))}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Link with Steam</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Steam Account</DialogTitle>
              <DialogDescription>
                Get your Steam account linked putting your Steam user link here:
              </DialogDescription>
            </DialogHeader>
            <div className="grid py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userlink" className="text-right">
                  User Link
                </Label>
                <Input id="steamlink" value={steamlink} onChange={(event) => setSteamlink(event.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter className="w-full flex flex-row justify-between items-center">
              <Label className="text-xs text-left text-red-600">*see the results scrolling down the page</Label>
              <Button type="submit" onClick={() => startTransition(() => handleGetUser())}>Link Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <Card className="w-96 p-3 flex flex-col justify-center items-center gap-3">
          <Avatar className="h-32 w-32 border">
            <AvatarImage src={steamUser?.response.players[0].avatarfull} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <Label htmlFor="steamname" className="text-center text-lg underline underline-offset-2 mb-2">{steamUser?.response.players[0].personaname}</Label>
          <Label htmlFor="steamid" className="text-center">Steam ID: {steamUser?.response.players[0].steamid ?? "nenhum"}</Label>
          <Label htmlFor="steamlink" className="text-center">Steam Link: {steamUser?.response.players[0].profileurl ?? "nenhum"}</Label>
          <Label htmlFor="steamgame" className="text-center">Jogando agora: {steamUser?.response.players[0].gameextrainfo ?? "nada"}</Label>
        </Card>
        <Card className="w-11/12 m-5 p-5 flex flex-col justify-center items-center">
          <Label className="text-lg">Meus jogos</Label>
          <Card className="w-full m-5 grid grid-cols-5 md:grid-cols-1 gap-3 shadow-none border-0">
        {
          games ?
          games.map((game) => (
                <Card className="flex flex-col w-full items-center" key={game.appid}>
                  <AspectRatio ratio={19/ 9} className="bg-muted">
                    <img
                      src={game.logo}
                      alt="Photo by Drew Beamer"
                      className="h-full w-full rounded-t-xl object-cover"
                    />
                  </AspectRatio>
                  <div className="flex-1 w-full flex flex-col justify-between items-start p-2 gap-2">
                    <Label className="text-left underline underline-offset-2 mb-2">{game.name}</Label>
                    <Label className="text-left">Horas: {(game.playtime / 60).toFixed(1)}</Label>
                  </div>
                </Card>
          ))
          
          : ""
        }
          </Card>
        </Card>
      </div>
      <Toaster/>
    </div>  
  );
}
