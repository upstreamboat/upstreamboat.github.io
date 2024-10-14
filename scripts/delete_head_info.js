/*
    脚本功能：清除指定文件夹下的所有文件的头部信息
*/

// 获取所有笔记
const files = app.vault.getFiles();

// 指定需要清理头部属性的文件夹
const targetFolder = "test/";

files.forEach(file => {
    // 检查文件是否在目标文件夹内
    if (file.path.startsWith(targetFolder) && file.extension === "md") {
        // 读取当前文件内容
        app.vault.read(file).then(fileContent => {
            const lines = fileContent.split("\n");
            let bodyContent = "";

            // 找到最后一个头属性结束的位置
            const headerEndIndex = lines.lastIndexOf("---");
            if (headerEndIndex !== -1) {
                // 仅保留头部结束符之后的内容
                bodyContent = lines.slice(headerEndIndex + 1).join("\n").trim();
            } else {
                bodyContent = fileContent; // 如果没有头部，保留原内容
            }

            // 写回文件
            app.vault.modify(file, bodyContent).then(() => {
                // 自动保存文件，直接确保保存操作
                console.log(`已清理并保存文件: ${file.path}`);
            }).catch(err => {
                console.error(`写回文件失败: ${file.path}, 错误: ${err}`);
            });
        }).catch(err => {
            console.error(`读取文件失败: ${file.path}, 错误: ${err}`);
        });
    }
});
