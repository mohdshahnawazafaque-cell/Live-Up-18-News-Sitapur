const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(
  "author: feed.title || 'Live Up 18 Desk',",
  "author: 'मो० शाहनवाज़',"
);
fs.writeFileSync('server.ts', serverContent);

console.log("Updated server.ts default author.");
