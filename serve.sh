#!/usr/bin/env bash
# 本地预览脚本：编译并启动 Jekyll 服务器
# 用法: ./serve.sh  (默认 http://localhost:4000)
set -e

# 工具链安装在工作区内的 .local 目录（因为 $HOME 在本环境只读）
TOOLCHAIN="$(cd "$(dirname "$0")/.." && pwd)/.local"
export PATH="$TOOLCHAIN/ruby/bin:$TOOLCHAIN/gem/bin:$PATH"
export GEM_HOME="$TOOLCHAIN/gem"
export GEM_PATH="$TOOLCHAIN/gem"

cd "$(dirname "$0")"

if ! command -v ruby >/dev/null 2>&1; then
  echo "错误：未找到 ruby。请先编译 Ruby（见 README 的本地预览章节）。" >&2
  exit 1
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "安装 bundler..."
  gem install bundler --no-document
fi

echo "安装依赖（首次较慢，请耐心等待）..."
bundle install

echo "启动服务器: http://localhost:4000  (Ctrl+C 停止)"
exec bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload
