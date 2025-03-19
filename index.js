const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { exec } = require('child_process');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// 봇이 준비됐을 때 실행
client.once(Events.ClientReady, readyClient => {
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

// 🔹 명령어 핸들러 객체 (각 명령어를 개별 함수로 관리)
const commandHandlers = {
    ping: async (interaction) => {
        await interaction.reply('🏓 Pong!');
    },

    청소: async (interaction) => {
        const count = interaction.options.getInteger('count');

        if (count < 1 || count > 100) {
            await interaction.reply({ content: '⚠️ 1~100개 사이의 메시지를 삭제할 수 있습니다.', ephemeral: true });
            return;
        }

        try {
            const messages = await interaction.channel.bulkDelete(count, true);
            await interaction.reply({ content: `🧹 **${messages.size}개**의 메시지를 삭제했습니다.`, ephemeral: false });
        } catch (error) {
            if (error.message.includes('under 14 days old')) {
                await interaction.reply({ content: '❌ 14일 이상 된 메시지는 삭제할 수 없습니다.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ 메시지를 삭제하는 동안 오류가 발생했습니다.', ephemeral: true });
            }
        }
    },
    병영수첩: async (interaction) => {
        const userId = interaction.options.getString('id');

        await interaction.reply(`🔍 **${userId}**의 병영수첩을 조회 중입니다...`);

        // ✅ Python 크롤링 스크립트 실행
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
                        { name: '🎯 전체 K/D', value: data["전체 K/D"], inline: true },
                        { name: '🔫 라플 K/D', value: data["라플 K/D"], inline: true },
                        { name: '🎯 스나 K/D', value: data["스나 K/D"], inline: true }
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

// 🔹 슬래시 명령어 실행 이벤트 (개별 함수 실행)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const handler = commandHandlers[interaction.commandName];
    if (handler) {
        await handler(interaction);
    } else {
        await interaction.reply({ content: '❌ 알 수 없는 명령어입니다.', ephemeral: true });
    }
});

// 🔹 봇 로그인 실행
client.login(token);
