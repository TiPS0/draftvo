import fs from 'fs';
import path from 'path';

const platform = process.argv[2];

if (!platform || (platform !== 'macos' && platform !== 'windows')) {
  console.error('Please specify platform: "macos" or "windows"');
  process.exit(1);
}

const possibleBundleDirs = [
  path.join(process.cwd(), 'src-tauri', 'target', 'release', 'bundle'),
  path.join(process.cwd(), 'src-tauri', 'target', 'x86_64-pc-windows-msvc', 'release', 'bundle')
];

let bundleDir = null;
for (const dir of possibleBundleDirs) {
  if (fs.existsSync(dir)) {
    // If it's macos we need dmg, if it's windows we need nsis
    // But since cargo tauri build could leave artifacts in multiple folders,
    // let's just make sure the specific folder we need exists.
    if (platform === 'macos' && fs.existsSync(path.join(dir, 'dmg'))) {
      bundleDir = dir;
      break;
    }
    if (platform === 'windows' && fs.existsSync(path.join(dir, 'nsis'))) {
      bundleDir = dir;
      break;
    }
  }
}

if (!bundleDir) {
  console.error(`\n⚠️ Could not find Tauri bundle directory with installer files for ${platform}. Make sure the build completed successfully.\n`);
  process.exit(1);
}

const releaseDir = path.join(process.cwd(), 'releases', platform);

if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true });
}
fs.mkdirSync(releaseDir, { recursive: true });

let movedSomething = false;

if (platform === 'macos') {
  const dmgDir = path.join(bundleDir, 'dmg');
  if (fs.existsSync(dmgDir)) {
    const files = fs.readdirSync(dmgDir);
    for (const file of files) {
      if (file.endsWith('.dmg')) {
        fs.copyFileSync(path.join(dmgDir, file), path.join(releaseDir, file));
        console.log(`\n🎉 SUCCESS! Installer ready at: desktop/releases/macos/${file}\n`);
        movedSomething = true;
      }
    }
  }
}

if (platform === 'windows') {
  const nsisDir = path.join(bundleDir, 'nsis');
  if (fs.existsSync(nsisDir)) {
    const files = fs.readdirSync(nsisDir);
    for (const file of files) {
      if (file.endsWith('.exe')) {
        fs.copyFileSync(path.join(nsisDir, file), path.join(releaseDir, file));
        console.log(`\n🎉 SUCCESS! Installer ready at: desktop/releases/windows/${file}\n`);
        movedSomething = true;
      }
    }
  }
}

if (!movedSomething) {
  console.log(`\n⚠️ No installer files found to move for ${platform}! Make sure the build completed successfully.\n`);
}
