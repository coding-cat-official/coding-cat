from browser import bind, document, worker, window

TIMEOUT_MS = 2000
WORKER = None # the worker object
RUNNING = False
TIMEOUT_ID = -1
# ^ when RUNNING is True, this holds the ID of an active timeout
# to cancel and restart the worker

### INITIALIZING THE WORKER ###

def onready(w):
    global WORKER
    WORKER = w

def onmessage(msg):
    """Runs when the worker sends a message back to us, to say whether the code
    ran correctly and which test cases it passed."""
    global WORKER, RUNNING, TIMEOUT_ID
    print('worker finished! clearing timeout', TIMEOUT_ID)
    window.clearTimeout(TIMEOUT_ID)
    RUNNING = False
    respond(msg.data)

def respawn_worker():
    print('respawing worker')
    global WORKER, RUNNING, TIMEOUT_ID
    if WORKER is not None:
        WORKER.worker.terminate()
    RUNNING = False
    TIMEOUT_ID = -1
    WORKER = None
    window.setTimeout(
        lambda: worker.create_worker('code-runner', onready, onmessage),
        0,
    )

def student_code_timeout():
    respond({
        'status': 'failure',
        'message': 'your code took too long to run',
    })
    respawn_worker()

def respond(response):
    document.dispatchEvent(
        window.CustomEvent.new(
            'eval_finished', {
                'detail': response,
            },
        ),
    )

### PROXYING EVENTS FROM THE UI TO THE WORKER ###

@bind(document, 'eval')
def main(e):
    global WORKER, RUNNING, TIMEOUT_ID

    # don't try to run the code if the worker isn't up and running
    if WORKER is None: return

    # or if there's already a submission running
    if RUNNING:
        print('skipping sending code to worker since one is running')
        return

    print('sending code to worker')
    RUNNING = True
    WORKER.send(e.detail)
    TIMEOUT_ID = window.setTimeout(student_code_timeout, TIMEOUT_MS)

### SPAWNING THE WORKER ###

respawn_worker()
