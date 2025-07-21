import Enumerable from "linq"

async function work(action: () => Promise<void>, ...times: number[]) {
    if (!times.length) {
        await action()
        return
    }

    let lastTime = 0
    const getTime = (hour: number) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hour).getTime()

    setInterval(() => {
        const nextTime = Enumerable.from(times)
            .select(getTime)
            .where(x => x > lastTime)
            .orderBy(x => x)
            .firstOrDefault()

        if (!nextTime) {
            return
        }

        if (new Date().getTime() < nextTime) {
            return
        }

        console.log(new Date(), "Execute action", lastTime, nextTime)
        lastTime = nextTime
        action()
    }, 5 * 1000)
}

export const scheduler = {
    work,
}