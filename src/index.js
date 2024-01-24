const {spawn} = require('cross-spawn');

function crossParams(argv) {
  const INTERPOLATION_REGEX = /\$\{([\w-]+)\}/gi;
const PARAM_REGEX = /--?([\w]+)(=|\s)([a-zA-Z0-9]+)?/g

const args = argv.slice(2);
const templateCmd = args[0]
const externalArgs = args.slice(1);

if (!templateCmd) throw Error('No command specified');

const externalArgsMap = {};

externalArgs.forEach((arg, i, arr) => {
    const isKeyArg = arg.startsWith("-") || arg.startsWith("--");
    
    if (!isKeyArg) return;

    const [key, value] = arg.replaceAll("-", "").split("=");
    const hasValue = typeof value !== undefined;
    const isNumberKey = isFinite(Number(key));

    if (!hasValue || isNumberKey) return;

    externalArgsMap[key] = value;
})

const interpolateArg = (sub, key, offset) => {
    if (!key) return;

    let replacement;

    if (isFinite(Number(key))) return replacement = externalArgs[Number(key) - 1];
    else replacement = externalArgsMap[key];

    return replacement ?? "";
}

// console.log(externalArgs);
const interpolatedCmd = templateCmd.replace(INTERPOLATION_REGEX, interpolateArg).split(" ");
// console.log(interpolatedCmd);

const proc = spawn(
    interpolatedCmd[0],
    interpolatedCmd.slice(1),
      {
        stdio: 'inherit',
        env: process.env
      },
);

/** This fragment is borrowed from https://github.com/kentcdodds/cross-env */

process.on('SIGTERM', () => proc.kill('SIGTERM'))
process.on('SIGINT', () => proc.kill('SIGINT'))
process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
process.on('SIGHUP', () => proc.kill('SIGHUP'))
proc.on('exit', (code, signal) => {
  let exitCode = code
  if (exitCode === null) {
    exitCode = signal === 'SIGINT' ? 0 : 1
  }
  process.exit(exitCode)
})

/* End of fragment */
}

module.exports = crossParams;