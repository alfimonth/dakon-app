let gameTurn = "A";
let gameRun = false;
let stoneUsed = 0;
const boxUsed = document.querySelectorAll(".box-used");
const boxUsedA = document.querySelectorAll(".box-used:not(.inv-b)");
const boxUsedB = document.querySelectorAll(".box-used:not(.inv-a)");
const invA = document.querySelector(".inv-a");
const invB = document.querySelector(".inv-b");
const usedBoxesAWithoutInv = document.querySelectorAll(".zone-a > .box-used:not(.inv)");
const usedBoxesBWithoutInv = document.querySelectorAll(".zone-b > .box-used:not(.inv)");
const stonePlaceA = document.querySelector(".place-a");
const stonePlaceB = document.querySelector(".place-b");
const infoBox = document.querySelector(".info-box");
const startButton = document.querySelector(".start-button")

boxUsed.forEach((box) => {
  if (!box.classList.contains("inv")) {
    for (let i = 0; i < 5; i++) {
      const gameStone = document.createElement("div");
      gameStone.setAttribute("class", "game-stone");
      box.appendChild(gameStone);
    }
  }
});

function pilihTurn() {
  startButton.style.display = 'none';
  const randomValue = Math.random();

  if (randomValue < 0.5) {
    alert("kamu jalan duluan");

    // infoBox.innerHTML = 'Giliran kamu berjalan, klik bagian berwarna kuning';
    // turnA();
    setTimeout(turnA, 50)
  } else {
    alert("bot jalan duluan");

    setTimeout(turnB, 100)
  }
}

function endGame() {
  let countInvA = invA.children.length;
  let countInvB = invB.children.length;

  if (countInvA > 25 || countInvB > 25 || countInvA + countInvB === 50) {
    if (countInvA > countInvB) {
      alert("Game Berakhir, kamu menang");
    } else {
      if (countInvA === countInvB) {
        alert("Game Berakhir, hasilnya seri");
      } else {
        alert("Game Berakhir, kamu kalah");
      }
    }
    return true;
  } else {
    return false;
  }
}

function turnA() {
  if (!endGame()) {
    let notEmptyBox = [];
    usedBoxesAWithoutInv.forEach((box) => {
      if (box.children.length > 0) {
        notEmptyBox.push(box);
      }
    });
    if (notEmptyBox.length === 0) {
      gameTurn = "B";
      gameRun = false;
      turnB();
    } else {
      notEmptyBox.forEach((box) => {
        box.classList.add('green');
      })
      console.log(notEmptyBox);
      usedBoxesAWithoutInv.forEach((box, index) => {
        box.addEventListener("click", function () {
          if (!gameRun && gameTurn === "A" && box.children.length > 0) {
            usedBoxesAWithoutInv.forEach((box) => {
              box.classList.remove('green');
            })
            gameTurn = "pending";
            gameRun = true;
            let countStone = box.children.length;
            stoneUsed = countStone;
            while (box.firstChild) {
              box.removeChild(box.firstChild);
              const gameStone = document.createElement("div");
              gameStone.setAttribute("class", "game-stone");
              stonePlaceA.appendChild(gameStone);
            }

            let currentIndex = index + 1;

            function addGameStone() {
              if (stoneUsed > 0) {
                if (currentIndex >= boxUsedA.length) {
                  currentIndex = 0; // Loop back to the first box
                }

                const currentBox = boxUsedA[currentIndex];
                const gameStone = document.createElement("div");
                gameStone.setAttribute("class", "game-stone");
                currentBox.appendChild(gameStone);

                stoneUsed--;
                stonePlaceA.removeChild(stonePlaceA.firstChild);
                currentIndex++;

                setTimeout(addGameStone, 500); // Menunggu 1 detik sebelum memanggil kembali fungsi
              } else {
                let lastBox = boxUsedA[currentIndex - 1];
                if (lastBox.children.length > 1 && !lastBox.classList.contains("inv")) {
                  stoneUsed = lastBox.children.length;
                  while (lastBox.firstChild) {
                    lastBox.removeChild(lastBox.firstChild);
                    const gameStone = document.createElement("div");
                    gameStone.setAttribute("class", "game-stone");
                    stonePlaceA.appendChild(gameStone);
                  }
                  addGameStone();
                } else {
                  //batu berheni
                  if (currentIndex === 6) {
                    infoBox.innerHTML = 'Kamu berhenti di lumbung, kamu boleh berjalan lagi';
                    invA.classList.add("stop");
                    setTimeout(function () {
                      invA.classList.remove("stop");
                    }, 2000);
                    gameTurn = "A";
                    turnA();
                  } else {
                    if (currentIndex < 6) {
                      let attackedZone = boxUsedA[11 - currentIndex];
                      if (attackedZone.children.length > 0) {
                        stoneGet = attackedZone.children.length + 1;
                        while (lastBox.firstChild) {
                          lastBox.removeChild(lastBox.firstChild);
                        }
                        while (attackedZone.firstChild) {
                          attackedZone.removeChild(attackedZone.firstChild);
                        }
                        for (let i = 0; i < stoneGet; i++) {
                          const gameStone = document.createElement("div");
                          gameStone.setAttribute("class", "game-stone");
                          invA.appendChild(gameStone);
                        }
                      }
                    } else {
                      console.log("berhenti di area lawan");
                    }
                    infoBox.innerHTML = 'Giliran Bot';
                    gameTurn = "B";
                    setTimeout(turnB, 600);
                  }
                  gameRun = false;
                }
              }
            }
            infoBox.innerHTML = 'kamu sedang berjalan';
            addGameStone();
          }
        });
      });
    }
  } else {
    location.reload();
  }
}

