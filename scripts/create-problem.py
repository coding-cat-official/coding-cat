# Made by Luke Weaver before he noticed that there was already a script for making problems in public-problems :(

import json
import os

difficulties = [
    "easy",
    "medium",
    "hard"
]

# TODO: Dynamic categories?

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
    
    new_problem["title"] = get_user_input("Please enter the title of the problem. This is the display name. It should only have alphanumeric characters and may have spaces:\n", [], True)
    new_problem["name"] = make_snake_case(new_problem["title"])
    new_problem["difficulty"] = get_user_input("\nPlease enter the difficulty of the problem:\n", difficulties)
    new_problem["category"] = get_category()
    new_problem["question_type"].append(get_user_input("\nPlease input the problem's question type:\n", question_types))
    print(f"\nNew Problem: {new_problem}\n")
    return new_problem

# Gets a string from the user after printing the input_message
# Uses is_valid_input to ensure no empty, None or only whitespace input
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
    return user_input.strip()

# Ensures input_str:
#  - Is not an empty string or None
#  - Is not only whitespace
#  - Contains only alphanumeric characters (and spaces)
#  - Is on the whitelist, if provided
def is_valid_input(input_str: str, whitelist: list, check_file_path: bool) -> bool:
    if input_str is None or input_str == "":
        print("\nSorry, input was an empty string or None\n")
        return False
    stripped_str = input_str.strip()
    if stripped_str == "":
        print("\nSorry, input was only whitespace\n")
        return False
    if not stripped_str.replace(" ", "").isalnum():
        print("\nSorry, input should only be alphanumeric characters and spaces\n")
        return False
    if len(whitelist) > 0:
        if not input_str in whitelist:
            print("\nSorry, that was not one of the options.\n")
            return False
    if check_file_path and os.path.exists(make_kebab_case(input_str)):
        print("\nSorry, a problem with that name already exists.\n")
        return False
    return True

# gets the category from user input using the categories dict
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

# returns the filepath to the passed problem directory
def get_path_to_problem(problem: dict) -> str:
    try:
        dir_name = make_kebab_case(problem["title"])
        # even though haystack and mutation are problem_types,
        # regardless of category, they go in their respective dirs
        if new_problem["question_type"][0] == "haystack":
            return f"src/public-problems/haystack/{dir_name}"
        if new_problem["question_type"][0] == "mutation":
            return f"src/public-problems/mutation/{dir_name}"
        
        # get snake_case name for category
        category_dir = ""
        for category in categories:
            if category["display_name"] == new_problem["category"]:
                category_dir = category["dir_name"]
                break
        return f"src/public-problems/{category_dir}/{dir_name}"
    except Exception as e:
        print(f"Something went wrong: {e}")
        return ""

# creates all the problem files (description.md, io.json, meta.json and starter.py)
def fill_problem_dir(problem: dict) -> None:
    try:
        path_to_dir = get_path_to_problem(problem)
        with open(f"{path_to_dir}/description.md", "w", encoding="utf-8") as file:
            file.write(f"Write a function `{problem["name"]}(param_1: type) -> return_type:` that does x, y, z with `param_1` and returns something.\n\n")
            file.write("For example:\n")
            file.write(f"- `{problem["name"]}(example_input) ")
            file.write("\u2192") # "→"
            file.write(" Example Return`")
        print("Created description.md")

        with open(f"{path_to_dir}/io.json", "w") as file:
            # TODO: json.dumps formats this with newline around the test cases
            # ideally io.json should be formatted as below
            io = [
                {
                    "input": [5],
                    "output": [10]
                }
            ]
            file.write(json.dumps(io, indent=2))
        print("Created io.json")

        with open(f"{path_to_dir}/meta.json", "w") as file:
            meta = {
                "title": problem["title"],
                "name": problem["name"],
                "difficulty": problem["difficulty"],
                "author": "",
                "category": problem["category"],
                "question_type": [
                    problem["question_type"][0]
                ]
            }
            file.write(json.dumps(meta, indent=2))
        print("Created meta.json")

        with open(f"{path_to_dir}/starter.py", "w") as file:
            file.write(f"def {problem["name"]}(param_1: type) -> return_type:\n")
            file.write("    # Your code here\n")
            file.write("    pass")
        print("Created starter.py")

        # TODO: Create mutation files?
    except Exception as e:
        print(f"Something went wrong: {e}")

if __name__ == "__main__":
    try:
        new_problem = get_problem_props()
        os.mkdir(get_path_to_problem(new_problem))
        fill_problem_dir(new_problem)
        print(f"\nSuccessfully created your new problem \"{new_problem["title"]}\"!")
        print(f"\nThe problem has a placeholder description. Please go edit it.")
        print("\nThe problem also only has a single placeholder test case, please add at least 10 test cases.")
    except KeyboardInterrupt:
        print("\nProgram exited via KeyboardInterrupt\n")
    except Exception as e:
        print(f"\nSomething went wrong: {e}\n")
