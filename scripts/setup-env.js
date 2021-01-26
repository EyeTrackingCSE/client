const util = require('util');
const exec = util.promisify(require('child_process').exec);

const NODE_VERSION = 14;
const NODE_GYP_VERSION = 7;
const NF_VERSION = 3;

/**
 * Executes command in a child process wrapped in async/await
 * @param {string} command 
 */
const execOutput = async(command) => {
    let { stdout, stderr } = await exec(command);
    if (stderr) {
        console.error(stderr);
    }
    return stdout;
};

const checkNodeVersion = (minVersion) => {
    let fullNodeVersion = process.versions.node;
    let verNumber = Number(fullNodeVersion.split('.')[0]);
    return verNumber >= minVersion;
};

const checkNodeGypVersion = async(minVersion) => {
    let { stdout, stderr } = await exec("node-gyp -v");

    // If not installed, install it
    if (stdout.includes("is not recognized")) {
        await exec(`npm install -g node-gyp@${minVersion}`);
        return true;
    }

    // If installed, check the version
    let version = Number(stdout.charAt(1));
    return version >= minVersion;
};

const checkNFVersion = async(minVersion) => {
    let { stdout, stderr } = await exec("nf --version");

    // If not installed, install it
    if (stdout.includes("is not recognized")) {
        await exec(`npm install -g foreman@${minVersion}`);
        return true;
    }

    // If installed, check the version
    let version = Number(stdout.charAt(0));
    return version >= minVersion;
};

const installLocalDependencies = async() => {
    let { stdout, stderr } = await exec("npm install");
}

const buildEyetrackingModule = async() => {
    let { stout, stderr } = await exec("npm run rebuild-eyetracking");
}

const main = async(args) => {
    let hasNode = checkNodeVersion(args.NODE_VERSION);
    let hasNodeGyp = checkNodeGypVersion(args.NODE_GYP_VERSION);
    let hasForeman = checkNFVersion(args.NF_VERSION);

    console.log("Verifying node installation");
    if (!hasNode) {
        console.error(`Please upgrade/install node.js version ${args.NODE_VERSION} minimum.`);
        return;
    }

    console.log("Verifying node-gyp installation");
    if (!hasNodeGyp) {
        console.error(`Please upgrade your node-gyp installation version to ${args.NODE_GYP_VERSION} minimum.`);
        return;
    }

    console.log("Verifying foreman installation");
    if (!hasForeman) {
        console.error(`Please upgrade your foreman installation version to ${args.NODE_GYP_VERSION} minimum.`);
        return;
    }

    console.log("Installing local dependencies");
    await installLocalDependencies();

    console.log("Building eyetracking addon");
    await buildEyetrackingModule();

    console.log('\n\x1b[36m%s\x1b[0m', 'All set'); //cyan

};

main({ NODE_VERSION, NODE_GYP_VERSION, NF_VERSION });