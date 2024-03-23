const User = require("../../models/User");
const { Client, Interaction } = require("discord.js");

module.exports = {
    name: 'frogs',
    description: 'check the number of frogs you own',

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) =>{
        if (!interaction.inGuild()) {
          interaction.reply({
            content: "You can only run this command inside a server.",
          });
          return;
        }

        try {
      await interaction.deferReply();

      let query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if(user){
        await interaction.editReply(`You have claimed ownership of ${user.balance} frogs. Your army is growing 😈!`)
      }
    } catch (error) {
      console.log(`Error with /frogs: ${error}`);
    }

}}