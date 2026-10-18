# BabyRiiri 🎵

BabyRiiri's official music app — a fast, installable PWA built with React, Vite and Tailwind.
Visitors can **listen, search, browse, favorite and install**. Only the owner can change the catalogue,
through a **login-protected admin panel** at `/admin`.

---

## How it's locked down

| | Visitors | Owner (logged in) |
|---|---|---|
| Play / pause / seek / skip / shuffle / repeat / volume / queue | ✅ | ✅ |
| Search, browse songs · albums · playlists · artist profile | ✅ | ✅ |
| Favorites, recently played, theme, install the app | ✅ (saved on their device only) | ✅ |
| Add / edit / delete songs, albums, playlists, bio, release dates | ❌ no UI, no route, no code path | ✅ via `/admin` |
| Upload audio / artwork | ❌ | ✅ via `/admin` |

* The public app has **no** Content Manager, editors, import/export or upload screens — they were removed, not hidden.
* The catalogue is plain files in the repo (`content/`), baked into the build. There is nothing a visitor's browser can write to.
  Editing localStorage only affects that visitor's own favorites. Old locally-stored catalogue data from earlier builds is purged on load.
* `/admin` requires a **GitHub login with write access to this repo**. Anyone else is refused by GitHub itself.
  A save in the admin is a commit to GitHub → Netlify rebuilds → it goes live.
* `/admin` is excluded from search engines (`robots.txt`, `X-Robots-Tag`) and from the PWA cache.

## Project layout

```
content/                 ← THE CATALOGUE (edited by the admin panel or by hand)
  songs/*.json             one file per song
  albums/*.json            one file per album (tracklist is derived from each song's "album")
  playlists/*.json         one file per playlist
  announcements/*.json     homepage announcement cards
  artist.json              artist profile, bio, social links
public/
  audio/                   ← audio files (mp3 / m4a)
  images/                  ← artwork
  admin/                   ← Decap CMS admin (index.html + config.yml)
src/data/babyriiri.js    ← reads /content and hands it to the app (the single data entry point)
netlify.toml             ← build + headers + SPA redirect
```

The UI is fully data-driven. **Adding a song never requires touching `Home.jsx`, `Library.jsx`, `Explore.jsx`,
`MusicPlayer.jsx` or `SongCard.jsx`** — add one JSON file (the admin does this for you).
A song with no audio file shows as **"Soon"** and opens its detail page instead of failing to play.

---

## One-time setup

### 1. Put this project in your repo and deploy to Netlify
```bash
# from inside this folder (after copying it over the repo contents)
git add -A
git commit -m "BabyRiiri v2: locked-down public app + admin panel"
git push origin main
```
Netlify → **Add new site → Import an existing project → GitHub → thyrealmatty/riiris-studio**.
Build settings come from `netlify.toml` (`npm run build`, publish `dist`) — just click Deploy.
From now on **every push to `main` auto-builds and publishes.**

> If your default branch isn't `main`, change `branch:` in `public/admin/config.yml`.

### 2. Turn on the admin login (GitHub OAuth)
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   * Homepage URL: your Netlify site URL
   * Authorization callback URL: `https://api.netlify.com/auth/done`
   * Copy the **Client ID** and generate a **Client Secret**.
2. Netlify → your site → **Site configuration → Access & security → OAuth → Install provider → GitHub**,
   paste the Client ID + Secret.
3. Open `https://YOUR-SITE/admin/` → **Login with GitHub**.

Only GitHub accounts with write access to the repo can save changes. To give someone else access, add them as a
collaborator on the repo; to remove access, remove them.

> Netlify's dashboard labels move around over time. If the OAuth option isn't where described, any
> Decap-compatible GitHub OAuth proxy works — set `base_url:` under `backend:` in `public/admin/config.yml`.

---

## Adding a song (the everyday workflow)

1. Go to `/admin/` and log in.
2. **Songs → New Song.** Fill in the title (everything else is optional — nothing is made up), pick the album,
   drop in the **audio file** and **artwork**, tick *New Release* / *Trending* / *Feature on homepage* if wanted.
3. **Publish.** Netlify rebuilds (about a minute) and the song is live for everyone.

Edit or delete a song the same way. Albums pick up their songs automatically from the song's *Album* field.
Delete a *Homepage Announcement* to take it off the homepage.

Tips: export audio as **MP3 128–192 kbps** (or M4A) to keep loading fast; artwork **square, 600×600 or larger**.

### Editing in VS Code instead
Everything in `content/` is plain JSON, so you can edit it by hand, or drop audio in `public/audio/` and set
`"audioSrc": "/audio/your-file.mp3"` in the song's JSON. Then:
```bash
git pull          # the admin panel commits to GitHub too — always pull first
git add -A && git commit -m "Add new song" && git push
```

## Local development
```bash
npm install
npm run dev            # http://localhost:5173
npm run cms            # optional: in a 2nd terminal, lets /admin edit local files without GitHub login
npm run build          # production build → dist/
npm run preview        # test the production build + PWA locally
```

## What's in the app
* Home (featured, jump back in, new releases, listen now, playlists, announcements), Library, Explore, Search, Artist profile, Settings
* Full-screen player + mini-player, **Up next queue**, shuffle/repeat, seek, volume, share, favorites
* Lock-screen / headset controls (Media Session), desktop shortcuts: `Space` play/pause, `←/→` seek 5s, `Shift+←/→` previous/next
* Installable PWA with offline-friendly caching (audio supports seeking from cache), install card + Settings entry (with iOS steps)
* Light / dark theme, respects "reduce motion"

## Privacy
Favorites, recently played, queue, volume and theme are stored **only on the visitor's device**. The app has no
accounts, comments or forms, and the public profile shows only city/country-level location and links the owner chooses to publish.
