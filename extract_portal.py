import zipfile
import os
import sys

zip_path = r"c:\Users\Lenovo\Downloads\sbi-banking-portal (3)-20260819T092150Z-1-001\sbi-banking-portal (3)\sbi-banking-portal\sbi-banking.zip"
dest_base = r"c:\Users\Lenovo\Downloads\sbi-banking-portal (3)-20260819T092150Z-1-001\sbi-banking-portal (3)\sbi-banking-portal"

print(f"Opening zip: {zip_path}")
z = zipfile.ZipFile(zip_path)
extracted = 0
skipped = 0

for info in z.infolist():
    name = info.filename
    if not name or name.endswith("/"):
        continue

    # Skip node_modules and venv because they contain 50k OS-incompatible binary files and can be freshly installed
    if "/node_modules/" in name or name.startswith("node_modules/") or "/venv/" in name or name.startswith("venv/"):
        skipped += 1
        continue

    full_target = os.path.abspath(os.path.join(dest_base, name.replace("/", os.sep)))
    # Add \\?\ for Windows long paths if path is long
    if len(full_target) >= 240 and not full_target.startswith("\\\\?\\"):
        win_target = "\\\\?\\" + full_target
    else:
        win_target = full_target

    parent_dir = os.path.dirname(win_target)
    os.makedirs(parent_dir, exist_ok=True)

    try:
        with z.open(info) as src, open(win_target, "wb") as dst:
            dst.write(src.read())
        extracted += 1
        if extracted % 200 == 0:
            print(f"Extracted {extracted} files...")
    except Exception as e:
        print(f"Error extracting {name}: {e}")
        skipped += 1

print(f"Extraction Completed! Successfully extracted {extracted} files (skipped {skipped} node_modules/venv items).")
