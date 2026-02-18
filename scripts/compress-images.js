const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../src/assets/members');
const files = fs.readdirSync(directory);

async function compressImages() {
    console.log('Starting image compression...');

    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
            const filePath = path.join(directory, file);
            const tempPath = path.join(directory, `temp_${file}`);

            try {
                const stats = fs.statSync(filePath);
                console.log(`Processing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

                await sharp(filePath)
                    .resize(800) // Resize to a reasonable width for member cards
                    .jpeg({ quality: 80, mozjpeg: true })
                    .toFile(tempPath);

                fs.unlinkSync(filePath);
                fs.renameSync(tempPath, filePath);

                const newStats = fs.statSync(filePath);
                console.log(`Finished ${file}. New size: ${(newStats.size / 1024).toFixed(2)} KB`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }

    console.log('Image compression complete.');
}

compressImages();
