
# Cross-params

This is an (over-)simplified solution for interpolating comand-line args for NPM scripts

## Installation

npm:

    npm install --save-dev cross-params

yarn:

    yarn add -D cross-params

## Usage

`cross-params` accepts command with *arg pointers* as first argument, followed by actual command-line arguments. For example:

    npx cross-params \"yarn \${1}\" --version

will result in calling

    yarn --version

The syntax for template strings is following:

-  `${n}` where `n` is the argument index starting from 1

-  `${key}` where `key` is the argument key in key-value pair.

Key-value args must starts `-` or `--` and divided with `=`, for example:

    npx cross-params \"yarn --${command}\" --command=version

### NPM scripts

Note that you should wrap command template in quotes and escape the `$` symbols:

    // package.json
    {
	    "scripts": {
	    	"cross": "cross-params \"yarn \\${1}\""
	    }
    }

Happy hacking!