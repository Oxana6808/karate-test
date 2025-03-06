from PIL import Image
import os

# Список имен файлов (вставь список выше)
image_files = [
    "images/1.1_Канжи.jpg",
    "images/1.2_Канку.jpg",
    "images/1.3_Сосай.jpg",
    "images/1.4_Сихан.jpg",
    "images/1.5_Сэнсэй.jpg",
    "images/1.6_Сэмпай.jpg",
    "images/1.7_Кохай.jpg",
    "images/1.8_Ханси.jpg",
    "images/1.9_Кантё.jpg",
    "images/1.10_Додзё.jpg",
    "images/1.11_Доги.jpg",
    "images/1.12_Кихон.jpg",
    "images/1.13_Идо_кихон.jpg",
    "images/1.14_Рэнраку.jpg",
    "images/1.15_Ката.jpg",
    "images/1.16_Кумитэ.jpg",
    "images/1.17_Иппон-кумитэ.jpg",
    "images/1.18_Санбон-кумитэ.jpg",
    "images/1.19_Якусоку-кумитэ.jpg",
    "images/1.20_Дзию_кумитэ.jpg",
    "images/1.21_Ос.jpg",
    "images/1.22_Ногарэ.jpg",
    "images/1.23_Ибуки.jpg",
    "images/1.24_Нидан.jpg",
    "images/1.25_Самбон.jpg",
    "images/1.26_Макивара.jpg",
    "images/1.27_Сайонара.jpg",
    "images/1.28_Аригато.jpg",
    "images/1.29_Таттэ.jpg",
    "images/1.30_Тамеши-вари.jpg",
    "images/1.31_Шушин.jpg",
    "images/1.32_Кокю_хо.jpg",
    "images/1.33_Оби.jpg",
    "images/1.34_Рэй.jpg",
    "images/1.35_До.jpg",
    "images/1.36_Будо.jpg",
    "images/1.37_Кайтэн.jpg",
    "images/1.38_Кимэ.jpg",
    "images/2.1_Сэйдза.jpg",
    "images/2.2_Андза.jpg",
    "images/2.3_Мокусо.jpg",
    "images/2.4_Мокусо_ямэ.jpg",
    "images/2.5_Синдэн_ни_рэй.jpg",
    "images/2.6_Сэнсэй_ни_рэй.jpg",
    "images/2.7_Отагай_ни_рэй.jpg",
    "images/2.8_Ёи.jpg",
    "images/2.9_Камаэтэ.jpg",
    "images/2.10_Хадзимэ.jpg",
    "images/2.11_Ямэ.jpg",
    "images/2.12_Маваттэ.jpg",
    "images/2.13_Хантай.jpg",
    "images/2.14_Наорэ.jpg",
    "images/2.15_Ясумэ.jpg",
    "images/2.16_Торимасен.jpg",
    "images/2.17_Хикиваке.jpg",
    "images/2.18_Чуй.jpg",
    "images/2.19_Сикаку.jpg",
    "images/2.20_Тори.jpg",
    "images/2.21_Уке.jpg",
    "images/2.22_Таттэ_кудасай.jpg",
    "images/3.1_Ичи.jpg",
    "images/3.2_Ни.jpg",
    "images/3.3_Сан.jpg",
    "images/3.4_Ши.jpg",
    "images/3.5_Го.jpg",
    "images/3.6_Року.jpg",
    "images/3.7_Сичи.jpg",
    "images/3.8_Хачи.jpg",
    "images/3.9_Ку.jpg",
    "images/3.10_Джу.jpg",
    "images/3.11_Ниджу.jpg",
    "images/3.12_Санджу.jpg",
    "images/3.13_Ёнджу.jpg",
    "images/3.14_Годжу.jpg",
    "images/3.15_Рокуджу.jpg",
    "images/3.16_Нанаджу.jpg",
    "images/3.17_Хачиджу.jpg",
    "images/3.18_Кюджу.jpg",
    "images/3.19_Хяку.jpg",
    "images/4.1_Джодан.jpg",
    "images/4.2_Чюдан.jpg",
    "images/4.3_Гэдан.jpg",
    "images/4.4_Агэ.jpg",
    "images/4.5_Ороси.jpg",
    "images/4.6_Маэ.jpg",
    "images/4.7_Ёко.jpg",
    "images/4.8_Усиро.jpg",
    "images/4.9_Маваси.jpg",
    "images/4.10_Сото.jpg",
    "images/4.11_Учи.jpg",
    "images/4.12_Хидари.jpg",
    "images/4.13_Миги.jpg",
    "images/4.14_Ой.jpg",
    "images/4.15_Гяку.jpg",
    "images/4.16_Маэ_коса.jpg",
    "images/4.17_Усиро_коса.jpg",
    "images/4.18_Кайтэн.jpg",
    "images/4.19_Ура.jpg",
    "images/4.20_Шомэн.jpg",
    "images/4.21_Сагари.jpg",
    "images/5.1_Джодан.jpg",
    "images/5.2_Агама.jpg",
    "images/5.3_Are.jpg",
    "images/5.4_Гаммен.jpg",
    "images/5.5_Нодо.jpg",
    "images/5.6_Чудан.jpg",
    "images/5.7_Муне.jpg",
    "images/5.8_Мизо-учи.jpg",
    "images/5.9_Сакотцу.jpg",
    "images/5.10_Хара.jpg",
    "images/5.11_Хизо.jpg",
    "images/5.12_Гедан.jpg",
    "images/5.13_Коши.jpg",
    "images/6.1_Ой.jpg",
    "images/6.2_Гяку.jpg",
    "images/7.1_Хидари.jpg",
    "images/7.2_Миги.jpg",
    "images/8.1_Сэйкэн.jpg",
    "images/8.2_Уракэн.jpg",
    "images/8.3_Тэтцуй.jpg",
    "images/8.4_Шуто.jpg",
    "images/8.5_Хайто.jpg",
    "images/8.6_Шотэй.jpg",
    "images/8.7_Кокэн.jpg",
    "images/8.8_Нукитэ.jpg",
    "images/8.9_Хиджи.jpg",
    "images/8.10_Ёхон_нукитэ.jpg",
    "images/8.11_Нихон_нукитэ.jpg",
    "images/8.12_Накаюби_иппонкэн.jpg",
    "images/8.13_Ояюби_иппонкэн.jpg",
    "images/8.14_Хиракэн.jpg",
    "images/8.15_Рютокэн.jpg",
    "images/8.16_Хайсю.jpg",
    "images/8.17_Тохо.jpg",
    "images/8.18_Кэйко.jpg",
    "images/8.19_Котэ.jpg",
    "images/8.20_Тюсоку.jpg",
    "images/8.21_Сокуто.jpg",
    "images/8.22_Тэйсоку.jpg",
    "images/8.23_Хайсоку.jpg",
    "images/8.24_Аши.jpg",
    "images/8.25_Какато.jpg",
    "images/8.26_Сунэ.jpg",
    "images/8.27_Хидза.jpg",
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
    "images/10.1_Сэйкэн_цуки.jpg",
    "images/10.2_Татэ-цуки.jpg",
    "images/10.3_Агэ-цуки.jpg",
    "images/10.4_Сита-цуки.jpg",
    "images/10.5_Ороси-цуки.jpg",
    "images/10.6_Моротэ-цуки.jpg",
    "images/10.7_Яма-цуки.jpg",
    "images/10.8_Дзюн-цуки.jpg",
    "images/10.9_Сётэй_учи.jpg",
    "images/10.10_Ёхон_нукитэ.jpg",
    "images/10.11_Нихон_нукитэ.jpg",
    "images/10.12_Хиракэн_цуки.jpg",
    "images/10.13_Хиракэн_маваси_учи.jpg",
    "images/10.14_Рютокэн.jpg",
    "images/10.15_Тохо_цуки.jpg",
    "images/10.16_Аго_учи.jpg",
    "images/10.17_Тэтцуи_ороси_учи.jpg",
    "images/10.18_Тэтцуи_комиками_учи.jpg",
    "images/10.19_Тэтцуи_хидзо_учи.jpg",
    "images/10.20_Тэтцуи_ёко_учи.jpg",
    "images/10.21_Уракэн_сёмэн_учи.jpg",
    "images/10.22_Уракэн_саю_учи.jpg",
    "images/10.23_Уракэн_хидзо_учи.jpg",
    "images/10.24_Уракэн_маваси_учи.jpg",
    "images/10.25_Сюто_сакоцу_учи.jpg",
    "images/10.26_Сюто_учикоми.jpg",
    "images/10.27_Сюто_гаммэн_учи.jpg",
    "images/10.28_Сюто_хидзо_учи.jpg",
    "images/10.29_Сюто_ёко_учи.jpg",
    "images/10.30_Сюто_дзёдан_учи.jpg",
    "images/10.31_Маваси_учи.jpg",
    "images/10.32_Хайто_учи.jpg",
    "images/10.33_Моротэ_хайто_учи.jpg",
    "images/10.34_Хайсю_учи.jpg",
    "images/10.35_Кокэн_учи.jpg",
    "images/10.36_Кэйко_учи.jpg",
    "images/10.37_Маваси_хидзи_атэ.jpg",
    "images/10.38_Маэ_хидзи_атэ.jpg",
    "images/10.39_Агэ_хидзи_атэ.jpg",
    "images/10.40_Ороси_хидзи_атэ.jpg",
    "images/10.41_Усиро_хидзи_атэ.jpg",
    "images/11.1_Кин_гэри.jpg",
    "images/11.2_Хидза_гэри.jpg",
    "images/11.3_Маваси_хидза_гэри.jpg",
    "images/11.4_Маэ_гэри.jpg",
    "images/11.5_Маваси_гэри.jpg",
    "images/11.6_Усиро_гэри.jpg",
    "images/11.7_Усиро_маваси_гэри.jpg",
    "images/11.8_Ёко_гэри.jpg",
    "images/11.9_Кансэцу_гэри.jpg",
    "images/11.10_Маэ_киагэ.jpg",
    "images/11.11_Сото_маваси_киагэ.jpg",
    "images/11.12_Учи_маваси_киагэ.jpg",
    "images/11.13_Ёко_киагэ.jpg",
    "images/11.14_Учи_хайсоку_гэри.jpg",
    "images/11.15_Ороси_сото_какато_гэри.jpg",
    "images/11.16_Ороси_учи_какато_гэри.jpg",
    "images/11.17_Ура_маваси_гэри.jpg",
    "images/11.18_Маэ_тоби_гэри.jpg",
    "images/11.19_Нидан_тоби_гэри.jpg",
    "images/11.20_Ёко_тоби_гэри.jpg",
    "images/11.21_Маваси_тоби_гэри.jpg",
    "images/11.22_Усиро_тоби_гэри.jpg",
    "images/11.23_Усиро_маваси_тоби_гэри.jpg",
    "images/11.24_До_маваси_кайтэн_гэри.jpg",
    "images/12.1_Дэйо_дан_укэ.jpg",
    "images/12.2_Сото_укэ.jpg",
    "images/12.3_Учи_укэ.jpg",
    "images/12.4_Гэдан_барай.jpg",
    "images/12.5_Маэ_маваши_укэ.jpg",
    "images/12.6_Шуто_маваши_укэ.jpg",
    "images/12.7_Моротэ_учи_укэ.jpg",
    "images/12.8_Учи_укэ_гэдан_барай.jpg",
    "images/12.9_Джуджи_укэ.jpg",
    "images/12.10_Сётэй_укэ.jpg",
    "images/12.11_Сюто_дзёдан_учи_укэ.jpg",
    "images/12.12_Какэ_укэ.jpg",
    "images/12.13_Моротэ_какэ_укэ.jpg",
    "images/12.14_Хайто_учи_укэ.jpg",
    "images/12.15_Моротэ_хайто_учи_укэ.jpg",
    "images/12.16_Кокэн_укэ.jpg",
    "images/12.17_Моротэ_сюто_гэдан_укэ.jpg",
    "images/12.18_Моротэ_сётэй_гэдан_укэ.jpg",
    "images/12.19_Хидзи_укэ.jpg",
    "images/12.20_Осаэ_укэ.jpg",
    "images/12.21_Сунэ_укэ.jpg",
    "images/12.22_Хидза_укэ.jpg"
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