/*
  chimpocode line bot app

  created by kyopan
  元祖ちんポコ野郎：https://gist.github.com/shoz/78bdb25a381eda1c802a87cb8e7552bc
*/

function doPost(e) {
  var replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return;
  }

  var url = 'https://api.line.me/v2/bot/message/reply';
  var channelToken = 'nC4Q0+EzypYMKkEtnIz57H4bsijGIqBwh1U48z4/n3BpMEyTy1mLNgVHellQKCunuDPykD8bPjH/7Ddf+2UqztJSSZzCUjR4rS+IRkLg3IA4qsSFm7DvrDH+Js2nlxsNGL1/Q+ELrlpT6AAVgiUM4AdB04t89/1O/w1cDnyilFU=';
  
  var input = JSON.parse(e.postData.contents).events[0].message;

  var message = "Hello:) 元気？"

  if(input.type == 'text') {
    // POKOTIN判定機
      // ポコかちんがあるか確認する。
      // ある場合は日本語またはポコちん語が想定される。

      // ポコともちんともマッチしない場合、人類言語が想定される。
      // しかし、人類言語にポコとちんが内包されている可能性はゼロじゃない。
      // 例えば、「ボク、ポコちん野郎！」
      // これは日本語だ。
      // つまり、ポコちん以外の文字列を取得して、存在する場合は人類語と判断する。

    if(input.text.includes('ポコ') || input.text.includes('ちん')) {
      if(input.text.includes('ポコ') && !input.text.includes('ちん')){
        // ポコがあってちんが無い。これは日本語だ！
        message = ascii2chinpoko(input.text);
        // message = "oぽこxちん";
      }else if(!input.text.includes('ポコ') && input.text.includes('ちん')){
        // ポコが無くてちんがある。これは日本語だ！
        message = ascii2chinpoko(input.text);
        // message = "xぽこoちん";
      }else if(input.text.includes('ポコ') && input.text.includes('ちん')){
        // ポコがあってちんもある。これはポコチン言語の可能性あり！
        // しかし、「ボク、ポコちん野郎！」が来てしまった場合はアウトだ。
        // ポコちん以外の文字を検出する必要がある。

        var poko_sentence = input.text.replace(/\s+/g, '')


        var poko_count = ( poko_sentence.match( /ポコ/g ) || [] ).length
        var chin_count = ( poko_sentence.match( /ちん/g ) || [] ).length
        var output = (poko_count+chin_count)/poko_sentence.length
        if(output < 0.5){
          // ポコちん濃度が薄いため、人類語と判断する！
          message = ascii2chinpoko(input.text)
        }else{
          // ポコちん言語間違いナシ！！
          message = chinpoko2ascii(input.text)
        }
      }
    }else{
      // ない場合は人類語が妥当であるため、ポコちんを返す。
      message = ascii2chinpoko(input.text);
      // message = "xぽこxちん";
    }
  }

   var messages = [{
    'type': 'text',
    'text': message,
  }];

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

var sorry = ["ちょっとパースできなかったw", "すまん、あまりにもポコちん過ぎて理解できなかったw", "つまり？", "日本語でおけw"]

function ascii2chinpoko(ascii=" "){
  var arr=[];
  if(ascii==' '){return sorry[getRandomInt(4)]}
  for(let i=0;i<ascii.length;i++){
    var ascii_code = ascii.charCodeAt(i);
    ascii_code = ascii_code.toString(2)
    let ascii_code2 = ascii_code.replace(/0/g, 'ちん').replace(/1/g, 'ポコ')
    // console.log(ascii_code2);
    arr[i]=ascii_code2;
  }
  return arr.join(' ')
}


function chinpoko2ascii(chinpoko=""){
  var chimpocode = chinpoko.replace(/ちん/g, '0').replace(/ポコ/g, '1')
  var chimarr = []
  var chimascii = []
  chimarr=chimpocode.split(' ')

  for(var i=0;i<chimarr.length;i++){
    var ascii_char = String.fromCharCode(parseInt(chimarr[i], 2))
    chimascii[i]=ascii_char
  }

  if(chimpocode==undefined){
    return sorry[getRandomInt(4)]
  }else{
    return chimascii.join("")
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}