import sys
import os

# Add project root to path
sys.path.append('/Users/paul/Documents/04 GitHub/project-folder_app')

from app import slugify

def test_logic():
    print("--- Testing Formatting Logic ---")
    
    # 1. Project Name: Sentence case with hyphens
    raw_name = "summer campaign 2024"
    formatted_name = slugify(raw_name.capitalize(), lower=False)
    expected_name = "Summer-campaign-2024"
    
    print(f"Project Name Input: '{raw_name}'")
    print(f"Formatted: '{formatted_name}'")
    print(f"Pass: {formatted_name == expected_name}\n")
    
    # 2. Client Code: Uppercase
    raw_code = "acme"
    formatted_code = slugify(raw_code, lower=False).upper()
    expected_code = "ACME"
    
    print(f"Client Code Input: '{raw_code}'")
    print(f"Formatted: '{formatted_code}'")
    print(f"Pass: {formatted_code == expected_code}\n")

if __name__ == "__main__":
    test_logic()
