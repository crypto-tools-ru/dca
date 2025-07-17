require("dotenv").config()

export interface Settings {
    strategy: string,

    symbols: string[],

    trackPriceStartDate: number,
    trackPriceIntervalHours: number,

    bybitApiKeyPublic: string,
    bybitApiKeyPrivate: string,
    tgBotToken: string,
    tgChatId: string,
}

function get(): Settings {
    return {
        strategy: process.env.strategy!,

        symbols: process.env.symbols!.split(","),

        trackPriceStartDate: Date.parse(process.env.trackPriceStartDate!),
        trackPriceIntervalHours: parseInt(process.env.trackPriceIntervalHours!),

        bybitApiKeyPublic: process.env.bybitApiKeyPublic!,
        bybitApiKeyPrivate: process.env.bybitApiKeyPrivate!,
        tgBotToken: process.env.tgBotToken!,
        tgChatId: process.env.tgChatId!,
    }
}

export const settings = {
    get,
}