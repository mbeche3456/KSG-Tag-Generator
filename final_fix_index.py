
with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Step 1: Update footer at line 7802 (index 7801)
print(f"Footer line before: {repr(lines[7801])}")
lines[7801] = lines[7801].replace('<footer class="sticky-footer">', '<footer id="main-footer" class="sticky-footer">')

# Step 2: Update first bootAuth function (around line 3200)
# Add main-footer display:none after document.getElementById('app').style.display='none' around line 3232
for i in range(3200, 3250):
    if "document.getElementById('app').style.display='none';" in lines[i]:
        lines.insert(i+1, "  document.getElementById('main-footer').style.display='none';\n")
        print("Added hide footer to first bootAuth at line", i+2)

# Step 3: Update second bootAuth function (around line 7478)
for i in range(7460, 7500):
    if "document.getElementById('app').style.display='none';" in lines[i]:
        lines.insert(i+1, "  document.getElementById('main-footer').style.display='none';\n")
        print("Added hide footer to second bootAuth at line", i+2)

# Also make sure in first bootAuth's "show app" part we already have the display:block (which we do at line 3216)
with open("index.html", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("All done!")
