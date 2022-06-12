"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var import_type_1 = require("../util/import-type");
var static_require_1 = require("../util/static-require");
var newLinesBetweenOptions = ['ignore', 'always', 'always-and-inside-groups', 'never'];
var alphabetizeOptions = ['ignore', 'asc', 'desc'];
var defaultGroups = ['absolute', 'module', 'parent', 'sibling', 'index'];
var MAX_GROUP_SIZE = 100000;
function reverse(array) {
    return array
        .map(function (v) {
        return {
            name: v.name,
            rank: -v.rank,
            node: v.node,
        };
    })
        .reverse();
}
function getTokensOrCommentsAfter(sourceCode, node, count) {
    var currentNodeOrToken = node;
    var result = [];
    for (var i = 0; i < count; i++) {
        currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
        if (currentNodeOrToken == null) {
            break;
        }
        result.push(currentNodeOrToken);
    }
    return result;
}
function getTokensOrCommentsBefore(sourceCode, node, count) {
    var currentNodeOrToken = node;
    var result = [];
    for (var i = 0; i < count; i++) {
        currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
        if (currentNodeOrToken == null) {
            break;
        }
        result.push(currentNodeOrToken);
    }
    return result.reverse();
}
function takeTokensAfterWhile(sourceCode, node, condition) {
    var tokens = getTokensOrCommentsAfter(sourceCode, node, MAX_GROUP_SIZE);
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
        if (condition(tokens[i])) {
            result.push(tokens[i]);
        }
        else {
            break;
        }
    }
    return result;
}
function takeTokensBeforeWhile(sourceCode, node, condition) {
    var tokens = getTokensOrCommentsBefore(sourceCode, node, MAX_GROUP_SIZE);
    var result = [];
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (condition(tokens[i])) {
            result.push(tokens[i]);
        }
        else {
            break;
        }
    }
    return result.reverse();
}
function findOutOfOrder(imported) {
    if (imported.length === 0) {
        return [];
    }
    var maxSeenRankNode = imported[0];
    return imported.filter(function (importedModule) {
        var res = importedModule.rank < maxSeenRankNode.rank;
        if (maxSeenRankNode.rank < importedModule.rank) {
            maxSeenRankNode = importedModule;
        }
        return res;
    });
}
function findRootNode(node) {
    var parent = node;
    while (parent.parent != null && parent.parent.body == null) {
        parent = parent.parent;
    }
    return parent;
}
function findEndOfLineWithComments(sourceCode, node) {
    var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
    var endOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] : node.range[1];
    var result = endOfTokens;
    for (var i = endOfTokens; i < sourceCode.text.length; i++) {
        if (sourceCode.text[i] === '\n') {
            result = i + 1;
            break;
        }
        if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
            break;
        }
        result = i + 1;
    }
    return result;
}
function commentOnSameLineAs(node) {
    return function (token) {
        return (token.type === 'Block' || token.type === 'Line') &&
            token.loc.start.line === token.loc.end.line &&
            token.loc.end.line === node.loc.end.line;
    };
}
function findStartOfLineWithComments(sourceCode, node) {
    var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
    var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
    var result = startOfTokens;
    for (var i = startOfTokens - 1; i > 0; i--) {
        if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
            break;
        }
        result = i;
    }
    return result;
}
function isPlainRequireModule(node) {
    if (node.type !== 'VariableDeclaration') {
        return false;
    }
    if (node.declarations.length !== 1) {
        return false;
    }
    var decl = node.declarations[0];
    return (decl.id != null &&
        decl.id.type === 'Identifier' &&
        decl.init != null &&
        decl.init.type === 'CallExpression' &&
        decl.init.callee != null &&
        decl.init.callee.name === 'require' &&
        decl.init.arguments != null &&
        decl.init.arguments.length === 1 &&
        decl.init.arguments[0].type === 'Literal');
}
function isPlainImportModule(node) {
    return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}
