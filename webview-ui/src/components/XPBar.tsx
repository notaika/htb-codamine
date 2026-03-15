interface XPBarProps {
    xp: number
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

function xpForLevel(level: number): number {
  if (level <= 0) return 100
  return 100 * (1.15 ** level) + xpForLevel(level - 1)
}

function getProgress(totalXP: number): ProgressResult {

    let currentLevel = 1

    while (totalXP >= xpForLevel(currentLevel)) {
    currentLevel++
  }
    currentLevel--
    
    const currentLevelXP = Math.round(xpForLevel(currentLevel))
    const nextLevelXP = Math.round(xpForLevel(currentLevel + 1))
    const xpIntoLevel = totalXP - currentLevelXP
    const xpNeededForLevel = nextLevelXP - currentLevelXP
    const percentage = Math.min((xpIntoLevel / xpNeededForLevel) * 100, 100)
    const showPercentage = percentage.toFixed(1)
    const xpRemaining = Math.round(nextLevelXP - totalXP)
    
    return {
        currentLevel,
        nextLevel: currentLevel + 1,
        percentage,
        showPercentage,
        xpRemaining,
        totalXP,
        nextLevelXP
  }

}

export default function XPBar({xp}: XPBarProps){
    const{
        currentLevel,
        nextLevel,
        showPercentage,
        xpRemaining,
        totalXP,
        nextLevelXP
    } = getProgress(xp)

    return(
        <div>
            <p>Level: {currentLevel}</p>
            <p>Next Level: {nextLevel}</p>
            <p>Percent: {showPercentage}%</p>
            <p>EXP: {totalXP} / {nextLevelXP}</p>
            <p>Remaining: {xpRemaining}</p>

        </div>
    )
}


