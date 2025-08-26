from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta, date
from models import db, User, Task, TaskType, Checklist, UserChecklist
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    'postgresql://postgres:password@localhost:5432/todai_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# データベース初期化
def init_db():
    with app.app_context():
        db.create_all()
        
        # タスクタイプの初期データ
        if TaskType.query.count() == 0:
            task_types_data = [
                # 主要科目
                {'category': '主要科目', 'name': '英語', 'points': 50},
                {'category': '主要科目', 'name': '数学', 'points': 50},
                {'category': '主要科目', 'name': '国語', 'points': 50},
                {'category': '主要科目', 'name': '物理', 'points': 40},
                {'category': '主要科目', 'name': '化学', 'points': 40},
                {'category': '主要科目', 'name': '社会', 'points': 40},
                # 試験
                {'category': '試験', 'name': '模試受験', 'points': 100},
                {'category': '試験', 'name': '過去問演習', 'points': 60},
                # 生活習慣
                {'category': '生活習慣', 'name': '睡眠（7時間以上）', 'points': 20},
                {'category': '生活習慣', 'name': '運動・筋トレ', 'points': 30},
                {'category': '生活習慣', 'name': '入浴', 'points': 10},
                {'category': '生活習慣', 'name': '食事管理', 'points': 15},
                # 息抜き
                {'category': '息抜き', 'name': '読書', 'points': 20},
                {'category': '息抜き', 'name': '散歩', 'points': 15},
                # ペナルティ
                {'category': 'ペナルティ', 'name': '麻雀', 'points': -30},
                {'category': 'ペナルティ', 'name': 'ゲーム（1時間超）', 'points': -20},
            ]
            
            for data in task_types_data:
                task_type = TaskType(**data)
                db.session.add(task_type)
            
            db.session.commit()
        
        # チェックリストの初期データ
        if Checklist.query.count() == 0:
            checklists_data = [
                {'title': '願書提出', 'description': '東大出願書類の準備・提出', 'order': 1},
                {'title': '共通テスト出願', 'description': '共通テスト願書提出', 'order': 2},
                {'title': '模試受験計画', 'description': '年間模試スケジュール作成', 'order': 3},
                {'title': '参考書・問題集準備', 'description': '必要な教材の購入', 'order': 4},
                {'title': '過去問入手', 'description': '赤本・青本の準備', 'order': 5},
                {'title': '志望理由書作成', 'description': '推薦入試用の志望理由書', 'order': 6},
                {'title': '面接対策', 'description': '推薦入試の面接準備', 'order': 7},
                {'title': '宿泊先予約', 'description': '受験時の宿泊施設予約', 'order': 8},
            ]
            
            for data in checklists_data:
                checklist = Checklist(**data)
                db.session.add(checklist)
            
            db.session.commit()

