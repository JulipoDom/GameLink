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
import { useState } from "react"
import GetSteamUser from "./actions/steam";
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

  const [steamlink, setSteamlink] = useState<string>("")

  const [steamUser, setSteamUser] = useState<SteamUser>()

  const { toast } = useToast()
  
  const { setTheme } = useTheme()

  async function handleGetUser(){
    const usr = await GetSteamUser(steamlink)
    if (!usr) {
      toast({
        title: "Sintax Error",
        description: "The link is uncorrectly writen, you may correct it!"
      })
      return
    }
    setSteamUser(usr)
  }

  return (
    <div>
      <div className="h-screen w-full flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
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
                <Input id="steamlink"  value={steamlink} onChange={(event) => setSteamlink(event.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter className="w-full flex flex-row justify-between items-center">
              <Label className="text-xs text-left text-red-600">*see the results scrolling down the page</Label>
              <Button type="submit" onClick={() => handleGetUser()}>Link Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-screen w-full flex justify-center items-center">
        <Card className="w-96 p-3 flex flex-col justify-around items-center gap-3">
          <Avatar className="h-32 w-32 border">
            <AvatarImage src={steamUser?.response.players[0].avatarfull} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <Label htmlFor="steamname" className="text-center text-lg underline underline-offset-2 mb-2">{steamUser?.response.players[0].personaname}</Label>
          <Label htmlFor="steamid" className="text-center">Steam ID: {steamUser?.response.players[0].steamid ?? "nenhum"}</Label>
          <Label htmlFor="steamlink" className="text-center">Steam Link: {steamUser?.response.players[0].profileurl ?? "nenhum"}</Label>
          <Label htmlFor="steamgame" className="text-center">Jogando agora: {steamUser?.response.players[0].gameextrainfo ?? "nada"}</Label>
        </Card>
      </div>
      <Toaster/>
    </div>
  );
}
