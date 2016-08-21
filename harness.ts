/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as ts from "typescript";
import * as fs from "fs";
import "colors";
const JsDiff = require('diff');


const options: ts.CompilerOptions = {};
const rootFileNames = ["mistake.ts"];

const host: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
        getScriptVersion: (fileName) => "0",
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    };
const ls = ts.createLanguageService(host, ts.createDocumentRegistry());

ls.getSemanticDiagnostics("mistake.ts").forEach((diagnostic) => {
    const fixes = ls.getCodeFixesAtPosition("mistake.ts", diagnostic.start, diagnostic.length, [`TS${diagnostic.code}`]);
    fixes.forEach(fix => {
        console.log(fix.description);
        for (let change of fix.changes) {
            const snap = host.getScriptSnapshot("mistake.ts");
            const orig = snap.getText(0, snap.getLength());
            let replaced = orig;
            for (let i = change.textChanges.length - 1; i >=0; i--) {
                const replacement = change.textChanges[i];
                replaced = replaced.substr(0, replacement.span.start) +
                 replacement.newText +
                 replaced.substr(replacement.span.start + replacement.span.length);
            }
            var diff = JsDiff.diffWords(orig, replaced);
            diff.forEach(function(part){
            // green for additions, red for deletions
            // grey for common parts
            var color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
                process.stderr.write(part.value[color]);
            });
        }
    });
});

