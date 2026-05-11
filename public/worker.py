import ast
# browser is a Brython-specific module that exists in the browser runtime
# 'type: ignore' is telling the linter to skip it and stop giving a warning
from browser import bind, self # type: ignore

# global print capture buffer - reset before each code run
_print_output = []
# stores student code to check for print statements after eval
_student_code = ""

def captured_print(*args, **kwargs):
    # support print's sep and end keywords
    sep = kwargs.get("sep", " ")
    end = kwargs.get("end", "\n")
    line = sep.join(str(a) for a in args) + end
    _print_output.append(line)

def load_student_function(code, name):
    global _student_code
    _student_code = code

    # stores student code in a box
    HARNESS_CODE = f'box["fn"] = {name}'
    box = {}
    # this call to exec stores the student func in the box
    # override print inside the student's execution env
    exec(code + '\n' + HARNESS_CODE, { 'box': box, 'print': captured_print })
    return box['fn'] # return the function from the box

def test_student_function(student_function, tests): 
    global _print_output
    report = []
    for test in tests:
        _print_output = []
        try:
            actual_output = student_function(*test['input'])
            report.append({
                "input": ", ".join(str(x) for x in test['input']),
                "expected": str(test['output']),
                "actual": str(actual_output),
                "equal": actual_output == test['output'],
                "error": None,
                "printed": "".join(_print_output) # captured printed lines
            })
        except Exception as e:
            report.append({
                "input": ", ".join(str(x) for x in test['input']),
                "expected": str(test['output']),
                "actual": None,
                "equal": False,
                "error": f"{type(e).__name__}: {e}",
                "printed": "".join(_print_output)
            })
    # Final test for if the code contains print statements
    contains_print = ("print(" in _student_code)
    report.append({
        "input": "N/A",
        "expected": "No print statements",
        "actual": "Print statement found" if contains_print else "No print statements",
        "equal": not contains_print,
        "error": None,
        "printed": ""
    })
    return report

# runs student input against the solution and all the mutation files and returnns json object with the results
def test_mutation_function(solution, mutations, tests, function_name):
    global _print_output
    solution_function = load_student_function(solution, function_name)
    mutation_functions = [ load_student_function(mutant, function_name) for mutant in mutations ]
    parsed_tests = []

    if isinstance(tests, list) and tests and isinstance(tests[0], dict) and 'Input' in tests[0]:
        parsed_tests = []
        for row in tests:
            try:
                inputs   = [ast.literal_eval(tok) for tok in row['Input']]
                expected = [ast.literal_eval(row['Expected'])]
                parsed_tests.append((inputs, expected, None))
            except Exception as e:
                tag = "__ERROR__"
                err = str(e)
                parsed_tests.append((tag, err, row['Input']))

    report = []
    for inputs, expected, raw in parsed_tests:
        if inputs == "__ERROR__":
            report.append({
                "input": raw,
                "expected": None,
                "solution": {"inputs": raw, "actual": f"<error: {expected}>", "equal": False, "printed": ""},
                "mutations": [{"index": i, "actual": "<skipped due to syntax error>", "equal": False, "printed": ""}
                    for i, _ in enumerate(mutation_functions)],
            })
            continue
                
        entry = {
            "input": inputs if inputs is not None else raw,
            "expected": expected,
        }
        try:
            solution_output = solution_function(*(inputs or []))
            solution_string = solution_output if isinstance(solution_output, (list, tuple)) else [solution_output]
            solution_ok = (len(expected)==1 and solution_output==expected[0]) or (solution_string==expected)
        except Exception as e:
            solution_string = f"<error: {e}>"
            solution_ok = False
        entry["solution"] = {"inputs": inputs, "actual": solution_string, "equal": solution_ok, "printed": "".join(_print_output)}
        mutants = []
        for index, mutation_function in enumerate(mutation_functions):
            _print_output = []
            try:
                mutant_output = mutation_function(*(inputs or []))
                mutant_string =mutant_output if isinstance(mutant_output, (list, tuple)) else [mutant_output]
                mutant_ok = (len(expected)==1 and mutant_output==expected[0]) or (mutant_string==expected)
            except Exception as e:
                mutant_string = f"<error: {e}>"
                mutant_ok = False
            mutants.append({ "index": index, "actual": mutant_string, "equal": mutant_ok, "printed": "".join(_print_output)})
        entry["mutations"] = mutants
        report.append(entry)
    return report

def respond_failure(message):
    self.send({
        "status": "failure",
        "message": message,
    })

def respond_success(report):
    self.send({
        "status": "success",
        "report": report,
    })

# Event that is called when the run button is clicked calls different function if the problem type is mutation
@bind(self, "message")
def load_and_test_student_function(e):
    global _print_output
    data = e.data
    hints = { 
        "TypeError": "You may be passing the wrong number or type of arguments to your function.",
        "IndexError":  "Looks like you're accessing an index that doesn't exist – check your loops or indexing.",
        "KeyError":    "You're trying to access a dictionary key that isn't there.",
        "ValueError":  "A value isn't in the expected format – perhaps converting types went wrong?",
        "ZeroDivisionError": "You attempted to divide by zero – make sure your denominators aren't zero.",
        "NameError": "You may be trying to use a variable whose value hasn't been set - make sure all variables are set before referring to them."
    }
    if data.get("question_type", None) in ('coding', 'haystack'):
        try:
            student_function = load_student_function(data['code'], data['name'])
        except Exception as e:
            return respond_failure(
                f"{type(e).__name__} while loading your function: {e}\n\n"
                "Tip: Make sure your function is defined with the correct name and syntax."
            )

        try:
            report = test_student_function(student_function, data['tests'])
            
            for result in report:
                if result["error"]:
                    err_type, err_msg = result["error"].split(":", 1)
                    
                    hint = hints.get(err_type.strip())
                    if hint == None:
                        return respond_failure(
                            f"{err_type.strip()} while running your code on input {result['input']}: {err_msg.strip()}"
                        )
                    return respond_failure(
                        f"{err_type.strip()} while running your code on input {result['input']}: {err_msg.strip()}\n\n"
                        f"Tip: {hint}"
                    ) 
            
        except Exception as e:
            err_type = type(e).__name__ 
            hint = hints.get(err_type)

            return respond_failure(
                f"{err_type} while running your code: {e}\n\n"
                f"Tip: {hint}"        
            )
    elif data.get("question_type", None) == "mutation":
        try:
            solution_code = data["solution"]
            mutation_codes = data.get("mutations", [])
            tests = data.get("code","")
            function_name = data["name"]     
            report = test_mutation_function(solution_code, mutation_codes, tests, function_name)
        except Exception as ex:
            return respond_failure(f"{type(ex).__name__} in mutation harness: {ex}")
        return respond_success(report)
    else:
        return respond_failure("Question type not supported.")

    return respond_success(report)
