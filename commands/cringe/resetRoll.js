const { SlashCommandBuilder, Collection, PermissionFlagsBits } = require("discord.js");
const rollCooldown = require("../../events/interactionCreate.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rollreset")
    .setDescription("Обнуляет таймер на кнопке ролла ролей у пользователя.")
    .addUserOption((option) =>
      option
        .setName("targetuser")
        .setDescription("Пользователь которому нужно обнулить таймер.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser("targetuser");
    if (rollCooldown.rollCooldown.has(user.id)) {
      await interaction.reply(
        `У пользователя ${user} есть КД на ROLL. КД был успешно удалён`
      );
      rollCooldown.rollCooldown.delete(user.id);
      await wait(60000);
      await interaction.deleteReply();
    } else {
      await interaction.reply(`У пользователя ${user} нету КД на ROLL`);
      await wait(60000);
      await interaction.deleteReply();
    }
  },
};
