from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """do before every test"""

        self.client = app.test_client()
        app.config["TESTING"] = True

    def testHomepage(self):
        """make sure information is in session and html is displayed"""
        with self.client:
            res = self.client.get("/")
            self.assertIn("board", session)
            self.assertIsNone(session.get("highscore"))
            self.assertIsNone(session.get("nplays"))
            self.assertIn(b"Score:", res.data)
            self.assertIn(b"Time left:")

    def test_invalid_word(self):
        """test if word is on the board"""

        self.client.get('/')
        response = self.client.get('/check-word?word=amazing')
        self.assertEqual(response.json['result'], 'not-on-board')

    def non_english_word(self):
        """test if word is in the dictionary"""

        self.client.get('/')
        response = self.client.get(
            '/check-word?word=asdfghjkl')
        self.assertEqual(response.json['result'], 'not-word')
    