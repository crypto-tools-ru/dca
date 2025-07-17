import Enumerable from "linq";
import { bybit } from "./bybit";
import { linq } from "./linq";

interface Profit {
    symbol: string,
    profit: number,
}

interface Profits {
    profits: Profit[],
    profit: number,
}

const moneys = new Map<string, number>([["BTCUSDT", 2 * 230]])

async function calculateProfits(symbols: string[], start: number): Promise<Profits> {
    console.log(new Date(), "Start calculate profits")

    const assets = await bybit.getAssets()
    let profits: Profit[] = []

    await linq.forEach(symbols, async symbol => {
        const coins = assets.find(x => x.symbol === symbol)!.size
        const money = moneys.get(symbol)!
        const price = await bybit.getPrice(symbol)
        
        const avgPrice = money / coins
        const profit = round((price - avgPrice) / avgPrice * 100)

        profits.push({ symbol, profit })
    })

    profits = Enumerable.from(profits).orderByDescending(x => x.profit).toArray()
    const profit = round(Enumerable.from(profits).average(x => x.profit))

    return { profits, profit }
}

function round(value: number): number {
    return parseFloat(value.toFixed(2))
}

export const pricesCalculator = {
    calculateProfits,
}