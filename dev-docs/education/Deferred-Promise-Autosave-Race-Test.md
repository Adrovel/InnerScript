---
created: 2026-06-19 09:16:58
modified: 2026-06-19 09:16:58
---
# Deferred Promise Autosave Race Test

Created: 2026-06-04
Context: InnerScript editor autosave behavior.

## The Code

```js
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

it("keeps newer body when older save returns late", async () => {
  const firstSave = deferred();

  // queue save for "hello"
  // start save, return firstSave.promise

  // queue newer body "hello world" before firstSave resolves

  firstSave.resolve({
    id: "entry-1",
    title: null,
    body: "hello",
    entry_type: "note",
    created_at: "...",
    updated_at: "...",
  });

  // assert local editor/body is still "hello world"
  // assert another save is queued for "hello world"
});
```

## What `deferred()` Does

Normally, a promise resolves whenever the async function finishes.

`deferred()` lets the test control exactly when the promise resolves.

It returns three things:

| Piece | Meaning |
|---|---|
| `promise` | The promise the app/test will wait on. |
| `resolve` | A function the test can call later to make the promise succeed. |
| `reject` | A function the test can call later to make the promise fail. |

This is useful for testing bad timing.

## Why This Tests Autosave Races

An autosave race happens when saves finish in a different order than they started.

Example:

1. User types `hello`.
2. App starts save A for `hello`.
3. Before save A finishes, user types `hello world`.
4. App now has newer local text: `hello world`.
5. Save A finishes late and returns the old body: `hello`.

The bug would be:

```text
local editor says "hello world"
late server response says "hello"
app accidentally overwrites editor back to "hello"
```

The correct behavior is:

```text
late old save returns
editor still shows "hello world"
app knows another save is needed for "hello world"
```

## What The Test Is Trying To Prove

The test forces save A to pause by returning `firstSave.promise`.

While save A is still pending, the test simulates a newer edit.

Then the test manually calls:

```js
firstSave.resolve({
  body: "hello",
});
```

That means:

```text
the older save finally returned
```

Now the app must not trust that old response blindly. It should keep the newer body in local state and queue or run another save for the newer body.

## Why The Returned Body Is Old

The resolved response contains:

```js
body: "hello"
```

That is intentional. It represents the server finishing the old request.

The editor already moved on to:

```js
"hello world"
```

So the test checks that the old response does not erase newer user input.

## Two Ways To Test This

### Option 1: Pure Helper Or Hook Tested With Vitest Only

This means extracting the autosave decision logic into a pure function or a small hook, then testing it directly.

Example target:

```js
shouldApplySaveResponse({
  response_body: "hello",
  current_body: "hello world",
  save_started_at_version: 1,
  current_version: 2,
});
```

You are testing the logic, not the full screen.

Use this when:

- You want fast tests.
- You want simpler setup.
- You only need to prove save-order logic.
- You do not need real typing, DOM events, focus, textareas, or React rendering.

Pros:

- Fast.
- Less flaky.
- Easier to understand.
- No browser-like environment needed.
- Good for edge cases like old save returns late, failed save, duplicate save, and dirty state.

Cons:

- It does not prove the real editor UI wires the logic correctly.
- It may miss bugs in event handlers, debouncing, focus, textarea updates, or React state timing.

### Option 2: Install Testing Library, User Event, And jsdom

This means testing the editor more like a real user would use it.

Packages:

```bash
npm install -D @testing-library/react @testing-library/user-event jsdom
```

Then the test can render the editor, type into the textarea, wait for autosave behavior, and assert what appears on screen.

You are testing the UI plus the logic together.

Use this when:

- You want true browser-style typing tests.
- You need to verify React rendering and state updates.
- You care about textarea behavior, focus, keyboard events, debounced saves, and screen output.
- You want confidence that the real component works, not only the extracted logic.

Pros:

- Closer to the actual user experience.
- Catches wiring bugs between UI and autosave logic.
- Good for testing "user types, UI shows this, save gets called" flows.

Cons:

- More dependencies.
- More setup.
- Slower than pure function tests.
- Can become flaky if timers, debouncing, and async saves are not controlled carefully.

## The Difference In One Line

Pure Vitest helper/hook test:

```text
Does the autosave logic make the right decision?
```

Testing Library + jsdom test:

```text
Does the actual editor behave correctly when a user types?
```

## Practical Recommendation For InnerScript

Start with Option 1.

Extract the autosave race logic into a small pure helper or hook and test it with Vitest. That gives quick confidence around the hardest part: stale saves returning late.

Add Option 2 later if the editor UI itself becomes tricky, especially around typing, focus, debounce timing, or visible save-status behavior.
