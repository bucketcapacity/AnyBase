function convertNum(number,tab) {
    var numString = number.selectionText;
    console.log("Convert " + numString + " to selected base.");

    
    var myWindow = window.open("./popup.html","MsgWindow","width=600 height=250");

    chrome.storage.local.set({hnum:numString},function() {
        console.log('stored '+numString+' to hnum');
    });

}
chrome.contextMenus.create({
    title: "Convert %s", 
    contexts:["selection"], 
    onclick: convertNum
});
