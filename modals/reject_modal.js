const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customId: "reject_modal",

    async execute(interaction) {
        console.log("📝 Модалка отказа");

        try {
            const userId = interaction.customId.split("_")[1];
            const reason = interaction.fields.getTextInputValue("reason");

            if (!userId) {
                return await interaction.reply({
                    content: "❌ Ошибка: ID не найден",
                    ephemeral: true
                });
            }

            const member = await interaction.guild.members.fetch(userId);

            await interaction.reply({
                content: `❌ Заявка отклонена. Причина: ${reason}`,
                ephemeral: true
            });

            const oldEmbed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(0xFF0000)
                .setDescription(`**Статус:** ❌ Отказано`)
                .addFields(
                    { name: "Отказал", value: interaction.user.tag, inline: true },
                    { name: "Причина", value: reason, inline: false },
                    { name: "Время", value: new Date().toLocaleString(), inline: true }
                );

            const disabledRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("disabled")
                    .setLabel("✅ Принять")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("disabled")
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("disabled")
                    .setLabel("❌ Отказан")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("disabled")
                    .setLabel("🔒 Закрыть")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            await interaction.message.edit({
                embeds: [newEmbed],
                components: [disabledRow]
            });

            await interaction.channel.setName(`❌-${member.user.username}`);

            // ЛС с причиной
            try {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle("❌ ЗАЯВКА ОТКЛОНЕНА")
                            .setDescription(`Ваша заявка в **Unplugged** отклонена.`)
                            .addFields(
                                { name: "Причина", value: reason },
                                { name: "Отказал", value: interaction.user.tag }
                            )
                            .setTimestamp()
                    ]
                });
            } catch (err) {
                console.log("❌ ЛС не отправлено:", err.message);
            }

            // Удаляем тикет через 30 секунд
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                    console.log("🗑️ Тикет удалён");
                } catch (e) {
                    console.error("❌ Ошибка удаления:", e);
                }
            }, 30000);

        } catch (error) {
            console.error("❌ Ошибка в reject_modal.js:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
