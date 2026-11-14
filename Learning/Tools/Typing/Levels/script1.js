
function ensureTypingStyle() {
  if (document.getElementById("typingFeedbackStyle")) return;
  const s = document.createElement("style");
  s.id = "typingFeedbackStyle";
  s.textContent = ".key-target{outline:3px solid #6222CC; background:#ffe066 !important;} .key-wrong{background:#e57373 !important;} #gameBanner{margin:10px 0;padding:10px 12px;border-radius:8px;background:#eef3ff;color:#222;font-weight:700;max-width:520px;white-space:pre-line;}";
  document.head.appendChild(s);
}

function bannerForWords(wordList) {
  const letters = [];
  const seen = {};
  (wordList || []).forEach(function (w) {
    String(w).toUpperCase().replace(/[^A-Z]/g, "").split("").forEach(function (ch) {
      if (!seen[ch]) { seen[ch] = true; letters.push(ch); }
    });
  });
  const leftSet = "QWERTASDFGZXCV";
  const left = letters.filter(function (ch) { return leftSet.indexOf(ch) !== -1; });
  const right = letters.filter(function (ch) { return leftSet.indexOf(ch) === -1; });
  function listKeys(arr) {
    if (arr.length === 1) return "the " + arr[0] + " key";
    if (arr.length === 2) return "the " + arr[0] + " and " + arr[1] + " keys";
    return "the " + arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1] + " keys";
  }
  let first;
  if (letters.length === 2 && left.length === 1 && right.length === 1) {
    first = "Keep your left finger on the " + left[0] + " key \n Keep your right finger on the " + right[0] + " key";
  } else if (letters.length > 0 && letters.length <= 4) {
    first = "Keep your fingers on " + listKeys(letters);
  } else if (letters.length > 4) {
    first = "Type the words on the screen using " + listKeys(letters);
  } else {
    first = "Keep your fingers on the home row";
  }
  return first + " \n Try and keep your eyes on the screen \n Type as many words as you can";
}
function showBanner(msg) {
  ensureTypingStyle();
  let el = document.getElementById("gameBanner");
  if (!el) {
    el = document.createElement("div");
    el.id = "gameBanner";
    el.setAttribute("role", "status");
    const box = document.getElementById("gamebox");
    if (box && box.parentNode) box.parentNode.insertBefore(el, box);
    else document.body.insertBefore(el, document.body.firstChild);
  }
  el.textContent = msg || "";
}
function clearKeyHighlights() {
  document.querySelectorAll(".key-target,.key-wrong").forEach(function (el) {
    el.classList.remove("key-target", "key-wrong");
  });
}
function highlightTarget() {
  ensureTypingStyle();
  document.querySelectorAll(".key-target").forEach(el => el.classList.remove("key-target"));
  if (typeof gameON !== "undefined" && gameON >= 2) return;
  if (!wordSplit || !wordSplit[i]) return;
  const id = String(wordSplit[i].toUpperCase().charCodeAt(0) - 64);
  const el = document.getElementById(id);
  if (el) el.classList.add("key-target");
}
function flashWrong(id) {
  const el = document.getElementById(String(id));
  if (!el) return;
  el.classList.add("key-wrong");
  setTimeout(() => el.classList.remove("key-wrong"), 250);
}


let letter = "";
let code = 0;
const word = ["HOOK", "LUCK", "COOK", "TOOL","SOUP","TILT","WALL","HOPE","LATE","RACE","RICE","WALK","TALK","BONE","HOME"];
let word1 = "";
let wordSplit = [];
let keyPress = 0;
let compare = 0;
let i = 0;
let points = 0;
let gameON = 0;

