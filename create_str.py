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

for folder in folders:
    Path(folder).mkdir(parents=True, exist_ok=True)
    print(f"Created or exists: {folder}")

print("Done.")