#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const api = require('./index');
const pkg = require('./package.json')


program
    .version(pkg.version)

program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, -1).join(' ');
        api.add(words).then(() => {
            console.log('添加成功！')
        }, () => {
            console.log('添加失败！')
        })
    });

program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => {
            console.log('清除成功！')
        }, () => {
            console.log('清除失败！')
        })
    });



program.parse(process.argv);

if (process.argv.length === 2) {
    //说明用户直接运行node cli.js
    void api.showAll()
}