import concurrently from 'concurrently';

const githubRunNumber = process.env.GITHUB_RUN_NUMBER;

const CICommand = `yarn browserstack-cypress run ${
  githubRunNumber ? `--build-name "Github Run #${githubRunNumber}"` : ''
}`;
const localCommand = 'yarn cypress run';
const devCommand = 'yarn cypress open';

// exit 0 is added to keep a good exit code since
// concurrently sends SIGTERM to this process after the tests end
const serveCommand = 'yarn serve || exit 0';
const firebaseEmulatorCommand =
  'cd ../.. && firebase emulators:start --only auth,firestore';

const waitOnURLs = [
  'http-get://localhost:3000/index.html',
  'http://localhost:4000',
];

const isCI = Boolean(process.env.CI);
const isDevMode = process.argv[2] === 'dev';

// List of commands who always exit with 1 and can be ignored
const excludeErrorCommands = [serveCommand, firebaseEmulatorCommand];

const catchHandler = (values) =>
  values
    // Filter out the serve command since it always returns 1
    .filter((x) => !excludeErrorCommands.includes(x.command.command))
    .map((x) => {
      if (x.exitCode !== 0) {
        console.error('Tests failed.');
        process.exit(1);
      }
    });

const cypressCommand = `yarn wait-on ${waitOnURLs.join(' ')} && ${
  isCI ? CICommand : isDevMode ? devCommand : localCommand
}`;
const commands = [serveCommand, firebaseEmulatorCommand, cypressCommand];

concurrently(commands, {
  killOthers: ['failure', 'success'],
}).catch(catchHandler);
