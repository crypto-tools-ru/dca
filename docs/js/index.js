async function dca() {
    try {
        setAttribute("show-dca", "disabled", "")
        setStyle("dca-loader", "display", "block")

        await showDca()
    } catch (ex) {
        console.error(ex)
    }

    removeAttribute("show-dca", "disabled")
    setStyle("dca-loader", "display", "none")
}

async function showDca() {
    setHtml("dca-total", "")
    setHtml("dca-result", "")

    const settings = getSettings()

    const results = await calculateDca(
        settings.symbol,
        settings.startDate,
        settings.endDate,
        settings.budget,
        settings.sellProfit,
        settings.buyFall,
        settings.margin
    )

    showDcaTotal(results.total)
    showDcaResult(results.results)
}

function showDcaTotal(total) {
    let html = ""

    const getRow = (title, value, postfix) => {
        return `
        <div class="row">
            <div class="col-md-3">${title}</div>
            <div class="col-md-9"><b>${value}${postfix || ""}</b></div>
        </div>
    `
    }

    html += getRow("Профит", total.profit, "$")
    html += getRow("Максимальная просадка", total.maxFall, "%")
    html += getRow("Максимальное кол-во покупок", total.maxBudgetsCount)
    html += getRow("Ориентировочный бюджет", total.needTotalBudget, "$")
    html += getRow("ROI", total.percent, "%")

    setHtml("dca-total", html)
}

function showDcaResult(results) {
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Цена</th>
                    <th>Позиция</th>
                    <th>Количество</th>
                    <th>Средняя цена</th>
                    <th>Просадка</th>
                    <th>Прибыль</th>
                </tr>
            </thead>
            <tbody>
    `

    results.forEach(x => html += `
        <tr>
            <td>${x.date}</th>
            <td>${x.price}$</td>
            <td>${x.money}$</td>
            <td>${x.coins}</td>
            <td>${x.avgPrice}$</td>
            <td>${x.fall}%</td>
            <td>${x.profit}$</td>
        </tr>
    `)

    html += `
                </tbody>
            </table>
        `
    setHtml("dca-result", html)
}