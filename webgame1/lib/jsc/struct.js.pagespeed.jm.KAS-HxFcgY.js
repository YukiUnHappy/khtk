(function(global,undefined){"use strict";var Struct=function(struct,value,endianness){this.endianness=endianness===undefined&&true||endianness;this.defaultValue=value||0;this.struct=normalize(struct,this.defaultValue);this.byteLength=getByteLength(this.struct);this.emptyBuffer=new ArrayBuffer(this.byteLength);this.constructor=Struct;this._debug=false;this._struct={};this._debug&&console.log('STRUCT.CREATE','defaultValue:',this.defaultValue,'byteLength:',this.byteLength,'endianness:',this.endianness,'struct:',this.struct);};Struct.prototype={update:function(struct){this.struct=update(this.struct,struct||{});this.byteLength=getByteLength(this.struct);this.emptyBuffer=new ArrayBuffer(this.byteLength);return clone(this.struct);},read:function(arrayBuffer,offset){if(arrayBuffer===undefined&&offset===undefined){return align(this.struct,function(item,prop,struct){struct[prop]=item[1];});}
var that=this,endianness=this.endianness,dv=arrayBuffer instanceof DataView&&arrayBuffer||new DataView(arrayBuffer);if(arrayBuffer.byteLength===0){return new Error('Uncaught IndexSizeError: Buffer size was zero byte.');}
this.offset=offset||0;this._debug&&console.info('STRUCT.READ','byteLength:',arrayBuffer.byteLength,'readOffset:',this.offset);var readed=align(this.struct,function(item,prop,struct){var values=[],typed=item[0],value=item[1],length=item[2],vary=item[3],size=typedefs[typed]||1,lengthTyped='uint8',i=0;if(isString(length)){lengthTyped=length;length=value.byteLength||value.length;}
if(arrayBuffer.byteLength<=that.offset){return new Error('Uncaught IndexSizeError: Index or size was negative.');}
if(vary===true){try{length=dv['get'+capitalize(lengthTyped)](that.offset,endianness)/size;}catch(e){console.error(e,that.offset,that.offset+size,arrayBuffer.byteLength);return new Error(e);}
that.offset+=typedefs[lengthTyped];that._struct[prop+'Size']=[lengthTyped,length*size];that._debug&&console.log(prop+'Size',that._struct[prop+'Size'],that.offset);}
if(isArrayBuffer(value)){var endOffset=that.offset+length*size;if(arrayBuffer.byteLength<endOffset){return new Error('Uncaught IndexSizeError: Index or size was negative.');}
values=arrayBuffer.slice(that.offset,endOffset);that.offset+=length*size;}else{while(i<length){if(isStruct(typed)){var buffer=arrayBuffer.slice(that.offset);values[i]=typed.read(buffer);size=typed.byteLength;}else{if(that.offset+size>arrayBuffer.byteLength){values[i]=new Error('Uncaught IndexSizeError: Index or size was negative.');}else{values[i]=dv['get'+capitalize(typed)](that.offset,endianness);}}
if(isError(values[i]))return values[i];that.offset+=size;i++;}}
if(isArrayBuffer(value)||isString(value)||isArray(value)||length>1){struct[prop]=isString(value)?charCodeArrToStr(values):values;}else{struct[prop]=values[0];}
that._struct[prop]=[typed,struct[prop]];that._debug&&console.log(prop,that._struct[prop],that.offset);});if(!isError(readed)){this.byteLength=this.offset;this.offset!=arrayBuffer.byteLength&&readed.type>=200&&this.offset!=6&&console.warn('Incorrect buffer size readed',this.offset,arrayBuffer.byteLength,readed);}
return isError(readed)&&readed||clone(readed);},write:function(struct){var that=this,offset=0,endianness=this.endianness;if(struct!==undefined){this.update(struct);}
var dataView=new DataView(this.emptyBuffer);this._debug&&console.info('STRUCT.WRITE','byteLength:',this.byteLength);align(this.struct,function(item,prop){var values=[],typed=item[0],value=item[1],length=item[2],vary=item[3],size=typedefs[typed],lengthTyped='uint8',i=0;if(size===undefined&&isStruct(typed)){lengthTyped=length;length=value.length;size=1;}
if(isString(length)||isString(value)){lengthTyped=length;length=value.length;}
if(isArrayBuffer(value)){length=value.byteLength;}
if(vary===true){dataView['set'+capitalize(lengthTyped)](offset,length*size,endianness);offset+=typedefs[lengthTyped];that._struct[prop+'Size']=[lengthTyped,length*size];that._debug&&console.log(prop+'Size',that._struct[prop+'Size'],offset);}
that._struct[prop]=[typed,value];if(isArrayBuffer(value)||isString(value)||isArray(value)||length>1){if(isArrayBuffer(value))values=arrayBufferToArray(value,typed);if(isFunction(value))values=[that.defaultValue];if(isArray(value))values=value;values=value&&isString(value)&&strToCharCodeArr(value)||values;}else{values=[value];}
while(i<length){if(isStruct(typed)){var buffer=typed.write(values[i]),tmp=new Uint8Array(buffer),j=0;while(j<tmp.length){dataView.setUint8(offset+j,tmp[j]);j++;}
offset+=tmp.length;}else{dataView['set'+capitalize(typed)](offset,values[i],endianness);offset+=size;}
i++;}
that._debug&&console.log(prop,that._struct[prop],offset);});offset!=this.emptyBuffer.byteLength&&console.warn('Incorrect buffer size writed');return dataView.buffer;}};var typedefs={int8:1,uint8:1,int16:2,uint16:2,int32:4,uint32:4,float32:4,int64:8,uint64:8,float64:8};function isStruct(a){return!!a&&a.constructor===Struct;}
function isError(a){return!!a&&a.constructor===Error;}
function isUndefined(a){return a===undefined;}
function isNull(a){return a===null;}
function isArray(a){return!!a&&(a===Array||a.constructor===Array);}
function isObject(a){return!!a&&(a===Object||a.constructor===Object);}
function isString(a){return!!a&&(a===String||a.constructor===String);}
function isFunction(a){return!!a&&(a===Function||a.constructor===Function);}
function isArrayBuffer(a){return!!a&&(a===ArrayBuffer||a.constructor===ArrayBuffer);}
function capitalize(str){return str.charAt(0).toUpperCase()+str.slice(1);}
function align(model,callback){var struct={},error=null;for(var p in model){if(model.hasOwnProperty(p)){var item=model[p];if(isObject(item)){struct[p]=align(item,callback);}else{error=callback(item,p,struct);if(error){struct=error;break;}}}}
return struct;}
function update(model,obj){for(var p in obj){if(model.hasOwnProperty(p)){if(isObject(model[p])){model[p]=update(model[p],obj[p]);}else{model[p][1]=obj[p];}}}
return model;}
function clone(obj){var struct={};for(var p in obj){if(obj.hasOwnProperty(p)){struct[p]=obj[p];}}
return struct;}
function normalize(model,defaultValue){return align(model,function(params,prop,struct){var _typed=isArray(params)&&params[0]||params,typed=isStruct(_typed)&&_typed||_typed.toLowerCase(),value=isString(params)?defaultValue:params[1],length=isArray(params)&&params.length>=3&&params[2]||(isString(value)||isArray(value)||isArrayBuffer(value))&&value.length||isArrayBuffer(value)&&value.byteLength||1,vary=isArray(params)&&(isString(length)||length>1)?isString(length)&&params[3]===undefined&&true||params[3]:false;if(isUndefined(value)||isNull(value))value='';struct[prop]=[typed,value,length,vary];});}
function getByteLength(struct){var byteLength=0;align(struct,function(item){var typed=item[0],value=item[1],length=item[2],vary=item[3],size=typedefs[typed],lengthTyped='uint8';if(size===undefined&&isStruct(typed)){size=typed.byteLength;}
if(isString(length)||isString(value)){lengthTyped=length;length=value&&value.length||0;}
if(isArrayBuffer(value)){length=value.byteLength||0;}
if(vary===true)byteLength+=typedefs[lengthTyped];byteLength+=length*size;});return byteLength;}
function strToCharCodeArr(str){var arr=[],len=str.length,idx=0;while(idx<len){arr[idx]=str.charCodeAt(idx);idx++;}
return arr;}
function charCodeArrToStr(arr){var str=[],len=arr.length,idx=0;while(idx<len){str[idx]=String.fromCharCode(arr[idx]);idx++;}
return str.join('');}
function arrayBufferToArray(buf,typed){return Array.prototype.slice.call(new global[capitalize(typed)+'Array'](buf));}
if(DataView.prototype.getUint64===undefined&&DataView.prototype.setUint64===undefined&&DataView.prototype.getInt64===undefined&&DataView.prototype.setInt64===undefined){var pow2=function(n){return(n>=0&&n<31)?(1<<n):(pow2[n]||(pow2[n]=Math.pow(2,n)-1));};var Uint64=function(lo,hi){this.lo=lo;this.hi=hi;};Uint64.prototype={valueOf:function(){return this.lo+pow2(32)*this.hi;},toString:function(){return Number.prototype.toString.apply(this.valueOf(),arguments);}};Uint64.fromNumber=function(number){var hi=Math.floor(number/pow2(32)),lo=number-hi*pow2(32);return new Uint64(lo,hi);};var Int64=function(){Uint64.apply(this,arguments);};Int64.prototype='create'in Object?Object.create(Uint64.prototype):new Uint64();Int64.prototype.valueOf=function(){if(this.hi<pow2(31)){return Uint64.prototype.valueOf.apply(this,arguments);}
return-((pow2(32)-this.lo)+pow2(32)*(pow2(32)-1-this.hi));};Int64.fromNumber=function(number){var lo,hi;if(number>=0){var unsigned=Uint64.fromNumber(number);lo=unsigned.lo;hi=unsigned.hi;}else{hi=Math.floor(number/pow2(32));lo=number-hi*pow2(32);hi+=pow2(32);}
return new Int64(lo,hi);};DataView.prototype.getUint64=function(byteOffset,endianness){var parts=endianness?[0,4]:[4,0];for(var i=0;i<2;i++){parts[i]=this.getUint32(byteOffset+parts[i],endianness);}
return new Uint64(parts[0],parts[1]).valueOf();};DataView.prototype.setUint64=function(byteOffset,value,endianness){value=Uint64.fromNumber(value);var parts=endianness?{lo:0,hi:4}:{lo:4,hi:0};for(var partName in parts){this.setUint32(byteOffset+parts[partName],value[partName],endianness);}};DataView.prototype.getInt64=function(byteOffset,endianness){var parts=endianness?[0,4]:[4,0];for(var i=0;i<2;i++){parts[i]=this.getUint32(byteOffset+parts[i],endianness);}
return new Int64(parts[0],parts[1]).valueOf();};DataView.prototype.setInt64=function(byteOffset,endianness){var value=Int64.fromNumber(value);var parts=endianness?{lo:0,hi:4}:{lo:4,hi:0};for(var partName in parts){this.setUint32(byteOffset+parts[partName],value[partName],endianness);}};}
global.Struct=Struct;})(this);