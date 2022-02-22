"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dl_command = exports.download_command = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfkit = __importStar(require("pdfkit"));
const admZip = __importStar(require("adm-zip"));
const api_1 = __importDefault(require("../calameo/api"));
const await_1 = __importDefault(require("../utils/await"));
const BOOK_FORMAT = {
    PDF: "PDF",
    ZIP: "ZIP"
};
exports.download_command = {
    label: "download",
    help: "dl <url|book_code> <output_file> [--format=<zip|pdf>]",
    callback: async (label, args, cli) => {
        if (args.length > 1) {
            console.log(args);
            let book_code = null;
            let format = BOOK_FORMAT[(args["format"] + "" || "pdf").toUpperCase()];
            let output_file_path = args[1] + "";
            try {
                let url = new URL(args[0]);
                console.log(url.pathname);
            }
            catch (e) {
                book_code = args[0];
            }
            let book_info = (await api_1.default.getBookInfo(book_code));
            if (book_info.status == "error") {
                console.error(book_info.content.msg);
                return true;
            }
            if (book_info.status == "ok") {
                let book_key = book_info.content.key;
                let page_count = parseInt(book_info.content.document.pages);
                !fs.existsSync(path.join(__dirname, "/tmp/")) ? fs.mkdirSync(path.join(__dirname, "/tmp/")) : null;
                let book_pages_dir_path = path.join(__dirname, "tmp/" + book_code + "/");
                !fs.existsSync(book_pages_dir_path) ? fs.mkdirSync(book_pages_dir_path) : null;
                let downloaded_page_count = 0;
                let same_time_downloading_count = 0;
                let same_time_downloading_max = 3;
                for (let i = 1; i < page_count + 1; ++i) {
                    let download = async (attempt = 0, attempt_max = 3) => {
                        try {
                            let page_file_path = path.join(book_pages_dir_path, "/p" + i + ".jpg");
                            if (!fs.existsSync(page_file_path)) {
                                let is_same_time_downloading = same_time_downloading_count < same_time_downloading_max;
                                same_time_downloading_count += is_same_time_downloading ? 1 : 0;
                                let r = (await api_1.default.fetchBookPage(book_key, i));
                                same_time_downloading_count += is_same_time_downloading ? -1 : 0;
                                fs.writeFileSync(page_file_path, r);
                            }
                            downloaded_page_count += 1;
                            console.info("Page " + i + "/" + page_count + " downloaded.");
                        }
                        catch (e) {
                            if (attempt < attempt_max) {
                                console.warn("Problem happends while page " + i + "/" + page_count + " downloading, trying again... (attempt " + (attempt + 1) + "/" + attempt_max + ")\n" + e);
                                download(attempt + 1, attempt_max);
                            }
                            else {
                                console.error("Page " + i + "/" + page_count + " downloading failed.");
                                downloaded_page_count = -1;
                            }
                        }
                    };
                    let can_same_time_downloading = same_time_downloading_count < same_time_downloading_max;
                    can_same_time_downloading ? download() : await download();
                }
                await await_1.default.validContenxt(() => { return downloaded_page_count == page_count || downloaded_page_count == -1; });
                if (downloaded_page_count == -1) {
                    console.error("An error occured when trying to download book pages.");
                    process.exit(0);
                }
                console.info("Converting book pages to " + format + " file \"" + output_file_path + "\"...");
                if (format == BOOK_FORMAT.PDF) {
                    let pdf_doc = new pdfkit.default();
                    pdf_doc.pipe(fs.createWriteStream(path.join(output_file_path)));
                    for (let i = 1; i < page_count + 1; ++i) {
                        let page_file_path = path.join(book_pages_dir_path, "/p" + i + ".jpg");
                        pdf_doc.addPage({ margins: { top: 0, bottom: 0, left: 0, right: 0 }, }).image(page_file_path, { width: parseInt(book_info.content.document.width), height: parseInt(book_info.content.document.height), align: "center", valign: "center" });
                    }
                    pdf_doc.end();
                }
                else if (format == BOOK_FORMAT.ZIP) {
                    let zip_file = new admZip.default();
                    for (let i = 1; i < page_count + 1; ++i) {
                        let page_file_path = path.join(book_pages_dir_path, "/p" + i + ".jpg");
                        zip_file.addLocalFile(page_file_path);
                    }
                    fs.writeFileSync(output_file_path, zip_file.toBuffer());
                }
                console.log(format, BOOK_FORMAT.ZIP);
            }
            return true;
        }
        return false;
    }
};
exports.dl_command = exports.download_command;
exports.dl_command.label = "dl";
