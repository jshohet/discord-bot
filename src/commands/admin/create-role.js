const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "create-role",
  description: "create a new role.",
  options: [
    {
      name: "role-name",
      description: "the name of the role",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "role-color",
      description: "the color of this role",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "role-permissions",
      description: "the permissions of the role [int]",
      type: ApplicationCommandOptionType.String,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    await interaction.deferReply();

    const roleName = interaction.options.get("role-name").value;
    const roleColor = interaction.options.get("role-color")?.value || "#FFFFFF";
    // const rolePermissions = interaction.options.get("role-permissions")?.value || "0n";

    if (!roleColor.startsWith("#")) {
      interaction.editReply(`${roleColor} is an invalid hex code.`);
      return;
    }   

    try {
      interaction.guild.roles.create({
        name: roleName,
        color: roleColor,
        // permissions: bigint1,
      });
    } catch (error) {
      console.log(error);
    }

    await interaction.editReply(
      `${roleName} role was created with color ${roleColor} and no permissions.`
    );
  },
};
