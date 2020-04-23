/**
 * import file
 *
 * @param {File} currentFile currently selected file object
 * @param {string} ajaxUrl ajax url
 * @param {string} security_code nonce verification code
 * @param {string} delimiter delimiter for csv data
 */
export function importFile(currentFile, ajaxUrl, security_code, delimiter) {
    let regex = /^([a-zA-Z0-9()\s_\\.\-:])+(.csv)$/;
    let regex2 = /^([a-zA-Z0-9()\s_\\.\-:])+(.xml)$/;
    let regex3 = /^([a-zA-Z0-9()\s_\\.\-:])+(.html)$/;
    let regex4 = /^([a-zA-Z0-9()\s_\\.\-:])+(.zip)$/;

    let is_csv = regex.test(currentFile.name.toLowerCase());
    let is_xml = regex2.test(currentFile.name.toLowerCase());
    let is_html = regex3.test(currentFile.name.toLowerCase());
    let is_zip = regex4.test(currentFile.name.toLowerCase());

    let file = currentFile;
    if (is_zip) {
        let http = new XMLHttpRequest(),
            url = ajaxUrl + '?action=zip_unpacker';

        let data = new FormData();
        data.append('file', file, 'csv_zip.zip');

        // TODO [erdembircan] import related nonce is here
        data.append('security_code', security_code);

        http.open('POST', url, true);

        http.onreadystatechange = function (action) {
            if (this.readyState == 4 && this.status == 200) {
                let data = http.responseText;
                if (data) data = JSON.parse(data);

                if (data && Array.isArray(data)) {
                    if (data[0] == 'success') {
                        if (data[1] && Array.isArray(data[1])) {
                            let dataTable = [];

                            // check file extension, if it "csv" add get this tableData
                            for (let i = 0; i < data[1].length; i++) {
                                if (data[1][i][0] === 'csv') {
                                    dataTable.push(data[1][i][1]);
                                }
                            }

                            if (dataTable.length > 0) {
                                tablesFromCsvSaveRun(dataTable, 0, delimiter);
                            }
                        }
                    }
                }

            }
        }
        http.send(data);
    } else if (is_csv || is_xml || is_html) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            let data;
            reader.onload = function (e) {
                data = e.target.result;

                if (is_csv) {
                    tablesFromCsvSaveRun([data], 0);
                }
            }

            reader.readAsText(file);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid file.");
    }

    /**
     * run all process for importing tables
     */
    function tablesFromCsvSaveRun(tableDataCsv, index, delimiter) {
        if (tableDataCsv && Array.isArray(tableDataCsv)) {

           // TODO [erdembircan] delimiter definition here
            let csvDelimiterSelect = document.querySelector('#wptb-csvDelimiter');
            let csvDelimiter;
            if (csvDelimiterSelect) {
                csvDelimiter = csvDelimiterSelect.value;
                if (csvDelimiter == 'tab') csvDelimiter = '\t';
            }
            if (!csvDelimiter) {
                csvDelimiter = searchDelimiter(tableDataCsv[index]);
                if (!csvDelimiter) {
                    alert('The delimiter could not be determined');

                    return;
                }
            }

            document.addEventListener('table:imported:saved', function tabImSave() {
                tableImportingProgressBar(index + 1, tableDataCsv.length, 'import');
                if (tableDataCsv.length - index > 1) {
                    tablesFromCsvSaveRun(tableDataCsv, index + 1);
                }

                document.removeEventListener('table:imported:saved', tabImSave);
            });

            let tableDataArr = parseCsv(tableDataCsv[index], csvDelimiter);
            let importedTable = createTableFromDataArray(tableDataArr);
            tableImportedSave(importedTable);

            if (index === 0) {
                tableImportingProgressBar(0, 1, 'import');
            }
        }

    }
}

