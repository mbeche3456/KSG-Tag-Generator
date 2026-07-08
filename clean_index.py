
import sys
filepath = r'c:\Users\user\Pictures\rolls tag3\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
# Find the FIRST </html> tag (the end of the original document)
first_html_idx = content.find('</html>')
if first_html_idx != -1:
    # Keep everything up to and including the first </html> tag
    # This removes the duplicate content and corrupted trailing data
    clean_content = content[:first_html_idx + 7]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(clean_content)
    print("File cleaned successfully - removed duplicate content")
else:
    print("No </html> tag found")
    sys.exit(1)
