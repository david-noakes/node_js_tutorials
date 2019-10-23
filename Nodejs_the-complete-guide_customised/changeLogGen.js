const child = require("child_process");
const fs = require("fs");

const latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0];
const output = child
  .execSync(`git log ${latestTag}..HEAD --date=format:%Y%m%d%H%M%S --format=%B%H%n%cd----DELIMITER----`)
  .toString("utf-8");

const commitsArray = output
  .split("----DELIMITER----\n")
  .map(commit => {
    const [message, sha, date] = commit.split("\n");

    return { sha, message, date };
  })
  .filter(commit => Boolean(commit.sha));

const currentChangelog = fs.readFileSync("./CHANGELOG.md", "utf-8");
const currentVersion = require("./package.json").version;
// const newVersion = currentVersion + 1;
let newChangelog = `# Version ${currentVersion} (${
  new Date().toISOString().split("T")[0]
})\n\n`;

console.log({ commitsArray });

// // update package.json
// fs.writeFileSync("./package.json", JSON.stringify({ version: String(newVersion) }, null, 2));

// // create a new commit
// child.execSync('git add .');
// child.execSync(`git commit -m "chore: Bump to version ${newVersion}"`);

// // tag the commit
// child.execSync(`git tag -a -m "Tag for version ${newVersion}" version${newVersion}`);

const chores = [];
const features = [];
const fixes = [];
const perfs = [];
const refacts = [];
const sections = [];

commitsArray.forEach(commit => {
  if (commit.message.startsWith("feature: ")) {
    features.push(
      `* ${commit.message.replace("feature: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
  if (commit.message.startsWith("fix: ")) {
    fixes.push(
      `* ${commit.message.replace("fix: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
  if (commit.message.startsWith("performance: ")) {
    perfs.push(
      `* ${commit.message.replace("performance: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
  if (commit.message.startsWith("refactor: ")) {
    refacts.push(
      `* ${commit.message.replace("refactor: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
  if (commit.message.startsWith("chore: ")) {
    chores.push(
      `* ${commit.message.replace("chore: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
  if (commit.message.startsWith("section: ")) {
    sections.push(
      `* ${commit.message.replace("section: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
});

if (features.length) {
  newChangelog += `## Features\n`;
  features.forEach(ft => {
    newChangelog += ft;
  });
  newChangelog += '\n';
}

if (fixes.length) {
  newChangelog += `## Fixes\n`;
  fixes.forEach(fx => {
    newChangelog += fx;
  });
  newChangelog += '\n';
}

if (perfs.length) {
  newChangelog += `## Performance Enhancements\n`;
  perfs.forEach(pf => {
    newChangelog += pf;
  });
  newChangelog += '\n';
}

if (refacts.length) {
  newChangelog += `## Refactoring\n`;
  refacts.forEach(rf => {
    newChangelog += rf;
  });
  newChangelog += '\n';
}

if (chores.length) {
  newChangelog += `## Chores\n`;
  chores.forEach(chore => {
    newChangelog += chore;
  });
  newChangelog += '\n';
}

if (sections.length) {
  newChangelog += `## Sections\n`;
  sections.forEach(se => {
    newChangelog += se;
  });
  newChangelog += '\n';
}

// prepend the newChangelog to the current one
fs.writeFileSync("./CHANGELOG.md", `${newChangelog}${currentChangelog}`);