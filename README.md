# NZR Detailing — сайт

Статический сайт (HTML + CSS + JS), без сборки и зависимостей.

## Структура
- `index.html` — разметка
- `css/style.css` — все стили и анимации (rise, glide, fade, draw)
- `css/fonts-local.css` — опционально, локальные шрифты
- `js/main.js` — галерея, лайтбокс, форма, блик на логотипе
- `images/work-1..3.jpg` — фото (work-3 также фон первого экрана)
- `fonts/` — сюда класть .woff2, если нужен самостоятельный хостинг шрифтов

## Локальный запуск
    cd папка-проекта
    python3 -m http.server 8000
    # открыть http://localhost:8000
(или `npx serve`, или расширение Live Server в VS Code).
Двойной клик по index.html тоже работает, но проверяйте через сервер.

## Что поменять перед публикацией
- `PHONE_WA` в `js/main.js` — номер WhatsApp (формат 7707…, без +)
- ссылки Instagram и 2ГИС в `index.html`
- `<title>` и `<meta name="description">` в `index.html`
