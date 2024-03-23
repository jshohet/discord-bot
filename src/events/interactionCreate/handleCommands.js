require("dotenv").config();
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  await interaction.deferReply({ ephemeral: true });

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) {
        return;
    }
    if (commandObject.devOnly) {
      if (!process.env.DEVS.includes(interaction.member.id)) {
        await interaction.editReply({
          content: "Only developers are allowed to run this command.",
        });
        return;
      }
    }
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === process.env.TEST_SERVER)) {
        await interaction.editReply({
          content: "This command can not be run here.",
        });
        return;
      }
    }

    if(commandObject.permissionsRequired?.length){
        for(const permission of commandObject.permissionsRequired){
            if(!interaction.member.permissions.has(permission)){
                await interaction.editReply({
                  content: "Not enough permissions.",
                });
                break;
            }
        }
    }
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
       const bot = interaction.guild.members.me;

       if(!bot.permissions.has(permission)){
        await interaction.editReply({
          content: "I dont have enough permissions.",
        });
        break;
       }
      }
    }

    await commandObject.callback(client, interaction);
    
  } catch (error) {
    console.log(`there was an error running this command: ${error}`);
  }
};
