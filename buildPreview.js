import { execSync } from 'child_process'
import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

;(async () => {
  try {
    console.log('Killing port 3333...')
    execSync('port-killer 3333', { stdio: 'inherit' })
    console.log('----------------------------------------')
    await sleep(2000)

    console.log('rm -rf ./build')
    execSync('rm -rf ./build')
    console.log('----------------------------------------')
    await sleep(2000)

    console.log('Building the project...')
    execSync('npm run build', { stdio: 'inherit' })
    console.log('----------------------------------------')
    await sleep(2000)

    console.log('Copying .env to the build directory...')
    if (existsSync('.env')) {
      let envContent = readFileSync('.env', 'utf-8')
      envContent = envContent.replace(/NODE_ENV=development/g, 'NODE_ENV=production')
      writeFileSync('./build/.env', envContent)
      console.log('.env file copied and modified successfully.')
    } else {
      console.warn('No .env file found, skipping this step.')
    }
    console.log('----------------------------------------')
    await sleep(2000)

    console.log('Installing production dependencies...')
    execSync('npm ci --omit="dev"', { stdio: 'inherit', cwd: './build' })
    console.log('----------------------------------------')
    await sleep(2000)

    console.log('Starting the server...')
    execSync('node bin/server.js', { stdio: 'inherit', cwd: './build' })
  } catch (error) {
    console.error('An error occurred:', error.message)
    process.exit(1)
  }
})()
