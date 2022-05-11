import store from '@/store'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en
}

export default function localize(key) {
  const locale = store.getters.info.locale || 'en-US'
  return locales[locale][key] || '[Localize error]: key not found'
}
