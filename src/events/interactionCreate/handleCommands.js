require("dotenv").config();
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;
    if (commandObject.devOnly) {
      if (!process.env.DEVS.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only developers are allowed to run this command.",
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === process.env.TEST_SERVER)) {
        interaction.reply({
          content: "This command can not be run here.",
          ephemeral: true,
        });
        return;
      }
    }

    if(commandObject.permissionsRequired?.length){
        for(const permission of commandObject.permissionsRequired){
            if(!interaction.member.permissions.has(permission)){
                interaction.reply({
                    content: 'Not enough permissions.',
                    ephemeral: true
                });
                break;
            }
        }
    }
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
       const bot = interaction.guild.members.me;

       if(!bot.permissions.has(permission)){
        interaction.reply({
            content: 'I dont have enough permissions.',
            ephemeral: true
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
