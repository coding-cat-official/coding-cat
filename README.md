# Welcome to Coding Cat

In browser IDE and tester for python. For educational purposes, inspired by [Codingbat](https://www.codingbat.com).

The site can be found at [coding-cat.club](https://coding-cat.club).

## Run Locally

To run a local instance of Coding Cat, follow these steps.

First, you will need to install [jq](https://jqlang.org/). It is recommended to install it using a package manager, like apt for Linux or scoop for Windows. If you simply install the binary, you might have to place it in the usr/bin/ directory in your Git installation folder for it to work.

Then, clone the repo, switch to the staging branch, and run `git submodule sync` and `git -c submodule.src/private-problems.update=none submodule update --init --recursive`. This will clone the public-problems submodule, while ignoring private-problems.

Run `npm install` to install the dependencies, then run `npm run build` in the project root to set up the list of problems (`npm run build-windows` if you're on Windows).

Finally, run `npm run start` to run the app locally.

### Run Unit Tests

To run the tests, use the `npm run test` command in the project root.

### TO DO

Future features we'd like to add:

- User accounts with log ins, persistent solutions, tracks progress
- Debugger? Ability to test code in a REPL?
- Choose your own inputs to the functions
- Partially hidden tests
- Print statements

### BUGS

- In `intersecting_metro`, if you do `return None` this somehow triggers the timeout.
