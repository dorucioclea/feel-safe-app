const path  = require('path');
const readline = require('readline');
const stylelint  = require('stylelint');

const cliQuestion = 'Do you want to fox it? (y for yes)';
const green = '\x1b[32m%s\x1b[0m';

let options = {
  fix: false,
  files: path.join(__dirname, "../src/theme/**/*.scss"),
  formatter: "string"
};

stylelint
  .lint(options)
  .then((data) =>  {
    if (data.errored === false) { return; }

    console.log(data.output);

    let interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    interface.question(`\x1b[33m${cliQuestion}\x1b[0m\n`, (answer) => {
      if (`${answer}` === 'y') {
        options.fix = true;
        stylelint.lint(options);
        console.log(green, 'fixed');
      }
      interface.close()
    });
  });
