#!/usr/bin/env python3
"""Fix malformed JSON files by adding missing field names."""

import json
import re
import sys
from pathlib import Path

def fix_json_file(filepath):
    """Fix a single JSON file."""
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix pattern: "questionId": NUMBER,\n SPACES "VALUE"\n ]
        # This appears to be a user answer field that's missing its key
        fixed_content = re.sub(
            r'("questionId":\s*\d+,)\s*\n(\s+)"',
            r'\1\n\2"userAnswer": [',
            content
        )

        # Now fix the closing bracket - find cases where we have just a string followed by ]
        # Pattern: "VALUE"\n SPACES ],
        fixed_content = re.sub(
            r'("userAnswer":\s*\[\s*\n\s+)(".*?")\s*\n(\s+)\]',
            r'\1\2\n\3]',
            fixed_content
        )

        # Validate the fixed JSON
        try:
            data = json.loads(fixed_content)
            print(f"  ✓ Valid JSON with {len(data)} sections")

            # Count questions
            total_q = sum(len(s.get('questions', [])) for s in data)
            print(f"  ✓ Total questions: {total_q}")

            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)

            print(f"  ✓ Fixed and saved")
            return True

        except json.JSONDecodeError as e:
            print(f"  ✗ Still invalid after fix: {e}")
            print(f"  Trying original file...")

            # Maybe it's already valid?
            try:
                data = json.loads(content)
                print(f"  ✓ Original file is actually valid!")
                return True
            except:
                return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    study_dir = Path('.')
    json_files = list(study_dir.glob('*.json'))

    print(f"Found {len(json_files)} JSON files\n")

    success_count = 0
    for json_file in json_files:
        if json_file.name != 'fix_json.py':  # Skip this script
            if fix_json_file(json_file):
                success_count += 1
            print()

    print(f"\nFixed {success_count}/{len(json_files)} files")

if __name__ == '__main__':
    main()
