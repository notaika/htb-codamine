import "./XPBar.css";

//Props: recieves raw  XP from APP.tsx
interface XPBarProps {
  xp: number;
}

//Shape of values returned to getProcess (basically promises that these will be called when calling getProcess)
interface ProgressResult {
  currentLevel: number;
  nextLevel: number;
  percentage: number;
  xpRemaining: number;
  totalXP: number;
  nextLevelXP: number;
}


// Receives xp from App.tsx which gets it from extension.ts via postMessage
export default function XPBar({ xp }: XPBarProps) {
  const {
    currentLevel,
    nextLevel,
    percentage,
    xpRemaining,
    totalXP,
    nextLevelXP,
  } = getProgress(xp); // destructure all values from getProgress


  return (
    <div>
      <div className="progressArea">
        <div className="progressInfo">
          <span>Level: {currentLevel}</span> <span>Next: {nextLevel}</span>
        </div>
        <div className="progressContainer" title={`Remaining: ${xpRemaining}`}>
          <div className="progress" style={{width: `${Math.floor(percentage)}%`}}>
          </div>
          <span className="progressLabel">{Math.floor(percentage)}%</span>
        </div>
        <div className="progressInfo">
          <span>EXP: {Math.round(totalXP)} / {nextLevelXP}</span>
        </div>
      </div>
    </div>
  );
}



// Calculates the TOTAL cumulative XP needed to reach a given level
// Recursive function that adds 15% more cost per level

function xpForLevel(level: number): number {
  if (level <= 0) return 100; // base case — stops recursion, every level starts with 100 XP floor
  return 100 * 1.15 ** level + xpForLevel(level - 1); // this level's cost + all previous levels
}

// Gets total xp gained currently and uses the data to parse when needed

function getProgress(totalXP: number): ProgressResult {
  let currentLevel = 0;


  /*
    Keep incrementing level as long as XP meets the next level threshold
    Checks currentLevel + 1 so it never overshoots
    Stops when you don't have enough XP for the next level
  */
  while (totalXP >= Math.round(xpForLevel(currentLevel + 1))) {
    currentLevel++;
  }


 /* find current level based on total xp gained and checks if it meets the next level threshold 
    Level 1 (internal 0) always starts at 0 XP — no XP needed to be level 1
    Higher levels start at their threshold from xpForLevel
    Math.round removes ugly decimals from the recursive formula
   */
  const currentLevelXP =
    currentLevel === 0 ? 0 : Math.round(xpForLevel(currentLevel));

  // XP threshold needed to get to next level 
  const nextLevelXP = Math.round(xpForLevel(currentLevel + 1));

  // Gives how far into the current level 
  const xpIntoLevel = totalXP - currentLevelXP;

  // Gives total XP needed for next level
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  // Shows percentage till next level (0-100)
  const percentage = Math.min((xpIntoLevel / xpNeededForLevel) * 100, 100);

  // XP left until next level 
  const xpRemaining = Math.round(nextLevelXP - totalXP);



  return {
    currentLevel: currentLevel + 1, //internally will be 0, but will be displayed as level 1 to the user 
    nextLevel: currentLevel + 2,
    percentage,
    xpRemaining,
    totalXP: Math.round(totalXP), //remove decimals for total xp gained as it updates 
    nextLevelXP,
  };
}
