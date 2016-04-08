# .kill();

This is a language that will `.kill()` your mind. Whateer sanity you hade, abandon it. `.kill()` will surely make your life worse.

## Code layout

There are two possible program "modes" that may come about. The first is "string" mode, the solue purpose of which is to output a string. It does this by looking at contigious slices of the string with a fixed starting point (the start of the string) for valid base64 strings. Once one has been found, it will `atob` it and output it.

If no such string is found (i.e. all substrings starting with the beginning error when decoded), the "eval" mode will be activated. The first character marks a delimit character, and the rest of the program is split at that character. Each subsection made by this split is interpreted as a base64 character string, the result of which is then joined together and evaled as the source code of the base langauage, in this case, JavaScript.
