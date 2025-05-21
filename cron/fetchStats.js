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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var slippi_1 = require("./slippi");
var google_spreadsheet_1 = require("google-spreadsheet");
var creds_json_1 = require("../secrets/creds.json");
var syncFs = require("fs");
var path = require("path");
var util_1 = require("util");
var settings = require("../settings");
var child_process_1 = require("child_process");
var fs = syncFs.promises;
var execPromise = util_1["default"].promisify(child_process_1.exec);
// var playerCodes = [
//     "HUFFF#0", "IBDW#0", "AMSA#0"
// ];
var getSheetData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var doc, sheet, rows, codes, tags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doc = new google_spreadsheet_1.GoogleSpreadsheet(settings.spreadsheetID);
                return [4 /*yield*/, doc.useServiceAccountAuth(creds_json_1["default"])];
            case 1:
                _a.sent();
                return [4 /*yield*/, doc.loadInfo()];
            case 2:
                _a.sent(); // loads document properties and worksheets
                sheet = doc.sheetsByIndex[0];
                return [4 /*yield*/, sheet.getRows()];
            case 3:
                rows = (_a.sent());
                codes = __spreadArray([], new Set(rows.map(function (r) { return r._rawData[1]; }).filter(function (r) { return r !== ''; })), true);
                tags = __spreadArray([], new Set(rows.map(function (r) { return r._rawData[2]; }).filter(function (r) { return r !== ''; })), true);
                return [2 /*return*/, [codes, tags]];
        }
    });
}); };
var getPlayers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheetData, codes, tags, allData, results, validResults, unsortedPlayers, unsortedPlayersWithTags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getSheetData()];
            case 1:
                sheetData = _a.sent();
                codes = sheetData[0];
                tags = sheetData[1];
                console.log("Found ".concat(codes.length, " player codes"));
                allData = codes.map(function (code) { return (0, slippi_1.getPlayerDataThrottled)(code); });
                return [4 /*yield*/, Promise.all(allData.map(function (p) { return p["catch"](function (e) { return e; }); }))];
            case 2:
                results = _a.sent();
                validResults = results.filter(function (result) { return !(result instanceof Error); });
                unsortedPlayers = validResults
                    .filter(function (data) { var _a; return (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.getUser; })
                    .map(function (data) { return data.data.getUser; });
                // uncomment to print all display names
                // var displayNames = unsortedPlayers.map(function(player) {
                //   return player.displayName;
                // });
                if (unsortedPlayers.length != tags.length) {
                    console.log("Error retrieving player data. Received data of length " + unsortedPlayers.length.toString() + " but " +
                        "tag list is of length " + tags.length.toString());
                    return [2 /*return*/, []];
                }
                unsortedPlayersWithTags = unsortedPlayers.map(function (obj, i) { return (__assign(__assign({}, obj), { leaderboardName: tags[i] })); });
                return [2 /*return*/, unsortedPlayersWithTags.sort(function (p1, p2) {
                        return p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal;
                    })];
        }
    });
}); };
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var players, newFile, oldFile, timestamp, rootDir, _a, stdout, stderr, _b, stdout2, stderr2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('Starting player fetch.');
                    return [4 /*yield*/, getPlayers()];
                case 1:
                    players = _c.sent();
                    if (!players.length) {
                        console.log('Error fetching player data. Terminating.');
                        return [2 /*return*/];
                    }
                    console.log('Player fetch complete.');
                    newFile = path.join(__dirname, 'data/players-new.json');
                    oldFile = path.join(__dirname, 'data/players-old.json');
                    timestamp = path.join(__dirname, 'data/timestamp.json');
                    return [4 /*yield*/, fs.rename(newFile, oldFile)];
                case 2:
                    _c.sent();
                    console.log('Renamed existing data file.');
                    return [4 /*yield*/, fs.writeFile(newFile, JSON.stringify(players))];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, fs.writeFile(timestamp, JSON.stringify({ updated: Date.now() }))];
                case 4:
                    _c.sent();
                    console.log('Wrote new data file and timestamp.');
                    console.log('Deploying.');
                    rootDir = path.normalize(path.join(__dirname, '..'));
                    console.log(rootDir);
                    return [4 /*yield*/, execPromise("git -C ".concat(rootDir, " status --porcelain"))];
                case 5:
                    _a = _c.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    if (stdout || stderr) {
                        console.log('Pending git changes... aborting deploy');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, execPromise("npm run --prefix ".concat(rootDir, " deploy"))];
                case 6:
                    _b = _c.sent(), stdout2 = _b.stdout, stderr2 = _b.stderr;
                    console.log(stdout2);
                    if (stderr2) {
                        console.error(stderr2);
                    }
                    console.log('Deploy complete.');
                    return [2 /*return*/];
            }
        });
    });
}
main();
