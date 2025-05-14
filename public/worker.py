import ast
from browser import bind, self

def load_student_function(code, name):
    HARNESS_CODE = f'box["fn"] = {name}' # stores student code in a box
    box = {}
    exec(code + '\n' + HARNESS_CODE, { 'box': box }) # this call to exec stores the student func in the box
    return box['fn'] # return the function from the box

def test_student_function(student_function, tests): 
    report = []
    for test in tests:
        try:
            actual_output = student_function(*test['input'])
            report.append({
                "input": ", ".join(str(x) for x in test['input']),
                "expected": str(test['output']),
                "actual": str(actual_output),
                "equal": actual_output == test['output'],
                "error": None
            })
        except Exception as e:
            report.append({
                "input": ", ".join(str(x) for x in test['input']),
                "expected": str(test['output']),
                "actual": None,
                "equal": False,
                "error": f"{type(e).__name__}: {e}"
            })
    return report

def load_tests(tests_str: str):
    parsed = []
    for line in tests_str.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            left, right = line.split(";", 1)
            inputs   = [ast.literal_eval(tok) for tok in left.split("|") if tok.strip()]
            expected = [ast.literal_eval(tok) for tok in right.split("|") if tok.strip()]
            parsed.append((inputs, expected, line))

        except SyntaxError as e:
            parsed.append(("__SYNTAX_ERROR__", e, line))
            continue
            
    return parsed

def test_mutation_function(solution, mutations, tests, function_name):
    solution_function = load_student_function(solution, function_name)
    mutation_functions = [ load_student_function(mutant, function_name) for mutant in mutations ]
    tests = load_tests(tests)
    report = []
    for test in tests:
        if test[0] == "__SYNTAX_ERROR__":
            _, err, raw = test
            report.append({
                "input": raw,
                "expected": None,
                "solution": {"inputs": raw, "actual": f"<syntax error: {err}>", "equal": False},
                "mutations": [{"index": i, "actual": "<skipped due to syntax error>", "equal": False}
                      for i, _ in enumerate(mutation_functions)],
            })
            continue
        
        inputs, expected, raw = test
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
        entry["solution"] = {"inputs": inputs, "actual": solution_string, "equal": solution_ok}
        mutants = []
        for index, mutation_function in enumerate(mutation_functions):
            try:
                mutant_output = mutation_function(*(inputs or []))
                mutant_string =mutant_output if isinstance(mutant_output, (list, tuple)) else [mutant_output]
                mutant_ok = (len(expected)==1 and mutant_output==expected[0]) or (mutant_string==expected)
            except Exception as e:
                mutant_string = f"<error: {e}>"
                mutant_ok = False
            mutants.append({ "index": index, "actual": mutant_string, "equal": mutant_ok})
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

@bind(self, "message")
def load_and_test_student_function(e):
    data = e.data
    hints = { 
        "TypeError": "You may be passing the wrong number or type of arguments to your function.",
        "IndexError":  "Looks like you're accessing an index that doesn't exist – check your loops or indexing.",
        "KeyError":    "You're trying to access a dictionary key that isn't there.",
        "ValueError":  "A value isn't in the expected format – perhaps converting types went wrong?",
        "ZeroDivisionError": "You attempted to divide by zero – make sure your denominators aren't zero.",
    }
    if data.get("question_type",[0]) == 'coding':
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
    else:
        try:
            solution_code   = data["solution"]
            mutation_codes = data.get("mutations", [])
            tests = data.get("code","")
            function_name    = data["name"]     
            report = test_mutation_function(solution_code, mutation_codes, tests, function_name)
        except Exception as ex:
            return respond_failure(f"{type(ex).__name__} in mutation harness: {ex}")
        return respond_success(report)

    print(report)

    return respond_success(report)
