from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import time
import os

app = Flask(__name__)
CORS(app)

# 環境変数から読み込み（docker-compose.ymlで設定済み）
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    'postgresql://postgres:password@localhost:5432/todai_db'  # ローカル開発用フォールバック
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def wait_for_db():
    """データベースの準備ができるまで待機"""
    max_retries = 30
    for i in range(max_retries):
        try:
            with app.app_context():
                db.session.execute(db.text('SELECT 1'))
                print("Database connection successful!")
                return True
        except Exception as e:
            print(f"Waiting for database... ({i+1}/{max_retries})")
            time.sleep(2)
    return False

@app.route('/')
def index():
    return jsonify({
        'message': 'Flask API Server',
        'status': 'running'
    })

@app.route('/api/health')
def health():
    # データベース接続チェック
    try:
        db.session.execute(db.text('SELECT 1'))
        db_status = 'connected'
    except:
        db_status = 'disconnected'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status
    })

if __name__ == '__main__':
    if wait_for_db():
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("Failed to connect to database. Exiting...")