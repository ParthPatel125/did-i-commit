# did-i-commit

a tiny cli that checks whether you contributed on github today, and nags you
with a desktop notification if you haven't. zero dependencies: auth is
borrowed from the gh cli you already have.

```
$ node did-i-commit.js
✓ ParthPatel125: 4 contributions today. streak safe.

$ node did-i-commit.js
✗ ParthPatel125: no contributions yet today. 2.4h until midnight.
```

## install

```
git clone https://github.com/ParthPatel125/did-i-commit
cd did-i-commit
node did-i-commit.js
```

needs node 18+ and the [gh cli](https://cli.github.com) logged in
(`gh auth login`). that's it. no token to paste anywhere.

## the nag

`--nag` sends a desktop notification (macos or linux) when you're at risk:

```
node did-i-commit.js --nag
```

run it on a schedule so it catches you before midnight. cron, every day at 9pm:

```
0 21 * * * /usr/bin/env node /path/to/did-i-commit.js --nag
```

## scripting

exit codes are meaningful, so you can chain it:

- `0`: contributed today
- `1`: not yet
- `2`: couldn't reach github

```
node did-i-commit.js || echo "go write some code"
```

## how it counts

"contributions" is whatever github counts on your graph: commits, prs, issues,
reviews. it queries the graphql api for today only (your local midnight to
now), so it agrees with the green square you're trying to earn.

## license

mit
