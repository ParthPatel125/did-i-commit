<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/header-dark.svg">
  <img src="assets/header-light.svg" width="100%" alt="did-i-commit. did you commit today? a tiny cli that knows.">
</picture>

github only gives you a green square if you contribute before midnight. this
is a tiny command-line tool that checks whether you've earned today's square
yet, and sends you a desktop notification if you haven't. no api token to
create, no config file, no dependencies to install: it borrows authentication
from the github cli you already have.

```
$ node did-i-commit.js
✓ ParthPatel125: 2 contributions today. streak safe.

$ node did-i-commit.js
✗ ParthPatel125: no contributions yet today. 2.4h until midnight.
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/h-install-dark.svg">
  <img src="assets/h-install-light.svg" alt="install">
</picture>

you need two things, both of which you probably have already:

- [node](https://nodejs.org) 18 or newer
- the [github cli](https://cli.github.com), logged in (`gh auth login`)

then:

```
git clone https://github.com/ParthPatel125/did-i-commit
cd did-i-commit
node did-i-commit.js
```

that's the whole install. the script is one file with zero npm packages, so
there is nothing to `npm install` and nothing to keep updated.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/h-the-nag-dark.svg">
  <img src="assets/h-the-nag-light.svg" alt="the nag">
</picture>

add `--nag` and it sends a desktop notification when you're at risk, on macos
(via the built-in notifier) or linux (via `notify-send`):

```
node did-i-commit.js --nag
```

the useful setup is running that on a schedule, so it catches you while
there's still time to do something about it. with cron, every day at 9pm:

```
crontab -e
0 21 * * * /usr/bin/env node /path/to/did-i-commit.js --nag
```

if today's square is already earned, the scheduled run stays silent. you only
hear from it when the streak is actually in danger.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/h-scripting-dark.svg">
  <img src="assets/h-scripting-light.svg" alt="scripting">
</picture>

exit codes are meaningful, so you can build on top of it:

- `0`: you contributed today
- `1`: not yet
- `2`: couldn't reach github (gh missing or not logged in)

```
node did-i-commit.js || echo "go write some code"
```

put it in your shell prompt, your tmux status bar, wherever a one-bit answer
is useful.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/h-how-it-counts-dark.svg">
  <img src="assets/h-how-it-counts-light.svg" alt="how it counts">
</picture>

"contributions" means whatever github counts on your profile graph: commits,
pull requests, issues, and reviews. the script asks the graphql api for your
contribution calendar covering just today (your local midnight to right now),
so its answer always agrees with the green square you're trying to earn. it
makes exactly one api call per run.

---

mit licensed. built because the author kept losing streaks at 11:58pm.
