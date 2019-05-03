//TODO revamp custom base section, do the listeners the right way, make it so the default base works right
//TODO Make a base switch button, which also carries over the output into the input

var windowSize = ['100px','145px','193px']; //Height

function convertDoz(numStr) {
    var foo = numStr.split('');
    for(i in foo) {
        if(foo[i] == 'ⵒ' || foo[i] == '*' || foo[i].toUpperCase() == 'A') {
            foo[i] = 'X';
        }
        if(foo[i] == 'Ɛ' || foo[i] == '#' || foo[i].toUpperCase() == 'B') {
            foo[i] = 'E';
        }
    }
    //document.getElementById('testOutput').innerHTML = foo;
    return foo.join('').toUpperCase();
}

function convert() {     
    
    document.getElementById('output').readOnly = true; //Last minute addition 2019/5/2
    
    //var test = document.getElementById('test');
    var testOut = document.getElementById('testOutput');
    
    document.addEventListener('change',customBase);
    
    var hackyBS = document.getElementById('hackyBS');
    
    chrome.storage.sync.get(['dozChar'],function(r) {
        if(!r.dozChar){
            hackyBS.innerHTML = 0;
        }
        else {
            hackyBS.innerHTML = r.dozChar;
        }
    });
    
    function dozSet() {
        var tmp = hackyBS.innerHTML;
        switch(tmp) {
            case('0'):
                return '0123456789ⵒƐ';
            case('1'):
               return '0123456789XE';
            default:
                break;
        }
        return ''
    }
    
    
    var num = document.getElementById('input');
    var baseFrom = document.getElementById('baseFrom');
    var baseTo = document.getElementById('baseTo');
    
    chrome.storage.sync.get(['baseDict'],function(result) {
        if(!result.baseDict) {
            chrome.storage.sync.set({baseDict:{}});
        }
        else {
            //var baseSel = document.querySelectorAll('baseSel');
            //console.log(baseSel);
            for(let key in result.baseDict) {
                //console.log(key,result.baseDict[key]);
                let opt = document.createElement("OPTION");
                opt.innerHTML = key;
                opt.value = result.baseDict[key];
                baseFrom.appendChild(opt);
                baseTo.appendChild(opt.cloneNode(true));
            }
                    
        }
                
    });
    
    //Lots of Try catches in here, don't know why it throws errors, but it works
    chrome.storage.local.get(['fromSel'],function(r) {
        if(!r.fromSel) {
            //console.log('putting in: ',baseFrom.selectedIndex]);
            chrome.storage.local.set({fromSel:baseFrom.selectedIndex});
        }
        else {
            try {
                baseFrom[r.fromSel].setAttribute('selected',true);
            } catch(err){}
        }
    });
    
    baseFrom.addEventListener('change',function() {
        var newSel = baseFrom.selectedIndex;
        //console.log(newSel);
        chrome.storage.local.get(['fromSel'],function(r) {
            //console.log("old: ",r.fromSel);
            try {
                baseFrom[r.fromSel].removeAttribute('selected');
            } catch(err){}
        });
        chrome.storage.local.set({fromSel:newSel},function() {
            baseFrom[newSel].setAttribute('selected',true);
        });
    });
    
    chrome.storage.local.get(['toSel'],function(r) {
        if(!r.toSel) {
            //console.log('putting in: ',baseFrom.selectedIndex]);
            chrome.storage.local.set({toSel:baseTo.selectedIndex});
        }
        else {
            try {
                baseTo[r.toSel].setAttribute('selected',true);
            } catch(err){}
        }
    });
    
    
    baseTo.addEventListener('change',function() {
        var newSel = baseTo.selectedIndex;
        //console.log(newSel);
        chrome.storage.local.get(['toSel'],function(r) {
            //console.log("old: ",r.fromSel);
            try{
                baseTo[r.toSel].removeAttribute('selected');
            }catch(err){}
        });
        chrome.storage.local.set({toSel:newSel},function() {
            baseTo[newSel].setAttribute('selected',true);
        });
    });
    //End of try catch stupidity
    
    var fracChar,commaLoc;
    
    chrome.storage.sync.get(['euroBox'],function(r) {
        if(!r.euroBox) {
            fracChar = '.';
        }
        else {
            fracChar = ',';
        }
    });
    
    chrome.storage.sync.get(['commaLoc'],function(r) {
        if(!r.commaLoc) {
            commaLoc = 3;
        }
        else {
            commaLoc = r.commaLoc
        }
    });
    
    var isSci = false;
    var internalCon = function(event) {
    
        var cleanNum,digitsFrom,digitsTo,baseFS,baseTS;
    
        switch(baseFrom.value) {
                case('binary'):
                digitsFrom = '01';
                cleanNum = num.value;
                break;
                case('octal'): //Last minute addition 2019/5/2
                digitsFrom = '01234567';
                cleanNum = num.value;
                break;
                case('decimal'):
                digitsFrom = '0123456789'
                cleanNum = num.value; //hnum should parseFloat this
                break;
                case('dozenal'):
                cleanNum = convertDoz(num.value);
                digitsFrom = '0123456789XE' //User won't see this, it's internal
                break;
                case('hexadecimal'):
                cleanNum = num.value.toUpperCase();
                digitsFrom = '0123456789ABCDEF';
                break;
                case('custom'):
                digitsFrom = document.getElementById('customBaseFrom').value;
                cleanNum = num.value;
                baseFS = document.getElementById('baseFromSelected').value;
                break;
            default:
                cleanNum = num.value;
                digitsFrom = '0123456789';
                break;
        }
    
        switch(baseTo.value) {
                case('binary'):
                digitsTo = '01';
                break;
                case('octal'): //Last minute addition 2019/5/2
                digitsTo = '01234567'
                break;
                case('decimal'):
                digitsTo = '0123456789'
                break;
                case('dozenal'):
                digitsTo = dozSet();
                break;
                case('hexadecimal'):
                digitsTo = '0123456789ABCDEF'
                break;
                case('custom'):
                digitsTo = document.getElementById('customBaseTo').value;
                baseTS = document.getElementById('baseToSelected').value;
                break;
            default:
                digitsTo = '0123456789';
                break;
        }
    
        cleanNum = cleanNum.split(' ').join('');//Last minute addition 2019/5/3

        var newNumber;
        
        if(baseFS) {
            newNumber = new HNum(cleanNum,digitsFrom,baseFS,undefined,undefined,undefined,fracChar,commaLoc);
        }
        else {
            newNumber = new HNum(cleanNum,digitsFrom,undefined,undefined,undefined,undefined,fracChar,commaLoc);
        }

        var output = document.getElementById('output');
        if(newNumber.number && newNumber.number != 'NaN') {
            if(baseTS) {
                newNumber.changeBase(digitsTo,baseTS)
            }
            else {
                newNumber.changeBase(digitsTo);
            }
            
            let commaTog = document.getElementById('commaTog');
            
            if(Math.abs(newNumber.value) > Math.pow(10,16) ){//&& newNumber.value.toString().length >= 17) {
                output.innerHTML = newNumber.sci(16);
                output.style.height = '35px';
                commaTog.setAttribute('hidden',true);
                isSci = true;
            } else {
                isSci = false;
                output.style.height = '14px'
                commaTog.removeAttribute('hidden');
                //output.innerHTML = newNumber.number;
                //output.innerHTML = dispNum;
                chrome.storage.sync.get(['commaAl'],function(r) {
                    switch(r.commaAl) {
                            case(0):
                            break;
                            case(1):
                            newNumber.commaOff();
                            break;
                            case(2):
                            newNumber.commaOn();
                            break;
                    }
                    //testOut.innerHTML = newNumber.number;
                    output.innerHTML = newNumber.number;
                    chrome.storage.local.set({finalNum:newNumber});

                });    
            }

        }
           else if(num.value && !newNumber.number) {
               output.innerHTML = "Invalid input";
           }
           else {
               output.innerHTML = '';
           }
    //}
    };
    
    
    chrome.storage.local.get(['hnum'], function(result) {
        if(result.hnum) {
            num.setAttribute('value',result.hnum);
            internalCon();
            //chrome.storage.local.remove('hnum');
        }
        chrome.storage.local.remove('hnum');
    });
    
    document.addEventListener('input',internalCon);
    document.addEventListener('change',internalCon);
    /*document.getElementById('output').addEventListener('input',function() {
        document.getElementById('testOutput').innerHTML = 'yeah'
    });*/
    document.getElementById('copy').addEventListener('click',function() {
        document.getElementById('output').select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    });
   
    
    document.getElementById('commaTog').addEventListener('click',function() {
        if(!isSci && num.value) {
            chrome.storage.local.get(['finalNum'],function(r) {
                console.log(r.finalNum);
                var fin = r.finalNum;
                var finalNumber = new HNum(fin.value,fin.digits,fin.base,fin.prec,fin.isComma,fin.trail,fin.fracSep,fin.commaLoc);
                //console.log(fin);
                finalNumber.commaTog();
                output.innerHTML = finalNumber.number;
                chrome.storage.local.set({finalNum:finalNumber});
            });
        }
    });
    
    var baseText = document.getElementById('baseText');
    var baseBut = document.getElementById("baseName");
    
    var digits,base;
    document.getElementById('saveFrom').addEventListener('click',function() {
        document.getElementById('overwrite').setAttribute('hidden',true) //Last minute addition 2019/5/2
        digits = document.getElementById('customBaseFrom').value;
        base = document.getElementById('baseFromSelected').value;
        if(digits && base) {
            document.body.style.height = windowSize[2];
            document.getElementById('enterBaseName').removeAttribute('hidden');
            baseBut.value = '';
        }
    });
    document.getElementById('saveTo').addEventListener('click',function() {
        document.getElementById('overwrite').setAttribute('hidden',true) //Last minute addition 2019/5/2
        digits = document.getElementById('customBaseTo').value;
        base = document.getElementById('baseToSelected').value;
        if(digits && base) {
            document.body.style.height = windowSize[2];
            document.getElementById('enterBaseName').removeAttribute('hidden');
            baseBut.value = '';
        }
    });
    
    
    function saveFunc(name,finalDig) {
        chrome.storage.sync.get(['baseDict'],function(result) {
            result.baseDict[name] = finalDig;
            chrome.storage.sync.set({baseDict:result.baseDict},function() {
                //testOut.innerHTML = 'base saved '+name+' '+result.baseDict[name];
                let opt = document.createElement("OPTION");
                opt.innerHTML = name;
                opt.value = finalDig;
                baseFrom.appendChild(opt);
                baseTo.appendChild(opt.cloneNode(true));
            });
            document.getElementById('enterBaseName').setAttribute('hidden',true);
            document.getElementById('overwrite').setAttribute('hidden',true);
            document.body.style.height = windowSize[1];
            //document.getElementById('testOutput').innerHTML = '0';
        });
    }
    
    baseBut.addEventListener('keypress', function(event){
        //console.log(event.keycode);
        if(event.keyCode == 13) {
            let name = baseBut.value;
            let finalDig = digits.slice(0,base);
            let illegalNames = ['binary','octal','decimal','dozenal','hexadecimal','custom','hnum'];
            if(illegalNames.indexOf(name.toLowerCase()) !== -1) {
                testOut.innerHTML = "you can't use that name"
                setTimeout(function(){ //Last minute addition 2019/5/2
                    testOut.innerHTML = ''
                },2000);
            }
            else if(name == '') { //Last minute addition 2019/5/2
            }
            else {
                chrome.storage.sync.get(['baseDict'],function(result) {

                    if(result.baseDict[name]) {
                        //testOut.innerHTML = 'name '+name+' is already in use';
                        document.getElementById('overwrite').removeAttribute('hidden');
                        document.body.style.height = windowSize[2];
                    }
                    else {
                        saveFunc(name,finalDig);
                    }
                    
                });
            }
        }
    });
    document.getElementById('yesSave').addEventListener('click',function() {
        let name = baseBut.value;
        let finalDig = digits.slice(0,base);
        //baseFrom.removeChild(baseFrom.getElementByValue(finalDig));
        //baseTo.removeChild(baseTo.getElementByValue(finalDig));
        //console.log(baseFrom.childNodes[0]);
        for(let node of baseFrom) {
            //console.log(node.value);
            if(node.value == name) {
                baseFrom.removeChild(node);
            }
        }
        for(let node of baseTo) {
            //console.log(node.value);
            if(node.value == name) {
                baseTo.removeChild(node);
            }
        }
        saveFunc(name,finalDig);
        document.getElementById('overwrite').setAttribute('hidden',true);
        document.getElementById('enterBaseName').setAttribute('hidden',true);
        document.body.style.height = windowSize[1];
            //document.getElementById('testOutput').innerHTML = '1';
    });
    
    document.getElementById('noSave').addEventListener('click',function() {
        document.getElementById('overwrite').setAttribute('hidden',true);
        document.getElementById('enterBaseName').setAttribute('hidden',true);
        document.body.style.height = windowSize[1];
            //document.getElementById('testOutput').innerHTML = '2';
    });

    
        
}

