from pathlib import Path

folders = [
    "backend",
    "backend/app",
    "backend/app/api",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/core",
    "frontend",
]

init_files = [
    "backend/app/__init__.py",
    "backend/app/api/__init__.py",
    "backend/app/models/__init__.py",
    "backend/app/schemas/__init__.py",
    "backend/app/core/__init__.py",
]

# создаём папки
for folder in folders:
    Path(folder).mkdir(parents=True, exist_ok=True)
    print(f"Folder ready: {folder}")

# создаём __init__.py
for file in init_files:
    path = Path(file)
    path.parent.mkdir(parents=True, exist_ok=True)  # на всякий случай
    path.touch(exist_ok=True)  # создаёт пустой файл, если его нет
    print(f"File ready: {file}")

print("Done.")