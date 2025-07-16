//  *****
//  Long
//  *****

async function calculateDcaLong(symbol, start, end, budget, sellProfit, buyFall, margin) {
    const results = []

    const candles = await getCandles(symbol, "D", start, end)

    for (let i = candles.length - 1; i >= 0; i--) {
        const candle = candles[i]

        if (!results.length) {
            results.push(buyLong(candle, 0, 0, budget))
            continue
        }

        const lastResult = results[results.length - 1]
        if (!lastResult.money) {
            results.push(buyLong(candle, 0, 0, budget))
            continue
        }

        const profit = (candle.close - lastResult.avgPrice) / lastResult.avgPrice * 100

        if (profit > sellProfit) {
            results.push(sellLong(candle, lastResult))
            continue
        }

        if (profit < buyFall) {
            results.push(buyLong(candle, lastResult.money, lastResult.coins, budget))
            continue
        }

        results.push(notBuyLong(candle, lastResult))
    }

    const total = getDcaTotalLong(results, budget, margin)

    return { results, total }
}

function getDcaTotalLong(results, budget, margin) {
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

function buyLong(candle, lastMoney, lastCoins, budget) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastMoney + budget
    const coins = lastCoins + budget / price
    const avgPrice = round(money / coins)
    const fall = round((price - avgPrice) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function notBuyLong(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastResult.money
    const coins = lastResult.coins
    const avgPrice = lastResult.avgPrice
    const fall = round((price - avgPrice) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function sellLong(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = 0
    const coins = 0
    const avgPrice = 0
    const fall = 0
    const profit = round((price - lastResult.avgPrice) / lastResult.avgPrice * lastResult.money)

    return { date, price, money, coins, avgPrice, fall, profit }
}

//  *****
//  Short
//  *****

async function calculateDcaShort(symbol, start, end, budget, sellProfit, buyFall, margin) {
    const results = []

    const candles = await getCandles(symbol, "D", start, end)

    for (let i = candles.length - 1; i >= 0; i--) {
        const candle = candles[i]

        if (!results.length) {
            results.push(buyShort(candle, 0, 0, budget))
            continue
        }

        const lastResult = results[results.length - 1]
        if (!lastResult.money) {
            results.push(buyShort(candle, 0, 0, budget))
            continue
        }

        const profit = (lastResult.avgPrice - candle.close) / lastResult.avgPrice * 100

        if (profit > sellProfit) {
            results.push(sellShort(candle, lastResult))
            continue
        }

        if (profit < buyFall) {
            results.push(buyShort(candle, lastResult.money, lastResult.coins, budget))
            continue
        }

        results.push(notBuyShort(candle, lastResult))
    }

    const total = getDcaTotalShort(results, budget, margin)

    return { results, total }
}

function getDcaTotalShort(results, budget, margin) {
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

function buyShort(candle, lastMoney, lastCoins, budget) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastMoney + budget
    const coins = lastCoins + budget / price
    const avgPrice = round(money / coins)
    const fall = round((avgPrice - price) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function notBuyShort(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastResult.money
    const coins = lastResult.coins
    const avgPrice = lastResult.avgPrice
    const fall = round((avgPrice - price) / avgPrice * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function sellShort(candle, lastResult) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = 0
    const coins = 0
    const avgPrice = 0
    const fall = 0
    const profit = round((lastResult.avgPrice - price) / lastResult.avgPrice * lastResult.money)

    return { date, price, money, coins, avgPrice, fall, profit }
}

//  *****
//  Common
//  *****

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