# just docs: https://github.com/casey/just
set shell        := ["bash", "-c"]
set dotenv-load  := true
set export       := true
normal           := '\033[0m'
green            := "\\e[32m"

@_help:
  echo ""
  just --list --unsorted --list-heading $'🚚 Commands:\n'
  echo -e ""
  echo -e "    Quick links:"
  echo -e "       module page:          {{green}}https://jsr.io/@metapages/deno-redis-broadcastchannel{{normal}}"
  echo -e "       github repo:          {{green}}https://github.com/dionjwa/deno-redis-broadcastchannel{{normal}}"  

# Develop: run the tests and rerun on changes
dev:
  docker compose up

# Quick compile checks
@check:
	deno check src/mod.ts
	echo -e "deno check ✅ "

# Test: TODO (currrently not implemented)
@test:
  echo "TODO: add tests"