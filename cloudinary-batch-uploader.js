// cloudinary-batch-uploader.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

class CloudinaryBatchUploader {
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

  getImageFiles(team, player) {
    const playerPath = path.join(this.teamsDir, team, player);
    return fs.readdirSync(playerPath).filter((name) => {
      const fullPath = path.join(playerPath, name);
      return fs.statSync(fullPath).isFile();
    });
  }

  async uploadAllImages() {
    const teamFolders = this.getTeamFolders();
    for (const team of teamFolders) {
      const playerFolders = this.getPlayerFolders(team);
      for (const player of playerFolders) {
        const imageFiles = this.getImageFiles(team, player);
        for (const image of imageFiles) {
          const imagePath = path.join(this.teamsDir, team, player, image);
          try {
            await cloudinary.uploader.upload(imagePath, {
              folder: `${team}/${player}`,
              public_id: path.parse(image).name,
            });
            console.log(`Uploaded: ${team}/${player}/${image}`);
          } catch (err) {
            console.error(
              `Error uploading ${team}/${player}/${image}:`,
              err.message
            );
          }
        }
      }
    }
  }
}

// Example usage:
const uploader = new CloudinaryBatchUploader({
  cloud_name: "dmkavnadn",
  api_key: "367629529681296",
  api_secret: "4SjIcB7V26OYJ-JHkOLiCQ-g9PI",
  teamsDir: path.join(__dirname, "public"),
});
uploader.uploadAllImages();

module.exports = CloudinaryBatchUploader;
