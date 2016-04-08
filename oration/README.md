# ORATION
Oration is a breath-oriented, syntax-substitution for python. Your program needs to breathe regularly, else it will suffocate. You can inhale for a large gulp of air, but don't do it too often, or your program wil hyperventilate! Oration is case-insensative, because it doesn't care about your case. It's also rather limited, so don't try to do anything fancy with it.

## Commands

 * `(we|i|you) need (.+)$` - `import $1`.
 * `start a (function)` - creates a function. Optional `with (arguments)` after.
 * `return (.+)` - returns that result (in python code).
 * `(give you|take this|here)` - begins a return statement.
 * `next` - proceeds a line.
 * `(backtracking|take a step back)` - decreases the tab level.
 * `invoke` - calls a function. Use like `invoke <name> [with arguments]`.
 * `capture` - appends the rest of the line to the compile code as a string. `Capture Hello!` appends `"Hello!"` to the compile code.
 * `listen` - begins a print statement.
 * `(that's the point|that's it)` - end a statement.
 * `literally, (.+)` - eval as `$1` as python.
 * `i'm done` - set the tab level to 0 and append a newline. "Closes everything."
 * `(good)?bye` - quits the program.
 * `fill me in` - auto completes parenthesis in program (implicitly done at the end of the program).
 * `(carry on|continue)` - adds a close-paren to the source code.

## Breath control

 * `breathe` - takes a breath, able to say another 7 commands.
 * `inhale` - take a deep breath! Able to say _14 commands!_ However, doing so thrice in a row will raise a `HyperventilationError`.

# Interpreter notes
When running the interpreter, do this:

    python oration.py "path-to-file"

`oration.py` will make a file called `foo_compiled.py` that contains the transpiled source code of the most recently run program, where `foo` was the name of the `.or` file.  So `python oration.py fibbonacci.or` will produce `fibbonacci_compiled.py`.

On OS X and possibly some linux distros, to be able to run `oration path_to_file`, add `alias oration="python ~/path/to/oration.py" $1`. 
