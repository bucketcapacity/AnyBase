function init() {
    
    var testOut = document.getElementById('testOutput');
    var baseRem = document.getElementById('baseRem');

    function writeOpt(sel) {
        chrome.storage.sync.get(['baseDict'],function(result){
            for(let key in result.baseDict) {
                let opt = document.createElement("OPTION");
                opt.innerHTML = key;
                opt.value = key;
                sel.appendChild(opt);
            }
        });
    }
    
    writeOpt(baseRem);
    
    
    var euroBox = document.getElementById('euro');
    chrome.storage.sync.get(['euroBox'],function(r) {
        euroBox.checked = r.euroBox;
    });
    euroBox.addEventListener('change',function() {
        chrome.storage.sync.set({'euroBox':euroBox.checked});
    });
    
    
    var commaAl = document.getElementById('commaAl');
    chrome.storage.sync.get(['commaAl'],function(r) {
        if(!r.commaAl) {
            chrome.storage.sync.set({commaAl:0})
        }
        else {
            commaAl[commaAl.selectedIndex].removeAttribute('selected');
            commaAl[r.commaAl].setAttribute('selected',true);
        }
    });
    commaAl.addEventListener('change',function() {
        chrome.storage.sync.set({commaAl:commaAl.selectedIndex});
    });
    
    var dozChar = document.getElementById('dozChar');
    chrome.storage.sync.get(['dozChar'],function(r) {
        if(!r.dozChar) {
            chrome.storage.sync.set({dozChar:0})
        }
        else {
            dozChar[dozChar.selectedIndex].removeAttribute('selected');
            dozChar[r.dozChar].setAttribute('selected',true);
        }
    });
    dozChar.addEventListener('change',function() {
        chrome.storage.sync.set({dozChar:dozChar.selectedIndex});
    });
    
    document.getElementById('removeButton').addEventListener('click',function() {
        chrome.storage.sync.get(['baseDict'],function(r) {
            var newDict = r.baseDict;
            var keys = baseRem && baseRem.options
            //var remList = [];
            for(let option of keys) {
                //console.log("index: "+i);
                if(option.selected) {
                    console.log(option.value);
                    //console.log(newDict[keys[i]]);
                    delete newDict[option.value];
                    baseRem.removeChild(option);
                }
            }
            /*for(let key in newDict) {
                console.log(key);
            }*/
            chrome.storage.sync.set({baseDict:newDict});
            //writeOpt(baseRem);
        });
    });
   
    var areYouSure = document.getElementById('areYouSure');
    document.getElementById('clearMem').addEventListener('click',function() {
        areYouSure.removeAttribute('hidden');
    });
    
    document.getElementById('imSure').addEventListener('click',function() {
        chrome.storage.sync.remove('baseDict');
        for(i in baseRem) {
            baseRem.remove(1);
        }
        areYouSure.setAttribute('hidden',true);
    });
    
    document.getElementById('notSure').addEventListener('click',function() {
        areYouSure.setAttribute('hidden',true);
    });
    
    var commaLoc = document.getElementById('commaLoc');
    
    chrome.storage.sync.get(['commaLoc'],function(r) {
        if(!r.commaLoc) {
            chrome.storage.sync.set({commaLoc:3})
            commaLoc.setAttribute('value',3);
        }
        else {
            commaLoc.setAttribute('value',r.commaLoc);
        }
    });
    
    commaLoc.addEventListener('change',function() {
        chrome.storage.sync.set({commaLoc:commaLoc.value});
    });
    
    var advanced = document.getElementById('advanced');
    var showAdv = document.getElementById('showAdvanced');
    var hideAdv = document.getElementById('hideAdvanced')
    showAdv.addEventListener('click',function() {
        advanced.removeAttribute('hidden');
        showAdv.setAttribute('hidden',true);
        hideAdv.removeAttribute('hidden');
    });
    hideAdv.addEventListener('click',function() {
        advanced.setAttribute('hidden',true);
        showAdv.removeAttribute('hidden');
        hideAdv.setAttribute('hidden',true);
    });

}

window.addEventListener('load',init);