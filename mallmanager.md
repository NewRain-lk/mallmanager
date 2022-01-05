# Vue-项目-重点



## 重点

1. src/
2. build/ webpack相关代码
3. config/ 本地服务器配置
4. .eslintignore eslist排除文件
5. .eslintrc eslint配置文件

#### 01-项目-GIT命令

##### …or create a new repository on the command line

​                  

```
echo "# mallmanager" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/NewRain-lk/mallmanager.git
git push -u origin main
```

##### …or push an existing repository from the command line

​                  

```
git remote add origin https://github.com/NewRain-lk/test.git
git branch -M main
git push -u origin main
```

##### …or import code from another repository

You can initialize this repository with code from a Subversion, Mercurial, or TFS project.

#### 02-项目-准备-代码规范-自定义指令-lintfix

1. 结尾没有【;】
2. 必须用全等【===】
3. 不允许出现未使用的变量
4. 不允许出现一个以上空行

- 在package.json中scripts自定义指令：指令很长

- npm run 自定义指令(dev)

- npm run lintfix（自动按照规范修正全部的js代码，但是多余的变量师不会修复的）

  ```js
  "lintfix": "eslint --ext .js,.vue src --fix",
  ```

- npm run gitcus

- 自动打开浏览器，可以在dev的指令后边增加【--open】

####  03-项目-新建分值-login

- 创建并且切换至该分支：git checkout -b dev-login
- 查看分支：git branch
- 新建组件+配置路由
- 提交代码
  - git add .
  - git commit -m "新建登录组件"
- commit：每完成一个小功能都提交一次
- push操作main去完成

#### 04-项目-合并上传

1. git add .
2. git commit -m '注释'
3. git branch
4. git checkout main
5. git merge dev-login
6. git push

