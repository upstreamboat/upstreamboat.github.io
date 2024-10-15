/*
    脚本功能：删除指定文件夹下的所有文件的头部信息中的 poster等 标签
*/

// 获取所有笔记
const files = app.vault.getFiles();

// 指定需要清理头部属性的文件夹
const targetFolder = "_posts";

const tags = ['poster', '  headline', '  caption', '  color'];

files.forEach(file => {
    // 检查文件是否在目标文件夹内
    if (file.path.startsWith(targetFolder) && file.extension === "md") {
        // 读取当前文件内容
        app.vault.read(file).then(fileContent => {
            const lines = fileContent.split("\n");
            
            // 过滤掉指定标签的行
            const updatedLines = lines.filter(line => {
                return !tags.some(tag => line.startsWith(tag + ':'));
            });

            // 写回文件
            app.vault.modify(file, updatedLines.join('\n')).then(() => {
                console.log(`Updated: ${file.name}`);
            }).catch(err => {
                console.error(`写回文件失败: ${file.path}, 错误: ${err}`);
            });
        }).catch(err => {
            console.error(`读取文件失败: ${file.path}, 错误: ${err}`);
        });
    }
});
