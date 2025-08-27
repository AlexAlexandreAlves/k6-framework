import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.3.1/index.js';

export default class Utils {

    /**
    // @param {string} filename - The name of the CSV file to read.
    // @returns {Array} - An array of arrays representing the CSV data.
    */
    static readCsv(filename) {
        const filePath = `../../resources/csv/${filename}`;
        try {
            const retorno = SharedArray(filename, function () {
                const fileContent = open(filePath, 'utf-8');
                const data = papaparse.parse(fileContent, {
                    header: false
                }).data;
                return data;
            });
            return retorno;
        } catch (error) {
            console.error(`Error reading CSV file: ${filePath}. Error: ${error.message}`);
            throw error;
        }
    }

    /**
    // @param {string} filename - The name of the TXT file to read.
    // @returns {Array} - An array of strings representing the lines of the TXT file.
    */

    static readTxt(filename) {
        const filePath = `../../resources/txt/${filename}`;
        try {
            const retorno = SharedArray(filename, function () {
                const fileContent = open(filePath, 'utf-8');
                return fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
            });
            return retorno;
        } catch (error) {
            console.error(`Error reading TXT file: ${filePath}. Error: ${error.message}`);
            throw error;
        }
    }
}