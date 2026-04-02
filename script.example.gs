// exemplo de script do Google Apps Script para receber os dados do formulário e armazená-los em uma planilha do Google Sheets

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
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
      var indexColuna = headers.indexOf(item.question);
      
      if (indexColuna !== -1) {
        newData[indexColuna] = item.review;
      } else {
        headers.push(item.question);
        newData.push(item.review);
        sheet.getRange(1, headers.length).setValue(item.question);
      }
    });
    
    sheet.appendRow(newData);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "details": erro.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
