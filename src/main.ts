
import { CLI } from "./cli/cli";

//

import { download_command, dl_command } from "./commands/download";

//

const cli = new CLI({
    prefix: "Calameo Book Downloader"
});

cli.registerCommand(download_command);
cli.registerCommand(dl_command);

cli.first();