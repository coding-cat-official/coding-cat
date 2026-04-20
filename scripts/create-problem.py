import os

difficulties = [
    "easy",
    "medium",
    "hard"
]

categories = [
    {
        "display_name": "Fundamentals",
        "input_name": "fundamentals",
        "dir_name": "fundamentals"
    },
    { 
        "display_name": "List-1: Indexing",
        "input_name": "list1",
        "dir_name": 'list_1_indexing'   
    },
    { 
        "display_name": "List-2: Iterating", 
        "input_name": "list2",
        "dir_name": "list_2_iterating"    
    },
    { 
        "display_name": "List-3: Complex Loop",
        "input_name": "list3",
        "dir_name": "list_3_complex_loop"
    },
    { 
        "display_name": "Logic",
        "input_name": "logic",
        "dir_name": "logic"    
    },
    { 
        "display_name": "String-1",
        "input_name": "string1",
        "dir_name": "string_1"
    },
    {
        "display_name": "String-2",
        "input_name": "string2",
        "dir_name": "string_2"
    },
    { 
        "display_name": "String-3",
        "input_name": "string3",
        "dir_name": "string_3"
    }
]

question_types = [
    "coding",
    "mutation",
    "haystack"
]

def get_problem_props() -> dict:
    new_problem = {
        "title": "",
        "name": "",
        "difficulty": "",
        "author": "",
        "category": "",
        "question_type": []
    }

    print("\n~ Welcome to the Coding Cat Problem Creator ~\n")
    new_problem["title"] = get_user_input("Please enter the title of the problem. This is the display name, it can have caps and spaces:\n", [], True)
    new_problem["name"] = make_snake_case(new_problem["title"])
    new_problem["difficulty"] = get_user_input("\nPlease enter the difficulty of the problem:\n", difficulties)
    new_problem["category"] = get_category()
    new_problem["question_type"].append(get_user_input("\nPlease input the problem's question type:\n", question_types))
    print(f"New Problem: {new_problem}")
    return new_problem

def get_user_input(input_message: str, whitelist: list = [], check_file_path: bool = False) -> str:
    user_input = None
    while True: # emulates do while loop
        if len(whitelist) > 0: # reads out possible answers if a whitelist exists
            input_message += "Possible answers:"
            for option in whitelist:
                input_message += f"\n     - {option}"
            input_message += "\n"
        
        user_input = input(input_message)
        
        if is_valid_input(user_input, whitelist, check_file_path):
            break
    return user_input

def is_valid_input(input_str: str, whitelist: list, check_file_path: bool) -> bool:
    if input_str is None or input_str == "":
        return False
    if len(whitelist) > 0:
        if not input_str in whitelist:
            return False
    if check_file_path and os.path.exists(make_kebab_case(input_str)):
        print(f"\nSorry, a problem with that name already exists.\n")
        return False
    return True

def get_category() -> str:
    category_inputs = []

    for category in categories:
        category_inputs.append(category["input_name"])
    
    category_input_name = get_user_input("\nPlease enter the category of problem:\n", category_inputs)
    
    for category in categories:
        if category["input_name"] == category_input_name:
            return category["display_name"]
    return "huh?"

def make_snake_case(name: str) -> str:
    name = name.lower()
    name = name.replace(" ", "_")
    return name

def make_kebab_case(name: str) -> str:
    name = name.lower()
    name = name.replace(" ", "-")
    return name

if __name__ == "__main__":
    new_problem = get_problem_props()
    try:
        dir_name = make_kebab_case(new_problem["title"])
        # even though haystack is a problem_type,
        # regardless of category, they all go in `public-problems/haystack/`
        if new_problem["question_type"][0] == "haystack":
            os.mkdir(f"../src/public-problems/haystack/{dir_name}")
        else:
            # get snake_case name for category
            category_dir = ""
            for category in categories:
                if category["display_name"] == new_problem["category"]:
                    category_dir = category["dir_name"]
                    break
            os.mkdir(f"../src/public-problems/{category_dir}/{dir_name}")
    except Exception as e:
        print(f"Something went wrong: {e}")
