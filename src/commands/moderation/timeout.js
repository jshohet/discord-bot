const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  Interaction,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description: "timeout a user",
  options: [
    {
      name: "target-user",
      description: "the user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "time duration (30m, 1h, 1 day)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "no reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }
    if (targetUser.user.bot) {
      await interaction.editReply("I can't timeout a bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("please provide a valid timeout duration.");
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or exceed 28 days."
      );
      return;
    }
    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "you can't timeout that user because they have the same/higher role than you."
      );
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "i can't timeout that user because they have the same or higher role than me"
      );
      return;
    }
    //timeout the target user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `User ${targetUser} was timed out extra for ${prettyMs(msDuration, {
            verbose: true,
          })}. \n Reason: ${reason}`
        );
        return;
      }
      console.log(msDuration)
      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `User ${targetUser} was timed out for ${prettyMs(msDuration, {
          verbose: true,
        })}. \n Reason: ${reason}`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
