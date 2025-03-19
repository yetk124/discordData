import sys
import json

# ✅ Jupyter Notebook에서 저장한 `get_nickname_with_script.py` 불러오기
from get_nickname_with_script import get_nickname_with_script

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        
        # ✅ 크롤링 실행
        user_stats = get_nickname_with_script(user_id)
        
        # ✅ JSON 출력 (디스코드 봇과 연결될 때 필요)
        print(json.dumps(user_stats))
    else:
        print(json.dumps({"error": "❌ 유저 ID가 제공되지 않았습니다."}))
