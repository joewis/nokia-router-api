# Router Web-App JavaScript (de-minified)

De-minified JavaScript bundles from the Nokia 3121 (Beacon 2) router admin SPA,
served from the router's `/web_whw/` path. These are **reference material** for
reverse-engineering the router's admin API — they are not part of the Python
client and are not executed.

## Files

| File | Source | Size | Purpose |
|---|---|---|---|
| `main.js` | `main.d55f48477b4a6570.js` (app-shell chunk 179) | 3.3MB / 44k lines | API service, data models, constants, login flow, endpoint map |
| `chunk-733.js` | `733.7bea0b77deb52a2d.js` (lazy chunk) | 174KB | System Log settings page — contains the `set_log_glb` payload builder |
| `runtime.js` | `runtime.3a6d1acc317438f9.js` | 3.2KB | Webpack chunk map (chunk id → filename hash) |

## Provenance

- Downloaded from `https://192.168.18.1/web_whw/` (authenticated session) on
  2026-09-06.
- De-minified with `js-beautify@1.15.1`.
- The SPA is Angular (webpack chunk id 179 app-shell; feature pages are
  lazy-loaded chunks).

## What was extracted

The `set_log_glb` payload format, found in `chunk-733.js`:

```js
const t = `logLevel=${this.writingLevel.value}&logDispLevel=${this.readingLevel.value}`;
this.api.request(this, "setlog", t);
```

- `logLevel` = capture level, numeric 0-7 (maps to `ct_syslog_cfg.Level`)
- `logDispLevel` = display level, string ("Error", "Debug", etc.)

Valid capture levels (from `writingLevelList`):
`Emergency`(0), `Alert`(1), `Critical`(2), `Error`(3), `Warning`(4),
`Notice`(5), `Informational`(6), `Debug`(7).

This is implemented in `nokia_api.py` as `set_log_level()`.

## Chunk map (from runtime.js)

```
32:8dae6a257751c8b8  119:72cef3b6a55d6db3  152:55a79504c4f35ab2
255:a5825ef2dcd5a0fd  294:8383ef2d5890924b  390:fa1519dd52f8a890
412:9706d586a2c17e32  427:3ab5fc7008a2092c  592:e8052c467830413c
632:c6c103ab0ef19a88  634:12407d9d2d198085  660:572905d636903b04
685:ea6c4320bfc78752  733:7bea0b77deb52a2d  848:4dc0f317cac5bb22
973:8a954ab24170910a
```

Chunk filenames follow the pattern `<id>.<hash>.js` (e.g. `733.7bea0b77deb52a2d.js`).
