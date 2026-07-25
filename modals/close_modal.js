const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customId: "close_modal",

    async execute(interaction) {
        console.log("🔒 Тикет закрывается");
        console.log(`📝 customId: ${interaction.customId}`);

        try {
            // ID ПОЛЬЗОВАТЕЛЯ - ЭТО ВСЁ, ЧТО ПОСЛЕ "close_modal_"
            const userId = interaction.customId.replace("close_modal_", "");
            console.log(`📝 userId: ${userId}`);
            
            const reason = interaction.fields.getTextInputValue("reason");
            const confirm = interaction.fields.getTextInputValue("confirm");

            if (confirm.toUpperCase() !== "ДА") {
                return await interaction.reply({
                    content: "❌ Вы не подтвердили закрытие. Напишите 'ДА' в поле подтверждения.",
                    ephemeral: true
                });
            }

            const member = await interaction.guild.members.fetch(userId);
            console.log(`📝 Закрывает: ${member.user.tag}`);

            // ОСТАЛЬНОЙ КОД...
            const oldEmbed = interaction.message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(0xFF9900)
                .setDescription(`**Статус:** 🔒 Закрыт`)
                .addFields(
                    { name: "Закрыл", value: interaction.user.tag, inline: true },
                    { name: "Причина", value: reason, inline: false },
                    { name: "Время", value: new Date().toLocaleString(), inline: true }
                );

            const disabledRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`disabled_1_${Date.now()}`)
                    .setLabel("✅ Принять")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`disabled_2_${Date.now()}`)
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`disabled_3_${Date.now()}`)
                    .setLabel("❌ Отказать")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`disabled_4_${Date.now()}`)
                    .setLabel("🔒 Закрыто")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            await interaction.message.edit({
                embeds: [newEmbed],
                components: [disabledRow]
            });

            await interaction.channel.setName(`🔒-${member.user.username}`);

            await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle("🔒 ТИКЕТ ЗАКРЫТ")
                        .setDescription(`Ваш тикет в **Unplugged** был закрыт.`)
                        .addFields(
                            { name: "Причина", value: reason, inline: false },
                            { name: "Закрыл", value: interaction.user.tag, inline: true }
                        )
                        .setFooter({ text: "Unplugged" })
                        .setTimestamp()
                ]
            }).catch(() => console.log("❌ Не удалось отправить ЛС"));

            await interaction.reply({
                content: `🔒 Тикет закрыт. Канал будет удалён через 10 секунд...`,
                ephemeral: true
            });

            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                    console.log(`🗑️ Тикет удалён`);
                } catch (error) {
                    console.error("❌ Ошибка удаления:", error);
                }
            }, 10000);

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