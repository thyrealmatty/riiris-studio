#!/usr/bin/env node
/**
 * ADD SONGS — the easy way.
 *  1. Drop your MP3/M4A files (and optional cover images with the SAME name) into the  new-songs  folder.
 *  2. Double-click ADD-SONGS.bat   (or run:  npm run add-songs)
 * It creates/updates each song, copies the files into place, then commits and pushes
 * to GitHub in small batches so uploads never time out. Netlify publishes it automatically.
 * A song that already exists (same name) just gets its audio/artwork attached.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inbox = path.join(root, 'new-songs')
const AUDIO = ['.mp3', '.m4a', '.aac', '.ogg']
const IMAGES = ['.jpg', '.jpeg', '.png', '.webp']
const BATCH_MB = 40
const MAX_MB = 90
const noPush = process.argv.includes('--no-push')

const slug = (name) =>
  name.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-')
const prettyTitle = (name) => name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
const git = (...a) => execFileSync('git', a, { cwd: root, stdio: 'inherit' })
const mb = (n) => n / 1024 / 1024

if (!fs.existsSync(inbox)) fs.mkdirSync(inbox, { recursive: true })
const files = fs.readdirSync(inbox).filter((f) => !f.startsWith('.') && !/^readme/i.test(f))
const audios = files.filter((f) => AUDIO.includes(path.extname(f).toLowerCase()))
const images = files.filter((f) => IMAGES.includes(path.extname(f).toLowerCase()))
const skipped = files.filter((f) => !audios.includes(f) && !images.includes(f))

if (!audios.length) {
  console.log('\nNo songs found. Put .mp3 or .m4a files in the "new-songs" folder, then run this again.')
  if (skipped.length) console.log('Ignored (not MP3/M4A):', skipped.join(', '), '\nTip: convert .wav files to MP3 first.')
  process.exit(0)
}

for (const d of ['public/audio', 'public/images/songs', 'content/songs']) fs.mkdirSync(path.join(root, d), { recursive: true })

const batches = [[]]
let batchSize = 0
const done = []
const usedImages = []
for (const file of audios) {
  const src = path.join(inbox, file)
  const size = mb(fs.statSync(src).size)
  if (size > MAX_MB) { console.log(`✗ ${file} is ${size.toFixed(0)} MB — too big for GitHub. Export it as a 128 kbps MP3 first.`); continue }
  if (size > 15) console.log(`! ${file} is ${size.toFixed(0)} MB — works, but a 128 kbps MP3 (~4 MB) loads much faster.`)
  const id = slug(file)
  if (!id) { console.log(`✗ Can't use the file name "${file}". Rename it with letters/numbers.`); continue }

  const audioName = id + path.extname(file).toLowerCase()
  fs.copyFileSync(src, path.join(root, 'public/audio', audioName))
  const touched = [`public/audio/${audioName}`]

  let artwork
  const img = images.find((i) => slug(i) === id)
  if (img) {
    artwork = `/images/songs/${id}${path.extname(img).toLowerCase()}`
    fs.copyFileSync(path.join(inbox, img), path.join(root, artwork.slice(1).replace(/^/, 'public/')))
    touched.push(`public${artwork}`)
    usedImages.push(img)
  }

  const jsonPath = path.join(root, 'content/songs', `${id}.json`)
  const existed = fs.existsSync(jsonPath)
  const song = existed
    ? JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    : { title: prettyTitle(file), artist: 'BabyRiiri', featuredArtists: [], album: '', artwork: '', audioSrc: '', releaseDate: '', genre: '', featured: false, newRelease: false, trending: false, description: '', addedAt: new Date().toISOString() }
  song.audioSrc = `/audio/${audioName}`
  if (artwork) song.artwork = artwork
  fs.writeFileSync(jsonPath, JSON.stringify(song, null, 2) + '\n')
  touched.push(`content/songs/${id}.json`)

  if (batchSize + size > BATCH_MB && batches.at(-1).length) { batches.push([]); batchSize = 0 }
  batches.at(-1).push({ title: song.title, touched })
  batchSize += size
  done.push(file)
  console.log(`✓ ${song.title}  ${existed ? '(updated existing song)' : '(new song)'}${artwork ? '  + artwork' : ''}`)
}

if (!done.length) process.exit(1)

if (noPush) { console.log('\n(--no-push) Files are in place. Commit and push when ready.'); process.exit(0) }

try {
  try { git('pull', '--rebase', '--autostash') } catch { console.log('(skipped pull — continuing)') }
  batches.filter((b) => b.length).forEach((b, i, all) => {
    console.log(`\nUploading batch ${i + 1} of ${all.length}…`)
    git('add', '--', ...b.flatMap((x) => x.touched))
    git('commit', '-m', `Add songs: ${b.map((x) => x.title).join(', ')}`.slice(0, 120))
    git('push')
  })
  for (const f of done) fs.rmSync(path.join(inbox, f))
  for (const i of usedImages) fs.rmSync(path.join(inbox, i), { force: true })
  console.log('\n✅ Done! Netlify is publishing now — your songs go live in about a minute.')
} catch (e) {
  console.log('\n⚠ Your files are saved in the project but the upload to GitHub did not finish.')
  console.log('  Check your internet connection and run ADD-SONGS.bat again — it will continue safely.')
  process.exit(1)
}
