class BoggleGame {
    constructor(seconds = 60){
        this.board = $("#boggle");
        this.seconds = seconds;
        this.showTimer();
        this.timer = setInterval(this.tick.bind(this), 1000);

        this.score = 0;
        this.words = new Set();

        $(".form", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showMessage(msg, cls){
        $(".message", this.board)
        .text(msg)
        .removeClass()
        .addClass(`message ${cls}`);
    }

    showWord(word){
        $(".words", this.board).append($("<li>", {text: word}));
    }

    showScore(){
        $(".score", this.board).text(this.score);
        if (this.score > 0){
            $(".score").addClass("ok");
        }
    }


    showTimer(){
        $(".timer", this.board).text(this.seconds);
        if (this.seconds <= 10){
            $(".timer").addClass("err");
        }
    }

    async handleSubmit(evt){
        evt.preventDefault()   
        const $word = $(".word")
        let word = $word.val()
        $(".form").trigger("reset")

        if (!word) return;

        if (this.words.has(word)){
            this.showMessage(`Already found ${word}!`, "err");
            return;
        }
        
        const res = await axios.get("/check-word", {params:{word: word}});

        if(res.data.result === "not-word"){
            this.showMessage(`${word} is not a valid English word`, "err")
        } else if (res.data.result === "not-on-board"){
            this.showMessage(`${word} is not a valid word on the board`, "err")
        } else {
            this.showWord(word);
            this.showMessage(`Added: ${word}`, "ok");
            this.words.add(word);
            this.score += word.length;
            this.showScore();
        }
    }

    async tick(){
        this.seconds -= 1;
        this.showTimer();

        if (this.seconds === 0){
            clearInterval(this.timer);
            await this.endGame();
        }
    }

    async endGame(){
        $(".form", this.board).hide();

        const resp = await axios.post("/post-score", {score: this.score});
        if (resp.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`, "ok");
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok")
        }
    }
}   

new BoggleGame();