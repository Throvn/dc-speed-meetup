import Discord, { DiscordAPIError } from "discord.js"

const store = { // Names which can be changed later
    waitingroom: {
        name: "Waitingroom",
        id: undefined
    },
    maxRooms: 5,
    activeChannels: [],
    categoryID: undefined, // id of the "speed meetup" category
    activeGuild: undefined,
};

const initializeRooms = (msg: Discord.Message): void => {
    if (
        msg.member.hasPermission("ADMINISTRATOR") &&
        msg.content === "!speedmeet"
    ) {
        store.activeGuild = msg.guild;
        msg.reply("Pong!");
        console.log(msg.guild.name);
        msg.guild.channels
            .create("Speed Meet-up", {
                type: "category",
                permissionOverwrites: [],
            })
            .then((channel: Discord.Channel): void => {
                store.categoryID = channel.id
                msg.guild.channels
                    .create(store.waitingroom.name, {
                        type: "voice",
                        permissionOverwrites: [

                        ],
                        parent: channel.id
                    })
                    .then((voiceChannel: Discord.VoiceChannel): void => {
                        store.waitingroom.id = voiceChannel.id;
                    }).catch((error: DiscordAPIError) => console.error(error));
            }).catch((error: DiscordAPIError) => console.error(error));
        msg.channel.send("Channel: Voice created!");
    }
}

const assignRandomly = async (voiceState: Discord.VoiceState): Promise<void> => {
    if (voiceState.channel.parent.id !== store.categoryID) return;
    if (store.activeChannels.length === 0) {
        console.log("should create new channel")
        const newChannel = await voiceState.guild.channels.create("Room 1", {
            type: "voice",
            permissionOverwrites: [],
            parent: store.categoryID
        })
        store.activeChannels.push(newChannel)
        voiceState.member.voice.setChannel(newChannel, "Started new Meet-up round. Go have fun!")
    } else {
        console.log(typeof store.activeChannels[0])
        store.activeChannels.sort((a: Discord.Channel, b: Discord.Channel): any => {
            const firstChannel = a.fetch(false).then(channel => channel.toJSON()).catch(error => console.log(error))
            console.log(firstChannel)
            if (firstChannel) {

            }
        })
        const randomChannel = store.activeChannels[Math.floor(Math.random() * store.activeChannels.length)]
        voiceState.member.voice.setChannel(randomChannel, "Assigning you to a Meet-up round. Go have fun!")
    }
}

export {
    initializeRooms,
    assignRandomly,
    store,
}