
with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Line 3121 (index 3120):", repr(lines[3120]))
print("Line 3122 (index 3121):", repr(lines[3121]))
print("Line 3123 (index 3122):", repr(lines[3122]))
