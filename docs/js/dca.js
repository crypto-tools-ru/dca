async function calculateDca(symbol, start, end, budget, sellProfit, buyFall, margin, direction) {
    const calculateProfit = direction === "Long"
        ? (end, start) => (end - start) / start
        : (end, start) => (start - end) / start

    const results = []

    const candles = await getCandles(symbol, "D", start, end)

    for (let i = candles.length - 1; i >= 0; i--) {
        const candle = candles[i]

        if (!results.length) {
            results.push(add(candle, 0, 0, budget, calculateProfit))
            continue
        }

        const lastResult = results[results.length - 1]
        if (!lastResult.money) {
            results.push(add(candle, 0, 0, budget, calculateProfit))
            continue
        }

        const profit = calculateProfit(candle.close, lastResult.avgPrice) * 100

        if (profit > sellProfit) {
            results.push(close(candle, lastResult, calculateProfit))
            continue
        }

        if (profit < buyFall) {
            results.push(add(candle, lastResult.money, lastResult.coins, budget, calculateProfit))
            continue
        }

        results.push(notAdd(candle, lastResult, calculateProfit))
    }

    const total = getDcaTotal(results, budget, margin)

    return { results, total }
}

function getDcaTotal(results, budget, margin) {
    const profit = round(sum(results, x => x.profit))
    const maxFall = round(min(results, x => x.fall))
    const maxBudgetsCount = round(max(results, x => x.money) / budget)
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

function add(candle, lastMoney, lastCoins, budget, calculateProfit) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastMoney + budget
    const coins = lastCoins + budget / price
    const avgPrice = round(money / coins)
    const fall = round(calculateProfit(price, avgPrice) * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function notAdd(candle, lastResult, calculateProfit) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = lastResult.money
    const coins = lastResult.coins
    const avgPrice = lastResult.avgPrice
    const fall = round(calculateProfit(price, avgPrice) * 100)
    const profit = 0

    return { date, price, money, coins, avgPrice, fall, profit }
}

function close(candle, lastResult, calculateProfit) {
    const date = formatDate(candle.date)
    const price = candle.close
    const money = 0
    const coins = 0
    const avgPrice = 0
    const fall = 0
    const profit = round(calculateProfit(price, lastResult.avgPrice) * lastResult.money)

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