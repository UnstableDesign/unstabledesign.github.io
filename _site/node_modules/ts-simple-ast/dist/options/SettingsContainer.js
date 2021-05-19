"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objectAssign = require("object-assign");
var SettingsContainer = /** @class */ (function () {
    function SettingsContainer(defaultSettings) {
        this.defaultSettings = objectAssign({}, defaultSettings);
        this.settings = defaultSettings;
    }
    /**
     * Resets the settings to the default.
     */
    SettingsContainer.prototype.reset = function () {
        this.settings = objectAssign({}, this.defaultSettings);
    };
    /**
     * Gets a copy of the settings as an object.
     */
    SettingsContainer.prototype.get = function () {
        return objectAssign({}, this.settings);
    };
    /**
     * Sets one or all of the settings.
     * @param settings - Settings to set.
     */
    SettingsContainer.prototype.set = function (settings) {
        objectAssign(this.settings, settings);
    };
    return SettingsContainer;
}());
exports.SettingsContainer = SettingsContainer;