# === 認証エンドポイント ===

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # 入力データの検証
        if not data:
            return jsonify({'message': 'リクエストデータが必要です'}), 400
        
        required_fields = ['email', 'username', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'{field}は必須項目です'}), 400
        
        # バリデーション
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'このメールアドレスは既に使用されています'}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'このユーザー名は既に使用されています'}), 400
        
        # ユーザー作成
        user = User(
            email=data['email'],
            username=data['username']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'登録に失敗しました: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

# === タスク管理エンドポイント ===

@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())
    date_str = request.args.get('date')
    
    if date_str:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        tasks = Task.query.filter_by(user_id=user_id, date=target_date).all()
    else:
        tasks = Task.query.filter_by(user_id=user_id).all()
    
    return jsonify([task.to_dict() for task in tasks]), 200

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    task = Task(
        user_id=user_id,
        task_type_id=data['task_type_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date()
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    # 完了済みタスクの場合はポイントを減算
    if task.completed:
        user = User.query.get(user_id)
        user.total_points -= task.task_type.points
        user.level = user.calculate_level()
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted'}), 200

@app.route('/api/tasks/<int:task_id>/complete', methods=['PUT'])
@jwt_required()
def complete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    user = User.query.get(user_id)
    
    # タスクの完了状態をトグル
    if task.completed:
        # 完了済みの場合は未完了にしてポイントを減算
        task.completed = False
        user.total_points -= task.task_type.points
    else:
        # 未完了の場合は完了にしてポイントを加算
        task.completed = True
        user.total_points += task.task_type.points
    
    # レベル更新
    user.level = user.calculate_level()
    
    db.session.commit()
    
    return jsonify({
        'task': task.to_dict(),
        'user': user.to_dict()
    }), 200

# === タスク種別エンドポイント ===

@app.route('/api/task-types', methods=['GET'])
def get_task_types():
    task_types = TaskType.query.all()
    return jsonify([tt.to_dict() for tt in task_types]), 200

# === チェックリストエンドポイント ===

@app.route('/api/checklists', methods=['GET'])
@jwt_required()
def get_checklists():
    user_id = int(get_jwt_identity())
    
    # 全チェックリストを取得
    checklists = Checklist.query.order_by(Checklist.order).all()
    
    # ユーザーの完了状況を含めて返す
    result = []
    for checklist in checklists:
        user_checklist = UserChecklist.query.filter_by(
            user_id=user_id,
            checklist_id=checklist.id
        ).first()
        
        checklist_dict = checklist.to_dict()
        checklist_dict['completed'] = user_checklist.completed if user_checklist else False
        result.append(checklist_dict)
    
    return jsonify(result), 200

@app.route('/api/checklists/<int:checklist_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_checklist(checklist_id):
    user_id = int(get_jwt_identity())
    
    user_checklist = UserChecklist.query.filter_by(
        user_id=user_id,
        checklist_id=checklist_id
    ).first()
    
    if not user_checklist:
        user_checklist = UserChecklist(
            user_id=user_id,
            checklist_id=checklist_id,
            completed=True,
            completed_at=datetime.utcnow()
        )
        db.session.add(user_checklist)
    else:
        # 状態を切り替え
        user_checklist.completed = not user_checklist.completed
        user_checklist.completed_at = datetime.utcnow() if user_checklist.completed else None
    
    db.session.commit()
    
    return jsonify(user_checklist.to_dict()), 200

# === プロフィールエンドポイント ===

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    # 今週の獲得ポイント計算
    week_start = date.today() - timedelta(days=date.today().weekday())
    week_tasks = Task.query.filter(
        Task.user_id == user_id,
        Task.date >= week_start,
        Task.completed == True
    ).all()
    week_points = sum([task.task_type.points for task in week_tasks])
    
    profile = user.to_dict()
    profile['week_points'] = week_points
    
    return jsonify(profile), 200

@app.route('/api/users/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

# === ランキングエンドポイント ===

@app.route('/api/rankings', methods=['GET'])
def get_rankings():
    period = request.args.get('period', 'all')  # week, month, all
    
    if period == 'week':
        week_start = date.today() - timedelta(days=date.today().weekday())
        # 週間ポイントを集計
        subquery = db.session.query(
            Task.user_id,
            db.func.sum(TaskType.points).label('week_points')
        ).join(TaskType).filter(
            Task.date >= week_start,
            Task.completed == True
        ).group_by(Task.user_id).subquery()
        
        users = db.session.query(User, subquery.c.week_points).outerjoin(
            subquery, User.id == subquery.c.user_id
        ).order_by(db.desc(db.func.coalesce(subquery.c.week_points, 0))).limit(100).all()
        
        rankings = []
        for i, (user, week_points) in enumerate(users, 1):
            rankings.append({
                'rank': i,
                'username': user.username,
                'level': user.level,
                'points': week_points or 0
            })
    elif period == 'month':
        month_start = date.today().replace(day=1)
        # 月間ポイントを集計
        subquery = db.session.query(
            Task.user_id,
            db.func.sum(TaskType.points).label('month_points')
        ).join(TaskType).filter(
            Task.date >= month_start,
            Task.completed == True
        ).group_by(Task.user_id).subquery()
        
        users = db.session.query(User, subquery.c.month_points).outerjoin(
            subquery, User.id == subquery.c.user_id
        ).order_by(db.desc(db.func.coalesce(subquery.c.month_points, 0))).limit(100).all()
        
        rankings = []
        for i, (user, month_points) in enumerate(users, 1):
            rankings.append({
                'rank': i,
                'username': user.username,
                'level': user.level,
                'points': month_points or 0
            })
    else:
        users = User.query.order_by(User.total_points.desc()).limit(100).all()
        rankings = []
        for i, user in enumerate(users, 1):
            rankings.append({
                'rank': i,
                'username': user.username,
                'level': user.level,
                'total_points': user.total_points
            })
    
    return jsonify(rankings), 200

@app.route('/api/rankings/top', methods=['GET'])
def get_top_rankings():
    users = User.query.order_by(User.total_points.desc()).limit(10).all()
    
    rankings = []
    for i, user in enumerate(users, 1):
        rankings.append({
            'rank': i,
            'username': user.username,
            'level': user.level,
            'total_points': user.total_points
        })
    
    return jsonify(rankings), 200

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)