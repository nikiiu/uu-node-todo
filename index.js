const db = require('./db.js')
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read();
    // 往里面添加一个title任务
    list.push({ title, done: false });
    // 存储任务到文件 
    await db.write(list);
}

module.exports.clear = async () => {
    await db.write([]);
}

const markAsDone = (list, index) => {
    list[index].done = true;
    db.write(list);
}
const markAsUnDone = (list, index) => {
    list[index].done = false;
    db.write(list);
}

const updateTitle = (list, index) => {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title

    }).then(answer => {
        list[index].title = answer.title;
        db.write(list)
    })
}

const remove = (list, index) => {
    list.splice(index, 1)
    db.write(list);
}


const askForAction = (list, index) => {
    //askForAction
    const actions = { markAsDone, markAsUnDone, remove, updateTitle }
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择你的操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '标记为已完成', value: 'markAsDone' },
            { name: '标记为未完成', value: 'markAsUnDone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'remove' },
        ]
    }).then(answer2 => {
        const action = actions[answer2.action]
        action && action(list, index)
    })
}

const askForCreateTask = (list) => {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',

    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}

const printTasks = (list) => {
    //printTasks
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [{ name: '退出', value: '-1' }, ...list.map((task, index) => {
                    return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() }

                }), { name: '+ 创建任务', value: '-2' }]
            }
        )
        .then(answer => {
            const index = parseInt(answer.index)

            if (index >= 0) {
                //选中了一个任务
                askForAction(list, index);
            } else if (index === -2) {
                //创建任务
                askForCreateTask(list);
            }
        })
}

module.exports.showAll = async () => {
    //读取任务
    const list = await db.read();
    //打印任务
    printTasks(list);
}

