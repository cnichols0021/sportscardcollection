// cloudinary-team-player-folder-manager.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

class CloudinaryTeamPlayerFolderManager {
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

  getPlayerFolders(team) {
    const teamPath = path.join(this.teamsDir, team);
    return fs.readdirSync(teamPath).filter((name) => {
      const fullPath = path.join(teamPath, name);
      return fs.statSync(fullPath).isDirectory();
    });
  }

  async createFolders() {
    const teamFolders = this.getTeamFolders();
    for (const team of teamFolders) {
      // Create team folder in Cloudinary
      await this.createCloudinaryFolder(team);
      const playerFolders = this.getPlayerFolders(team);
      for (const player of playerFolders) {
        // Create player folder under team in Cloudinary
        await this.createCloudinaryFolder(`${team}/${player}`);
      }
    }
  }

  async createCloudinaryFolder(folderPath) {
    try {
      await cloudinary.api.create_folder(folderPath);
      console.log(`Created folder: ${folderPath}`);
    } catch (err) {
      if (err.http_code === 409) {
        console.log(`Folder already exists: ${folderPath}`);
      } else {
        console.error(`Error creating folder ${folderPath}:`, err.message);
      }
    }
  }
}

// Example usage:
// ...existing code...
const manager = new CloudinaryTeamPlayerFolderManager({
  cloud_name: "dmkavnadn",
  api_key: "367629529681296",
  api_secret: "4SjIcB7V26OYJ-JHkOLiCQ-g9PI",
  teamsDir: path.join(__dirname, "public"),
});
manager.createFolders();

module.exports = CloudinaryTeamPlayerFolderManager;
