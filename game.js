const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");

let points = 0;
let ongoing = false;
let startGame = true;

class Barrier{
    constructor({ serial, color = "#7CFC00", width = 40, height = Math.round(Math.random() * (350 - 150) + 150) }){
        this.serial = serial;
        this.color = color;
        this.width = width;
        this.height = height;
        this.position = {
            x: (gameBoard.width + (serial * 200)),
            y: (Math.round(Math.random() * (1 - 0) + 0) * gameBoard.height),
        };
    }

    draw(){
        if(this.position.y === 500){
            this.position.y = this.position.y - this.height;
        }
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Bird{
    constructor({ color= "red", position, velocity, gravity, jump = false, jumpPosition }){
        this.position = {
            x: 30,
            y: 250
        };
        this.velocity = velocity;
        this.gravity = gravity;
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 15, 0, 2 * Math.PI);
        ctx.fill();
    }

    move(){
        if(this.position.y + 15 < gameBoard.height && !this.jump){
            this.position.y += this.gravity;
            this.gravity += 0.2;
        } else if(this.jump){
            this.gravity = 0
            if(this.position.y > this.jumpPosition - this.velocity &&
                this.position.y - 15 > 0){
                this.position.y -= 10;
            } else {
                this. gravity = 1;
                this.jump = false;
            }
            
        }
    }
}

let barriers = [];
const bird = new Bird({ velocity: 50, gravity: 0 })

for(let i = barriers.length; i < 4; i++){
    barriers.push(new Barrier({ serial: i }));
}

function moveBarriers(){
    let velocity = 2;
    barriers.forEach((item) => {
        item.position.x -= velocity;
        if(item.position.x  === 0 ){
            barriers.push(new Barrier({ serial: 0 }));
        }
    })
    barriers.forEach((item) => {
        if(item.position.x + item.width < 0){
            barriers.shift();
            points += 1;
            document.getElementById("scoreText").innerText = points;
        }
    })
}

function checkIfCollapse(barrier){
    // felső akadály
    if(barrier.position.y === 0){
        if(bird.position.x + 15 >= barrier.position.x &&
            bird.position.y - 15 < barrier.height &&
            barrier.position.x + 15 > 0){
                console.log("second if")
                ongoing = false;
                startGame = gameOver();
            }
    }
    // alsó akadály
    if(barrier.position.y > 0){
        if(bird.position.x + 15 >= barrier.position.x &&
            bird.position.y + 15 > barrier.position.y &&
            barrier.position.x + 15 > 0){
                ongoing = false;
                startGame = gameOver();
            }
    }
    // talaly
    if(bird.position.y + 15 > gameBoard.height){
        ongoing = false;
        startGame = gameOver();
    }
}

function gameOver(){
    document.getElementById("scoreText").innerText = "Végső pontszámod: " + points;
    return false;
}


function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    barriers.forEach( (barrier) => {
        barrier.draw();
    })
    bird.draw();
    if(ongoing){
    moveBarriers();
    bird.move();
    }
    checkIfCollapse(barriers[0]);
}

window.addEventListener("keydown", (event) => {
    switch(event.key){
        case "s":
            if(startGame){
                ongoing = true;
            }
            break;
        case " ":
            bird.jump = true;
            bird.jumpPosition = bird.position.y;
            break;
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    location.reload();
});

animate();
