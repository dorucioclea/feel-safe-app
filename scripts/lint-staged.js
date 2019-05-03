const sgf = require('staged-git-files');
const { spawn } = require('child_process');

sgf((error, stagedFiles) => {
  if (error) {
    console.log(error);
  }

  let files = [];

  for (const stagedFile of stagedFiles) {
    files.push(` --files ${stagedFile.filename}`);
  }

  const npm = spawn('npm', ['run', 'lint', '--', 'app', ...files, ], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });

  let errorCount = 0;

  npm.stdout.on('data', (data) => {
    const output = data.toString();

    console.log(output);

    if (output.indexOf('ERROR') > -1) {
      const count = (output.match(/is/g) || []).length;
      errorCount += count;
    }
  });

  npm.stderr.on('data', (data) => {
    // console.error(data.toString());
  });

  npm.on('close', (code) => {
    if (code && errorCount) {
      console.log(`${errorCount} errors while linting staged files!`);

      if (process.argv[2] === '--no-hard-exit') {
        return process.exit(0);
      }
      
      return process.exit(1);
    }
  });
});