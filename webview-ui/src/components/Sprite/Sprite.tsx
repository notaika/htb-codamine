Aimport "./Sprite.css";
import { useState, useEffect } from 'react';

export default function Sprite({ spriteType } : { spriteType : string}) {

  const [sprite, setSprite] = useState(spriteType);

  function handleSpriteClick() {
    setSprite()
  }
  
  useEffect(() => {
    const elementSprite = document.getElementById("sprite");

    elementSprite.addEventListener("click", (event) => {
      event.target.getAttribute("data-sprite-name")
    });
  });

  return (
    // <div className="{sprite}"></div>
    <div className="mushroom-idle-animation" id="sprite" data-sprite-name={spriteType}></div>
  );
}