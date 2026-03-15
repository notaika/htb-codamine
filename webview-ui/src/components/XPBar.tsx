interface XPBarProps {
    xp: number
    level: number
}


interface ProgressResult {
    currentLevel: number
    nextLevel: number
    percentage: number
    showPercentage: string
    xpRemaining: number
    totalXP: number
    nextLevelXP: number
}

const LEVELS = [
    {level: 1, xpRequired: 0},   
    {level: 2, xpRequired: 100},
    {level: 3, xpRequired: 500},
    {level: 4, xpRequired: 1000},
    {level: 5, xpRequired: 1500},
]

function getProgress(totalXP: number) ProgressResult {

    const currentLevel = LEVELS.findLast(lvl => totalXP >= lvl.xpRequired) ?? LEVELS[0]
    const nextLevel = LEVELS.find(lvl => totalXP < lvl.xpRequired) ?? LEVELS[LEVELS.length - 1]
    const percentage = Math.min((totalXP / nextLevel.xpRequired) * 100, 100)
    const showPercentage = percentage.toFixed(1)
    const xpRemaining = nextLevel.xpRequired - totalXP
    
    return {
    currentLevel: currentLevel.level,
    nextLevel: nextLevel.level,
    percentage,
    showPercentage,
    xpRemaining,
    totalXP,
    nextLevelXP: nextLevel.xpRequired
  }

    
}




