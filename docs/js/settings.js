function getSettings() {
    return {
        symbol: document.getElementById("symbol").value + "USDT",
        startDate: Date.parse(document.getElementById("startDate").value),
        endDate: Date.parse(document.getElementById("endDate").value),
        budget: parseInt(document.getElementById("budget").value),
        sellProfit: parseInt(document.getElementById("sellProfit").value),
        buyFall: parseInt(document.getElementById("buyFall").value),
        margin: 4.6,
    }
}