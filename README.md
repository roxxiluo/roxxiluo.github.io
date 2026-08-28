# 学术个人主页（Academic Pages 框架）

基于 [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io)
（学术圈最常用的 GitHub Pages 模板，`nuomizai.github.io`、`yixchen.github.io` 均为此款）搭建的干净框架，
已配置好英文占位内容，你只需替换个人资料、上传 PDF 即可上线。

## 目录结构

```
_config.yml              站点全局配置（姓名、邮箱、社交链接、主题色等）★ 必改
_data/
  navigation.yml          顶部导航栏顺序 ★ 可增删菜单项
  authors.yml             作者信息（你 + 共同作者）★ 必改
_pages/
  about.md                首页 / 个人简介 ★ 必改
  cv.md                   简历页 ★ 必改
_publications/*.md        论文（一条一个文件，可自动从 bibtex 生成）
_talks/*.md               学术报告 / 讲座
_teaching/*.md            教学经历
_portfolio/*.md           项目展示
_posts/*.md               博客
files/                    PDF、幻灯片等附件（发布后路径为 /files/xxx.pdf）
images/profile.png        你的头像（正方形，建议 500×500）★ 必换
markdown_generator/       用 CSV 批量生成 publications/talks 的工具
```

## 快速部署（3 步上线）

1. **推送到 GitHub**
   ```bash
   cd website
   git init && git add -A && git commit -m "init"
   # 在 GitHub 新建仓库，命名为 <你的用户名>.github.io，然后：
   git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git
   git push -u origin main
   ```

2. **启用 Pages**：仓库 Settings → Pages → Source 选 `GitHub Actions`（模板已含
   `.github/workflows/jekyll-build.yml`，推送后自动构建）。

3. **改 `_config.yml`**：把 `url`、`repository`、`author.*` 中的占位符改成你的信息。

   几分钟后访问 `https://<你的用户名>.github.io` 即可看到站点。

## 本地预览

GitHub Pages 会在云端用 Jekyll 构建，本地预览二选一：

- **Docker（推荐，无需装 Ruby）**
  ```bash
  docker compose up   # 或 docker run --rm -v "$PWD":/srv/jekyll -p 4000:4000 jekyll/jekyll:pages
  ```
  访问 http://localhost:4000
- **本机安装 Ruby + Jekyll**（见 [Jekyll 官方文档](https://jekyllrb.com/docs/installation/)）

> 当前机器未装 Ruby，无法直接 `jekyll serve`；最快是直接推到 GitHub 用云端构建。

## 你需要准备的内容清单 ✅

对照下表收集材料，然后逐项填入：

| 模块 | 文件 | 需要准备什么 |
|---|---|---|
| 基本信息 | `_config.yml` | 姓名、单位、头衔、城市、邮箱、GitHub / Google Scholar / ORCID / LinkedIn / X 等链接 |
| 头像 | `images/profile.png` | 一张正方形证件照或生活照 |
| 首页简介 | `_pages/about.md` | 2-3 句自我介绍、3-5 个研究方向、News 列表、精选论文 |
| 简历 | `_pages/cv.md` | 教育经历、工作/实习经历、技能、审稿/服务经历 |
| 论文 | `_publications/` | 每篇：标题、作者、venue、年份、PDF（放 `files/`）、bibtex 条目 |
| 报告/讲座 | `_talks/` | 报告题目、类型、地点、日期、slides PDF |
| 教学 | `_teaching/` | 课程名、角色（助教/讲师）、学期、地点 |
| 项目 | `_portfolio/` | 项目名、简介、代码仓库链接 |

**最省事的论文录入方式**：把全部 bibtex 放进 `files/*.bib`，用
`markdown_generator` 里的脚本（或手动按 `_publications/2025-01-01-paper-title.md`
这个示例格式）批量生成 Markdown。

## 常用定制

- **换主题色**：`_config.yml` 里 `site_theme` 可选 `default / air / sunrise / mint / dirt / contrast`。
- **隐藏不需要的栏目**：直接删掉 `_data/navigation.yml` 里的对应条目（如无教学就删 `Teaching`）。
- **双栏/作者侧栏文案**：改 `_config.yml` 的 `author.bio`。

## 更多帮助

- 模板官方指南：https://academicpages.github.io/markdown/
- 官方 Wiki：https://github.com/academicpages/academicpages.github.io/wiki
