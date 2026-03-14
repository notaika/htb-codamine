interface XPBarProps {
    xp: number
    level: number
}

const LEVELS = [
    {level: 1, xpRequired: 0},
    {level: 2, xpRequired: 100},
    {level: 3, xpRequired: 1000},
    {level: 4, xpRequired: 10000},
    {level: 5, xpRequired: 100000},
]

function progress(totalXP: number) {
    
}


export default function XPBar({xp, level}: XPBarProps){

    return (
        <p>{xp}</p>
    )

    
};