function customBase() {
    var inst = document.getElementById('instructions');
    if(document.getElementById('baseFrom').value == 'custom') {
        document.body.style.height = windowSize[1];  
        
        document.getElementById('overwrite').setAttribute('hidden',true);//Last minute addition 2019/5/2
        //document.getElementById('enterBaseName').setAttribute('hidden',true);

        var customBF = document.getElementById('customBaseFrom');
        var baseFSel = document.getElementById('baseFromSelected');
        customBF.removeAttribute('hidden');
        baseFSel.removeAttribute('hidden');
        inst.removeAttribute('hidden');
        inst.style.left = '33px';
        document.getElementById('saveFrom').removeAttribute('hidden');
        if(customBF.value && !baseFSel.value) {
            baseFSel.setAttribute('value',customBF.value.length);
        }
        else if(customBF.value.length < baseFSel.value || baseFSel.value <= 1) {
            baseFSel.value = customBF.value.length
        }
        //document.getElementById('customBaseFrom').removeAttribute('hidden');
        //document.getElementById('baseFromSelected').removeAttribute('hidden');
        
    }
    
    else {
        document.getElementById('customBaseFrom').setAttribute('hidden',true);
        document.getElementById('baseFromSelected').setAttribute('hidden',true);
        document.getElementById('saveFrom').setAttribute('hidden',true);

        //inst.setAttribute('hidden',true);
    }
    if(document.getElementById('baseTo').value == 'custom') {
        document.body.style.height = windowSize[1];
        
        document.getElementById('overwrite').setAttribute('hidden',true); //Last minute addition 2019/5/2
        //document.getElementById('enterBaseName').setAttribute('hidden',true);
        
        var customBT = document.getElementById('customBaseTo');
        var baseTSel = document.getElementById('baseToSelected');
        customBT.removeAttribute('hidden');
        baseTSel.removeAttribute('hidden');
        inst.removeAttribute('hidden');
        if(document.getElementById('baseFrom').value !== 'custom') {
            inst.style.left = '148px'
        }
        document.getElementById('saveTo').removeAttribute('hidden');
        if(customBT.value && !baseTSel.value) {
            baseTSel.setAttribute('value',customBT.value.length);
        }
        else if(customBT.value.length < baseTSel.value || baseTSel.value <= 1) {
            baseTSel.value = customBT.value.length
        }
        //document.getElementById('customBaseTo').removeAttribute('hidden');
        //document.getElementById('baseToSelected').removeAttribute('hidden');
    }
    else {
        document.getElementById('customBaseTo').setAttribute('hidden',true);
        document.getElementById('baseToSelected').setAttribute('hidden',true);
        document.getElementById('saveTo').setAttribute('hidden',true);
        //inst.setAttribute('hidden',true);

    }
    
    if(document.getElementById('baseFrom').value !== 'custom' && document.getElementById('baseTo').value !== 'custom') {
        inst.setAttribute('hidden',true);
        document.getElementById('enterBaseName').setAttribute('hidden',true);
        document.getElementById('overwrite').setAttribute('hidden',true);
        document.body.style.height = windowSize[0];
    }
}


window.addEventListener('load',convert);


