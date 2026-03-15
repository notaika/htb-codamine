import "./XPBar.css";

interface XPBarProps {
    xp: number
}


interface ProgressResult {
    currentLevel: number
    nextLevel: number
    percentage: number
    xpRemaining: number
    totalXP: number
    nextLevelXP: number
}

function xpForLevel(level: number): number {
  if (level <= 0) return 100;
  return 100 * (1.15 ** level) + xpForLevel(level - 1)
}

function getProgress(totalXP: number): ProgressResult {

    let currentLevel = 0

    while (totalXP >= Math.round(xpForLevel(currentLevel + 1))) {
    currentLevel++
  }
    
    const currentLevelXP = currentLevel === 0 ? 0 : Math.round(xpForLevel(currentLevel))
    const nextLevelXP = Math.round(xpForLevel(currentLevel + 1))
    const xpIntoLevel = totalXP - currentLevelXP
    const xpNeededForLevel = nextLevelXP - currentLevelXP
    const percentage = Math.min((xpIntoLevel / xpNeededForLevel) * 100, 100)
    const xpRemaining = Math.round(nextLevelXP - totalXP)
    
    return {
        currentLevel: currentLevel + 1,
        nextLevel: currentLevel + 2,
        percentage,
        xpRemaining,
        totalXP: Math.round(totalXP),
        nextLevelXP
  }

}

export default function XPBar({xp}: XPBarProps){
    const{
        currentLevel ,
        nextLevel,
        percentage,
        xpRemaining,
        totalXP,
        nextLevelXP
    } = getProgress(xp)

    return(
        <div>
            <p>Level: {currentLevel}</p>
            <p>Next Level: {nextLevel}</p>
            <p>Percent: {Math.floor(percentage)}%</p>
            <p>EXP: {Math.round(totalXP)} / {nextLevelXP}</p>
            <p>Remaining: {xpRemaining}</p>
            <div className="progressContainer">
                <div className="progress" style={{width: `${Math.floor(percentage)}%`}}>
                    <span className="progressLabel">{Math.floor(percentage)}%</span>
                </div>
            </div>
        </div>
    )
}


