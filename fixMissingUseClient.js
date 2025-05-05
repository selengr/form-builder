const fs = require('fs');
const path = require('path');

const projectDir = './'; // مسیر پروژه‌ت
const clientIndicators = ['useState', 'useEffect', 'useRef', 'useReducer', 'onClick', 'onChange', 'useMemo'];

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules')) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function needsUseClient(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasUseClient = content.startsWith('"use client"') || content.startsWith("'use client'");
    const isClientComponent = clientIndicators.some(indicator => content.includes(indicator));
    return isClientComponent && !hasUseClient;
}

function addUseClient(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = `"use client";\n` + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
}

const files = getAllFiles(projectDir);
const fixedFiles = [];

files.forEach(file => {
    if (needsUseClient(file)) {
        addUseClient(file);
        fixedFiles.push(file);
    }
});

if (fixedFiles.length === 0) {
    console.log('✅ همه چیز مرتبه، چیزی از use client جا نیفتاده!');
} else {
    console.log('🚀 use client به فایل‌های زیر اضافه شد:\n');
    fixedFiles.forEach(file => {
        console.log('✅', file);
    });
}
