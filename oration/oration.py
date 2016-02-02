import sys,re
file = open(sys.argv[1])
to_parse = []
filler = re.compile(r"\s+(?:um+|alrighty?|sh(?:oo|i)t)\s?(?:[,:]?|(?:[!.?])+)\s*")

def cleanse(string):
	return re.sub(r"([!.?]|\.\.\.)$","",string)

def fix_parens(string):
	level = 0
	orig_string = string
	for c in string[::-1]:
		if c == "(":
			level += 1
		elif c == ")":
			level -= 1
		if level > 0:
			string += ")"
			break
	if string==orig_string:
		return string
	else:
		return fix_parens(string)

for line in file:
	# remove filler words
	line = re.sub(filler,"",line)
	to_parse += re.split(r"(<=[!.?:]) ",line.replace("\n",""))

MAX_BREATH   = 7
breath       = 7
deep_breaths = 0
compiled     = ""
tab_level    = 0
line         = 0
commented    = False

for ex in to_parse:
	space_ex = ex.split(" ")
	if breath <= 0:
		print("BreathError: The program suffocated on line %s." % line)
		sys.exit()
	if not commented:
		if ex.lower().startswith("we need ") or ex.lower().startswith("i need ") or ex.lower().startswith("you need "):
			compiled += "import " + ex[8:-1] + "\n"
		elif ex.lower().startswith("start a "):
			key_word = space_ex[2]
			if key_word == "function":
				compiled += "\t" * tab_level + "def " + cleanse(space_ex[3])
				tab_level += 1
				compiled += "(" + cleanse(",".join(space_ex[5:])) + "):\n"
		elif ex.lower().startswith("return"):
			compiled += "\t" * tab_level + "return " + cleanse(ex[6:]) + "\n"
		elif ex.lower().startswith("give you") or ex.lower().startswith("take this") or ex.lower().startswith("here"):
			compiled += "\t" * tab_level + "return "
		elif ex.lower().startswith("next"):
			compiled += "\n" + "\t" * tab_level
		elif ex.lower().startswith("backtracking") or ex.lower().startswith("take a step back"):
			tab_level -= 1
		elif ex.lower().startswith("invoke"):
			compiled += cleanse(space_ex[1]) + "(" + cleanse(",".join(space_ex[3:]).replace("number","eval(input)")).replace("input","input(\"~>\")") + ")"
		elif ex.lower().startswith("capture"):
			compiled += "\""+cleanse(" ".join(space_ex[1:])).replace("\"","\\\"")+"\""
		elif ex.lower().startswith("listen"):
			compiled += "\t" * tab_level + "print("
		elif ex.lower().startswith("that's the point") or ex.lower().startswith("that's it"):
			compiled += ")\n"
		elif ex.lower().startswith("literally, "):
			compiled += cleanse(ex[11:])+" "
		elif ex.lower().startswith("if "):
			compiled += "\t" * tab_level+"if " + cleanse(" ".join(space_ex[1:]))+":\n"
			tab_level += 1
		elif ex.lower().startswith("i'm done"):
			tab_level = 0
			compiled += "\n"
		elif ex.lower().startswith("goodbye") or ex.lower().startswith("bye"):
			compiled += "\t" * tab_level + "sys.exit()\n"
		elif ex.lower().startswith("fill me in"):
			compiled = fix_parens(compiled)
		elif ex.lower().startswith("carry on") or ex.lower().startswith("continue"):
			compiled += ")"
		elif ex.lower().startswith("don't listen to me") or ex.lower().startswith("shush"):
			commented = True
		
		# controlling breathing
		if ex.lower().startswith("breathe"):
			breath = MAX_BREATH
			deep_breaths = 0 if deep_breaths <= 0 else deep_breaths - 1
		elif ex.lower().startswith("inhale"):
			breath = 2*MAX_BREATH
			if deep_breaths > 2:
				print("HyperventilationError: The program lost the will to continue on line %s." % line)
			deep_breaths += 1
		else:
			breath -= len(space_ex)
		line += 1
	elif ex.lower().startswith("hear me out now") or ex.lower().startswith("sorry"):
		commented = False
		breath -= 1

compiled = fix_parens(compiled)
a=open("compiled.txt","w")
a.write(compiled)
exec(compiled)
