import XLSX from 'xlsx';

class ExcelManager {
  static options = {
    bookType: 'xlsx',
  };

  // MARK: Create an Excel Sheet Report form Historical Data
  static createNewExcelSheetReport(data): void {
    // var workbook = XLSX.utils.book_new();

    const structure = [['', '', '', '', '']];

    // var worksheet = XLSX.utils.aoa_to_sheet([
    //   ["A1", "B1", "C1"],
    //   ["A2", "B2", "C2"],
    //   ["A3", "B3", "C3"]
    // ]);

    // XLSX.utils.book_append_sheet(workbook, worksheet, sheet_name);

    // XLSX.writeFileXLSX(workbook, filename, opts);

    console.log(structure);
  }
}

export default ExcelManager;