var fs = require('fs')
var csv = require('fast-csv')
var ws = fs.createWriteStream("new.csv",{flags:'a'})

var obj1 = fs.readFileSync('json2/web.json')
var obj = JSON.parse(obj1)

//All the diiferent type of vocab stored in arrays
var dcall=[['do','not','call','me'],['stop','calling','me'],['calling','me','every','day'],['cannot','call','me'],
['cannot','call','my','cell'],['cannot','call','my','work'],['if','you','don\’t','stop']]

var har=['ridiculous','harassing','harassment',['fed','up'],'sick','tired']

var legal=['attorney','lawyer','legal',['sue','you'],['breaking','the','law'],'illegal',['that\’s','illegal'],
['is','it','legal'],'cease','desist'];

var rb=[['better','business','bureau'],'ftc',['attorney','general'],'fdcpa',['fair','debt','collections','practices','act'],
'fcc','tcpa']

var itp=[['i','can','pay'],['i','can','only','pay'],['what\’s','my','balance'],'settlement',['settle','in','full'],
['i','plan','to','pay'],['i','am','looking','to','pay'],['i','am','looking','to','resolve']];

var ol=[['i','cannot','pay'],['i','can\’t','pay'],['i','refuse','to','pay'],'hardship',['i','am','in','a','financial','hardship'],
['i','have','no','money'],['i','am','unemployed'],['i','am','out','of','work'],['i','am','on','disability'] ];

var cursing=['fuck','shit','crap','ass','asshole','dick','bitch'];


var mcall=[['i','have','a','missed','call'],['returning','a','call'],['your','number','on','my','caller','id']];

var letter=[['i','have','a','letter'],['i','received','a','letter']];

var email=[['i','have','an','email'],['i','received','an','email']];

var text=[['i','was','texted'],['i','received','a','text']];

var md=[['this','call','may','be','monitored','or','recorded'],['this','call','may','be','monitored','and','recorded'],
['calls','are','monitored','and','recorded']];

var mmdfull=[['this','is','a','communication','from','a','debt','collector','and','is',
'an','attempt','to','collect','a','debt',',','any','information','obtained','will','be','used','for','that','purpose']];

var mmdpartial=[['this','is','a','communication','from','a','debt','collector'],
['attempt','to','collect','a','debt'],
['any','information','obtained','will','be','used','for','that','purpose']];

var opening=[['my','name','is'],['thank','you','for','calling'],['mrs','associates'],
['thank','you','for','being','a','customer','of'],['first','i','want','to','thank','you','for'],['with','a','current','balance','of']
,['balance','owed'],['can','you','pay','this','balance','today','?'],['are','you','in','a','position',
'to','pay','this','balance'],['what','are','your','intentions'],['are','you','able','to','resolve','this']];

var closing =[['thank','you'],['thank','you','for','your','time'],['thank','you','for','being','a','customer','of']]


var a = obj['results']['items'];
var l = a.length;

//Function which checks the given array of vocab exists in the call transcript or not
function check(cl)
{

var time =0.0;
var t_time =0;
var iterator = 0;
var h =0;
var f =0;

while(h < l)
{
    
    
        
       if(Array.isArray(cl[f]) && a[h]['alternatives'][0]['content'].toLowerCase() == cl[f][0])
       {
       
       var pos = h;
       iterator = 0;
       while(iterator < cl[f].length )
       {
          
           if(a[h]['alternatives'][0]['content'].toLowerCase() == cl[f][iterator])
            {
               time = time + (Number(a[h]['end_time'])-Number(a[h]['start_time']));
               iterator ++;
               h++;
            }
            
           else if(a[h]['alternatives'][0]['content'].toLowerCase() != cl[f][iterator])
            {
               time = 0;
               h = pos;
               f++;
               break;
            }
           if(iterator >= cl[f].length)
           {
           f=0;
           }
           
            
       }//while
    
       }//if
      
        else if(a[h]['alternatives'][0]['content'].toLowerCase() == cl[f])
        {
            time = time +(Number(a[h]['end_time'])-Number(a[h]['start_time']));
            h++;
            f = 0;
        }
        else if (a[h]['alternatives'][0]['content'].toLowerCase() != cl[f] && f < cl.length)
        {
            f++;
        }
        else if(a[h]['alternatives'][0]['content'].toLowerCase() != cl[f] && f >= cl.length)
        {
            h++;
            f=0;
        }
         t_time = t_time + time;
         time = 0;
       
}// while h

if(t_time > 0)
    return 'YES'
else
    return 'NO'

}
var ans = [];


//BEHAVIORAL PHASE
//checking for complaint langauge
ans.push(check(cursing));
ans.push(check(dcall));
ans.push(check(har));
ans.push(check(legal));
ans.push(check(rb));


//checking for intent to pay and objection language
ans.push(check(itp));
ans.push(check(ol));


//checking sentiments
var sentiment = require('sentiment');
sentiment = new sentiment();
//ar doc = sentiment.analyze(obj['results']['transcripts'][0]['transcript'].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," "));

//for particular attribute of sentiments like score
var doc = sentiment.analyze(obj['results']['transcripts'][0]['transcript']).score;
var senti;
if(doc > 0)
    senti="POSITIVE"
else if(doc < 0)
    senti="NEGATIVE"
else
    senti="NEUTRAL"
//or
//var doc1 = sentiment.analyze(obj['results']['transcripts'][0]['transcript']).comparative;
ans.push(senti);

//checking for call reason langauge
ans.push(check(mcall));
ans.push(check(letter));
ans.push(check(email));
ans.push(check(text));

//COMPLIANCE PHASE
//checking for monitoring  disclosure
ans.push(check(md)) ;

//mini miranda disclosure
var temp;
temp=check(mmdfull)
ans.push(temp)
if(temp=='NO')
    temp=check(mmdpartial)
else
    temp='NO'
ans.push(temp);

//opening
ans.push(check(opening));

//closing
ans.push(check(closing));

//total time
var b = obj['results']['speaker_labels']['segments'];
var total_duration=b[b.length-1]['end_time'];
ans.push(total_duration);



// silence time
var total_time = 0;
for(var k = 0;k < b.length;k++)
{
    total_time = total_time + (Number(b[k]['end_time'])-Number(b[k]['start_time']));
}
var silence_time = total_duration - total_time;
ans.push(silence_time);
var silence= (silence_time /total_duration) * 100;
ans.push(silence);

csv.write([ans]).pipe(ws);
