import Enumerable from "linq"

async function work(action: () => Promise<void>, ...times: number[]) {
    if (!times.length) {
        await action()
        return
    }

    let lastTime = 0
    const getTime = (hour: number) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hour).getTime()

    const check = async () => {
        {
            const nextTime = Enumerable.from(times)
                .select(getTime)
                .where(x => x > lastTime)
                .orderBy(x => x)
                .firstOrDefault()

            if (!nextTime) {
                console.log(new Date(), "Not found time to work", lastTime, Enumerable.from(times).select(getTime).toArray())
                return
            }

            if (new Date().getTime() < nextTime) {
                console.log(new Date(), "Time is not for work", new Date().getTime(), lastTime, Enumerable.from(times).select(getTime).toArray())
                return
            }

            console.log(new Date(), "Execute action", lastTime, nextTime)
            lastTime = nextTime
            await action()
        }
    }

    setInterval(() => check(), 5 * 60 * 1000)
    await check()
}

export const scheduler = {
    work,
}