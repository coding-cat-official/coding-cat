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
            "input": test['input'],
            "expected": test['output'],
            "actual": actual_output,
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
    try:
        student_function = load_student_function(e.detail.code, e.detail.name)
    except Error as e:
        return respond_failure(
            f"failed to load function {e.detail.name}: {str(e)}"
        )

    try:
        report = test_student_function(student_function, e.detail.tests)
    except Error as e:
        return respond_failure(
            f"your function encountered an error while running: {str(e)}",
        )

    return respond_success(report)
