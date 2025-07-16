async function calculateDca(symbol, start, end, budget, sellProfit, buyFall, margin) {
    const results = []

    const candles = await getCandles(symbol, "D", start, end)

    for (let i = candles.length - 1; i >= 0; i--) {
        const candle = candles[i]

        if (!results.length) {
            results.push(buy(candle, 0, 0, budget))
            continue
        }

        const lastResult = results[results.length - 1]
        if (!lastResult.money) {
            results.push(buy(candle, 0, 0, budget))
            continue
        }

        const profit = (candle.close - lastResult.avgPrice) / lastResult.avgPrice * 100

        if (profit > sellProfit) {
            results.push(sell(candle, lastResult))
            continue
        }

        if (profit < buyFall) {
            results.push(buy(candle, lastResult.money, lastResult.coins, budget))
            continue
        }

        results.push(notBuy(candle, lastResult))
    }

    const total = getTotal(results, budget, margin)

    return { results, total }
}

function getTotal(results, budget, margin) {
    const profit = round(sum(results, x => x.profit))
    const maxFall = round(min(results, x => x.fall)) 
    const maxBudgetsCount =  round(max(results, x => x.money) / budget)
    const needTotalBudget = round(max(results, x => x.money) / margin)
    const percent = round((profit / needTotalBudget) * 100)

    return {
        profit,
        maxFall,
        maxBudgetsCount,
        needTotalBudget,
        percent,
    }
}

function buy(candle, lastMoney, lastCoins, budget) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastMoney + budget
    const coins = lastCoins + budget / price
    const avgPrice = round(money / coins)
    const fall = round((price - avgPrice) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function notBuy(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastResult.money
    const coins = lastResult.coins
    const avgPrice = lastResult.avgPrice
    const fall = round((price - avgPrice) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function sell(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = 0
    const coins = 0
    const avgPrice = 0
    const fall = 0
    const profit = round((price - lastResult.avgPrice) / lastResult.avgPrice * lastResult.money)

    return { date, price, money, coins, avgPrice, fall, profit }
}

function formatDate(time) {
    const date = new Date(time)
    const format = (value) => {
        return value < 10 ? `0${value}` : value.toString()
    }

    return `${format(date.getFullYear())}-${format(date.getMonth() + 1)}-${format(date.getDate())}`
}

function round(value, digits = 2) {
    return parseFloat(value.toFixed(digits))
}