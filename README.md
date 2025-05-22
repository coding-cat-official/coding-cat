# Welcome to Coding Cat

In browser IDE with auto-tested problems in Python. Problems are organized around categories that denote their difficulty. This project is inspired by [Coding Bat](https://www.codingbat.com).

The site can be found at [coding-cat.club](https://coding-cat.club).

## Run Locally

To run a local instance of Coding Cat, follow these steps.

First, you will need to install [jq](https://jqlang.org/). It is recommended to install it using a package manager, like apt for Linux or scoop for Windows. If you simply install the binary, you might have to place it in the usr/bin/ directory in your Git installation folder for it to work.

Then, clone the repo using `--recurse-submodules` to clone all the submodules as well. If you don't have access to the private-problems repository, clone the repo normally, and run `git submodule sync` and `git -c submodule.src/private-problems.update=none submodule update --init --recursive`. This will clone the public-problems submodule, while ignoring private-problems.

Run `npm install` to install the dependencies, then run `npm run build` in the project root to set up the list of problems.

Finally, run `npm run start` to run the app locally.

### Run Unit Tests

To run the tests, use the `npm run test` command in the project root.

### Load different problem sets

To switch the problem set from the public-problems repository to the private-problems one, define an environment variable called `REACT_APP_PROBLEM_SET` and set it to either `public-problems` or `private_problems`. You will have to rebuild the problem list using `npm run build-problems`. If this variable is not defined, it will use `public-problems` by default.

## Project History and Timeline

### Summer 2024
A bare, front-end only version of this application was developed by Eric Mayhew and Jacob Errington in Summer of 2024. 

### Fall 2024
During the school year, dozens of students in Eric's introduction to Python course at Dawson added dozens of problems to the problem set. Thank you to these students for enhancing the application.

### Spring 2025 
During April to May of 2025, 3 student interns (Emmanuelle Lin, Ahmed Sobh, and Kristian Garkov) implemented a number of key features that make Coding Cat what it is today, such as: a backend with persistent user accounts, the ability for users to set individualized goals for number of problems completed, new problem types (like mutation testing problems), and reflections.  Thank you to these students for implementing these key features. 
