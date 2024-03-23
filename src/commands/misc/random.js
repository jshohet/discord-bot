const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  
} = require("discord.js");

module.exports = {
    name: "random",
    description: "rolls a random number",
     options: [
    {
      name: "dice-max",
      description: "largest number on the die",
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
],
    callback: (client, interaction) => {
        if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server");
      return;
    }
        const number = interaction.options.get("dice-max").value;
        const random = Math.floor(Math.random() * number + 1 );
        
        interaction.reply(`You rolled a ${random} out of ${number}!`);
    }
}