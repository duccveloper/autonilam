# THIS PROJECT IS ARCHIVED BECAUSE OF NEW NILAM SYSTEM
## maybe will fix but f4 no time
## AutoNilam script here: https://github.com/du-cc/BetterNilam/blob/main/AutoNilam.js
## feel free to see how these work together lol, [give feedback here](https://forms.gle/pZG8rdTAu64wPVL28)
<br>
<code>It was capable to automate Nilam submissions seamlessly with ChatGPT integration, website styling, and dynamic synopsis generation for a simplified experience.
</code>
<br>
<hr>


# How It Works

## Injecting and Initialization

- **Functions Involved**: `autoLogin()`, `webFetch()`, `inject()`, `detectSite()`, `data()`

- If auto-login is enabled and the user is logged out, it logs them in.

- Fetches HTML elements from [here](https://github.com/du-cc/BetterNilam/tree/main/elements).

- Injects elements like CSS and sidebar.

- Detects the site; if the user is on a specific site, it fetches and injects corresponding HTML.

- Fetches a custom theme from cookies, setting it to default if not present.

## BetterNilam

- **Functions Involved**: `inject()`, `webFetch()`, `data()`

- Loads current settings.

- Replaces CSS `<style>` with a new one when previewing.

- Replaces the style cookie when applying changes.

- Removes CSS and cookies when disabling BetterNilam.

## EzNilam

- **Functions Involved**: `webFetch()`, `inject()`, `data()`, `sendNilam()`

- **On Submission**:

  - Fetches [this page](https://nilamjohor.edu.my/aktiviti-bacaan/index?AktivitiBacaanSearch[pageSize]=10000).

  - Extracts the list of previously read books.

  - Replaces default synopsis arguments with information.

  - Checks if the title is in the list of past read books; if yes, aborts the operation.

  - Parses data and sends a POST request to [this endpoint](https://nilamjohor.edu.my/aktiviti-bacaan/create).

## AutoNilam

- **Functions Involved**: `webFetch()`, `inject()`, `data()`, `sendNilam()`

  - Generates a prompt using preferred settings.

  - **After pasting output from ChatGPT**:

    - Parses JSON.

    - Loops through the output books to find past read books.

    - If in legit mode, sets a timeout for every book; else, instantly sends all books.

    - Creates a status element for the sending status.

    - Loops to parse data and sends a POST request to [this endpoint](https://nilamjohor.edu.my/aktiviti-bacaan/create) for every book.

# Install (requires UserScript extension eg: Tampermonkey)
# [Latest version](https://raw.githubusercontent.com/du-cc/BetterNilam/main/betterNilam.user.js)

## Manually load (not recommended)
```js
document.head.appendChild(Object.assign(document.createElement('script'), { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/du-cc/BetterNilam@main/source.js' }));
```
