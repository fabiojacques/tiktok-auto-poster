const fs = require('fs');
const path = require('path');

// Simula buscar um vídeo do Google Drive
function getVideoFromDrive(niche) {
  const fileName = `${niche}-video-${Date.now()}.mp4`;
  const filePath = path.join(__dirname, '../temp', fileName);

  // Cria um "arquivo fake" simulando download
  fs.writeFileSync(filePath, 'VIDEO_FAKE_CONTENT');

  return {
    fileName,
    filePath
  };
}

module.exports = {
  getVideoFromDrive
};
