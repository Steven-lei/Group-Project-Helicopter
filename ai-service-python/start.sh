#!/bin/bash

# 1. 环境检测与激活
if [ -d ".venv/Scripts" ]; then
    source .venv/Scripts/activate
    VENV_CREATED=false
elif [ -d ".venv/bin" ]; then
    source .venv/bin/activate
    VENV_CREATED=false
else
    echo "Creating new virtual environment..."
    python -m venv .venv
    # 再次尝试激活
    [ -d ".venv/Scripts" ] && source .venv/Scripts/activate || source .venv/bin/activate
    VENV_CREATED=true
fi

# 2. 依赖变化检测逻辑
REQUIREMENTS_FILE="requirements.txt"
HASH_FILE=".venv/.deps_hash"

# 计算当前 requirements.txt 的哈希值 (Windows 环境下使用 md5sum 或 certutil)
CURRENT_HASH=$(md5sum $REQUIREMENTS_FILE | cut -d ' ' -f 1)

if [ "$VENV_CREATED" = true ] || [ ! -f "$HASH_FILE" ] || [ "$CURRENT_HASH" != "$(cat $HASH_FILE)" ]; then
    echo "Dependencies changed or new environment detected. Running pip install..."
    pip install -r $REQUIREMENTS_FILE
    # 安装成功后记录哈希
    echo "$CURRENT_HASH" > "$HASH_FILE"
else
    echo "Dependencies are up-to-date. Skipping pip install."
fi

# 3. 启动服务
export PYTHONPATH=$PYTHONPATH:.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000