function canCrossNodeWhileReorder(node) {
    return isPlainRequireModule(node) || isPlainImportModule(node);
}
function canReorderItems(firstNode, secondNode) {
    var parent = firstNode.parent;
    var firstIndex = parent.body.indexOf(firstNode);
    var secondIndex = parent.body.indexOf(secondNode);
    var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);
    for (var _i = 0, nodesBetween_1 = nodesBetween; _i < nodesBetween_1.length; _i++) {
        var nodeBetween = nodesBetween_1[_i];
        if (!canCrossNodeWhileReorder(nodeBetween)) {
            return false;
        }
    }
    return true;
}
function fixOutOfOrder(context, firstNode, secondNode, order) {
    var sourceCode = context.getSourceCode();
    var firstRoot = findRootNode(firstNode.node);
    var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
    var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);
    var secondRoot = findRootNode(secondNode.node);
    var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
    var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
    var canFix = canReorderItems(firstRoot, secondRoot);
    var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
    if (newCode[newCode.length - 1] !== '\n') {
        newCode = newCode + '\n';
    }
    var message = '`' + secondNode.name + '` import should occur ' + order + ' import of `' + firstNode.name + '`';
    if (order === 'before') {
        context.report({
            node: secondNode.node,
            message: message,
            fix: canFix &&
                (function (fixer) {
                    return fixer.replaceTextRange([firstRootStart, secondRootEnd], newCode + sourceCode.text.substring(firstRootStart, secondRootStart));
                }),
        });
    }
    else if (order === 'after') {
        context.report({
            node: secondNode.node,
            message: message,
            fix: canFix &&
                (function (fixer) {
                    return fixer.replaceTextRange([secondRootStart, firstRootEnd], sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode);
                }),
        });
    }
}
function reportOutOfOrder(context, imported, outOfOrder, order) {
    outOfOrder.forEach(function (imp) {
        var found = imported.find(function hasHigherRank(importedItem) {
            return importedItem.rank > imp.rank;
        });
        fixOutOfOrder(context, found, imp, order);
    });
}
function makeOutOfOrderReport(context, imported) {
    var outOfOrder = findOutOfOrder(imported);
    if (!outOfOrder.length) {
        return;
    }
    var reversedImported = reverse(imported);
    var reversedOrder = findOutOfOrder(reversedImported);
    if (reversedOrder.length < outOfOrder.length) {
        reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
        return;
    }
    reportOutOfOrder(context, imported, outOfOrder, 'before');
}
function mutateRanksToAlphabetize(imported, order, ignoreCase) {
    var groupedByRanks = imported.reduce(function (acc, importedItem) {
        acc[importedItem.rank] = acc[importedItem.rank] || [];
        acc[importedItem.rank].push(importedItem.name);
        return acc;
    }, {});
    var groupRanks = Object.keys(groupedByRanks);
    groupRanks.forEach(function (groupRank) {
        groupedByRanks[groupRank].sort(function (importA, importB) {
            return ignoreCase ? importA.localeCompare(importB) : importA < importB ? -1 : importA === importB ? 0 : 1;
        });
        if (order === 'desc') {
            groupedByRanks[groupRank].reverse();
        }
    });
    var alphabetizedRanks = groupRanks.sort().reduce(function (acc, groupRank) {
        groupedByRanks[groupRank].forEach(function (importedItemName, index) {
            acc[importedItemName] = +groupRank + index / MAX_GROUP_SIZE;
        });
        return acc;
    }, {});
    imported.forEach(function (importedItem) {
        importedItem.rank = alphabetizedRanks[importedItem.name];
    });
}
function getRegExpGroups(ranks) {
    return Object.keys(ranks)
        .filter(import_type_1.isRegularExpressionGroup)
        .map(function (rank) { return [rank, new RegExp(rank.slice(1, rank.length - 1))]; });
}
function computeRank(ranks, regExpGroups, name, type) {
    return ranks[(0, import_type_1.determineImportType)(name, regExpGroups)] + (type === 'import' ? 0 : MAX_GROUP_SIZE);
}
function registerNode(node, name, type, ranks, regExpGroups, imported) {
    var rank = computeRank(ranks, regExpGroups, name, type);
    if (rank !== -1) {
        imported.push({ name: name, rank: rank, node: node });
    }
}
function isInVariableDeclarator(node) {
    return node && (node.type === 'VariableDeclarator' || isInVariableDeclarator(node.parent));
}
var knownTypes = ['absolute', 'module', 'parent', 'sibling', 'index'];
function convertGroupsToRanks(groups) {
    var rankObject = groups.reduce(function (res, group, index) {
        if (typeof group === 'string')
            group = [group];
        group.forEach(function (groupItem) {
            if (!(0, import_type_1.isRegularExpressionGroup)(groupItem) && knownTypes.indexOf(groupItem) === -1) {
                throw new Error("Incorrect configuration of the rule: Unknown type " + JSON.stringify(groupItem) + ". For a regular expression, wrap the string in '/', ex: '/shared/'");
            }
            if (res[groupItem] !== undefined) {
                throw new Error('Incorrect configuration of the rule: `' + groupItem + '` is duplicated');
            }
            res[groupItem] = index;
        });
        return res;
    }, {});
    var omittedTypes = knownTypes.filter(function (type) {
        return rankObject[type] === undefined;
    });
    return omittedTypes.reduce(function (res, type) {
        res[type] = groups.length;
        return res;
    }, rankObject);
}
function fixNewLineAfterImport(context, previousImport) {
    var prevRoot = findRootNode(previousImport.node);
    var tokensToEndOfLine = takeTokensAfterWhile(context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));
    var endOfLine = prevRoot.range[1];
    if (tokensToEndOfLine.length > 0) {
        endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
    }
    return function (fixer) { return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n'); };
}
function removeNewLineAfterImport(context, currentImport, previousImport) {
    var sourceCode = context.getSourceCode();
    var prevRoot = findRootNode(previousImport.node);
    var currRoot = findRootNode(currentImport.node);
    var rangeToRemove = [
        findEndOfLineWithComments(sourceCode, prevRoot),
        findStartOfLineWithComments(sourceCode, currRoot),
    ];
    if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
        return function (fixer) { return fixer.removeRange(rangeToRemove); };
    }
    return undefined;
}
function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports) {
    var getNumberOfEmptyLinesBetween = function (currentImport, previousImport) {
        var linesBetweenImports = context
            .getSourceCode()
            .lines.slice(previousImport.node.loc.end.line, currentImport.node.loc.start.line - 1);
        return linesBetweenImports.filter(function (line) { return !line.trim().length; }).length;
    };
    var previousImport = imported[0];
    imported.slice(1).forEach(function (currentImport) {
        var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
        var currentGroupRank = Math.floor(currentImport.rank);
        var previousGroupRank = Math.floor(previousImport.rank);
        if (newlinesBetweenImports === 'always' || newlinesBetweenImports === 'always-and-inside-groups') {
            if (currentGroupRank !== previousGroupRank && emptyLinesBetween === 0) {
                context.report({
                    node: previousImport.node,
                    message: 'There should be at least one empty line between import groups',
                    fix: fixNewLineAfterImport(context, previousImport),
                });
            }
            else if (currentGroupRank === previousGroupRank &&
                emptyLinesBetween === 0 &&
                newlinesBetweenImports === 'always-and-inside-groups') {
                context.report({
                    node: previousImport.node,
                    message: 'There should be at least one empty line between imports',
                    fix: fixNewLineAfterImport(context, previousImport),
                });
            }
            else if (currentGroupRank === previousGroupRank &&
                emptyLinesBetween > 0 &&
                newlinesBetweenImports !== 'always-and-inside-groups') {
                context.report({
                    node: previousImport.node,
                    message: 'There should be no empty line within import group',
                    fix: removeNewLineAfterImport(context, currentImport, previousImport),
                });
            }
        }
        else if (emptyLinesBetween > 0) {
            context.report({
                node: previousImport.node,
                message: 'There should be no empty line between import groups',
                fix: removeNewLineAfterImport(context, currentImport, previousImport),
            });
        }
        previousImport = currentImport;
    });
}
function getAlphabetizeConfig(options) {
    var alphabetize = options.alphabetize || {};
    var order = alphabetize.order || 'ignore';
    var ignoreCase = alphabetize.ignoreCase || false;
    if (typeof order !== 'string') {
        throw new Error('Incorrect alphabetize config: `order` property should be ' +
            'a string, but `' +
            JSON.stringify(typeof order) +
            '` found instead.');
    }
    else if (['ignore', 'asc', 'desc'].indexOf(order) === -1) {
        throw new Error('Incorrect alphabetize config: `order` property should be ' +
            'either `ignore`, `asc` or `desc`, but `' +
            JSON.stringify(order) +
            '` found instead.');
    }
    if (typeof ignoreCase !== 'boolean') {
        throw new Error('Incorrect alphabetize config: ignoreCase should be ' +
            'a boolean, but `' +
            JSON.stringify(typeof ignoreCase) +
            '` found instead.');
    }
    return { order: order, ignoreCase: ignoreCase };
}
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            url: 'https://github.com/Tibfib/eslint-plugin-import-helpers/blob/master/docs/rules/order-imports.md',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    groups: {
                        type: 'array',
                    },
                    newlinesBetween: {
                        enum: newLinesBetweenOptions,
                    },
                    alphabetize: {
                        type: 'object',
                        properties: {
                            order: {
                                enum: alphabetizeOptions,
                                default: 'ignore',
                            },
                            ignoreCase: {
                                type: 'boolean',
                                default: false,
                            },
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create: function importOrderRule(context) {
        var options = context.options[0] || {};
        var newlinesBetweenImports = options.newlinesBetween || 'ignore';
        var alphabetize;
        var ranks;
        var regExpGroups;
        try {
            alphabetize = getAlphabetizeConfig(options);
            ranks = convertGroupsToRanks(options.groups || defaultGroups);
            regExpGroups = getRegExpGroups(ranks);
        }
        catch (error) {
            return {
                Program: function (node) {
                    context.report(node, error.message);
                },
            };
        }
        var imported = [];
        var level = 0;
        var incrementLevel = function () { return level++; };
        var decrementLevel = function () { return level--; };
        return {
            ImportDeclaration: function handleImports(node) {
                if (node.specifiers.length) {
                    var name = node.source.value;
                    registerNode(node, name, 'import', ranks, regExpGroups, imported);
                }
            },
            CallExpression: function handleRequires(node) {
                if (level !== 0 || !(0, static_require_1.isStaticRequire)(node) || !isInVariableDeclarator(node.parent)) {
                    return;
                }
                var name = node.arguments[0].value;
                registerNode(node, name, 'require', ranks, regExpGroups, imported);
            },
            'Program:exit': function reportAndReset() {
                if (alphabetize.order !== 'ignore') {
                    mutateRanksToAlphabetize(imported, alphabetize.order, alphabetize.ignoreCase);
                }
                makeOutOfOrderReport(context, imported);
                if (newlinesBetweenImports !== 'ignore') {
                    makeNewlinesBetweenReport(context, imported, newlinesBetweenImports);
                }
                imported = [];
            },
            FunctionDeclaration: incrementLevel,
            FunctionExpression: incrementLevel,
            ArrowFunctionExpression: incrementLevel,
            BlockStatement: incrementLevel,
            ObjectExpression: incrementLevel,
            'FunctionDeclaration:exit': decrementLevel,
            'FunctionExpression:exit': decrementLevel,
            'ArrowFunctionExpression:exit': decrementLevel,
            'BlockStatement:exit': decrementLevel,
            'ObjectExpression:exit': decrementLevel,
        };
    },
};
