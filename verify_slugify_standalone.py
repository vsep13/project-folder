import re

def slugify(text, lower=True):
    if lower:
        text = text.lower()
    text = re.sub(r'[\s_]+', '-', text)
    return re.sub(r'[^a-zA-Z0-9\-]', '', text)

def test_logic():
    print("--- Testing Formatting Logic (Standalone) ---")
    
    # 1. Project Name: Sentence case with hyphens
    # Logic from app.py: safe_project_name = slugify(project_name.capitalize(), lower=False)
    input_project = "summer campaign 2024"
    project_case = input_project.capitalize() # "Summer campaign 2024"
    formatted_project = slugify(project_case, lower=False)
    expected_project = "Summer-campaign-2024"
    
    print(f"Project Input: '{input_project}'")
    print(f"Capitalized:   '{project_case}'")
    print(f"Formatted:     '{formatted_project}'")
    print(f"Pass: {formatted_project == expected_project}\n")
    
    # 2. Client Code: Uppercase
    # Logic from app.py: safe_client_code = slugify(client_code, lower=False).upper()
    input_code = "acme"
    formatted_code = slugify(input_code, lower=False).upper()
    expected_code = "ACME"
    
    print(f"Client Code Input: '{input_code}'")
    print(f"Formatted:       '{formatted_code}'")
    print(f"Pass: {formatted_code == expected_code}\n")

if __name__ == "__main__":
    test_logic()
