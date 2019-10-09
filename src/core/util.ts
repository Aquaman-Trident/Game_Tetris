export function getRandom(min:number, max:number){
    const dis = max - min;
    return Math.floor(Math.random() * dis + min);
}