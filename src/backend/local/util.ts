export function sleep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, 2000);
    })
}