export type Language = "en" | "ru";

type TranslationKey =
  | "appTitle"
  | "chooseElement"
  | "close"
  | "currentSceneHighlight"
  | "electrons"
  | "fillingStep"
  | "full"
  | "infoPanel.configuration"
  | "infoPanel.levelsAndOrbitals"
  | "infoPanel.selectedElement"
  | "level"
  | "language"
  | "next"
  | "orbitalFocus"
  | "orientation"
  | "overview"
  | "overviewDescription"
  | "periodicTable"
  | "previous"
  | "readTheStructure"
  | "reset"
  | "singleOrientationDescription"
  | "stats.atomicNumber"
  | "stats.electrons"
  | "stats.levels"
  | "stats.name"
  | "stats.neutrons"
  | "stats.protons"
  | "subshell"
  | "subshellAll"
  | "subshellSelectedDescription"
  | "symbolTitle"
  | "track"
  | "tracks"
  | "unknownFocus"
  | "unknownFocusDescription";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appTitle: "Interactive Atom Visualizer",
    chooseElement: "Choose element",
    close: "Close",
    currentSceneHighlight: "Current scene highlight",
    electrons: "electrons",
    fillingStep: "Filling step",
    full: "Full",
    "infoPanel.configuration": "spdf electron configuration",
    "infoPanel.levelsAndOrbitals": "Levels and spdf orbitals",
    "infoPanel.selectedElement": "Selected element",
    language: "Language",
    level: "Level",
    next: "Next",
    orbitalFocus: "Orbital focus",
    orientation: "Orientation",
    overview: "Overview",
    overviewDescription: "All orbitals are shown without focus",
    periodicTable: "Periodic table",
    previous: "Previous",
    readTheStructure: "Read the structure",
    reset: "Reset",
    singleOrientationDescription: "Single orientation inside {subshell}",
    "stats.atomicNumber": "Atomic number",
    "stats.electrons": "Electrons",
    "stats.levels": "Levels",
    "stats.name": "Name",
    "stats.neutrons": "Neutrons",
    "stats.protons": "Protons",
    subshell: "Subshell",
    subshellAll: "All",
    subshellSelectedDescription: "Full {subshell} subshell is selected",
    symbolTitle: "Symbol {symbol}",
    track: "track",
    tracks: "tracks",
    unknownFocus: "Custom focus",
    unknownFocusDescription: "Selected orbital focus",
  },
  ru: {
    appTitle: "Интерактивный визуализатор атома",
    chooseElement: "Выбрать элемент",
    close: "Закрыть",
    currentSceneHighlight: "Текущая подсветка сцены",
    electrons: "электронов",
    fillingStep: "Шаг заполнения",
    full: "Полностью",
    "infoPanel.configuration": "spdf электронная конфигурация",
    "infoPanel.levelsAndOrbitals": "Уровни и spdf-орбитали",
    "infoPanel.selectedElement": "Выбранный элемент",
    language: "Язык",
    level: "Уровень",
    next: "Дальше",
    orbitalFocus: "Фокус орбитали",
    orientation: "Ориентация",
    overview: "Общий вид",
    overviewDescription: "Все орбитали показаны без фокуса",
    periodicTable: "Периодическая таблица",
    previous: "Назад",
    readTheStructure: "Изучение структуры",
    reset: "Сброс",
    singleOrientationDescription: "Одна ориентация внутри {subshell}",
    "stats.atomicNumber": "Атомный номер",
    "stats.electrons": "Электроны",
    "stats.levels": "Уровни",
    "stats.name": "Название",
    "stats.neutrons": "Нейтроны",
    "stats.protons": "Протоны",
    subshell: "Подуровень",
    subshellAll: "Все",
    subshellSelectedDescription: "Выбран весь подуровень {subshell}",
    symbolTitle: "Символ {symbol}",
    track: "траектория",
    tracks: "траекторий",
    unknownFocus: "Пользовательский фокус",
    unknownFocusDescription: "Выбранный фокус орбитали",
  },
};

