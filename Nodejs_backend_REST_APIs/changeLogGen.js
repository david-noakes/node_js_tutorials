const child = require('child_process');
const fs = require('fs');

const latestTag = child.execSync('git describe --long').toString('utf-8').split('-')[0];

const output = child
    .execSync(`git log ${latestTag}..HEAD --date=format:%Y%m%d%H%M%S --format=%B~~BREAK~~%H~~BREAK~~%cd~~BREAK~~~~~~DELIMITER~~~~`)
    // .execSync(`git log --date=format:%Y%m%d%H%M%S --format=%B~~BREAK~~%H~~BREAK~~%cd~~BREAK~~~~~~DELIMITER~~~~`)
    .toString('utf-8');
// console.log(output);

const commitsArray = output
    .split('~~~~DELIMITER~~~~\n')
    .map(commit => {
    //   const [message, sha, isodate] = commit.split('\n');
       const [message, sha, isodate] = commit.split('~~BREAK~~');

        return { sha, message, isodate };
    })
    .filter(commit => Boolean(commit.sha));

//console.log({ commitsArray });
console.log(commitsArray.length);

const currentChangelog = fs.readFileSync("./CHANGELOG.md", "utf-8");
// const currentVersion = Number(require("./package.json").version);
const currentVersion = require("./package.json").version;
// const newVersion = currentVersion + 1;
let newChangelog = `# Version ${currentVersion} (${
  new Date().toISOString().split("T")[0]
})\n\n`;

// console.log({ commitsArray });

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
const refactors = [];
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
      `* ${commit.message.replace("section: ", "") + " " + 
           commit.isodate.substring(0, 8) + " "} ([${commit.sha.substring(
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
    refactors.push(
      `* ${commit.message.replace("refactor: ", "")} ([${commit.sha.substring(
        0,
        6
      )}](https://github.com/jackyef/changelog-generator/commit/${
        commit.sha
      }))\n`
    );
  }
});

if (features.length) {
  console.log(features.length)
  newChangelog += `## Features\n`;
  features.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

if (fixes.length) {
  console.log(fixes.length)
  newChangelog += `## Fixes\n`;
  fixes.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

if (perfs.length) {
  console.log(perfs.length)
  newChangelog += `## Performance Enhancements\n`;
  perfs.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

if (refactors.length) {
  console.log(refactors.length)
  newChangelog += `## Refactorings\n`;
  refactors.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

if (chores.length) {
  console.log(chores.length)
  newChangelog += `## Chores\n`;
  chores.forEach(chore => {
    newChangelog += chore;
  });
  newChangelog += '\n';
}

if (sections.length) {
  console.log(sections.length)
  newChangelog += `## Sections\n`;
  sections.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

// prepend the newChangelog to the current one
fs.writeFileSync("./CHANGELOG.md", `${newChangelog}${currentChangelog}`);
// console.log("CHANGELOG.md:", `${newChangelog}${currentChangelog}`);
