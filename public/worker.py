from browser import bind, self

def load_student_function(code, name):
    HARNESS_CODE = f'box["fn"] = {name}'
    box = {}
    exec(code + '\n' + HARNESS_CODE, { 'box': box })
    return box['fn']

def test_student_function(student_function, tests):
    report = []
    for test in tests:
        actual_output = student_function(*test['input'])
        report.append({
            "input": ", ".join(str(x) for x in test['input']),
            "expected": str(test['output']),
            "actual": str(actual_output),
            "equal": actual_output == test['output'],
        })
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
    try:
        student_function = load_student_function(data['code'], data['name'])
    except Exception as e:
        return respond_failure(
            f"{type(e).__name__} while loading your function: {e}\n"
            "Tip: Make sure your function is defined with the correct name and syntax."
        )

    try:
        report = test_student_function(student_function, data['tests'])
    except Exception as e:
        err_type = type(e).__name__ 
        hints = { 
            "TypeError": "You may be passing the wrong number or type of arguments to your function.",
            "IndexError":  "Looks like you're accessing an index that doesn't exist – check your loops or indexing.",
            "KeyError":    "You're trying to access a dictionary key that isn't there.",
            "ValueError":  "A value isn't in the expected format – perhaps converting types went wrong?",
            "ZeroDivisionError": "You attempted to divide by zero – make sure your denominators aren't zero.",
        }

        hint = hints.get(err_type)

        return respond_failure(
            f"{err_type} while running your code: {e}\n\n"
            f"Tip: {hint}"        
        )

    return respond_success(report)
