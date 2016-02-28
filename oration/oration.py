#!/usr/bin/env python
import sys,re
file = open(sys.argv[1])
try:
	if sys.argv[2] == '2':
		version=2
	else:
		version=3
except:
	version=3

to_parse = []
filler = re.compile(r"\s+(?:um+|alrighty?|sh(?:oo|i)t)\s?(?:[,:]?|(?:[!.?])+)\s*")

def cleanse(string):
	return re.sub(r"([!.?`]|\.\.\.)$","",string)

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

def breath_hyper_error(errorcode):
	print_syntax=(('print(',')'),('print ',''))[version-2]
	exec printsyntax[0] + errorcode + print_syntax[1]
	sys.exit()
	

MAX_BREATH   = 7
breath       = 7
deep_breaths = 0
compiled     = ""
module       = ""
tab_level    = 0
line         = 0
commented    = False

for ex in to_parse:
	ex=ex.lower()
	space_ex = ex.split(" ")
	if breath <= 0:
		breath_hyper_error('"BreathError: The program suffocated on line %s." % line')
	
	if not commented:
		deduct_breath = True
		if ex.startswith("we need ") or ex.startswith("i need ") or ex.startswith("you need "):
			module = ex[7:-1]
			compiled += "import " + module + "\n"
		elif ex.startswith("to iterate, "):
			compiled += "while " + ex[12:-1] + ":\n"
			tab_level += 1
			compiled += "\t" * tab_level
		elif ex.startswith("now"):
			compiled += module + "." + ex[4:-1] + "\n"
		elif ex.startswith("chop"):
			compiled = compiled[:int(-1*len(ex)/5)]
		elif ex.startswith("start a "):
			key_word = space_ex[2]
			if key_word == "function":
				compiled += "\t" * tab_level + "def " + cleanse(space_ex[3])
				tab_level += 1
				compiled += "(" + cleanse(",".join(space_ex[5:])) + "):\n"
		elif ex.startswith("return"):
			compiled += "\t" * tab_level + "return " + cleanse(ex[6:]) + "\n"
		elif ex.startswith("give you") or ex.startswith("take this") or ex.startswith("here"):
			compiled += "\t" * tab_level + "return "
		elif ex.startswith("next"):
			compiled += "\n" + "\t" * tab_level
		elif ex.startswith("backtracking") or ex.startswith("take a step back"):
			tab_level -= 1
		elif ex.startswith("invoke"):
			input_phrase="eval(input)" if version - 2 else "eval(raw_input)"
			compiled += cleanse(space_ex[1]) + "(" + cleanse(",".join(space_ex[3:]).replace("number",input_phrase).replace("input","input(\"~> \")")) + ")"
		elif ex.startswith("capture"):
			compiled += "\""+cleanse(" ".join(space_ex[1:])).replace("\"","\\\"")+"\""
		elif ex.startswith("boring"):
			compiled += "print('\\n'\n)" if version - 2 else "print'\\n'\n"
		elif ex.startswith("listen"):
			compiled += "\t" * tab_level + "%s" % ("print ","print(")[version-2]
		elif ex.startswith("that's the point") or ex.startswith("that's it"):
			compiled += "%s\n" % ('',')')[version-2]
		elif ex.startswith("literally, "):
			compiled += cleanse(ex[11:])+" "
		elif ex.startswith("if "):
			compiled += "\t" * tab_level+"if " + cleanse(" ".join(space_ex[1:]))+":\n"
			tab_level += 1
		elif ex.startswith("i'm done"):
			tab_level = 0
			compiled += "\n"
		elif ex.startswith("goodbye") or ex.startswith("bye"):
			compiled += "\t" * tab_level + "sys.exit()\n"
		elif ex.startswith("fill me in"):
			compiled = fix_parens(compiled)
		elif ex.startswith("carry on") or ex.startswith("continue"):
			compiled += ")"
		elif ex.startswith("don't listen to me") or ex.startswith("shush"):
			commented = True
		else:
			deduct_breath = False
		
		# controlling breathing
		if ex.startswith("breathe"):
			breath = MAX_BREATH
			deep_breaths = 0 if deep_breaths <= 0 else deep_breaths - 1
		elif ex.startswith("inhale"):
			breath = 2*MAX_BREATH
			if deep_breaths > 2:
				breath_hyper_error('"HyperventilationError: The program lost the will to continue on line %s." % line)')
		elif deduct_breath:
			breath -= len(space_ex)
		
		line += 1
	elif ex.startswith("hear me out now") or ex.startswith("sorry"):
		commented = False
		breath -= 1

compiled = fix_parens(compiled)

filename=sys.argv[1].replace('\/','\\')
filename=filename[filename.rfind('/'):] if filename.rfind('/') != -1 else sys.argv[1]
filename=filename[:filename.rfind('.or')]

a=open("%s_compiled.py" % filename,"w")

a.write('#!/usr/bin/env python'+ str(version)+'\n')
a.write(compiled)

a.close()
