export function localized(strings, locale){
  return strings[locale] || strings['en']
}