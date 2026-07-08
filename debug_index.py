
with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("=== Searching for '<footer' ===")
for i, line in enumerate(lines):
    if '<footer' in line:
        print(f"Line {i+1} (index {i}): {repr(line)}")

print("\n=== Searching for 'bootAuth' ===")
for i, line in enumerate(lines):
    if 'bootAuth' in line:
        print(f"Line {i+1} (index {i}): {repr(line)}")
        for j in range(i, i+30):
            print(f"  Line {j+1}: {repr(lines[j])}")
