import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export default class Utils {

    /**
    // @param {string} filename - The name of the CSV file to read.
    // @param {boolean} [hasHeader=true] - Wheter the csv file has a header row. Defaults to true.
    // @returns {SharedArray<any>} - An array of arrays representing the CSV data.
    */
    static readCsv(filename, hasHeader = true) {
        const filePath = `../../resources/csv/${filename}`;
        try {
            const retorno = new SharedArray(filename, function () {
                const fileContent = open(filePath);
                const data = papaparse.parse(fileContent, {
                    header: hasHeader,
                    skipEmptyLines: true,
                });
                return data.data;
            });
            return retorno;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error reading CSV file: ${filePath}. Error: ${errorMessage}`);
            throw error;
        }
    }

    /**
    // @param {string} filename - The name of the TXT file to read.
    // @returns {SharedArray<string>} - An array of strings representing the lines of the TXT file.
    */

    static readTxt(filename) {
        const filePath = `../../resources/txt/${filename}`;
        try {
            const retorno = new SharedArray(filename, function () {
                const fileContent = open(filePath);
                return fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
            });
            return retorno;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error reading TXT file: ${filePath}. Error: ${errorMessage}`);
            return new SharedArray('empty', function () { return []; });
        }
    }
}