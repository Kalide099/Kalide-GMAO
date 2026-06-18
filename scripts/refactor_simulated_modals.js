const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, '../frontend/src/pages'),
    path.join(__dirname, '../frontend/src/pages/roadmap'),
    path.join(__dirname, '../frontend/src/pages/nexus'),
    path.join(__dirname, '../frontend/src/pages/public')
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('SimulatedProcessModal')) {
        return;
    }

    const moduleName = path.basename(filePath, '.jsx').toLowerCase();
    
    // Extract toast success message
    const match = content.match(/toast\.success\((['"`].*?['"`])\)/);
    const successMsg = match ? match[1] : "'Action synced to database.'";

    // 1. Remove SimulatedProcessModal import
    content = content.replace(/import SimulatedProcessModal from ['"](\.\.\/)*components\/SimulatedProcessModal['"];?\n?/, '');

    // 2. Ensure api is imported
    if (!content.includes("import api from ")) {
        content = content.replace(/(import .*?\n)(?!import)/, `$1import api from '../../services/api/axiosConfig';\n`);
    }

    // 3. Ensure toast is imported
    if (!content.includes("import toast")) {
        content = content.replace(/(import .*?\n)(?!import)/, `$1import toast from 'react-hot-toast';\n`);
    }

    // 4. Inject generic save handler right after the first line containing 'const { t }'
    const handlerCode = `
    const handleGenericAction = async () => {
        try {
            const res = await api.post('/n/${moduleName}', { action: 'Generic Action Executed', timestamp: new Date() });
            if(res.data.success) {
                toast.success(${successMsg});
            }
        } catch (err) {
            toast.error('Failed to communicate with Nexus Backend');
        }
    };
    `;
    
    if (!content.includes('handleGenericAction')) {
        content = content.replace(/(const { t }.*?)\n/, `$1\n${handlerCode}`);
    }

    // 5. Replace onClick triggers
    // Covers: setSimModalOpen(true), setSimModal({ isOpen: true, ... })
    content = content.replace(/setSimModalOpen\([\s\S]*?\)/g, 'handleGenericAction()');
    content = content.replace(/setSimModal\(\{[\s\S]*?\}\)/g, 'handleGenericAction()');

    // 6. Remove the modal state
    content = content.replace(/const \[simModalOpen, setSimModalOpen\] = useState\(false\);?\n?/, '');
    content = content.replace(/const \[simModal, setSimModal\] = useState\(\{[\s\S]*?\}\);?\n?/, '');

    // 7. Remove the modal JSX
    content = content.replace(/<SimulatedProcessModal[\s\S]*?\/>/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Refactored ${path.basename(filePath)}`);
}

dirsToScan.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.jsx')) {
            processFile(path.join(dir, file));
        }
    });
});