//console.log(gameON);
//if (gameON < 1){
document.addEventListener('keyup', function(event) {
  
    switch(event.key) {
      

      case 'a':
        document.getElementById("1").style.backgroundColor = "#f0f0f0"; // Change color to a different shade
        break;
      case 'b':
        document.getElementById("2").style.backgroundColor = "#f0f0f0"; // Change color to another shade
        break;
      case 'c':
        document.getElementById("3").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'd':
        document.getElementById("4").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'e':
        document.getElementById("5").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'f':
        document.getElementById("6").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'g':
        document.getElementById("7").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'h':
        document.getElementById("8").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'i':
        document.getElementById("9").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'j':
        document.getElementById("10").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'k':
        document.getElementById("11").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'l':
        document.getElementById("12").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'm':
        document.getElementById("13").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'n':
        document.getElementById("14").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'o':
        document.getElementById("15").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'p':
        document.getElementById("16").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'q':
        document.getElementById("17").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'r':
        document.getElementById("18").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 's':
        document.getElementById("19").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 't':
        document.getElementById("20").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'u':
        document.getElementById("21").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'v':
        document.getElementById("22").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'w':
        document.getElementById("23").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'x':
        document.getElementById("24").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'y':
        document.getElementById("25").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      case 'z':
        document.getElementById("26").style.backgroundColor = "#f0f0f0"; // Change color to yet another shade
        break;
      // Add more cases for other keys
     
    
 }
});



document.addEventListener('keydown', function(event) {
    switch(event.key) {
      

      case 'a':
        document.getElementById("1").style.backgroundColor = "DimGray"; // Change color to a different shade
        letter = document.getElementById("1").innerHTML;
        keyPress = 1;
         
        break;
      case 'b':
        document.getElementById("2").style.backgroundColor = "DimGray"; // Change color to another shade
        letter = document.getElementById("2").innerHTML;
        keyPress = 2;
         
        break;
      case 'c':
        document.getElementById("3").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("3").innerHTML;
        keyPress = 3;
        
        break;
      case 'd':
        document.getElementById("4").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("4").innerHTML;
        keyPress = 4;
        
        break;
      case 'e':
        document.getElementById("5").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("5").innerHTML;
        keyPress = 5;
        
        break;
      case 'f':
        document.getElementById("6").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("6").innerHTML;
        keyPress = 6;
        
        break;
      case 'g':
        document.getElementById("7").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("7").innerHTML;
        keyPress = 7;
        
        break;
      case 'h':
        document.getElementById("8").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("8").innerHTML;
        keyPress = 8;
        
        break;
      case 'i':
        document.getElementById("9").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("9").innerHTML;
        keyPress = 9;
        
        break;
      case 'j':
        document.getElementById("10").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("10").innerHTML;
        keyPress = 10;
        
        break;
      case 'k':
        document.getElementById("11").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("11").innerHTML;
        keyPress = 11;
        
        break;
      case 'l':
        document.getElementById("12").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("12").innerHTML;
        keyPress = 12;
        
        break;
      case 'm':
        document.getElementById("13").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("13").innerHTML;
        keyPress = 13;
        
        break;
      case 'n':
        document.getElementById("14").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("14").innerHTML;
        keyPress = 14;
        

        break;
      case 'o':
        document.getElementById("15").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("15").innerHTML;
        keyPress = 15;
        
        break;
      case 'p':
        document.getElementById("16").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("16").innerHTML;
        keyPress = 16;
        
        break;
      case 'q':
        document.getElementById("17").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("17").innerHTML;
        keyPress = 17;
        
        break;
      case 'r':
        document.getElementById("18").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("18").innerHTML;
        keyPress = 18;
        
        break;
      case 's':
        document.getElementById("19").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("19").innerHTML;
        keyPress = 19;
        
        break;
      case 't':
        document.getElementById("20").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("20").innerHTML;
        keyPress = 20;
        
        break;
      case 'u':
        document.getElementById("21").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("21").innerHTML;
        keyPress = 21;
        
        break;
      case 'v':
        document.getElementById("22").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("22").innerHTML;
        keyPress = 22;
        
        break;
      case 'w':
        document.getElementById("23").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("23").innerHTML;
        keyPress = 23;
        
        break;
      case 'x':
        document.getElementById("24").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("24").innerHTML;
        keyPress = 24;
        
        break;
      case 'y':
        document.getElementById("25").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("25").innerHTML;
        keyPress = 25;
        
        break;
      case 'z':
        document.getElementById("26").style.backgroundColor = "DimGray"; // Change color to yet another shade
        letter = document.getElementById("26").innerHTML;
        keyPress = 26;
        
        break;
     
    }

 if (gameON < 2 && wordSplit && wordSplit[i]){

  let compare = wordSplit[i].charCodeAt(0) - 64;


    if (keyPress == compare){
      i ++;
      code ++;
      highlightTarget();
    } else if (keyPress) {
      flashWrong(keyPress);
    }
    if (i == 4){

        i = 0;
        points ++;
        level1();

    }

    
     switch(code){
    
      case 0:
        document.getElementById("gamebox").innerHTML = wordSplit[0] + wordSplit[1] + wordSplit[2] + wordSplit[3] ;
    highlightTarget();
        break;
      case 1:
        document.getElementById("gamebox").innerHTML = `<span style="color: red;">${wordSplit[0]}</span>` + wordSplit[1] + wordSplit[2] + wordSplit[3] ;
        break;
      case 2:    
        document.getElementById("gamebox").innerHTML = `<span style="color: red;">${wordSplit[0] + wordSplit[1]}</span>` + wordSplit[2] + wordSplit[3] ;
        break;
      case 3:
        document.getElementById("gamebox").innerHTML = `<span style="color: red;">${wordSplit[0] + wordSplit[1] + wordSplit[2]}</span>`  + wordSplit[3] ;
        break;

     }

}
});










