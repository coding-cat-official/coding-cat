# meta.json
# {
#   "title": "Calculate Absolute",
#   "name": "calculate_absolute",
#   "difficulty": "easy",
#   "author": "ChatGPT",
#   "category": "Fundamentals",
#   "question_type": [
#     "coding"
#   ]
# }

difficulties = [
    "easy",
    "medium",
    "hard"
]

categories = [
    { "display_name": "Fundamentals", "input_name": "fundamentals" },
    { "display_name": "List-1: Indexing", "input_name": "list_1" },
    { "display_name": "List-2: Iterating", "input_name": "list_2" },
    { "display_name": "List-3: Complex Loop" , "input_name": "list_3" },
    { "display_name": "Logic" , "input_name": "logic" },
    { "display_name": "String-1" , "input_name": "string_1" },
    { "display_name": "String-2" , "input_name": "string_2" },
    { "display_name": "String-3" , "input_name": "string_3" }
]

question_types = [
    "coding",
    "mutation",
    "haystack"
]

def main():
    new_problem = {
        "title": "",
        "name": "",
        "difficulty": "",
        "author": "",
        "category": "",
        "question_type": []
    }

    print("\n~ Welcome to the Coding Cat Problem Creator ~\n")
    new_problem["title"] = get_user_input("Please enter the title of the problem. This is the display name, it can have caps and spaces:\n")
    new_problem["name"] = make_snake_case(new_problem["title"])
    new_problem["difficulty"] = get_user_input("\nPlease enter the difficulty of the problem:\n", difficulties)
    new_problem["category"] = get_category()
    new_problem["question_type"] = get_user_input("\nPlease input the problem's question type:\n", question_types)
    print(new_problem)

def get_user_input(input_message: str, whitelist: list = []):
    user_input = None
    while True: # emulates do while loop
        if len(whitelist) > 0: # reads out possible answers if a whitelist exists
            input_message += "Possible answers:"
            for option in whitelist:
                input_message += f"\n     - {option}"
            input_message += "\n"
        
        user_input = input(input_message)
        
        if is_valid_input(user_input, whitelist):
            break
    return user_input

def is_valid_input(input_str: str, whitelist: list = []):
    if input_str is None or input_str == "":
        return False
    if len(whitelist) > 0:
        if not input_str in whitelist:
            return False
    return True

def get_category():
    category_inputs = []

    for category in categories:
        category_inputs.append(category["input_name"])
    
    category_input_name = get_user_input("\nPlease enter the category of problem:\n", category_inputs)
    
    for category in categories:
        if category["input_name"] == category_input_name:
            return category["display_name"]
    return "huh?"

def make_snake_case(name: str):
    name = name.lower()
    name = name.replace(" ", "_")
    return name

def make_kebab_case(name: str):
    # TODO: kebab-case for dir names
    pass

if __name__ == "__main__":
    main()