const russianElementNames: Record<string, string> = {
  hydrogen: "Водород",
  helium: "Гелий",
  lithium: "Литий",
  beryllium: "Бериллий",
  boron: "Бор",
  carbon: "Углерод",
  nitrogen: "Азот",
  oxygen: "Кислород",
  fluorine: "Фтор",
  neon: "Неон",
  sodium: "Натрий",
  magnesium: "Магний",
  aluminium: "Алюминий",
  silicon: "Кремний",
  phosphorus: "Фосфор",
  sulfur: "Сера",
  chlorine: "Хлор",
  argon: "Аргон",
  potassium: "Калий",
  calcium: "Кальций",
  scandium: "Скандий",
  titanium: "Титан",
  vanadium: "Ванадий",
  chromium: "Хром",
  manganese: "Марганец",
  iron: "Железо",
  cobalt: "Кобальт",
  nickel: "Никель",
  copper: "Медь",
  zinc: "Цинк",
  gallium: "Галлий",
  germanium: "Германий",
  arsenic: "Мышьяк",
  selenium: "Селен",
  bromine: "Бром",
  krypton: "Криптон",
  rubidium: "Рубидий",
  strontium: "Стронций",
  yttrium: "Иттрий",
  zirconium: "Цирконий",
  niobium: "Ниобий",
  molybdenum: "Молибден",
  technetium: "Технеций",
  ruthenium: "Рутений",
  rhodium: "Родий",
  palladium: "Палладий",
  silver: "Серебро",
  cadmium: "Кадмий",
  indium: "Индий",
  tin: "Олово",
  antimony: "Сурьма",
  tellurium: "Теллур",
  iodine: "Иод",
  xenon: "Ксенон",
  caesium: "Цезий",
  barium: "Барий",
  lanthanum: "Лантан",
  cerium: "Церий",
  praseodymium: "Празеодим",
  neodymium: "Неодим",
  promethium: "Прометий",
  samarium: "Самарий",
  europium: "Европий",
  gadolinium: "Гадолиний",
  terbium: "Тербий",
  dysprosium: "Диспрозий",
  holmium: "Гольмий",
  erbium: "Эрбий",
  thulium: "Тулий",
  ytterbium: "Иттербий",
  lutetium: "Лютеций",
  hafnium: "Гафний",
  tantalum: "Тантал",
  tungsten: "Вольфрам",
  rhenium: "Рений",
  osmium: "Осмий",
  iridium: "Иридий",
  platinum: "Платина",
  gold: "Золото",
  mercury: "Ртуть",
  thallium: "Таллий",
  lead: "Свинец",
  bismuth: "Висмут",
  polonium: "Полоний",
  astatine: "Астат",
  radon: "Радон",
  francium: "Франций",
  radium: "Радий",
  actinium: "Актиний",
  thorium: "Торий",
  protactinium: "Протактиний",
  uranium: "Уран",
  neptunium: "Нептуний",
  plutonium: "Плутоний",
  americium: "Америций",
  curium: "Кюрий",
  berkelium: "Берклий",
  californium: "Калифорний",
  einsteinium: "Эйнштейний",
  fermium: "Фермий",
  mendelevium: "Менделевий",
  nobelium: "Нобелий",
  lawrencium: "Лоуренсий",
  rutherfordium: "Резерфордий",
  dubnium: "Дубний",
  seaborgium: "Сиборгий",
  bohrium: "Борий",
  hassium: "Хассий",
  meitnerium: "Мейтнерий",
  darmstadtium: "Дармштадтий",
  roentgenium: "Рентгений",
  copernicium: "Коперниций",
  nihonium: "Нихоний",
  flerovium: "Флеровий",
  moscovium: "Московий",
  livermorium: "Ливерморий",
  tennessine: "Теннессин",
  oganesson: "Оганесон",
};

export function t(language: Language, key: TranslationKey) {
  return translations[language][key];
}

export function formatTranslation(
  language: Language,
  key: TranslationKey,
  values: Record<string, string>,
) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(language, key),
  );
}

export function getElementName(
  element: { key: string; name: string },
  language: Language,
) {
  if (language === "ru") {
    return russianElementNames[element.key] ?? element.name;
  }

  return element.name;
}
