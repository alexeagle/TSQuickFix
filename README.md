# Quick fixes

Quick fixes are coming in TypeScript, maybe in 2.1 (though it's not currently on the https://github.com/Microsoft/TypeScript/wiki/Roadmap#21)
This is great for your editor (just fix it please) and also for big-codebase janitoring (automatically fix a thing across Angular).

# Try it out

Here's a program with a simple diagnostic:

![problem](problem.png)

If you pull https://github.com/Microsoft/TypeScript/pull/9304 you can build a
TypeScript that knows how to fix some diagnostics.

Since this isn't available in any editors yet, I wrote a little command-line harness to run it
and just print the diff it would apply:

![fix](fix.png)
