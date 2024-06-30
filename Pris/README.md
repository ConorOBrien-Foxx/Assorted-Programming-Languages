# Pris
## "What is this terror!"
Pris has six functional characters, but has more commands than that. Strings of symbols have different meanings according to their number.

A Pris program is comprised of a series of meta-commands, or keywords. A keyword is made of a series of _one_ of any of the four main construction symbols (`(`, `)`, `{`, and `}`) and some modifier symbols (`[` and `]`). It must start with a construction symbol, and this denotes a change in meta-command. For example, the string `(([[][()]])[)` has two meta commands: `(([[][(` and `)]])])`.

## Data Structure
There are two registers, designated LEFT and RIGHT. One of them is "focused" and the other is "unfocused".

## Commands

Every command is a series of repeated `(`, `)`, `{`, or `}`, with optional `[` and `]` intermixed. The function of the command is first determined by the first character, and then augmented by the *mode* of the command, which is calculated by reading the command left-to-right, and keep track of a running accumulator which increases by 1 for each character, but `[` will instead double and add 1, and `]` will double and subtract 1. Thus, `)))` has a mode of 3, `(](` has a mode of 4, and `}}}}}[` has a mode of 9.

- `(` increases the focused register by the `mode`.
- `)` increases the unfocused register by the `mode`.
- `{` focuses on the LEFT register if `mode` is even, RIGHT otherwise.
- `}` is one of 14 subcommands, depending on the mode:
     1. `}` sets the focused register to the Unicode value of the first byte in the `prompt()`.
     2. `}}` sets the focused register to the numeric value of the `prompt()`. This command didn't work in the original implementation since it failed to call `prompt`, also it did the same thing as when the mode was 1.
     3. `}]` appends the focused register as a character to the output buffer.
     4. `}]}` appends the focused register as a number to the output buffer.
     5. `}}]` skips the next command if the focused register is nonzero.
     6. `}}]}` sets the instruction pointer to the value of the unfocused register.
     7. `}]]` sets the instruction pointer to the value of the unfocused register if and only if the focused register is nonzero.
     8. `}]]}` adds the unfocused register to the focused register.
     9. `}}][` multiples the focused register by the unfocused register.
     10. `}}][}` divides the focused register by the unfocused register.
     11. `}}]]` subtracts the unfocused register from the focused register.
     12. `}}]]}` increments the focused register.
     13. `}]][` decrements the focused register.
     14. `}]][}` outputs the output buffer and clears its contents.

## Hello, World!



