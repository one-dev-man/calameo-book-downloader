import * as fs from "fs";
import * as path from "path";

import * as pdfkit from "pdfkit";
import * as admZip from "adm-zip";

import CalameoAPI from "../calameo/api";
import { CLI, CLI_COMMAND_CONSTRUCTOR_TYPE } from "../cli/cli";
import Await from "../utils/await";

const BOOK_FORMAT = {
    PDF: "PDF",
    ZIP: "ZIP"
}

export const download_command: CLI_COMMAND_CONSTRUCTOR_TYPE = {
    label: "download",
    help: "dl <url|book_code> <output_file> [--format=<zip|pdf>]",
    callback: async (label: string, args: Array<any>, cli: CLI) => {
        if(args.length > 1) {
            let book_code = null;

            let format = BOOK_FORMAT[( args["format"]+"" || "pdf" ).toUpperCase()];
            let output_file_path = args[1]+"";
            
            try {
                let url = new URL(args[0]);
                console.log(url.pathname);
            }
            catch(e) {
                book_code = args[0];
            }

            let book_info = (await CalameoAPI.getBookInfo(book_code)) as any;
            if(book_info.status == "error") {
                console.error(book_info.content.msg);
                return true;
            }

            if(book_info.status == "ok") {
                let book_key = book_info.content.key;
                let page_count = parseInt(book_info.content.document.pages);

                !fs.existsSync(path.join(__dirname, "/tmp/")) ? fs.mkdirSync(path.join(__dirname, "/tmp/")) : null;
                let book_pages_dir_path = path.join(__dirname, "tmp/"+book_code+"/");
                !fs.existsSync(book_pages_dir_path) ? fs.mkdirSync(book_pages_dir_path) : null;

                let downloaded_page_count = 0;

                let same_time_downloading_count = 0;
                let same_time_downloading_max=3;
                for(let i = 1; i < page_count+1; ++i) {
                    let download = async (attempt=0, attempt_max=3) => {
                        try {
                            let page_file_path = path.join(book_pages_dir_path, "/p"+i+".jpg");
                            if(!fs.existsSync(page_file_path)) {
                                let is_same_time_downloading = same_time_downloading_count < same_time_downloading_max;
                                same_time_downloading_count+= is_same_time_downloading ? 1 : 0;
                                let r = (await CalameoAPI.fetchBookPage(book_key, i)) as any;
                                same_time_downloading_count+=is_same_time_downloading ? -1 : 0;
                                fs.writeFileSync(page_file_path, r);
                            }
                            downloaded_page_count+=1;
                            console.info("Page "+i+"/"+page_count+" downloaded.");
                        } catch(e) {
                            if(attempt < attempt_max) {
                                console.warn("Problem happends while page "+i+"/"+page_count+" downloading, trying again... (attempt "+(attempt+1)+"/"+attempt_max+")\n"+e);
                                download(attempt+1, attempt_max);
                            }
                            else {
                                console.error("Page "+i+"/"+page_count+" downloading failed.");
                                downloaded_page_count = -1;
                            }
                        }
                    };
                    let can_same_time_downloading = same_time_downloading_count < same_time_downloading_max;
                    can_same_time_downloading ? download() : await download();
                }

                await Await.validContenxt(() => { return downloaded_page_count == page_count || downloaded_page_count == -1; });

                if(downloaded_page_count == -1) {
                    console.error("An error occured when trying to download book pages.");
                    process.exit(0);
                }

                console.info("Converting book pages to "+format+" file \""+output_file_path+"\"...")

                if(format == BOOK_FORMAT.PDF) {
                    let pdf_doc = new pdfkit.default();

                    pdf_doc.pipe(fs.createWriteStream(path.join(output_file_path)));

                    for(let i = 1; i < page_count+1; ++i) {
                        let page_file_path = path.join(book_pages_dir_path, "/p"+i+".jpg");
                        pdf_doc.addPage({ margins: { top: 0, bottom: 0, left: 0, right: 0 },  }).image(page_file_path, { width: parseInt(book_info.content.document.width), height: parseInt(book_info.content.document.height), align: "center", valign: "center" });
                    }

                    pdf_doc.end();
                }
                else if(format == BOOK_FORMAT.ZIP) {
                    let zip_file = new admZip.default();
                    
                    for(let i = 1; i < page_count+1; ++i) {
                        let page_file_path = path.join(book_pages_dir_path, "/p"+i+".jpg");
                        zip_file.addLocalFile(page_file_path);
                    }

                    fs.writeFileSync(output_file_path, zip_file.toBuffer());
                }
            }
            return true;
        }
        return false;
    }
}

export const dl_command = download_command;
dl_command.label = "dl";