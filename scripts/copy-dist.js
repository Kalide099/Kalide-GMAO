const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

function copyDist() {
    const src = path.join(__dirname, '../frontend/dist');
    const dest = path.join(__dirname, '../dist');

    try {
        if (!fs.existsSync(src)) {
            console.error('Source frontend/dist does not exist!');
            process.exit(1);
        }

        if (fs.existsSync(dest)) {
            fs.rmSync(dest, { recursive: true, force: true });
        }

        copyFolderSync(src, dest);
        console.log('✅ Frontend dist successfully copied to root dist.');
    } catch (err) {
        console.error('Error copying dist:', err);
        process.exit(1);
    }
}

copyDist();
