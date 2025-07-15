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
    setHtml("dca-result", "")

    const settings = getSettings()

    const results = await calculateDca(
        settings.symbol,
        settings.startDate,
        settings.endDate,
        settings.budget,
        settings.sellProfit,
        settings.buyFall
    )

    console.table(results)
    showDcaResult(results)
}

function showDcaResult(results, profit) {
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

    html += `
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>${sum(results, x => x.profit).toFixed(2)}$</td>
        </tr>
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