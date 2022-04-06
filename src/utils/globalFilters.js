import store from '@/store'
import { toast } from 'materialize-css'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en,
}

export default {
  install(app) {
    app.config.globalProperties.$formatDate = function (date, format = 'date') {
      const options = {}
      if (format.includes('date')) {
        options.day = '2-digit'
        options.month = 'long'
        options.year = 'numeric'
      }
      if (format.includes('time')) {
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
      }
      if (format.includes('nosecond')) {
        options.hour = '2-digit'
        options.minute = '2-digit'
      }

      const locale = store.getters.info.locale
      return new Intl.DateTimeFormat(locale, options).format(new Date(date))
    }
    app.config.globalProperties.$localize = function (key) {
      const locale = store.getters.info.locale || 'en-US'
      return locales[locale][key] || '[Localize error]: key not found'
    }
    app.config.globalProperties.$message = function (html) {
      toast({ html })
    }
    app.config.globalProperties.$error = function (html) {
      toast({ html: `[Ошибка]: ${html}` })
    }
  },
}
