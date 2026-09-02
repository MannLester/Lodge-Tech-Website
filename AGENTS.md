# Lodge Tech Website Working Agreement

These instructions apply only to this project folder.

## Repository

- The GitHub repository for this project is `https://github.com/MannLester/Lodge-Tech-Website`.
- Treat this folder as an independent repository. Do not use or modify a Git repository, remote, files, or configuration inherited from a parent or sibling folder.

## Branches and commits

- Never commit directly to the default branch or another shared branch.
- Create a dedicated branch for every selected task before making implementation changes.
- Name branches according to the work, using a clear prefix such as `feature/`, `fix/`, `docs/`, `test/`, `refactor/`, or `chore/`.
- Break work into the maximum practical number of independently understandable commits. Do not split an indivisible change merely to increase the commit count.
- Follow the workspace's modular commit-and-push rules when commits or a push are requested.
- Do not commit, push, merge, or open a pull request unless the user explicitly selects and approves that action.

## Required workflow

For every new body of work, follow these gates in order:

1. Gather context from files inside this project boundary only.
2. List and break down the work into the smallest practical tasks, maximizing the number of meaningful possible commits.
3. Stop and wait for the user to select a task.
4. Explain the selected task in concrete terms, including intended changes, scope, assumptions, and verification.
5. Stop and wait for explicit user approval.
6. Create the task branch, execute only the approved task, and verify the result.

Do not combine the selection, explanation, approval, and execution gates. Do not begin implementation merely because a task was selected; explicit approval after the explanation is required.

If new information materially changes the approved scope during execution, stop, explain the change, and obtain fresh approval before continuing.
