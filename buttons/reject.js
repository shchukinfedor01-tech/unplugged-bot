const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    customId: "reject",

    async execute(interaction) {
        console.log("❌ Кнопка Отказать нажата");

        try {
            const userId = interaction.customId.split("_")[1];

            if (!userId) {
                return await interaction.reply({
                    content: "❌ Ошибка: не найден ID пользователя",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId(`reject_modal_${userId}`)
                .setTitle("❌ Причина отказа");

            const reasonInput = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Укажите причину отказа")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Напишите причину...")
                .setRequired(true)
                .setMaxLength(500);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reasonInput)
            );

            await interaction.showModal(modal);

        } catch (error) {
            console.error("❌ Ошибка в reject.js:", error);
            await interaction.reply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
