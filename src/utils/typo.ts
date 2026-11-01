// Типографика для русских текстов: неразрывный пробел после коротких слов и перед единицами,
// диапазоны «30–40» не разрываются.
const SHORT = /(^|[\s«(])(в|во|с|со|к|ко|о|об|у|и|а|но|на|по|за|из|до|от|не|ни|же|ли|для|без|при|про)\s/gi;

export function typo(text: string): string {
  return text
    .replace(SHORT, (_, pre: string, word: string) => `${pre}${word} `)
    .replace(SHORT, (_, pre: string, word: string) => `${pre}${word} `)
    .replace(/(\d)\s(минут\w*|час\w*|дн\w*|недел\w*|месяц\w*|урок\w*|модул\w*|публикац\w*|тем\b|раз\w*|строк\w*|секунд\w*|₽)/g, '$1 $2')
    .replace(/(\d)–(\d)/g, '$1⁠–⁠$2')
    .replace(/\s—/g, ' —');
}
