import { Tooltip } from 'materialize-css';
export default {
  beforeMount(el, { value }) {
    Tooltip.init(el, { html: value });
  },
  //чтобы уничтожить лишние тултипы при уходе со страницы
  unmounted(el) {
    //получаем тултипы через встроенный метод в материалайз
    const tooltip = Tooltip.getInstance(el);
    if (tooltip && tooltip.destroy) {
      tooltip.destroy();
    }
  },
};
