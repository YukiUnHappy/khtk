var str_B="012.123.234.345.456.567.678.789";var str_A=str_B.split(".");var getJSON=function(url,callback){if(CURRENT_BROWSER=="ie"||CURRENT_BROWSER=="safari")
{cc.log(CURRENT_BROWSER+" : "+url);getJSON2(url,callback);return;}
var xhr=new XMLHttpRequest();xhr.open("get",url,true);xhr.send();cc.log(url);xhr.onreadystatechange=callbackFunction;function callbackFunction(){var status;var data;if(xhr.readyState==4)
{status=xhr.status;if(status==200){try{data=JSON.parse(xhr.responseText);callback(null,data);}catch(e){cc.log(e);}finally{}}else{callback(status);}}}};var getJSON2=function(url,callback){var xhr=new XMLHttpRequest();xhr.open("get",url,true);xhr.responseType="json";xhr.onload=function(){var status=xhr.status;if(status==200){callback(null,xhr.response);}else{callback(status);}};xhr.send();xhr.onreadystatechange=callbackFunction;function callbackFunction(){callback(999,xhr.response,xhr.readyState);}};var getSPJSON=function(url,callback,encrypt){var xhr=new XMLHttpRequest();xhr.open("get",url,true);xhr.send();cc.log(url);xhr.onreadystatechange=callbackFunction;function callbackFunction(){var status;var data;if(xhr.readyState==4)
{status=xhr.status;if(status==200){if(encrypt==false){data=JSON.parse(xhr.responseText);callback(null,data);}else{var set=String.fromCharCode(52);var de_xor=decrypt(xhr.responseText,str_A[1]+set);data=JSON.parse(de_xor);callback(null,data);}}else{callback(status);}}}};var getGateJSON=function(req,callback){var url=SERVER_GATEWAY+"/Server_Check.aspx";var xhr=new XMLHttpRequest();xhr.open("POST",url,true);xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhr.onreadystatechange=function(){if(xhr.readyState==4){if(xhr.status==200){cc.log("RECV DATA"+xhr.responseText);var decode_data=Base64_Ex.decode(xhr.responseText);cc.log("**** json_en="+decode_data);callback(null,JSON.parse(decode_data),xhr.readyState);}}};var data=JSON.stringify(req);var encoding=encodeURIComponent(Base64_Ex.encode(data));xhr.send(encoding);};var TRACEFunction=function(name,fn){return cc.log("TRACE: "+name.toString()+" begin ["+fn.toString()+" ]");}
function Singleton()
{}
Singleton.getInstance=function()
{if(Singleton.instance==undefined)Singleton.instance=new Singleton();return Singleton.instance;};String.prototype.format=function()
{var content=this;for(var i=0;i<arguments.length;i++)
{var replacement='{'+i+'}';content=content.replace(replacement,arguments[i]);}
return content;};