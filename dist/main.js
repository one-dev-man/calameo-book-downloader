"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./cli/cli");
//
const download_1 = require("./commands/download");
//
const cli = new cli_1.CLI({
    prefix: "Calameo Book Downloader"
});
cli.registerCommand(download_1.download_command);
cli.registerCommand(download_1.dl_command);
cli.first();
