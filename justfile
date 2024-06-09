# just docs: https://github.com/casey/just
set shell         := ["bash", "-c"]
set dotenv-load   := true
set export        := true

@_help:
	echo ""
	just --list --unsorted --list-heading $'🚚 Commands:\n'
	echo -e ""

# development stack
@check:
	deno check src/mod.ts
	echo -e "deno check ✅ "

watch:
  docker compose up
	
# development stack
# watch:
# 	watchexec --exts ts --watch src -- deno check src/mod.ts