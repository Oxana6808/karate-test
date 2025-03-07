from PIL import Image
import os

# Список имен файлов для стоек (на основе объединенного списка)
image_files = [
    "images/9.1_Хэйсоку_дачи.jpg",
    "images/9.2_Мусуби_дачи.jpg",
    "images/9.3_Хэйко_дачи.jpg",
    "images/9.4_Шизен_дачи.jpg",
    "images/9.5_Учи_хатидзи_дачи.jpg",
    "images/9.6_Зенкуцу_дачи.jpg",
    "images/9.7_Кокутсу_дачи.jpg",
    "images/9.8_Санчин_дачи.jpg",
    "images/9.9_Киба_дачи.jpg",
    "images/9.10_Шико_дачи.jpg",
    "images/9.11_Не_коаши_дачи.jpg",
    "images/9.12_Цуроаши_дачи.jpg",
    "images/9.13_Какэ_аши_дачи.jpg",
    "images/9.14_Мороаши_дачи.jpg",
    "images/9.15_Джиу_камаэтэ_дачи.jpg",
    "images/9.16_Ёи_дачи.jpg",
    "images/9.17_Фудо_дачи.jpg"
]

# Создаем папку images, если её нет
if not os.path.exists("images"):
    os.makedirs("images")

# Генерируем изображения
for file_path in image_files:
    # Создаем белое изображение (200x200 пикселей)
    width, height = 200, 200
    white_color = (255, 255, 255)  # Белый фон
    image = Image.new("RGB", (width, height), white_color)

    # Сохраняем изображение
    image.save(file_path, "JPEG")
    print(f"Сгенерировано изображение: {file_path}")

print("Все изображения созданы!")