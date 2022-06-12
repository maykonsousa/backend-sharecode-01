"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineImportType = exports.isRegularExpressionGroup = exports.isRelativeToSibling = exports.isIndex = exports.isRelativeToParent = exports.isModule = exports.isAbsolute = void 0;
function isAbsolute(name) {
    return name.indexOf('/') === 0;
}
exports.isAbsolute = isAbsolute;
var moduleRegExp = /^[^\/\\.]/;
function isModule(name) {
    return moduleRegExp.test(name);
}
exports.isModule = isModule;
function isRelativeToParent(name) {
    return /^\.\.[\\/]/.test(name);
}
exports.isRelativeToParent = isRelativeToParent;
var indexFiles = ['.', './', './index', './index.js', './index.ts'];
function isIndex(name) {
    return indexFiles.indexOf(name) !== -1;
}
exports.isIndex = isIndex;
function isRelativeToSibling(name) {
    return /^\.[\\/]/.test(name);
}
exports.isRelativeToSibling = isRelativeToSibling;
function isRegularExpressionGroup(group) {
    return !!group && group[0] === '/' && group[group.length - 1] === '/' && group.length > 1;
}
exports.isRegularExpressionGroup = isRegularExpressionGroup;
function determineImportType(name, regExpGroups) {
    var matchingRegExpGroup = regExpGroups.find(function (_a) {
        var _groupName = _a[0], regExp = _a[1];
        return regExp.test(name);
    });
    if (matchingRegExpGroup)
        return matchingRegExpGroup[0];
    if (isAbsolute(name))
        return 'absolute';
    if (isModule(name))
        return 'module';
    if (isRelativeToParent(name))
        return 'parent';
    if (isIndex(name))
        return 'index';
    if (isRelativeToSibling(name))
        return 'sibling';
    return 'unknown';
}
exports.determineImportType = determineImportType;
