const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    customId: "close",

    async execute(interaction) {
        console.log("🔒 Закрытие тикета");

        try {
            // БЕРЕМ ID ИЗ КНОПКИ (он всегда 2-й после "close")
            const userId = interaction.customId.split("_")[1];
            console.log(`📝 ID пользователя: ${userId}`);
            
            const modal = new ModalBuilder()
                .setCustomId(`close_modal_${userId}`) // ← ПРОСТО! БЕЗ _${Date.now()}!
                .setTitle("🔒 Закрытие тикета");

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Причина закрытия")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Напишите причину закрытия тикета...")
                .setRequired(true)
                .setMaxLength(500);

            const confirm = new TextInputBuilder()
                .setCustomId("confirm")
                .setLabel("Подтверждение")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Напишите 'ДА' для подтверждения")
                .setRequired(true)
                .setMaxLength(3);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reason),
                new ActionRowBuilder().addComponents(confirm)
            );

            await interaction.showModal(modal);

        } catch (error) {
            console.error("❌ Ошибка:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};