import "./env.ts";
import Discord from "discord.js";
import { assignRandomly, initializeRooms, store } from "./users";

const client: Discord.Client = new Discord.Client();

client.on("ready", (): void => {
    console.log(`Logged in as ${client.user.tag}`);
});



client.on("message", initializeRooms);

client.on("voiceStateUpdate", async (oldState: Discord.VoiceState, newState: Discord.VoiceState): Promise<void> => {
    console.log(newState.channel.id, "  :  ", store.waitingroom.id)
    if (oldState.member.user.bot && newState.channel === null) return;
    else if (newState.channel && newState.channel.id === store.waitingroom.id) {
        console.log("someone joined speed-meetup");
        await assignRandomly(newState)
    }
});

client.on("disconnect", (): void => {
    if (store.activeGuild) {
        store.activeGuild;
        console.log("Bye Bye");
    }
});

client.login(process.env.TOKEN);
