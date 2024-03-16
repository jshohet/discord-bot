require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
  ],
});

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.CONNECTIONSTRING);
    console.log("connected to db.");
    eventHandler(client);
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
})();