function level1() {
    code = 0;
  randomNum();

   word1 = word[randomNumber]; 

    wordSplit = word1.split(""); 
    document.getElementById("gamebox").innerHTML = wordSplit[0] + wordSplit[1] + wordSplit[2] + wordSplit[3] ;
     



}

function level2(){

    
}

 function randomNum(){
                let min = 0;
                let max = Math.max(0, (typeof word !== "undefined" && word.length ? word.length : 1) - 1);
                randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            }



function handleClick() {
   //console.log('Button clicked');

   // document.getElementById(this.id).classList.remove("key");
   //  document.getElementById(this.id).classList.add(".pressBack");
   //  document.getElementById(this.id).classList.add(".key");
    console.log('Element clicked:', this);
    document.getElementById(this.id).style.backgroundColor = "#ff5733";
      //alert()  
           
        
}

function main1() {

    gameON = 0;
    points = 0;
    showBanner(bannerForWords(typeof word !== 'undefined' ? word : []));
    startTimer();
    level1();

 function startTimer() {
            let timeLeft = 10; // Initial countdown time in seconds
            const timerElement = document.getElementById('timer');

            const intervalId = setInterval(() => {
                if (timeLeft > 0) {
                    timerElement.innerText = ` ${timeLeft} seconds` + `\nPoints: ` + points;
                    timeLeft--;
                } else {
                    timerElement.innerHTML = `Game Over! ` + `<span style="color: green;"><br><br>Total Points:` + points + `</span> `;
                    gameON = 2;
                    clearKeyHighlights();

                    clearInterval(intervalId);
                    document.getElementById("gamebox").innerHTML = `<button id="play">Play Again</button>` + `\n` + `<button id="celly">Celebrate</button>`;


                    const button = document.getElementById('play');
                    const cell = document.getElementById('celly');

           // Add a click event listener to the button
            button.addEventListener('click', function() {
                main1();
            });

            // Celebrate
            cell.addEventListener('click', function() {
                celebrate();
            });
                    
                }
            }, 1000); // Update every 1000 milliseconds (1 second)


              


        }}

        function celebrate(){

          confetti({

            
        particleCount: 150,
        spread: 120,
        origin: { y: 0.8 }
    });

}

          