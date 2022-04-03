import { toast } from "materialize-css";

export default {
  install(app) {
    app.config.globalProperties.$message = function (html) {
      toast({ html });
    };

    app.config.globalProperties.$error = function (html) {
      toast({ html: `[Ошибка]: ${html}` });
    };
  },
};
