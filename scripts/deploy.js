const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const liveDir = path.join(root, '.next')
const tmpDir = path.join(root, '.next-build-tmp')
const oldDir = path.join(root, '.next-old')

function run(cmd, env) {
  execSync(cmd, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } })
}

function gitShortSha() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim()
  } catch {
    return String(Date.now())
  }
}

// Windows file locks (AV scanners, editor watchers) can make a rename fail
// transiently right after a build; retry briefly before giving up.
function renameWithRetry(src, dest, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      fs.renameSync(src, dest)
      return
    } catch (err) {
      if (i === attempts - 1) throw err
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300)
    }
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true })
fs.rmSync(oldDir, { recursive: true, force: true })

// Build into a fresh directory instead of wiping the live .next in place —
// PM2 keeps serving the current build's assets from disk until the swap below.
run('npm run build', {
  NEXT_DIST_DIR: '.next-build-tmp',
  NEXT_DEPLOYMENT_ID: gitShortSha(),
})

if (fs.existsSync(liveDir)) renameWithRetry(liveDir, oldDir)
renameWithRetry(tmpDir, liveDir)
fs.rmSync(oldDir, { recursive: true, force: true })

try {
  run('pm2 reload ecosystem.config.js --env production')
} catch {
  console.warn('pm2 reload failed — restart the app manually to pick up the new build.')
}
