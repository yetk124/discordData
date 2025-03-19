const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('병영수첩')
        .setDescription('서든어택 병영수첩에서 닉네임과 킬뎃 정보를 가져옵니다.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('조회할 서든어택 ID를 입력하세요.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.options.getString('id');

        await interaction.reply(`🔍 **${userId}**의 병영수첩을 조회 중입니다...`);

        // ✅ Python 스크립트 실행 (Selenium 사용)
        exec(`python get_sudden_attack_stats.py ${userId}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ 오류 발생: ${error.message}`);
                await interaction.followUp('❌ 병영수첩 데이터를 가져오는 중 오류가 발생했습니다.');
                return;
            }

            try {
                const data = JSON.parse(stdout);

                if (data.error) {
                    await interaction.followUp(`❌ 오류 발생: ${data.error}`);
                    return;
                }

                // ✅ Embed 메시지 생성
                const embed = new EmbedBuilder()
                    .setTitle(`🔎 ${data.닉네임}님의 병영수첩`)
                    .setURL(data.병영수첩_링크)
                    .setColor(0x0099FF)
                    .addFields(
                        { name: '🔹 닉네임', value: data.닉네임, inline: false },
                        { name: '🎯 전체 킬뎃', value: data.전체_킬뎃, inline: true },
                        { name: '🔫 라플 킬뎃', value: data.라플_킬뎃, inline: true },
                        { name: '🎯 스나 킬뎃', value: data.스나_킬뎃, inline: true }
                    )
                    .setFooter({ text: '서든어택 병영수첩 정보' });

                await interaction.followUp({ embeds: [embed] });

            } catch (parseError) {
                console.error(`❌ JSON 파싱 오류: ${parseError.message}`);
                await interaction.followUp('❌ 병영수첩 데이터를 처리하는 중 오류가 발생했습니다.');
            }
        });
    }
};
