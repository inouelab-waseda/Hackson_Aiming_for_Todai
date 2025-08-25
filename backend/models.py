# データベースモデル定義ファイル
# 初期設定用 - 必要に応じてモデルを追加してください

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 将来的にモデルクラスをここに追加
# 例:
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)

# class Todo(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(200), nullable=False)
#     completed = db.Column(db.Boolean, default=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)