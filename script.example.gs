// exemplo de script do Google Apps Script para receber os dados do formulário e armazená-los em uma planilha do Google Sheets

function doPost(e) {
  var spreadsheet = SpreadsheetApp.openById("CODIGO_PLANILHA_AQUI");
  var sheet = spreadsheet.getSheetByName("NOME_GUIA_PLANILHA_AQUI");
  
  try {
    var payload = JSON.parse(e.postData.contents);
    var responses = payload.responses; 
    
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      sheet.getRange(1, 1).setValue("Data/Hora");
      lastCol = 1;
    }
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    var newData = new Array(headers.length).fill("");
    newData[0] = new Date();
    
    responses.forEach(function(item) {
      var columnIndex = headers.indexOf(item.question);
      
      if (columnIndex !== -1) {
        newData[columnIndex] = item.review;
      } else {
        headers.push(item.question);
        newData.push(item.review);
        sheet.getRange(1, headers.length).setValue(item.question);
      }
    });
    
    sheet.appendRow(newData);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "details": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}