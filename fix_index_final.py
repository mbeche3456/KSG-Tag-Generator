
with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Step 1: Find and modify the footer line (line 3122)
for i in range(len(lines)):
    if '<footer style="position: sticky;' in lines[i]:
        lines[i] = lines[i].replace('<footer style="position: sticky;', '<footer id="main-footer" style="position: sticky;')
        print("Added id to footer at line", i+1)

# Step 2: Modify the bootAuth function
# Find where document.getElementById('app').style.display='block' is (line 3098)
for i in range(len(lines)):
    if "document.getElementById('app').style.display='block';" in lines[i]:
        lines.insert(i+1, "      document.getElementById('main-footer').style.display='block';\n")
        print("Added footer show at line", i+2)
        break

# Find where document.getElementById('app').style.display='none' is (line 3112)
for i in range(len(lines)):
    if "document.getElementById('app').style.display='none';" in lines[i] and 'bootAuth' in ''.join(lines[i-10:i]):
        lines.insert(i+1, "  document.getElementById('main-footer').style.display='none';\n")
        print("Added footer hide at line", i+2)
        break

with open("index.html", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Done updating index.html!")
