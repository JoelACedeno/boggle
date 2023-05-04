from flask import Flask, render_template, session, request, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "supersecretkey"

boggle_game = Boggle()

@app.route("/")
def show_board():
    """show game board"""

    board = boggle_game.make_board()
    session["board"] = board

    return render_template("index.html", board=board)

@app.route("/check-word")
def check_word():
    """check if word exists in dictionary"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({"result": response})

@app.route("/post-score", methods=["POST"])
def post_score():
    
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session["nplays"] = nplays + 1
    session["highscore"] = max(score, highscore)

    return jsonify(brokeRecord = score > highscore)