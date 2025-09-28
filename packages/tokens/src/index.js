"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var baseColors_json_1 = require("./build/baseColors.json");
var breakpoints_json_1 = require("./build/breakpoints.json");
var colors_json_1 = require("./build/colors.json");
var components_json_1 = require("./build/components.json");
var config_json_1 = require("./build/config.json");
var themes_json_1 = require("./build/themes.json");
var tokens_json_1 = require("./build/tokens.json");
var typography_json_1 = require("./build/typography.json");
var module = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, baseColors_json_1.default), breakpoints_json_1.default), colors_json_1.default), components_json_1.default), config_json_1.default), themes_json_1.default), tokens_json_1.default), typography_json_1.default);
exports.default = module;
