const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "yeet",
  description: "kick a member!!!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "the user to kick",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "the reason for kick",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.Kick],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "no reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("that user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("you can't kick the server owner");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "you can't kick that user because they have the same/higher role than you."
      );
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "i can't kick that user because they have the same or higher role than me"
      );
      return;
    }
    //kick the target user
    try {
      await targetUser.kick({ reason });
      await interaction.editReply(
        `User ${targetUser} was kicked. \n Reason: ${reason}`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
