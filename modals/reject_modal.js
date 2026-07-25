const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customId: "reject_modal",

    async execute(interaction) {
        console.log("❌ Отказ с причиной");

        try {
            const userId = interaction.customId.replace("reject_modal_", "");
            console.log(`📝 userId: ${userId}`);
            
            const reason = interaction.fields.getTextInputValue("reason");
            const member = await interaction.guild.members.fetch(userId);

            console.log(`📝 Отказ для: ${member.user.tag}`);

            const oldEmbed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(0xFF0000)
                .setDescription(`**Статус:** ❌ Отказано`)
                .addFields(
                    { name: "Отказал", value: interaction.user.tag, inline: true },
                    { name: "Причина", value: reason, inline: false },
                    { name: "Время", value: new Date().toLocaleString(), inline: true }
                );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`accept_${userId}_${Date.now()}`)
                    .setLabel("✅ Принять")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`obzvon_${userId}_${Date.now()}`)
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`disabled_reject_${Date.now()}`)
                    .setLabel("❌ Отказан")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`close_${userId}_${Date.now()}`)
                    .setLabel("🔒 Закрыть тикет")
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.message.edit({
                embeds: [newEmbed],
                components: [row]
            });

            await interaction.channel.setName(`❌-${member.user.username}`);

            await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle("❌ ЗАЯВКА ОТКЛОНЕНА")
                        .setDescription(`Ваша заявка в **Unplugged** была отклонена.`)
                        .addFields(
                            { name: "Причина", value: reason, inline: false },
                            { name: "Отказал", value: interaction.user.tag, inline: true }
                        )
                        .setFooter({ text: "Unplugged" })
                        .setTimestamp()
                ]
            }).catch(() => console.log("Не удалось отправить ЛС"));

            await interaction.reply({
                content: `❌ Заявка отклонена.`,
                ephemeral: true
            });

        } catch (error) {
            console.error("❌ ОШИБКА:", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: `❌ Ошибка: ${error.message}`,
                    ephemeral: true
                });
            }
        }
    }
};