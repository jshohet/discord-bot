const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");
const AutoRole = require('../../models/AutoRole')

module.exports = {
  name: "autorole-configure",
  description: "configure your auto-role for this server.",
  options: [
    {
      name: "target-role",
      description: "the role users get on join.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    const targetRoleId = interaction.options.get("target-role").value;

    try {
      await interaction.deferReply();
      let autoRole = await AutoRole.findOne({ guidId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          interaction.editReply(
            "auto role has already been configured for that role. to disable run /autorole-disable"
          );
          return;
        }
        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      await autoRole.save();
      interaction.editReply(
        "Autorole has now been configured. To disable run /autorole-disable."
      );
    } catch (error) {
      console.log(`Error with /autorole-configure: ${error}`);
    }
  },
};