// cloudinary-team-folder-manager.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

class CloudinaryTeamFolderManager {
  constructor({ cloud_name, api_key, api_secret, teamsDir }) {
    cloudinary.config({ cloud_name, api_key, api_secret });
    this.teamsDir = teamsDir;
  }

  getTeamFolders() {
    return fs.readdirSync(this.teamsDir).filter((name) => {
      const fullPath = path.join(this.teamsDir, name);
      return fs.statSync(fullPath).isDirectory();
    });
  }

  async createFolders() {
    const teamFolders = this.getTeamFolders();
    for (const team of teamFolders) {
      try {
        await cloudinary.api.create_folder(team);
        console.log(`Created folder: ${team}`);
      } catch (err) {
        if (err.http_code === 409) {
          console.log(`Folder already exists: ${team}`);
        } else {
          console.error(`Error creating folder ${team}:`, err.message);
        }
      }
    }
  }
}

// Example usage:
// const manager = new CloudinaryTeamFolderManager({
//   cloud_name: 'YOUR_CLOUD_NAME',
//   api_key: 'YOUR_API_KEY',
//   api_secret: 'YOUR_API_SECRET',
//   teamsDir: path.join(__dirname, 'public'),
// });
// manager.createFolders();

module.exports = CloudinaryTeamFolderManager;
