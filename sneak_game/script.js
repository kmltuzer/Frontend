class Snake {
    constructor (cols, rows, board) {
        this.foodX;
        this.foodY;
        this.snakeX = 1;
        this.snakeY = 1;
        this.velocityX = 1;
        this.velocityY = 0;
        this.snakeBody = [];
        this.level = +JSON.parse(localStorage.getItem('Difficulty')) || 1000;
        this.gameOver = false;
        this.interval;
        this.score = 0;
        this.bestScore = +JSON.parse(localStorage.getItem('Best Score')) || 0;
        this.cols = cols;
        this.rows = rows;
        this.board = board;

        document.querySelector('.best-score').innerHTML = this.bestScore;
        document.querySelector('.curr-score').textContent = this.score;
    };
    execute () {
        if ( !this.gameOver ) {
            this.setsnakeBody();
            this.checkSnakePosition();
            this.movesnake();
            this.setHTML();
        }
        this.checkGameOver();
    };
    setFoodPosition () { //
        this.foodX = Math.floor( Math.random() * this.cols ) + 1;
        this.foodY = Math.floor( Math.random() * this.rows ) + 1;
    };
    checkSnakePosition () { //
        if ( (this.snakeX === this.foodX) && (this.snakeY === this.foodY) ) {
            this.snakeBody.push([this.foodX, this.foodY]);
            this.setScore();
            this.setFoodPosition();
        };
    };
    setsnakeBody () { //
        this.snakeBody[0] = [this.snakeX, this.snakeY];
        for (let i = this.snakeBody.length - 1; i > 0; i--) {
            this.snakeBody[i] = this.snakeBody[i - 1];
        };
    };
    movesnake () { //
        this.snakeX += this.velocityX;
        this.snakeY += this.velocityY;
    };
    setHTML () {
        const foodMarkup = `<div class="food" style="grid-area: ${this.foodY} / ${this.foodX}"></div>`;
        this.board.innerHTML = foodMarkup;

        let snakeMarkup = `<div class="snake" style="grid-area: ${this.snakeY} / ${this.snakeX}"></div>`;
        this.snakeBody.forEach( (pos, i) => {
            i > 0 ? snakeMarkup += `<div class="snake" style="grid-area: ${pos[1]} / ${pos[0]}"></div>` : '';
        } );
        this.board.innerHTML += snakeMarkup;
    }
    checkGameOver () { //
        if (this.snakeX < 1 || this.snakeX > this.cols ) (this.gameOver = true);
        if (this.snakeY < 1 || this.snakeY > this.rows ) (this.gameOver = true);
        for (let i = 1; i < this.snakeBody.length; i++) {
            const x = this.snakeBody[i][0];
            const y = this.snakeBody[i][1];
            if ( ((this.snakeX === x) && (this.snakeY === y)) ) (this.gameOver = true);
            if ( this.gameOver ) break;
        };
        if ( this.gameOver ){
            this.reset();
            this.askUser();
         }        
        return this.gameOver;
    };
    setScore () { //
        this.score += 1500 / this.level;
        document.querySelector('.curr-score').textContent = this.score;
        if ( this.score >  this.bestScore ) {
            this.bestScore = this.score;
            document.querySelector('.best-score').innerHTML = this.score;
            localStorage.setItem('Best Score', JSON.stringify(this.bestScore));
        };
    };
    setVelocities (e) { // 
         let key;
        switch (e.key) {
            case 'ArrowUp' :
                this.velocityY = -1;
                this.velocityX = 0;
                break;
            case 'ArrowDown' :
                this.velocityY = 1;
                this.velocityX = 0;
                break;
            case 'ArrowRight' :
                this.velocityY = 0;
                this.velocityX = 1;
                break;
            case 'ArrowLeft' :
                this.velocityY = 0;
                this.velocityX = -1;
                break;
            default :
                this.velocityY = 0;
                this.velocityX = 1;

        };
        this.execute();
    };
    reset () { //
        clearInterval(this.interval)
        this.score = 0;
        this.snakeX = 1;
        this.snakeY = 1;
        this.board.classList.add('game-over');
        this.board.innerHTML = document.querySelector('.ongameover').innerHTML;

    };
    askUser () { //
        const plyBtn = document.querySelector('.game-over .p-again');
        plyBtn.addEventListener('click', () => window.location.reload() );

        const setDifficultyBtn  = document.querySelector('.game-over button.setting');
        setDifficultyBtn.addEventListener('click', () => {
            snk.board.innerHTML = document.querySelector('.difficulty').innerHTML;
            const btns = document.querySelectorAll('.game-over .levels button');
            btns.forEach( btn => btn.addEventListener('click', e => {
                this.level = +e.currentTarget.dataset.level;
                localStorage.setItem('Difficulty', JSON.stringify(this.level));
                window.location.reload();
            }) );
        } );

    }
};

const snk = new Snake(30, 30, document.querySelector('.board'));
snk.setFoodPosition();
snk.setHTML();

const setVelo = (e) => snk.setVelocities(e)
document.body.addEventListener('keydown', setVelo);
snk.interval = setInterval(() => snk.execute(), snk.level);