function turnB() {
  infoBox.innerHTML = 'Bot sedang berjalan';
  if (!endGame()) {
    gameTurn = "pending";
    gameRun = true;
    let notEmptyBox = [];
    usedBoxesBWithoutInv.forEach((box, index) => {
      if (box.children.length > 0) {
        notEmptyBox.push(index + 5);
      }
    });
    if (notEmptyBox.length === 0) {
      infoBox.innerHTML = 'Bot diskip karena semua lubangnya kosong';
      gameTurn = "A";
      gameRun = false;
      turnA();
    } else {
      let currentIndex = notEmptyBox[Math.floor(Math.random() * notEmptyBox.length)];
      let box = boxUsedB[currentIndex];
      let countStone = box.children.length;
      stoneUsed = countStone;
      while (box.firstChild) {
        box.removeChild(box.firstChild);
        const gameStone = document.createElement("div");
        gameStone.setAttribute("class", "game-stone");
        stonePlaceB.appendChild(gameStone);
      }

      currentIndex += 1;
      function addGameStone() {
        if (stoneUsed > 0) {
          if (currentIndex >= boxUsedB.length) {
            currentIndex = 0; // Loop back to the first box
          }

          const currentBox = boxUsedB[currentIndex];
          const gameStone = document.createElement("div");
          gameStone.setAttribute("class", "game-stone");
          currentBox.appendChild(gameStone);

          stoneUsed--;
          stonePlaceB.removeChild(stonePlaceB.firstChild);
          currentIndex++;

          setTimeout(addGameStone, 500); // Menunggu 1 detik sebelum memanggil kembali fungsi
        } else {
          let lastBox = boxUsedB[currentIndex - 1];
          if (lastBox.children.length > 1 && !lastBox.classList.contains("inv")) {
            stoneUsed = lastBox.children.length;
            while (lastBox.firstChild) {
              lastBox.removeChild(lastBox.firstChild);
              const gameStone = document.createElement("div");
              gameStone.setAttribute("class", "game-stone");
              stonePlaceB.appendChild(gameStone);
            }
            addGameStone();
          } else {
            //batu berheni
            if (currentIndex === 11) {
              infoBox.innerHTML = 'Bot berhenti dilumbung, Bot boleh berjalan lagi';
              setTimeout(turnB, 2000)
            } else {
              if (currentIndex - 1 < 11 && currentIndex - 1 > 4) {
                let attackedZone = boxUsedB[10 - currentIndex];
                if (attackedZone.children.length > 0) {
                  stoneGet = attackedZone.children.length + 1;
                  while (lastBox.firstChild) {
                    lastBox.removeChild(lastBox.firstChild);
                  }
                  while (attackedZone.firstChild) {
                    attackedZone.removeChild(attackedZone.firstChild);
                  }
                  for (let i = 0; i < stoneGet; i++) {
                    const gameStone = document.createElement("div");
                    gameStone.setAttribute("class", "game-stone");
                    invB.appendChild(gameStone);
                  }
                }
              } else {
                console.log("Giliran bot selesai");
              }
              gameTurn = "A";
              infoBox.innerHTML = 'Giliran Kamu';
              turnA()
            }
            gameRun = false;
          }
        }
      }

      addGameStone();
    }
  } else {
    location.reload();
  }
}