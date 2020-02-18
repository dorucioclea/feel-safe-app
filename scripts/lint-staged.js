/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-var-requires */
const sgf = require('staged-git-files');
const { spawn } = require('child_process');

sgf((error, stagedFiles) => {
  if (error) {
    console.log(error);
  }

  if (!stagedFiles.length) {
    return process.exit(0);
  }

  const files = [];

  for (const stagedFile of stagedFiles) {
    if (stagedFile.filename.indexOf('.ts') > -1) {
      files.push(` ${stagedFile.filename}`);
    }
  }

  console.log(...files);

  const npm = spawn('eslint', [...files], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });

  let errorCount = 0;

  npm.stdout.on('data', (data) => {
    const output = data.toString();

    console.log(output);

    if (output.indexOf('error') > -1) {
      const count = (output.match(/error/g) || []).length;
      errorCount += count;
    }
  });

  npm.stderr.on('data', () => {
    // console.error(data.toString());
  });

  npm.on('close', (code) => {
    console.log(`${errorCount} errors while linting staged files!`);

    if (code && errorCount) {
      if (process.argv[2] === '--no-hard-exit') {
        return process.exit(0);
      }
      
      return process.exit(1);
    }
  });
});