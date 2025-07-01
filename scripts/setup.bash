#!/bin/bash

set -e

# Проверка git
if ! command -v git &> /dev/null; then
  echo "Git не найден. Устанавливаю..."
  if ! command -v brew &> /dev/null; then
    echo "Homebrew не найден. Устанавливаю Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  brew install git
else
  echo "Git уже установлен."
fi

# Проверка node и npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "Node.js или npm не найдены. Устанавливаю..."
  if ! command -v brew &> /dev/null; then
    echo "Homebrew не найден. Установите Homebrew вручную и запустите скрипт снова."
    exit 1
  fi
  brew install node
else
  echo "Node.js и npm уже установлены."
fi

# Клонирование репозитория
REPO_URL="https://github.com/nurekeshka/glow-projection"
REPO_DIR="glow-projection"

if [ -d "$REPO_DIR" ]; then
  echo "Папка $REPO_DIR уже существует. Обновляю репозиторий..."
  cd "$REPO_DIR"
  git pull
else
  echo "Клонирую репозиторий..."
  git clone "$REPO_URL"
  cd "$REPO_DIR"
fi

# Установка зависимостей
echo "Устанавливаю зависимости..."
npm install

# Запуск приложения
echo "Запускаю приложение..."
npm start
