export * from "./app";
export * from "./api";
export * from "./editor";
export * from "./locale";

import * as app from "./app";
import * as api from "./api";
import * as editor from "./editor";
import * as locale from "./locale";

export const Constants = {
  ...app,
  ...api,
  ...editor,
  ...locale,
};
