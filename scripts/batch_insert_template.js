/*
    脚本功能：给指定文件夹下的所有文件 插入 模板文件
*/

// 指定_posts文件夹和模板文件
const postsFolder = "_posts/命令";
const templateFileName = "通用模板.md";

// 获取所有笔记
const files = app.vault.getFiles();

// 读取模板内容
const templateFile = files.find(file => file.name === templateFileName);
if (!templateFile) {
    console.error(`未找到模板文件: ${templateFileName}`);
    return;
}

app.vault.read(templateFile).then(templateContent => {
    files.forEach(file => {
        // 检查文件是否在_posts文件夹内
        if (file.path.startsWith(postsFolder) && file.extension === "md") {
            // 读取当前文件内容
            app.vault.read(file).then(fileContent => {
                // 检查是否存在头部文档属性
                const lines = fileContent.split("\n");
                const headerCount = lines.filter(line => line.trim() === "---").length;
                if (headerCount > 0) {
                    console.log(`跳过文件: ${file.path} (已存在头部属性信息)`);
                    return; // 跳过该文件
                }

                // 插入模板内容
                const updatedContent = templateContent + "\n\n" + fileContent;

                // 写回文件
                app.vault.modify(file, updatedContent).then(() => {
                    console.log(`已更新文件: ${file.path}`);
                }).catch(err => {
                    console.error(`更新文件失败: ${file.path}, 错误: ${err}`);
                });
            });
        }
    });
}).catch(err => {
    console.error(`读取模板文件失败: ${err}`);
});
