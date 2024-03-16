const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "bans a member!!!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "the user to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "the reason for ban",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || "no reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if(!targetUser){
      await interaction.editReply("that user doesn't exist in this server.");
      return;
    }

    if(targetUser.id === interaction.guild.ownerId){
      await interaction.editReply("you can't ban the server owner");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if(targetUserRolePosition >= requestUserRolePosition){
      await interaction.editReply("you can't ban that user because they have the same/higher role than you.");
      return;
    }
    if(targetUserRolePosition >= botRolePosition){
      await interaction.editReply("i can't ban that user because they are the bot");
      return;
    }
    //ban the target user
    try {
      await targetUser.ban({reason});
      await interaction.editReply(
        `User ${targetUser} was banned. \n Reason: ${reason}`
      );
    } catch (error) {
      console.log(error)
    }
  },
};
