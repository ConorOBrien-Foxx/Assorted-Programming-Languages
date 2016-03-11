# Pris
## "What is this terror!"
Pris has six functional characters, but has more commands than that. Strings of symbols have different meanings according to their number.

A Pris program is comprised of a series of meta-commands, or keywords. A keyword is made of a series of _one_ of any of the four main construction symbols (`(`, `)`, `{`, and `}`) and some modifier symbols (`[` and `]`). It must start with a constructoin symbol, and this denotes a change in meta-command. For example, the string `(([[][()]])[)` has two meta commands: `(([[][(` and `)]])])`.

## Data Structure
There are two registers, designated LEFT and RIGHT. One of them is "focused" and the other is "unfocused".

## Meta commands
A `(`-series modifies the focused register, whilst the `)`-series modifies the unfocused register. Each `(`- or `)`-series has a _value_; this is the number of symbols in the command, unless if there are modifier symbols in it. 

(INCOMPLETE)
