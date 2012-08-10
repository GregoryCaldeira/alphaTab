var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var alphatab = alphatab || {}
alphatab.Main = $hxClasses["alphatab.Main"] = function() { }
alphatab.Main.__name__ = ["alphatab","Main"];
alphatab.Main.main = function() {
}
if(!alphatab.audio) alphatab.audio = {}
alphatab.audio.GeneralMidi = $hxClasses["alphatab.audio.GeneralMidi"] = function() { }
alphatab.audio.GeneralMidi.__name__ = ["alphatab","audio","GeneralMidi"];
alphatab.audio.GeneralMidi._values = null;
alphatab.audio.GeneralMidi.getValue = function(name) {
	if(alphatab.audio.GeneralMidi._values == null) {
		alphatab.audio.GeneralMidi._values = new Hash();
		alphatab.audio.GeneralMidi._values.set("acousticgrandpiano",0);
		alphatab.audio.GeneralMidi._values.set("brightacousticpiano",1);
		alphatab.audio.GeneralMidi._values.set("electricgrandpiano",2);
		alphatab.audio.GeneralMidi._values.set("honkytonkpiano",3);
		alphatab.audio.GeneralMidi._values.set("electricpiano1",4);
		alphatab.audio.GeneralMidi._values.set("electricpiano2",5);
		alphatab.audio.GeneralMidi._values.set("harpsichord",6);
		alphatab.audio.GeneralMidi._values.set("clavinet",7);
		alphatab.audio.GeneralMidi._values.set("celesta",8);
		alphatab.audio.GeneralMidi._values.set("glockenspiel",9);
		alphatab.audio.GeneralMidi._values.set("musicbox",10);
		alphatab.audio.GeneralMidi._values.set("vibraphone",11);
		alphatab.audio.GeneralMidi._values.set("marimba",12);
		alphatab.audio.GeneralMidi._values.set("xylophone",13);
		alphatab.audio.GeneralMidi._values.set("tubularbells",14);
		alphatab.audio.GeneralMidi._values.set("dulcimer",15);
		alphatab.audio.GeneralMidi._values.set("drawbarorgan",16);
		alphatab.audio.GeneralMidi._values.set("percussiveorgan",17);
		alphatab.audio.GeneralMidi._values.set("rockorgan",18);
		alphatab.audio.GeneralMidi._values.set("churchorgan",19);
		alphatab.audio.GeneralMidi._values.set("reedorgan",20);
		alphatab.audio.GeneralMidi._values.set("accordion",21);
		alphatab.audio.GeneralMidi._values.set("harmonica",22);
		alphatab.audio.GeneralMidi._values.set("tangoaccordion",23);
		alphatab.audio.GeneralMidi._values.set("acousticguitarnylon",24);
		alphatab.audio.GeneralMidi._values.set("acousticguitarsteel",25);
		alphatab.audio.GeneralMidi._values.set("electricguitarjazz",26);
		alphatab.audio.GeneralMidi._values.set("electricguitarclean",27);
		alphatab.audio.GeneralMidi._values.set("electricguitarmuted",28);
		alphatab.audio.GeneralMidi._values.set("overdrivenguitar",29);
		alphatab.audio.GeneralMidi._values.set("distortionguitar",30);
		alphatab.audio.GeneralMidi._values.set("guitarharmonics",31);
		alphatab.audio.GeneralMidi._values.set("acousticbass",32);
		alphatab.audio.GeneralMidi._values.set("electricbassfinger",33);
		alphatab.audio.GeneralMidi._values.set("electricbasspick",34);
		alphatab.audio.GeneralMidi._values.set("fretlessbass",35);
		alphatab.audio.GeneralMidi._values.set("slapbass1",36);
		alphatab.audio.GeneralMidi._values.set("slapbass2",37);
		alphatab.audio.GeneralMidi._values.set("synthbass1",38);
		alphatab.audio.GeneralMidi._values.set("synthbass2",39);
		alphatab.audio.GeneralMidi._values.set("violin",40);
		alphatab.audio.GeneralMidi._values.set("viola",41);
		alphatab.audio.GeneralMidi._values.set("cello",42);
		alphatab.audio.GeneralMidi._values.set("contrabass",43);
		alphatab.audio.GeneralMidi._values.set("tremolostrings",44);
		alphatab.audio.GeneralMidi._values.set("pizzicatostrings",45);
		alphatab.audio.GeneralMidi._values.set("orchestralharp",46);
		alphatab.audio.GeneralMidi._values.set("timpani",47);
		alphatab.audio.GeneralMidi._values.set("stringensemble1",48);
		alphatab.audio.GeneralMidi._values.set("stringensemble2",49);
		alphatab.audio.GeneralMidi._values.set("synthstrings1",50);
		alphatab.audio.GeneralMidi._values.set("synthstrings2",51);
		alphatab.audio.GeneralMidi._values.set("choiraahs",52);
		alphatab.audio.GeneralMidi._values.set("voiceoohs",53);
		alphatab.audio.GeneralMidi._values.set("synthvoice",54);
		alphatab.audio.GeneralMidi._values.set("orchestrahit",55);
		alphatab.audio.GeneralMidi._values.set("trumpet",56);
		alphatab.audio.GeneralMidi._values.set("trombone",57);
		alphatab.audio.GeneralMidi._values.set("tuba",58);
		alphatab.audio.GeneralMidi._values.set("mutedtrumpet",59);
		alphatab.audio.GeneralMidi._values.set("frenchhorn",60);
		alphatab.audio.GeneralMidi._values.set("brasssection",61);
		alphatab.audio.GeneralMidi._values.set("synthbrass1",62);
		alphatab.audio.GeneralMidi._values.set("synthbrass2",63);
		alphatab.audio.GeneralMidi._values.set("sopranosax",64);
		alphatab.audio.GeneralMidi._values.set("altosax",65);
		alphatab.audio.GeneralMidi._values.set("tenorsax",66);
		alphatab.audio.GeneralMidi._values.set("baritonesax",67);
		alphatab.audio.GeneralMidi._values.set("oboe",68);
		alphatab.audio.GeneralMidi._values.set("englishhorn",69);
		alphatab.audio.GeneralMidi._values.set("bassoon",70);
		alphatab.audio.GeneralMidi._values.set("clarinet",71);
		alphatab.audio.GeneralMidi._values.set("piccolo",72);
		alphatab.audio.GeneralMidi._values.set("flute",73);
		alphatab.audio.GeneralMidi._values.set("recorder",74);
		alphatab.audio.GeneralMidi._values.set("panflute",75);
		alphatab.audio.GeneralMidi._values.set("blownbottle",76);
		alphatab.audio.GeneralMidi._values.set("shakuhachi",77);
		alphatab.audio.GeneralMidi._values.set("whistle",78);
		alphatab.audio.GeneralMidi._values.set("ocarina",79);
		alphatab.audio.GeneralMidi._values.set("lead1square",80);
		alphatab.audio.GeneralMidi._values.set("lead2sawtooth",81);
		alphatab.audio.GeneralMidi._values.set("lead3calliope",82);
		alphatab.audio.GeneralMidi._values.set("lead4chiff",83);
		alphatab.audio.GeneralMidi._values.set("lead5charang",84);
		alphatab.audio.GeneralMidi._values.set("lead6voice",85);
		alphatab.audio.GeneralMidi._values.set("lead7fifths",86);
		alphatab.audio.GeneralMidi._values.set("lead8bassandlead",87);
		alphatab.audio.GeneralMidi._values.set("pad1newage",88);
		alphatab.audio.GeneralMidi._values.set("pad2warm",89);
		alphatab.audio.GeneralMidi._values.set("pad3polysynth",90);
		alphatab.audio.GeneralMidi._values.set("pad4choir",91);
		alphatab.audio.GeneralMidi._values.set("pad5bowed",92);
		alphatab.audio.GeneralMidi._values.set("pad6metallic",93);
		alphatab.audio.GeneralMidi._values.set("pad7halo",94);
		alphatab.audio.GeneralMidi._values.set("pad8sweep",95);
		alphatab.audio.GeneralMidi._values.set("fx1rain",96);
		alphatab.audio.GeneralMidi._values.set("fx2soundtrack",97);
		alphatab.audio.GeneralMidi._values.set("fx3crystal",98);
		alphatab.audio.GeneralMidi._values.set("fx4atmosphere",99);
		alphatab.audio.GeneralMidi._values.set("fx5brightness",100);
		alphatab.audio.GeneralMidi._values.set("fx6goblins",101);
		alphatab.audio.GeneralMidi._values.set("fx7echoes",102);
		alphatab.audio.GeneralMidi._values.set("fx8scifi",103);
		alphatab.audio.GeneralMidi._values.set("sitar",104);
		alphatab.audio.GeneralMidi._values.set("banjo",105);
		alphatab.audio.GeneralMidi._values.set("shamisen",106);
		alphatab.audio.GeneralMidi._values.set("koto",107);
		alphatab.audio.GeneralMidi._values.set("kalimba",108);
		alphatab.audio.GeneralMidi._values.set("bagpipe",109);
		alphatab.audio.GeneralMidi._values.set("fiddle",110);
		alphatab.audio.GeneralMidi._values.set("shanai",111);
		alphatab.audio.GeneralMidi._values.set("tinklebell",112);
		alphatab.audio.GeneralMidi._values.set("agogo",113);
		alphatab.audio.GeneralMidi._values.set("steeldrums",114);
		alphatab.audio.GeneralMidi._values.set("woodblock",115);
		alphatab.audio.GeneralMidi._values.set("taikodrum",116);
		alphatab.audio.GeneralMidi._values.set("melodictom",117);
		alphatab.audio.GeneralMidi._values.set("synthdrum",118);
		alphatab.audio.GeneralMidi._values.set("reversecymbal",119);
		alphatab.audio.GeneralMidi._values.set("guitarfretnoise",120);
		alphatab.audio.GeneralMidi._values.set("breathnoise",121);
		alphatab.audio.GeneralMidi._values.set("seashore",122);
		alphatab.audio.GeneralMidi._values.set("birdtweet",123);
		alphatab.audio.GeneralMidi._values.set("telephonering",124);
		alphatab.audio.GeneralMidi._values.set("helicopter",125);
		alphatab.audio.GeneralMidi._values.set("applause",126);
		alphatab.audio.GeneralMidi._values.set("gunshot",127);
	}
	name = StringTools.replace(name.toLowerCase()," ","");
	return alphatab.audio.GeneralMidi._values.exists(name)?alphatab.audio.GeneralMidi._values.get(name):0;
}
alphatab.audio.MidiUtils = $hxClasses["alphatab.audio.MidiUtils"] = function() { }
alphatab.audio.MidiUtils.__name__ = ["alphatab","audio","MidiUtils"];
alphatab.audio.MidiUtils.durationToTicks = function(value) {
	return alphatab.audio.MidiUtils.valueToTicks(alphatab.model.ModelUtils.getDurationValue(value));
}
alphatab.audio.MidiUtils.valueToTicks = function(value) {
	return 960 * (4.0 / value) | 0;
}
alphatab.audio.MidiUtils.applyDot = function(ticks,doubleDotted) {
	if(doubleDotted) return ticks + (ticks / 4 * 3 | 0); else return ticks + (ticks / 2 | 0);
}
alphatab.audio.MidiUtils.applyTuplet = function(ticks,numerator,denominator) {
	return ticks * numerator / denominator | 0;
}
if(!alphatab.importer) alphatab.importer = {}
alphatab.importer.ScoreImporter = $hxClasses["alphatab.importer.ScoreImporter"] = function() {
};
alphatab.importer.ScoreImporter.__name__ = ["alphatab","importer","ScoreImporter"];
alphatab.importer.ScoreImporter.availableImporters = function() {
	var scoreImporter = new Array();
	scoreImporter.push(new alphatab.importer.Gp3To5Importer());
	scoreImporter.push(new alphatab.importer.AlphaTexImporter());
	return scoreImporter;
}
alphatab.importer.ScoreImporter.prototype = {
	determineTieOrigin: function(note) {
		var previousBeat = note.beat.previousBeat;
		while(previousBeat != null) {
			var noteOnString = previousBeat.getNoteOnString(note.string);
			if(noteOnString != null) return noteOnString; else previousBeat = previousBeat.previousBeat;
		}
		return null;
	}
	,determineHammerPullDestination: function(note) {
		var nextBeat = note.beat.nextBeat;
		while(nextBeat != null) {
			var noteOnString = nextBeat.getNoteOnString(note.string);
			if(noteOnString != null) return noteOnString; else nextBeat = nextBeat.nextBeat;
		}
		return null;
	}
	,finish: function(score) {
		var _g = 0, _g1 = score.tracks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(!t.isPercussion) {
				var _g2 = 0, _g3 = t.bars;
				while(_g2 < _g3.length) {
					var bar = _g3[_g2];
					++_g2;
					var _g4 = 0, _g5 = bar.voices;
					while(_g4 < _g5.length) {
						var v = _g5[_g4];
						++_g4;
						var _g6 = 0, _g7 = v.beats;
						while(_g6 < _g7.length) {
							var beat = _g7[_g6];
							++_g6;
							var _g8 = 0, _g9 = beat.notes;
							while(_g8 < _g9.length) {
								var n = _g9[_g8];
								++_g8;
								if(n.isTieDestination) {
									var tieOrigin = this.determineTieOrigin(n);
									if(tieOrigin == null) n.isTieDestination = false; else {
										tieOrigin.isTieOrigin = true;
										n.fret = tieOrigin.fret;
									}
								}
								if(n.isHammerPullOrigin) {
									var hammerPullDestination = this.determineHammerPullDestination(n);
									if(hammerPullDestination == null) n.isHammerPullOrigin = false; else hammerPullDestination.isHammerPullDestination = true;
								}
							}
						}
					}
				}
			}
		}
	}
	,readScore: function() {
		return null;
	}
	,init: function(data) {
		this._data = data;
	}
	,_data: null
	,__class__: alphatab.importer.ScoreImporter
}
alphatab.importer.AlphaTexImporter = $hxClasses["alphatab.importer.AlphaTexImporter"] = function() {
	alphatab.importer.ScoreImporter.call(this);
};
alphatab.importer.AlphaTexImporter.__name__ = ["alphatab","importer","AlphaTexImporter"];
alphatab.importer.AlphaTexImporter.isLetter = function(ch) {
	var code = HxOverrides.cca(ch,0);
	return !alphatab.importer.AlphaTexImporter.isTerminal(ch) && (code >= 33 && code <= 47 || code >= 58 && code <= 126 || code > 128);
}
alphatab.importer.AlphaTexImporter.isTerminal = function(ch) {
	return ch == "." || ch == "{" || ch == "}" || ch == "[" || ch == "]" || ch == "(" || ch == ")" || ch == "|" || ch == "'" || ch == "\"" || ch == "\\";
}
alphatab.importer.AlphaTexImporter.__super__ = alphatab.importer.ScoreImporter;
alphatab.importer.AlphaTexImporter.prototype = $extend(alphatab.importer.ScoreImporter.prototype,{
	readNumber: function() {
		var str = "";
		do {
			str += this._ch;
			this.nextChar();
		} while(this.isDigit(this._ch));
		return Std.parseInt(str);
	}
	,readName: function() {
		var str = "";
		do {
			str += this._ch;
			this.nextChar();
		} while(alphatab.importer.AlphaTexImporter.isLetter(this._ch) || this.isDigit(this._ch));
		return str;
	}
	,isDigit: function(ch) {
		var code = HxOverrides.cca(ch,0);
		return code >= 48 && code <= 57 || ch == "-" && this._allowNegatives;
	}
	,newSy: function() {
		this._sy = alphatab.importer.AlphaTexSymbols.No;
		do if(this._ch == alphatab.importer.AlphaTexImporter.EOL) this._sy = alphatab.importer.AlphaTexSymbols.Eof; else if(this._ch == " " || this._ch == "\n" || this._ch == "\r" || this._ch == "\t") this.nextChar(); else if(this._ch == "\"" || this._ch == "'") {
			this.nextChar();
			this._syData = "";
			this._sy = alphatab.importer.AlphaTexSymbols.String;
			while(this._ch != "\"" && this._ch != "'" && this._ch != alphatab.importer.AlphaTexImporter.EOL) {
				this._syData += this._ch;
				this.nextChar();
			}
			this.nextChar();
		} else if(this._ch == "-") {
			if(this._allowNegatives && this.isDigit(this._ch)) {
				var number = this.readNumber();
				this._sy = alphatab.importer.AlphaTexSymbols.Number;
				this._syData = number;
			} else {
				this._sy = alphatab.importer.AlphaTexSymbols.String;
				this._syData = this.readName();
			}
		} else if(this._ch == ".") {
			this._sy = alphatab.importer.AlphaTexSymbols.Dot;
			this.nextChar();
		} else if(this._ch == ":") {
			this._sy = alphatab.importer.AlphaTexSymbols.DoubleDot;
			this.nextChar();
		} else if(this._ch == "(") {
			this._sy = alphatab.importer.AlphaTexSymbols.LParensis;
			this.nextChar();
		} else if(this._ch == "\\") {
			this.nextChar();
			var name = this.readName();
			this._sy = alphatab.importer.AlphaTexSymbols.MetaCommand;
			this._syData = name;
		} else if(this._ch == ")") {
			this._sy = alphatab.importer.AlphaTexSymbols.RParensis;
			this.nextChar();
		} else if(this._ch == "{") {
			this._sy = alphatab.importer.AlphaTexSymbols.LBrace;
			this.nextChar();
		} else if(this._ch == "}") {
			this._sy = alphatab.importer.AlphaTexSymbols.RBrace;
			this.nextChar();
		} else if(this._ch == "|") {
			this._sy = alphatab.importer.AlphaTexSymbols.Pipe;
			this.nextChar();
		} else if(this.isDigit(this._ch)) {
			var number = this.readNumber();
			this._sy = alphatab.importer.AlphaTexSymbols.Number;
			this._syData = number;
		} else if(alphatab.importer.AlphaTexImporter.isLetter(this._ch)) {
			var name = this.readName();
			if(alphatab.model.Tuning.isTuning(name)) {
				this._sy = alphatab.importer.AlphaTexSymbols.Tuning;
				this._syData = name.toLowerCase();
			} else {
				this._sy = alphatab.importer.AlphaTexSymbols.String;
				this._syData = name;
			}
		} else this.error("symbol",alphatab.importer.AlphaTexSymbols.String,false); while(this._sy == alphatab.importer.AlphaTexSymbols.No);
	}
	,nextChar: function() {
		try {
			this._ch = this._data.readString(1);
			this._curChPos++;
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				this._ch = alphatab.importer.AlphaTexImporter.EOL;
			} else throw(e);
		}
	}
	,parseTuning: function(str) {
		var tuning = alphatab.model.Tuning.getTuningForText(str);
		if(tuning < 0) this.error("tuning-value",alphatab.importer.AlphaTexSymbols.String,false);
		return tuning;
	}
	,parseKeySignature: function(str) {
		switch(str.toLowerCase()) {
		case "cb":
			return -7;
		case "gb":
			return -6;
		case "db":
			return -5;
		case "ab":
			return -4;
		case "eb":
			return -3;
		case "bb":
			return -2;
		case "f":
			return -1;
		case "c":
			return 0;
		case "g":
			return 1;
		case "d":
			return 2;
		case "a":
			return 3;
		case "e":
			return 4;
		case "b":
			return 5;
		case "f#":
			return 6;
		case "c#":
			return 7;
		default:
			return 0;
		}
	}
	,parseClef: function(str) {
		switch(str.toLowerCase()) {
		case "g2":case "treble":
			return alphatab.model.Clef.G2;
		case "f4":case "bass":
			return alphatab.model.Clef.F4;
		case "c3":case "tenor":
			return alphatab.model.Clef.C3;
		case "c4":case "alto":
			return alphatab.model.Clef.C4;
		default:
			return alphatab.model.Clef.G2;
		}
	}
	,createDefaultScore: function() {
		this._score = new alphatab.model.Score();
		this._score.tempo = 120;
		this._score.tempoLabel = "";
		this._track = new alphatab.model.Track();
		this._track.playbackInfo.program = 25;
		this._track.playbackInfo.primaryChannel = alphatab.importer.AlphaTexImporter.TRACK_CHANNELS[0];
		this._track.playbackInfo.secondaryChannel = alphatab.importer.AlphaTexImporter.TRACK_CHANNELS[1];
		this._track.tuning = alphatab.model.Tuning.getPresetsFor(6)[0].tuning;
		this._score.addTrack(this._track);
	}
	,barMeta: function(bar) {
		var master = bar.track.score.masterBars[bar.index];
		while(this._sy == alphatab.importer.AlphaTexSymbols.MetaCommand) {
			if(this._syData == "ts") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("timesignature-numerator",alphatab.importer.AlphaTexSymbols.Number);
				master.timeSignatureNumerator = this._syData;
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("timesignature-denominator",alphatab.importer.AlphaTexSymbols.Number);
				master.timeSignatureDenominator = this._syData;
			} else if(this._syData == "ro") master.isRepeatStart = true; else if(this._syData == "rc") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("repeatclose",alphatab.importer.AlphaTexSymbols.Number);
				master.repeatCount = Std.parseInt(this._syData) - 1;
			} else if(this._syData == "ks") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.String) this.error("keysignature",alphatab.importer.AlphaTexSymbols.String);
				master.keySignature = this.parseKeySignature(this._syData);
			} else if(this._syData == "clef") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.String && this._sy != alphatab.importer.AlphaTexSymbols.Tuning) this.error("clef",alphatab.importer.AlphaTexSymbols.String);
				bar.clef = this.parseClef(this._syData);
			} else this.error("measure-effects",alphatab.importer.AlphaTexSymbols.String,false);
			this.newSy();
		}
	}
	,parseDuration: function(duration) {
		switch(duration) {
		case 1:
			return alphatab.model.Duration.Whole;
		case 2:
			return alphatab.model.Duration.Half;
		case 4:
			return alphatab.model.Duration.Quarter;
		case 8:
			return alphatab.model.Duration.Eighth;
		case 16:
			return alphatab.model.Duration.Sixteenth;
		case 32:
			return alphatab.model.Duration.ThirtySecond;
		case 64:
			return alphatab.model.Duration.SixtyFourth;
		default:
			return alphatab.model.Duration.Quarter;
		}
	}
	,noteEffects: function(note) {
		if(this._sy != alphatab.importer.AlphaTexSymbols.LBrace) return;
		this.newSy();
		while(this._sy == alphatab.importer.AlphaTexSymbols.String) {
			this._syData = Std.string(this._syData).toLowerCase();
			if(this._syData == "b") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.LParensis) this.error("bend-effect",alphatab.importer.AlphaTexSymbols.LParensis);
				this.newSy();
				while(this._sy != alphatab.importer.AlphaTexSymbols.RParensis && this._sy != alphatab.importer.AlphaTexSymbols.Eof) {
					if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("bend-effect-value",alphatab.importer.AlphaTexSymbols.Number);
					var bendValue = this._syData;
					note.bendPoints.push(new alphatab.model.BendPoint(0,Math.abs(bendValue) | 0));
					this.newSy();
				}
				if(note.bendPoints.length > 60) note.bendPoints = note.bendPoints.slice(0,60);
				var count = note.bendPoints.length;
				var step = Math.floor(60 / count);
				var i = 0;
				while(i < count) {
					note.bendPoints[i].offset = Math.floor(Math.min(60,i * step));
					i++;
				}
				if(this._sy != alphatab.importer.AlphaTexSymbols.RParensis) this.error("bend-effect",alphatab.importer.AlphaTexSymbols.RParensis);
				this.newSy();
			} else if(this._syData == "nh") {
				note.harmonicType = alphatab.model.HarmonicType.Natural;
				this.newSy();
			} else if(this._syData == "ah") {
				note.harmonicType = alphatab.model.HarmonicType.Artificial;
				this.newSy();
			} else if(this._syData == "th") {
				note.harmonicType = alphatab.model.HarmonicType.Tap;
				this.newSy();
			} else if(this._syData == "ph") {
				note.harmonicType = alphatab.model.HarmonicType.Pinch;
				this.newSy();
			} else if(this._syData == "sh") {
				note.harmonicType = alphatab.model.HarmonicType.Semi;
				this.newSy();
			} else if(this._syData == "gr") {
				this.newSy();
				if(this._syData == "ob") note.beat.graceType = alphatab.model.GraceType.OnBeat; else note.beat.graceType = alphatab.model.GraceType.BeforeBeat;
				this.newSy();
			} else if(this._syData == "tr") {
				this.newSy();
				if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("trill-effect",alphatab.importer.AlphaTexSymbols.Number);
				var fret = this._syData;
				this.newSy();
				var duration = 16;
				if(this._sy == alphatab.importer.AlphaTexSymbols.Number) {
					switch(this._syData) {
					case 16:case 32:case 64:
						duration = this._syData;
						break;
					default:
						duration = 16;
					}
					this.newSy();
				}
				note.trillFret = fret;
				note.trillSpeed = duration;
			} else if(this._syData == "tp") {
				this.newSy();
				var duration = 8;
				if(this._sy == alphatab.importer.AlphaTexSymbols.Number) {
					switch(this._syData) {
					case 8:case 16:case 32:
						duration = this._syData;
						break;
					default:
						duration = 8;
					}
					this.newSy();
				}
				note.beat.tremoloSpeed = duration;
			} else if(this._syData == "v") {
				this.newSy();
				note.vibrato = alphatab.model.VibratoType.Slight;
			} else if(this._syData == "sl") {
				this.newSy();
				note.slideType = alphatab.model.SlideType.Legato;
			} else if(this._syData == "ss") {
				this.newSy();
				note.slideType = alphatab.model.SlideType.Shift;
			} else if(this._syData == "h") {
				this.newSy();
				note.isHammerPullOrigin = true;
			} else if(this._syData == "g") {
				this.newSy();
				note.isGhost = true;
			} else if(this._syData == "ac") {
				this.newSy();
				note.accentuated = alphatab.model.AccentuationType.Normal;
			} else if(this._syData == "hac") {
				this.newSy();
				note.accentuated = alphatab.model.AccentuationType.Heavy;
			} else if(this._syData == "pm") {
				this.newSy();
				note.isPalmMute = true;
			} else if(this._syData == "st") {
				this.newSy();
				note.isStaccato = true;
			} else if(this._syData == "lr") {
				this.newSy();
				note.isLetRing = true;
			} else if(this.applyBeatEffect(note.beat)) {
			} else this.error(this._syData,alphatab.importer.AlphaTexSymbols.String,false);
		}
		if(this._sy != alphatab.importer.AlphaTexSymbols.RBrace) this.error("note-effect",alphatab.importer.AlphaTexSymbols.RBrace,false);
		this.newSy();
	}
	,note: function(beat) {
		if(this._sy != alphatab.importer.AlphaTexSymbols.Number && !(this._sy == alphatab.importer.AlphaTexSymbols.String && (Std.string(this._syData).toLowerCase() == "x" || Std.string(this._syData).toLowerCase() == "-"))) this.error("note-fret",alphatab.importer.AlphaTexSymbols.Number);
		var isDead = Std.string(this._syData).toLowerCase() == "x";
		var isTie = Std.string(this._syData).toLowerCase() == "-";
		var fret = isDead || isTie?0:this._syData;
		this.newSy();
		if(this._sy != alphatab.importer.AlphaTexSymbols.Dot) this.error("note",alphatab.importer.AlphaTexSymbols.Dot);
		this.newSy();
		if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("note-string",alphatab.importer.AlphaTexSymbols.Number);
		var string = this._syData;
		if(string < 1 || string > this._track.tuning.length) this.error("note-string",alphatab.importer.AlphaTexSymbols.Number,false);
		this.newSy();
		var note = new alphatab.model.Note();
		this.noteEffects(note);
		note.string = this._track.tuning.length - string;
		note.isDead = isDead;
		note.isTieDestination = isTie;
		if(!isTie) note.fret = fret;
		beat.addNote(note);
		return note;
	}
	,applyBeatEffect: function(beat) {
		if(this._syData == "f") {
			beat.fadeIn = true;
			this.newSy();
			return true;
		} else if(this._syData == "v") {
			beat.vibrato = alphatab.model.VibratoType.Slight;
			this.newSy();
			return true;
		} else if(this._syData == "s") {
			beat.slap = true;
			this.newSy();
			return true;
		} else if(this._syData == "p") {
			beat.pop = true;
			this.newSy();
			return true;
		} else if(this._syData == "dd") {
			beat.dots = 2;
			this.newSy();
			return true;
		} else if(this._syData == "d") {
			beat.dots = 1;
			this.newSy();
			return true;
		} else if(this._syData == "su") {
			beat.pickStroke = alphatab.model.PickStrokeType.Up;
			this.newSy();
			return true;
		} else if(this._syData == "sd") {
			beat.pickStroke = alphatab.model.PickStrokeType.Down;
			this.newSy();
			return true;
		} else if(this._syData == "tu") {
			this.newSy();
			if(this._sy != alphatab.importer.AlphaTexSymbols.Number) {
				this.error("tuplet",alphatab.importer.AlphaTexSymbols.Number);
				return false;
			}
			var tuplet = this._syData;
			switch(tuplet) {
			case 3:
				beat.tupletDenominator = 3;
				beat.tupletNumerator = 2;
				break;
			case 5:
				beat.tupletDenominator = 5;
				beat.tupletNumerator = 4;
				break;
			case 6:
				beat.tupletDenominator = 6;
				beat.tupletNumerator = 4;
				break;
			case 7:
				beat.tupletDenominator = 7;
				beat.tupletNumerator = 4;
				break;
			case 9:
				beat.tupletDenominator = 9;
				beat.tupletNumerator = 8;
				break;
			case 10:
				beat.tupletDenominator = 10;
				beat.tupletNumerator = 8;
				break;
			case 11:
				beat.tupletDenominator = 11;
				beat.tupletNumerator = 8;
				break;
			case 12:
				beat.tupletDenominator = 12;
				beat.tupletNumerator = 8;
				break;
			}
			this.newSy();
			return true;
		} else if(this._syData == "tb") {
			this.newSy();
			if(this._sy != alphatab.importer.AlphaTexSymbols.LParensis) {
				this.error("tremolobar-effect",alphatab.importer.AlphaTexSymbols.LParensis);
				return false;
			}
			this._allowNegatives = true;
			this.newSy();
			while(this._sy != alphatab.importer.AlphaTexSymbols.RParensis && this._sy != alphatab.importer.AlphaTexSymbols.Eof) {
				if(this._sy != alphatab.importer.AlphaTexSymbols.Number) {
					this.error("tremolobar-effect",alphatab.importer.AlphaTexSymbols.Number);
					return false;
				}
				beat.whammyBarPoints.push(new alphatab.model.BendPoint(0,this._syData));
				this.newSy();
			}
			if(beat.whammyBarPoints.length > 60) beat.whammyBarPoints = beat.whammyBarPoints.slice(0,60);
			var count = beat.whammyBarPoints.length;
			var step = Math.floor(60 / count);
			var i = 0;
			while(i < count) {
				beat.whammyBarPoints[i].offset = Math.floor(Math.min(60,i * step));
				i++;
			}
			this._allowNegatives = false;
			if(this._sy != alphatab.importer.AlphaTexSymbols.RParensis) {
				this.error("tremolobar-effect",alphatab.importer.AlphaTexSymbols.RParensis);
				return false;
			}
			this.newSy();
			return true;
		}
		return false;
	}
	,beatEffects: function(beat) {
		if(this._sy != alphatab.importer.AlphaTexSymbols.LBrace) return;
		this.newSy();
		while(this._sy == alphatab.importer.AlphaTexSymbols.String) {
			this._syData = Std.string(this._syData).toLowerCase();
			if(!this.applyBeatEffect(beat)) this.error("beat-effects",alphatab.importer.AlphaTexSymbols.String,false);
		}
		if(this._sy != alphatab.importer.AlphaTexSymbols.RBrace) this.error("beat-effects",alphatab.importer.AlphaTexSymbols.RBrace);
		this.newSy();
	}
	,beat: function(voice) {
		if(this._sy == alphatab.importer.AlphaTexSymbols.DoubleDot) {
			this.newSy();
			if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("duration",alphatab.importer.AlphaTexSymbols.Number);
			if(this._syData == 1 || this._syData == 2 || this._syData == 4 || this._syData == 8 || this._syData == 16 || this._syData == 32 || this._syData == 64) this._currentDuration = this.parseDuration(this._syData); else this.error("duration",alphatab.importer.AlphaTexSymbols.Number,false);
			this.newSy();
			return;
		}
		var beat = new alphatab.model.Beat();
		voice.addBeat(beat);
		if(this._sy == alphatab.importer.AlphaTexSymbols.LParensis) {
			this.newSy();
			this.note(beat);
			while(this._sy != alphatab.importer.AlphaTexSymbols.RParensis && this._sy != alphatab.importer.AlphaTexSymbols.Eof) this.note(beat);
			if(this._sy != alphatab.importer.AlphaTexSymbols.RParensis) this.error("note-list",alphatab.importer.AlphaTexSymbols.RParensis);
			this.newSy();
		} else if(this._sy == alphatab.importer.AlphaTexSymbols.String && Std.string(this._syData).toLowerCase() == "r") this.newSy(); else this.note(beat);
		if(this._sy == alphatab.importer.AlphaTexSymbols.Dot) {
			this.newSy();
			if(this._sy != alphatab.importer.AlphaTexSymbols.Number) this.error("duration",alphatab.importer.AlphaTexSymbols.Number);
			if(this._syData == 1 || this._syData == 2 || this._syData == 4 || this._syData == 8 || this._syData == 16 || this._syData == 32 || this._syData == 64) beat.duration = this.parseDuration(this._syData); else this.error("duration",alphatab.importer.AlphaTexSymbols.Number,false);
			this.newSy();
		} else beat.duration = this._currentDuration;
		this.beatEffects(beat);
	}
	,bar: function() {
		var master = new alphatab.model.MasterBar();
		this._score.addMasterBar(master);
		var bar = new alphatab.model.Bar();
		this._track.addBar(bar);
		if(master.index > 0) {
			master.keySignature = master.previousMasterBar.keySignature;
			master.timeSignatureDenominator = master.previousMasterBar.timeSignatureDenominator;
			master.timeSignatureNumerator = master.previousMasterBar.timeSignatureNumerator;
			bar.clef = bar.previousBar.clef;
		}
		this.barMeta(bar);
		var voice = new alphatab.model.Voice();
		bar.addVoice(voice);
		while(this._sy != alphatab.importer.AlphaTexSymbols.Pipe && this._sy != alphatab.importer.AlphaTexSymbols.Eof) this.beat(voice);
	}
	,bars: function() {
		this.bar();
		while(this._sy != alphatab.importer.AlphaTexSymbols.Eof) {
			if(this._sy != alphatab.importer.AlphaTexSymbols.Pipe) this.error("bar",alphatab.importer.AlphaTexSymbols.Pipe);
			this.newSy();
			this.bar();
		}
	}
	,metaData: function() {
		var anyMeta = false;
		while(this._sy == alphatab.importer.AlphaTexSymbols.MetaCommand) if(this._syData == "title") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.title = this._syData; else this.error("title",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "subtitle") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.subTitle = this._syData; else this.error("subtitle",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "artist") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.artist = this._syData; else this.error("artist",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "album") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.album = this._syData; else this.error("album",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "words") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.words = this._syData; else this.error("words",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "music") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.music = this._syData; else this.error("music",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "copyright") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.String) this._score.copyright = this._syData; else this.error("copyright",alphatab.importer.AlphaTexSymbols.String);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "tempo") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.Number) this._score.tempo = this._syData; else this.error("tempo",alphatab.importer.AlphaTexSymbols.Number);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "capo") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.Number) this._track.capo = this._syData; else this.error("capo",alphatab.importer.AlphaTexSymbols.Number);
			this.newSy();
			anyMeta = true;
		} else if(this._syData == "tuning") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.Tuning) {
				this._track.tuning = new Array();
				do {
					this._track.tuning.push(this.parseTuning(this._syData));
					this.newSy();
				} while(this._sy == alphatab.importer.AlphaTexSymbols.Tuning);
			} else this.error("tuning",alphatab.importer.AlphaTexSymbols.Tuning);
			anyMeta = true;
		} else if(this._syData == "instrument") {
			this.newSy();
			if(this._sy == alphatab.importer.AlphaTexSymbols.Number) {
				var instrument = js.Boot.__cast(this._syData , Int);
				if(instrument >= 0 && instrument <= 128) this._track.playbackInfo.program = this._syData; else this.error("instrument",alphatab.importer.AlphaTexSymbols.Number,false);
			} else if(this._sy == alphatab.importer.AlphaTexSymbols.String) {
				var instrumentName = js.Boot.__cast(this._syData , String);
				this._track.playbackInfo.program = alphatab.audio.GeneralMidi.getValue(instrumentName);
			} else this.error("instrument",alphatab.importer.AlphaTexSymbols.Number);
			this.newSy();
			anyMeta = true;
		} else this.error("metaDataTags",alphatab.importer.AlphaTexSymbols.String,false);
		if(anyMeta) {
			if(this._sy != alphatab.importer.AlphaTexSymbols.Dot) this.error("song",alphatab.importer.AlphaTexSymbols.Dot);
			this.newSy();
		}
	}
	,score: function() {
		this.metaData();
		this.bars();
	}
	,error: function(nonterm,expected,symbolError) {
		if(symbolError == null) symbolError = true;
		if(symbolError) throw haxe.io.Error.Custom(Std.string(this._curChPos) + ": Error on block " + nonterm + ", expected a " + Std.string(expected) + " found a " + Std.string(this._sy)); else throw haxe.io.Error.Custom(Std.string(this._curChPos) + ": Error on block " + nonterm + ", invalid value:" + Std.string(this._syData));
	}
	,readScore: function() {
		try {
			this.createDefaultScore();
			this._curChPos = 0;
			this._currentDuration = alphatab.model.Duration.Quarter;
			this.nextChar();
			this.newSy();
			this.score();
			this.finish(this._score);
			return this._score;
		} catch( e ) {
			console.log(e);
			throw alphatab.importer.ScoreImporter.UNSUPPORTED_FORMAT;
		}
	}
	,_currentDuration: null
	,_allowNegatives: null
	,_syData: null
	,_sy: null
	,_curChPos: null
	,_ch: null
	,_track: null
	,_score: null
	,__class__: alphatab.importer.AlphaTexImporter
});
alphatab.importer.AlphaTexSymbols = $hxClasses["alphatab.importer.AlphaTexSymbols"] = { __ename__ : ["alphatab","importer","AlphaTexSymbols"], __constructs__ : ["No","Eof","Number","DoubleDot","Dot","String","Tuning","LParensis","RParensis","LBrace","RBrace","Pipe","MetaCommand"] }
alphatab.importer.AlphaTexSymbols.No = ["No",0];
alphatab.importer.AlphaTexSymbols.No.toString = $estr;
alphatab.importer.AlphaTexSymbols.No.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.Eof = ["Eof",1];
alphatab.importer.AlphaTexSymbols.Eof.toString = $estr;
alphatab.importer.AlphaTexSymbols.Eof.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.Number = ["Number",2];
alphatab.importer.AlphaTexSymbols.Number.toString = $estr;
alphatab.importer.AlphaTexSymbols.Number.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.DoubleDot = ["DoubleDot",3];
alphatab.importer.AlphaTexSymbols.DoubleDot.toString = $estr;
alphatab.importer.AlphaTexSymbols.DoubleDot.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.Dot = ["Dot",4];
alphatab.importer.AlphaTexSymbols.Dot.toString = $estr;
alphatab.importer.AlphaTexSymbols.Dot.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.String = ["String",5];
alphatab.importer.AlphaTexSymbols.String.toString = $estr;
alphatab.importer.AlphaTexSymbols.String.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.Tuning = ["Tuning",6];
alphatab.importer.AlphaTexSymbols.Tuning.toString = $estr;
alphatab.importer.AlphaTexSymbols.Tuning.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.LParensis = ["LParensis",7];
alphatab.importer.AlphaTexSymbols.LParensis.toString = $estr;
alphatab.importer.AlphaTexSymbols.LParensis.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.RParensis = ["RParensis",8];
alphatab.importer.AlphaTexSymbols.RParensis.toString = $estr;
alphatab.importer.AlphaTexSymbols.RParensis.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.LBrace = ["LBrace",9];
alphatab.importer.AlphaTexSymbols.LBrace.toString = $estr;
alphatab.importer.AlphaTexSymbols.LBrace.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.RBrace = ["RBrace",10];
alphatab.importer.AlphaTexSymbols.RBrace.toString = $estr;
alphatab.importer.AlphaTexSymbols.RBrace.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.Pipe = ["Pipe",11];
alphatab.importer.AlphaTexSymbols.Pipe.toString = $estr;
alphatab.importer.AlphaTexSymbols.Pipe.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.AlphaTexSymbols.MetaCommand = ["MetaCommand",12];
alphatab.importer.AlphaTexSymbols.MetaCommand.toString = $estr;
alphatab.importer.AlphaTexSymbols.MetaCommand.__enum__ = alphatab.importer.AlphaTexSymbols;
alphatab.importer.Gp3To5Importer = $hxClasses["alphatab.importer.Gp3To5Importer"] = function() {
	alphatab.importer.ScoreImporter.call(this);
	this._globalTripletFeel = alphatab.model.TripletFeel.NoTripletFeel;
};
alphatab.importer.Gp3To5Importer.__name__ = ["alphatab","importer","Gp3To5Importer"];
alphatab.importer.Gp3To5Importer.__super__ = alphatab.importer.ScoreImporter;
alphatab.importer.Gp3To5Importer.prototype = $extend(alphatab.importer.ScoreImporter.prototype,{
	skip: function(count) {
		this._data.read(count);
	}
	,readStringByteLength: function(length) {
		var stringLength = this._data.readByte();
		var string = this._data.readString(stringLength);
		if(stringLength < length) this._data.read(length - stringLength);
		return string;
	}
	,readStringIntByte: function() {
		var length = this.readInt32() - 1;
		this._data.readByte();
		return this._data.readString(length);
	}
	,readStringInt: function() {
		return this._data.readString(this.readInt32());
	}
	,readStringIntUnused: function() {
		this._data.read(4);
		return this._data.readString(this._data.readByte());
	}
	,readInt32: function() {
		var ch1 = this._data.readByte();
		var ch2 = this._data.readByte();
		var ch3 = this._data.readByte();
		var ch4 = this._data.readByte();
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt8: function() {
		return this._data.readByte();
	}
	,readBool: function() {
		return this._data.readByte() != 0;
	}
	,readColor: function() {
		this._data.readByte();
		this._data.readByte();
		this._data.readByte();
		this._data.readByte();
	}
	,getDoubleSig: function(bytes,indices) {
		var sig = parseInt((((bytes.b[indices[1]] & 15) << 16 | bytes.b[indices[2]] << 8 | bytes.b[indices[3]]) * Math.pow(2,32)).toString(2),2) + parseInt(((bytes.b[indices[4]] >> 7) * Math.pow(2,31)).toString(2),2) + parseInt(((bytes.b[indices[4]] & 127) << 24 | bytes.b[indices[5]] << 16 | bytes.b[indices[6]] << 8 | bytes.b[indices[7]]).toString(2),2);
		return sig;
	}
	,readDouble: function() {
		var bytes = haxe.io.Bytes.alloc(8);
		this._data.readBytes(bytes,0,8);
		var indices;
		if(!this._data.bigEndian) indices = [7,6,5,4,3,2,1,0]; else indices = [0,1,2,3,4,5,6,7];
		var sign = 1 - (bytes.b[indices[0]] >> 7 << 1);
		var exp = (bytes.b[indices[0]] << 4 & 2047 | bytes.b[indices[1]] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes,indices);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readTrill: function(note) {
		note.trillFret = this._data.readByte();
		note.trillSpeed = 1 + this._data.readByte();
	}
	,deltaFretToHarmonicValue: function(deltaFret) {
		switch(deltaFret) {
		case 2:
			return 2.4;
		case 3:
			return 3.2;
		case 4:case 5:case 7:case 9:case 12:case 16:case 17:case 19:case 24:
			return deltaFret;
		case 8:
			return 8.2;
		case 10:
			return 9.6;
		case 14:case 15:
			return 14.7;
		case 21:case 22:
			return 21.7;
		default:
			return 12;
		}
	}
	,readArtificialHarmonic: function(note) {
		var type = this._data.readByte();
		if(this._versionNumber >= 500) switch(type) {
		case 1:
			note.harmonicType = alphatab.model.HarmonicType.Natural;
			note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
			break;
		case 2:
			var harmonicTone = this._data.readByte();
			var harmonicKey = this._data.readByte();
			var harmonicOctaveOffset = this._data.readByte();
			note.harmonicType = alphatab.model.HarmonicType.Artificial;
			break;
		case 3:
			note.harmonicType = alphatab.model.HarmonicType.Tap;
			note.harmonicValue = this.deltaFretToHarmonicValue(this._data.readByte());
			break;
		case 4:
			note.harmonicType = alphatab.model.HarmonicType.Pinch;
			note.harmonicValue = 12;
			break;
		case 5:
			note.harmonicType = alphatab.model.HarmonicType.Semi;
			note.harmonicValue = 12;
			break;
		} else if(this._versionNumber >= 400) switch(type) {
		case 1:
			note.harmonicType = alphatab.model.HarmonicType.Natural;
			note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
			break;
		case 3:
			note.harmonicType = alphatab.model.HarmonicType.Tap;
			break;
		case 4:
			note.harmonicType = alphatab.model.HarmonicType.Pinch;
			note.harmonicValue = 12;
			break;
		case 5:
			note.harmonicType = alphatab.model.HarmonicType.Semi;
			note.harmonicValue = 12;
			break;
		case 15:
			note.harmonicType = alphatab.model.HarmonicType.Artificial;
			note.harmonicValue = this.deltaFretToHarmonicValue(note.fret + 5);
			break;
		case 17:
			note.harmonicType = alphatab.model.HarmonicType.Artificial;
			note.harmonicValue = this.deltaFretToHarmonicValue(note.fret + 7);
			break;
		case 22:
			note.harmonicType = alphatab.model.HarmonicType.Artificial;
			note.harmonicValue = this.deltaFretToHarmonicValue(note.fret + 12);
			break;
		default:
		}
	}
	,readSlide: function(note) {
		if(this._versionNumber >= 500) {
			var type = this._data.readByte();
			switch(type) {
			case 1:
				note.slideType = alphatab.model.SlideType.Shift;
				break;
			case 2:
				note.slideType = alphatab.model.SlideType.Legato;
				break;
			case 4:
				note.slideType = alphatab.model.SlideType.OutDown;
				break;
			case 8:
				note.slideType = alphatab.model.SlideType.OutUp;
				break;
			case 16:
				note.slideType = alphatab.model.SlideType.IntoFromBelow;
				break;
			case 32:
				note.slideType = alphatab.model.SlideType.IntoFromAbove;
				break;
			default:
				note.slideType = alphatab.model.SlideType.None;
			}
		} else {
			var type = this._data.readInt8();
			switch(type) {
			case 1:
				note.slideType = alphatab.model.SlideType.Shift;
				break;
			case 2:
				note.slideType = alphatab.model.SlideType.Legato;
				break;
			case 3:
				note.slideType = alphatab.model.SlideType.OutDown;
				break;
			case 4:
				note.slideType = alphatab.model.SlideType.OutUp;
				break;
			case -1:
				note.slideType = alphatab.model.SlideType.IntoFromBelow;
				break;
			case -2:
				note.slideType = alphatab.model.SlideType.IntoFromAbove;
				break;
			default:
				note.slideType = alphatab.model.SlideType.None;
			}
		}
	}
	,readTremoloPicking: function(beat) {
		beat.tremoloSpeed = this._data.readByte();
	}
	,readGrace: function(voice,note) {
		var graceBeat = new alphatab.model.Beat();
		var graceNote = new alphatab.model.Note();
		graceNote.string = note.string;
		graceNote.fret = this._data.readInt8();
		graceBeat.duration = alphatab.model.Duration.ThirtySecond;
		this._data.read(3);
		if(this._versionNumber < 500) graceBeat.graceType = alphatab.model.GraceType.BeforeBeat; else {
			var flags = this._data.readByte();
			if((flags & 2) != 0) graceBeat.graceType = alphatab.model.GraceType.OnBeat; else graceBeat.graceType = alphatab.model.GraceType.BeforeBeat;
		}
		graceBeat.addNote(graceNote);
		voice.addBeat(graceBeat);
	}
	,readBend: function(note) {
		this._data.readByte();
		this.readInt32();
		var pointCount = this.readInt32();
		if(pointCount > 0) {
			var _g = 0;
			while(_g < pointCount) {
				var i = _g++;
				var point = new alphatab.model.BendPoint();
				point.offset = this.readInt32();
				point.value = this.readInt32() / 25 | 0;
				this._data.readByte() != 0;
				note.bendPoints.push(point);
			}
		}
	}
	,readNoteEffects: function(track,voice,beat,note) {
		var flags = this._data.readByte();
		var flags2 = 0;
		if(this._versionNumber >= 400) flags2 = this._data.readByte();
		if((flags & 1) != 0) this.readBend(note);
		if((flags & 16) != 0) this.readGrace(voice,note);
		if((flags2 & 4) != 0) this.readTremoloPicking(beat);
		if((flags2 & 8) != 0) this.readSlide(note); else if(this._versionNumber < 400) {
			if((flags & 4) != 0) note.slideType = alphatab.model.SlideType.Shift;
		}
		if((flags2 & 16) != 0) this.readArtificialHarmonic(note); else if(this._versionNumber < 400) {
			if((flags & 4) != 0) {
				note.harmonicType = alphatab.model.HarmonicType.Natural;
				note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
			}
			if((flags & 8) != 0) note.harmonicType = alphatab.model.HarmonicType.Artificial;
		}
		if((flags2 & 32) != 0) this.readTrill(note);
		note.isLetRing = (flags & 8) != 0;
		note.isHammerPullOrigin = (flags & 2) != 0;
		if((flags2 & 64) != 0) note.vibrato = alphatab.model.VibratoType.Slight;
		note.isPalmMute = (flags2 & 2) != 0;
		note.isStaccato = (flags2 & 1) != 0;
	}
	,toDynamicValue: function(value) {
		switch(value + 1) {
		case 1:
			return alphatab.model.DynamicValue.PPP;
		case 2:
			return alphatab.model.DynamicValue.PP;
		case 3:
			return alphatab.model.DynamicValue.P;
		case 4:
			return alphatab.model.DynamicValue.MP;
		case 5:
			return alphatab.model.DynamicValue.MF;
		case 7:
			return alphatab.model.DynamicValue.F;
		case 8:
			return alphatab.model.DynamicValue.FF;
		case 9:
			return alphatab.model.DynamicValue.FFF;
		default:
			return alphatab.model.DynamicValue.F;
		}
	}
	,readNote: function(track,bar,voice,beat,stringIndex) {
		var newNote = new alphatab.model.Note();
		newNote.string = stringIndex;
		newNote.tapping = this._beatTapping;
		var flags = this._data.readByte();
		if((flags & 2) != 0) newNote.accentuated = alphatab.model.AccentuationType.Heavy; else if((flags & 64) != 0) newNote.accentuated = alphatab.model.AccentuationType.Normal;
		newNote.isGhost = (flags & 4) != 0;
		if((flags & 32) != 0) {
			var noteType = this._data.readByte();
			if(noteType == 3) newNote.isDead = true; else if(noteType == 2) newNote.isTieDestination = true;
		}
		if((flags & 16) != 0) {
			var dynamicNumber = this._data.readInt8();
			newNote.dynamicValue = this.toDynamicValue(dynamicNumber);
		}
		if((flags & 32) != 0) newNote.fret = this._data.readInt8();
		if((flags & 128) != 0) {
			newNote.leftHandFinger = this._data.readInt8();
			newNote.rightHandFinger = this._data.readInt8();
			newNote.isFingering = true;
		}
		if(this._versionNumber >= 500) {
			if((flags & 1) != 0) newNote.durationPercent = this.readDouble();
			this._data.readByte();
		}
		if((flags & 8) != 0) this.readNoteEffects(track,voice,beat,newNote);
		beat.addNote(newNote);
	}
	,readMixTableChange: function(beat) {
		var tableChange = new alphatab.importer.MixTableChange();
		tableChange.instrument = this._data.readInt8();
		if(this._versionNumber >= 500) this._data.read(16);
		tableChange.volume = this._data.readInt8();
		tableChange.balance = this._data.readInt8();
		var chorus = this._data.readInt8();
		var reverb = this._data.readInt8();
		var phaser = this._data.readInt8();
		var tremolo = this._data.readInt8();
		if(this._versionNumber >= 500) tableChange.tempoName = this.readStringIntByte();
		tableChange.tempo = this.readInt32();
		if(tableChange.volume >= 0) this._data.readByte();
		if(tableChange.balance >= 0) this._data.readByte();
		if(chorus >= 0) this._data.readByte();
		if(reverb >= 0) this._data.readByte();
		if(phaser >= 0) this._data.readByte();
		if(tremolo >= 0) this._data.readByte();
		if(tableChange.tempo >= 0) {
			tableChange.duration = this._data.readInt8();
			if(this._versionNumber >= 510) this._data.readByte();
		}
		if(this._versionNumber >= 400) this._data.readByte();
		if(this._versionNumber >= 500) this._data.readByte();
		if(this._versionNumber >= 510) {
			this.readStringIntByte();
			this.readStringIntByte();
		}
		if(tableChange.volume >= 0) {
			var volumeAutomation = new alphatab.model.Automation();
			volumeAutomation.isLinear = true;
			volumeAutomation.type = alphatab.model.AutomationType.Volume;
			volumeAutomation.value = tableChange.volume;
			beat.automations.push(volumeAutomation);
		}
		if(tableChange.balance >= 0) {
			var balanceAutomation = new alphatab.model.Automation();
			balanceAutomation.isLinear = true;
			balanceAutomation.type = alphatab.model.AutomationType.Balance;
			balanceAutomation.value = tableChange.balance;
			beat.automations.push(balanceAutomation);
		}
		if(tableChange.instrument >= 0) {
			var instrumentAutomation = new alphatab.model.Automation();
			instrumentAutomation.isLinear = true;
			instrumentAutomation.type = alphatab.model.AutomationType.Instrument;
			instrumentAutomation.value = tableChange.instrument;
			beat.automations.push(instrumentAutomation);
		}
		if(tableChange.tempo >= 0) {
			var tempoAutomation = new alphatab.model.Automation();
			tempoAutomation.isLinear = true;
			tempoAutomation.type = alphatab.model.AutomationType.Tempo;
			tempoAutomation.value = tableChange.tempo;
			beat.automations.push(tempoAutomation);
		}
	}
	,toStrokeValue: function(value) {
		switch(value) {
		case 1:
			return 30;
		case 2:
			return 30;
		case 3:
			return 60;
		case 4:
			return 120;
		case 5:
			return 240;
		case 6:
			return 480;
		default:
			return 0;
		}
	}
	,readTremoloBarEffect: function(beat) {
		this._data.readByte();
		this.readInt32();
		var pointCount = this.readInt32();
		if(pointCount > 0) {
			var _g = 0;
			while(_g < pointCount) {
				var i = _g++;
				var point = new alphatab.model.BendPoint();
				point.offset = this.readInt32();
				point.value = this.readInt32() / 25 | 0;
				this._data.readByte() != 0;
				beat.whammyBarPoints.push(point);
			}
		}
	}
	,readBeatEffects: function(beat) {
		var flags = this._data.readByte();
		var flags2 = 0;
		if(this._versionNumber >= 400) flags2 = this._data.readByte();
		beat.fadeIn = (flags & 16) != 0;
		if((flags & 2) != 0) beat.vibrato = alphatab.model.VibratoType.Slight;
		beat.hasRasgueado = (flags2 & 1) != 0;
		if((flags & 32) != 0 && this._versionNumber >= 400) {
			var slapPop = this._data.readInt8();
			switch(slapPop) {
			case 1:
				this._beatTapping = true;
				break;
			case 2:
				beat.slap = true;
				break;
			case 3:
				beat.pop = true;
				break;
			}
		} else if((flags & 32) != 0) {
			var slapPop = this._data.readInt8();
			switch(slapPop) {
			case 1:
				this._beatTapping = true;
				break;
			case 2:
				beat.slap = true;
				break;
			case 3:
				beat.pop = true;
				break;
			}
			this._data.read(4);
		}
		if((flags2 & 4) != 0) this.readTremoloBarEffect(beat);
		if((flags & 64) != 0) {
			var strokeUp;
			var strokeDown;
			if(this._versionNumber < 500) {
				strokeDown = this._data.readByte();
				strokeUp = this._data.readByte();
			} else {
				strokeUp = this._data.readByte();
				strokeDown = this._data.readByte();
			}
			if(strokeUp > 0) {
				beat.brushType = alphatab.model.BrushType.BrushUp;
				beat.brushDuration = this.toStrokeValue(strokeUp);
			} else if(strokeDown > 0) {
				beat.brushType = alphatab.model.BrushType.BrushDown;
				beat.brushDuration = this.toStrokeValue(strokeDown);
			}
		}
		if((flags2 & 2) != 0) switch(this._data.readInt8()) {
		case 0:
			beat.pickStroke = alphatab.model.PickStrokeType.None;
			break;
		case 1:
			beat.pickStroke = alphatab.model.PickStrokeType.Up;
			break;
		case 2:
			beat.pickStroke = alphatab.model.PickStrokeType.Down;
			break;
		}
	}
	,readChord: function(beat) {
		var chord = new alphatab.model.Chord();
		if(this._versionNumber >= 500) {
			this._data.read(17);
			chord.name = this.readStringByteLength(21);
			this._data.read(4);
			chord.firstFret = this.readInt32();
			var _g = 0;
			while(_g < 7) {
				var i = _g++;
				var fret = this.readInt32();
				if(i < chord.strings.length) chord.strings.push(fret);
			}
			this._data.read(32);
		} else if(this._data.readByte() != 0) {
			if(this._versionNumber >= 400) {
				this._data.read(16);
				chord.name = this.readStringByteLength(21);
				this._data.read(4);
				chord.firstFret = this.readInt32();
				var _g = 0;
				while(_g < 7) {
					var i = _g++;
					var fret = this.readInt32();
					if(i < chord.strings.length) chord.strings.push(fret);
				}
				this._data.read(32);
			} else {
				this._data.read(25);
				chord.name = this.readStringByteLength(34);
				chord.firstFret = this.readInt32();
				var _g = 0;
				while(_g < 6) {
					var i = _g++;
					var fret = this.readInt32();
					chord.strings.push(fret);
				}
				this._data.read(36);
			}
		} else {
			var strings;
			if(this._versionNumber >= 406) strings = 7; else strings = 6;
			chord.name = this.readStringIntByte();
			chord.firstFret = this.readInt32();
			if(chord.firstFret > 0) {
				var _g = 0;
				while(_g < strings) {
					var i = _g++;
					var fret = this.readInt32();
					if(i < chord.strings.length) chord.strings.push(fret);
				}
			}
		}
		if(chord.name.length > 0) beat.chord = chord;
	}
	,readBeat: function(track,bar,voice) {
		var newBeat = new alphatab.model.Beat();
		voice.addBeat(newBeat);
		var flags = this._data.readByte();
		if((flags & 1) != 0) newBeat.dots = 1;
		if((flags & 64) != 0) this._data.readByte();
		var duration = this._data.readInt8();
		switch(duration) {
		case -2:
			newBeat.duration = alphatab.model.Duration.Whole;
			break;
		case -1:
			newBeat.duration = alphatab.model.Duration.Half;
			break;
		case 0:
			newBeat.duration = alphatab.model.Duration.Quarter;
			break;
		case 1:
			newBeat.duration = alphatab.model.Duration.Eighth;
			break;
		case 2:
			newBeat.duration = alphatab.model.Duration.Sixteenth;
			break;
		case 3:
			newBeat.duration = alphatab.model.Duration.ThirtySecond;
			break;
		case 4:
			newBeat.duration = alphatab.model.Duration.SixtyFourth;
			break;
		default:
			newBeat.duration = alphatab.model.Duration.Quarter;
		}
		if((flags & 32) != 0) {
			newBeat.tupletNumerator = this.readInt32();
			switch(newBeat.tupletNumerator) {
			case 1:
				newBeat.tupletDenominator = 1;
				break;
			case 3:
				newBeat.tupletDenominator = 2;
				break;
			case 5:case 6:case 7:
				newBeat.tupletDenominator = 4;
				break;
			case 9:case 10:case 11:case 12:case 13:
				newBeat.tupletDenominator = 8;
				break;
			case 2:case 4:case 8:
				break;
			default:
				newBeat.tupletNumerator = 1;
				newBeat.tupletDenominator = 1;
			}
		}
		if((flags & 2) != 0) this.readChord(newBeat);
		if((flags & 4) != 0) newBeat.text = this.readStringIntUnused();
		if((flags & 8) != 0) this.readBeatEffects(newBeat);
		if((flags & 16) != 0) this.readMixTableChange(newBeat);
		var stringFlags = this._data.readByte();
		var i = 6;
		while(i >= 0) {
			if((stringFlags & 1 << i) != 0 && 6 - i < track.tuning.length) this.readNote(track,bar,voice,newBeat,6 - i);
			i--;
		}
		if(this._versionNumber >= 500) {
			this._data.readByte();
			var flag = this._data.readByte();
			if((flag & 8) != 0) this._data.readByte();
		}
	}
	,readVoice: function(track,bar) {
		var beatCount = this.readInt32();
		if(beatCount == 0) return;
		var newVoice = new alphatab.model.Voice();
		bar.addVoice(newVoice);
		var _g = 0;
		while(_g < beatCount) {
			var i = _g++;
			this.readBeat(track,bar,newVoice);
		}
	}
	,readBar: function(track) {
		var newBar = new alphatab.model.Bar();
		track.addBar(newBar);
		var voiceCount = 1;
		if(this._versionNumber >= 500) {
			this._data.readByte();
			voiceCount = 2;
		}
		var _g = 0;
		while(_g < voiceCount) {
			var v = _g++;
			this.readVoice(track,newBar);
		}
	}
	,readBars: function() {
		var _g1 = 0, _g = this._barCount;
		while(_g1 < _g) {
			var b = _g1++;
			var _g3 = 0, _g2 = this._trackCount;
			while(_g3 < _g2) {
				var t = _g3++;
				this.readBar(this._score.tracks[t]);
			}
		}
	}
	,readTrack: function() {
		var newTrack = new alphatab.model.Track();
		this._score.addTrack(newTrack);
		var flags = this._data.readByte();
		newTrack.name = this.readStringByteLength(40);
		newTrack.isPercussion = (flags & 1) != 0;
		var stringCount = this.readInt32();
		var _g = 0;
		while(_g < 7) {
			var i = _g++;
			var tuning = this.readInt32();
			if(stringCount > i) newTrack.tuning.push(tuning);
		}
		var port = this.readInt32();
		var index = this.readInt32() - 1;
		var effectChannel = this.readInt32() - 1;
		this._data.read(4);
		if(index >= 0 && index < this._playbackInfos.length) {
			var info = this._playbackInfos[index];
			info.port = port;
			info.isSolo = (flags & 16) != 0;
			info.isMute = (flags & 32) != 0;
			info.secondaryChannel = effectChannel;
			newTrack.playbackInfo = info;
		}
		newTrack.capo = this.readInt32();
		this._data.read(4);
		if(this._versionNumber >= 500) {
			this._data.readByte();
			this._data.readByte();
			this._data.read(43);
		}
		if(this._versionNumber >= 510) {
			this._data.read(4);
			this.readStringIntByte();
			this.readStringIntByte();
		}
	}
	,readTracks: function() {
		var _g1 = 0, _g = this._trackCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.readTrack();
		}
	}
	,readMasterBar: function() {
		var previousMasterBar = null;
		if(this._score.masterBars.length > 0) previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
		var newMasterBar = new alphatab.model.MasterBar();
		var flags = this._data.readByte();
		if((flags & 1) != 0) newMasterBar.timeSignatureNumerator = this._data.readByte(); else if(previousMasterBar != null) newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
		if((flags & 2) != 0) newMasterBar.timeSignatureDenominator = this._data.readByte(); else if(previousMasterBar != null) newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
		newMasterBar.isRepeatStart = (flags & 4) != 0;
		if((flags & 8) != 0) {
			if(this._versionNumber >= 500) newMasterBar.repeatCount = this._data.readByte(); else newMasterBar.repeatCount = 1;
		}
		if((flags & 32) != 0) {
			var section = new alphatab.model.Section();
			section.text = this.readStringIntByte();
			section.marker = "";
			this.readColor();
			newMasterBar.section = section;
		}
		if((flags & 16) != 0 && this._versionNumber < 500) {
			var currentMasterBar = previousMasterBar;
			var existentAlternatives = 0;
			while(currentMasterBar != null) {
				if(currentMasterBar.repeatCount > 0 && currentMasterBar != previousMasterBar) break;
				if(currentMasterBar.isRepeatStart) break;
				existentAlternatives |= currentMasterBar.alternateEndings;
			}
			var repeatAlternative = 0;
			var repeatMask = this._data.readByte();
			var _g = 0;
			while(_g < 8) {
				var i = _g++;
				var repeating = 1 << i;
				if(repeatMask > i && (existentAlternatives & repeating) == 0) repeatAlternative |= repeating;
			}
			newMasterBar.alternateEndings = repeatAlternative;
		}
		if((flags & 64) != 0) {
			newMasterBar.keySignature = this._data.readInt8();
			this._data.readByte();
		} else if(previousMasterBar != null) newMasterBar.keySignature = previousMasterBar.keySignature;
		if(this._versionNumber >= 500 && (flags & 3) != 0) this._data.read(4);
		if(this._versionNumber >= 500 && (flags & 16) == 0) newMasterBar.alternateEndings = this._data.readByte();
		if(this._versionNumber >= 500) {
			var tripletFeel = this._data.readByte();
			switch(tripletFeel) {
			case 1:
				newMasterBar.tripletFeel = alphatab.model.TripletFeel.Triplet8th;
				break;
			case 2:
				newMasterBar.tripletFeel = alphatab.model.TripletFeel.Triplet16th;
				break;
			}
			this._data.readByte();
		} else newMasterBar.tripletFeel = this._globalTripletFeel;
		newMasterBar.isDoubleBar = (flags & 128) != 0;
		this._score.addMasterBar(newMasterBar);
	}
	,readMasterBars: function() {
		var _g1 = 0, _g = this._barCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.readMasterBar();
		}
	}
	,readPlaybackInfos: function() {
		this._playbackInfos = new Array();
		var _g = 0;
		while(_g < 64) {
			var i = _g++;
			var info = new alphatab.model.PlaybackInformation();
			info.primaryChannel = i;
			info.secondaryChannel = i;
			info.program = this.readInt32();
			info.volume = this._data.readByte();
			info.balance = this._data.readByte();
			this._data.read(6);
			this._playbackInfos.push(info);
		}
	}
	,readPageSetup: function() {
		this._data.read(30);
		var _g = 0;
		while(_g < 10) {
			var i = _g++;
			this.readStringIntByte();
		}
	}
	,readLyrics: function() {
		this._lyrics = new Array();
		this._lyricsIndex = new Array();
		this._lyricsTrack = this.readInt32();
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			this._lyricsIndex.push(this.readInt32() - 1);
			this._lyrics.push(this._data.readString(this.readInt32()));
		}
	}
	,readScoreInformation: function() {
		this._score.title = this.readStringIntUnused();
		this._score.subTitle = this.readStringIntUnused();
		this._score.artist = this.readStringIntUnused();
		this._score.album = this.readStringIntUnused();
		this._score.words = this.readStringIntUnused();
		if(this._versionNumber >= 500) this._score.music = this.readStringIntUnused(); else this._score.music = this._score.words;
		this._score.copyright = this.readStringIntUnused();
		this._score.tab = this.readStringIntUnused();
		this._score.instructions = this.readStringIntUnused();
		var noticeLines = this.readInt32();
		var notice = new StringBuf();
		var _g = 0;
		while(_g < noticeLines) {
			var i = _g++;
			if(i > 0) notice.b += Std.string("\n");
			notice.b += Std.string(this.readStringIntUnused());
		}
		this._score.notices = notice.b;
	}
	,readVersion: function() {
		var version = this.readStringByteLength(30);
		if(!StringTools.startsWith(version,"FICHIER GUITAR PRO ")) throw alphatab.importer.ScoreImporter.UNSUPPORTED_FORMAT;
		version = HxOverrides.substr(version,"FICHIER GUITAR PRO ".length + 1,null);
		var dot = version.indexOf(".");
		this._versionNumber = 100 * Std.parseInt(HxOverrides.substr(version,0,dot)) + Std.parseInt(HxOverrides.substr(version,dot + 1,null));
	}
	,readScore: function() {
		this.readVersion();
		this._score = new alphatab.model.Score();
		this.readScoreInformation();
		if(this._versionNumber < 500) this._globalTripletFeel = this._data.readByte() != 0?alphatab.model.TripletFeel.Triplet8th:alphatab.model.TripletFeel.NoTripletFeel;
		if(this._versionNumber >= 400) this.readLyrics();
		if(this._versionNumber >= 510) this._data.read(19);
		if(this._versionNumber >= 500) {
			this.readPageSetup();
			this._score.tempoLabel = this.readStringIntByte();
		}
		this._score.tempo = this.readInt32();
		if(this._versionNumber >= 510) this._data.readByte() != 0;
		this._keySignature = this.readInt32();
		if(this._versionNumber >= 400) this._octave = this._data.readByte();
		this.readPlaybackInfos();
		if(this._versionNumber >= 500) {
			this._data.read(38);
			this._data.read(4);
		}
		this._barCount = this.readInt32();
		this._trackCount = this.readInt32();
		this.readMasterBars();
		this.readTracks();
		this.readBars();
		this.finish(this._score);
		return this._score;
	}
	,_playbackInfos: null
	,_beatTapping: null
	,_trackCount: null
	,_barCount: null
	,_lyricsTrack: null
	,_lyrics: null
	,_lyricsIndex: null
	,_globalTripletFeel: null
	,_octave: null
	,_keySignature: null
	,_tempo: null
	,_score: null
	,_versionNumber: null
	,__class__: alphatab.importer.Gp3To5Importer
});
alphatab.importer.MixTableChange = $hxClasses["alphatab.importer.MixTableChange"] = function() {
	this.volume = -1;
	this.balance = -1;
	this.instrument = -1;
	this.tempoName = null;
	this.tempo = -1;
	this.duration = 0;
};
alphatab.importer.MixTableChange.__name__ = ["alphatab","importer","MixTableChange"];
alphatab.importer.MixTableChange.prototype = {
	duration: null
	,tempo: null
	,tempoName: null
	,instrument: null
	,balance: null
	,volume: null
	,__class__: alphatab.importer.MixTableChange
}
alphatab.importer.ScoreLoader = $hxClasses["alphatab.importer.ScoreLoader"] = function() { }
alphatab.importer.ScoreLoader.__name__ = ["alphatab","importer","ScoreLoader"];
alphatab.importer.ScoreLoader.loadScoreAsync = function(path,success,error) {
	var loader = new alphatab.platform.js.JsFileLoader();
	loader.loadBinaryAsync(path,function(data) {
		var importers = alphatab.importer.ScoreImporter.availableImporters();
		var _g = 0;
		while(_g < importers.length) {
			var importer = importers[_g];
			++_g;
			try {
				var input = new haxe.io.BytesInput(data);
				importer.init(input);
				var score = importer.readScore();
				success(score);
				return;
			} catch( e ) {
				if(e == alphatab.importer.ScoreImporter.UNSUPPORTED_FORMAT) continue; else error(haxe.Stack.toString(haxe.Stack.exceptionStack()));
			}
		}
		error("No reader for the requested file found");
	},error);
}
if(!alphatab.io) alphatab.io = {}
alphatab.io.OutputExtensions = $hxClasses["alphatab.io.OutputExtensions"] = function() { }
alphatab.io.OutputExtensions.__name__ = ["alphatab","io","OutputExtensions"];
alphatab.io.OutputExtensions.writeAsString = function(output,value) {
	var text;
	if(js.Boot.__instanceof(value,String)) text = js.Boot.__cast(value , String); else text = Std.string(value);
	output.writeString(text);
}
if(!alphatab.model) alphatab.model = {}
alphatab.model.AccentuationType = $hxClasses["alphatab.model.AccentuationType"] = { __ename__ : ["alphatab","model","AccentuationType"], __constructs__ : ["None","Normal","Heavy"] }
alphatab.model.AccentuationType.None = ["None",0];
alphatab.model.AccentuationType.None.toString = $estr;
alphatab.model.AccentuationType.None.__enum__ = alphatab.model.AccentuationType;
alphatab.model.AccentuationType.Normal = ["Normal",1];
alphatab.model.AccentuationType.Normal.toString = $estr;
alphatab.model.AccentuationType.Normal.__enum__ = alphatab.model.AccentuationType;
alphatab.model.AccentuationType.Heavy = ["Heavy",2];
alphatab.model.AccentuationType.Heavy.toString = $estr;
alphatab.model.AccentuationType.Heavy.__enum__ = alphatab.model.AccentuationType;
alphatab.model.AccidentalType = $hxClasses["alphatab.model.AccidentalType"] = { __ename__ : ["alphatab","model","AccidentalType"], __constructs__ : ["None","Natural","Sharp","Flat"] }
alphatab.model.AccidentalType.None = ["None",0];
alphatab.model.AccidentalType.None.toString = $estr;
alphatab.model.AccidentalType.None.__enum__ = alphatab.model.AccidentalType;
alphatab.model.AccidentalType.Natural = ["Natural",1];
alphatab.model.AccidentalType.Natural.toString = $estr;
alphatab.model.AccidentalType.Natural.__enum__ = alphatab.model.AccidentalType;
alphatab.model.AccidentalType.Sharp = ["Sharp",2];
alphatab.model.AccidentalType.Sharp.toString = $estr;
alphatab.model.AccidentalType.Sharp.__enum__ = alphatab.model.AccidentalType;
alphatab.model.AccidentalType.Flat = ["Flat",3];
alphatab.model.AccidentalType.Flat.toString = $estr;
alphatab.model.AccidentalType.Flat.__enum__ = alphatab.model.AccidentalType;
alphatab.model.Automation = $hxClasses["alphatab.model.Automation"] = function() {
};
alphatab.model.Automation.__name__ = ["alphatab","model","Automation"];
alphatab.model.Automation.prototype = {
	duration: null
	,value: null
	,type: null
	,isLinear: null
	,__class__: alphatab.model.Automation
}
alphatab.model.AutomationType = $hxClasses["alphatab.model.AutomationType"] = { __ename__ : ["alphatab","model","AutomationType"], __constructs__ : ["Tempo","Volume","Instrument","Balance"] }
alphatab.model.AutomationType.Tempo = ["Tempo",0];
alphatab.model.AutomationType.Tempo.toString = $estr;
alphatab.model.AutomationType.Tempo.__enum__ = alphatab.model.AutomationType;
alphatab.model.AutomationType.Volume = ["Volume",1];
alphatab.model.AutomationType.Volume.toString = $estr;
alphatab.model.AutomationType.Volume.__enum__ = alphatab.model.AutomationType;
alphatab.model.AutomationType.Instrument = ["Instrument",2];
alphatab.model.AutomationType.Instrument.toString = $estr;
alphatab.model.AutomationType.Instrument.__enum__ = alphatab.model.AutomationType;
alphatab.model.AutomationType.Balance = ["Balance",3];
alphatab.model.AutomationType.Balance.toString = $estr;
alphatab.model.AutomationType.Balance.__enum__ = alphatab.model.AutomationType;
alphatab.model.Bar = $hxClasses["alphatab.model.Bar"] = function() {
	this.voices = new Array();
	this.clef = alphatab.model.Clef.G2;
};
alphatab.model.Bar.__name__ = ["alphatab","model","Bar"];
alphatab.model.Bar.prototype = {
	isEmpty: function() {
		var _g = 0, _g1 = this.voices;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			if(!v.isEmpty()) return false;
		}
		return true;
	}
	,getMasterBar: function() {
		return this.track.score.masterBars[this.index];
	}
	,addVoice: function(voice) {
		voice.bar = this;
		voice.index = this.voices.length;
		this.voices.push(voice);
	}
	,voices: null
	,track: null
	,clef: null
	,previousBar: null
	,nextBar: null
	,index: null
	,__class__: alphatab.model.Bar
}
alphatab.model.Beat = $hxClasses["alphatab.model.Beat"] = function() {
	this.whammyBarPoints = new Array();
	this.notes = new Array();
	this.brushType = alphatab.model.BrushType.None;
	this.vibrato = alphatab.model.VibratoType.None;
	this.graceType = alphatab.model.GraceType.None;
	this.pickStroke = alphatab.model.PickStrokeType.None;
	this.duration = alphatab.model.Duration.Quarter;
	this.tremoloSpeed = -1;
	this.automations = new Array();
	this.start = 0;
	this.tupletDenominator = -1;
	this.tupletNumerator = -1;
};
alphatab.model.Beat.__name__ = ["alphatab","model","Beat"];
alphatab.model.Beat.prototype = {
	getNoteOnString: function(string) {
		var _g = 0, _g1 = this.notes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.string == string) return n;
		}
		return null;
	}
	,getAutomation: function(type) {
		var _g = 0, _g1 = this.automations;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			if(a.type == type) return a;
		}
		return null;
	}
	,addNote: function(note) {
		note.beat = this;
		this.notes.push(note);
		if(this.minNote == null || note.realValue() < this.minNote.realValue()) this.minNote = note;
		if(this.maxNote == null || note.realValue() > this.maxNote.realValue()) this.maxNote = note;
	}
	,calculateDuration: function() {
		var ticks = alphatab.audio.MidiUtils.durationToTicks(this.duration);
		if(this.dots == 2) ticks = alphatab.audio.MidiUtils.applyDot(ticks,true); else if(this.dots == 1) ticks = alphatab.audio.MidiUtils.applyDot(ticks,false);
		if(this.tupletDenominator > 0 && this.tupletNumerator >= 0) ticks = alphatab.audio.MidiUtils.applyTuplet(ticks,this.tupletNumerator,this.tupletDenominator);
		return ticks;
	}
	,start: null
	,tremoloSpeed: null
	,isTremolo: function() {
		return this.tremoloSpeed >= 0;
	}
	,pickStroke: null
	,graceType: null
	,hasChord: function() {
		return this.chord != null;
	}
	,chord: null
	,vibrato: null
	,hasWhammyBar: function() {
		return this.whammyBarPoints.length > 0;
	}
	,whammyBarPoints: null
	,tupletNumerator: null
	,tupletDenominator: null
	,brushDuration: null
	,brushType: null
	,text: null
	,slap: null
	,hasRasgueado: null
	,pop: null
	,lyrics: null
	,fadeIn: null
	,dots: null
	,isRest: function() {
		return this.notes.length == 0;
	}
	,automations: null
	,duration: null
	,maxNote: null
	,minNote: null
	,notes: null
	,voice: null
	,index: null
	,nextBeat: null
	,previousBeat: null
	,__class__: alphatab.model.Beat
}
alphatab.model.BendPoint = $hxClasses["alphatab.model.BendPoint"] = function(offset,value) {
	if(value == null) value = 0;
	if(offset == null) offset = 0;
	this.offset = offset;
	this.value = value;
};
alphatab.model.BendPoint.__name__ = ["alphatab","model","BendPoint"];
alphatab.model.BendPoint.prototype = {
	value: null
	,offset: null
	,__class__: alphatab.model.BendPoint
}
alphatab.model.BrushType = $hxClasses["alphatab.model.BrushType"] = { __ename__ : ["alphatab","model","BrushType"], __constructs__ : ["None","BrushUp","BrushDown","ArpeggioUp","ArpeggioDown"] }
alphatab.model.BrushType.None = ["None",0];
alphatab.model.BrushType.None.toString = $estr;
alphatab.model.BrushType.None.__enum__ = alphatab.model.BrushType;
alphatab.model.BrushType.BrushUp = ["BrushUp",1];
alphatab.model.BrushType.BrushUp.toString = $estr;
alphatab.model.BrushType.BrushUp.__enum__ = alphatab.model.BrushType;
alphatab.model.BrushType.BrushDown = ["BrushDown",2];
alphatab.model.BrushType.BrushDown.toString = $estr;
alphatab.model.BrushType.BrushDown.__enum__ = alphatab.model.BrushType;
alphatab.model.BrushType.ArpeggioUp = ["ArpeggioUp",3];
alphatab.model.BrushType.ArpeggioUp.toString = $estr;
alphatab.model.BrushType.ArpeggioUp.__enum__ = alphatab.model.BrushType;
alphatab.model.BrushType.ArpeggioDown = ["ArpeggioDown",4];
alphatab.model.BrushType.ArpeggioDown.toString = $estr;
alphatab.model.BrushType.ArpeggioDown.__enum__ = alphatab.model.BrushType;
alphatab.model.Chord = $hxClasses["alphatab.model.Chord"] = function() {
	this.strings = new Array();
};
alphatab.model.Chord.__name__ = ["alphatab","model","Chord"];
alphatab.model.Chord.prototype = {
	strings: null
	,firstFret: null
	,name: null
	,__class__: alphatab.model.Chord
}
alphatab.model.Clef = $hxClasses["alphatab.model.Clef"] = { __ename__ : ["alphatab","model","Clef"], __constructs__ : ["C3","C4","F4","G2"] }
alphatab.model.Clef.C3 = ["C3",0];
alphatab.model.Clef.C3.toString = $estr;
alphatab.model.Clef.C3.__enum__ = alphatab.model.Clef;
alphatab.model.Clef.C4 = ["C4",1];
alphatab.model.Clef.C4.toString = $estr;
alphatab.model.Clef.C4.__enum__ = alphatab.model.Clef;
alphatab.model.Clef.F4 = ["F4",2];
alphatab.model.Clef.F4.toString = $estr;
alphatab.model.Clef.F4.__enum__ = alphatab.model.Clef;
alphatab.model.Clef.G2 = ["G2",3];
alphatab.model.Clef.G2.toString = $estr;
alphatab.model.Clef.G2.__enum__ = alphatab.model.Clef;
alphatab.model.Duration = $hxClasses["alphatab.model.Duration"] = { __ename__ : ["alphatab","model","Duration"], __constructs__ : ["Whole","Half","Quarter","Eighth","Sixteenth","ThirtySecond","SixtyFourth"] }
alphatab.model.Duration.Whole = ["Whole",0];
alphatab.model.Duration.Whole.toString = $estr;
alphatab.model.Duration.Whole.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.Half = ["Half",1];
alphatab.model.Duration.Half.toString = $estr;
alphatab.model.Duration.Half.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.Quarter = ["Quarter",2];
alphatab.model.Duration.Quarter.toString = $estr;
alphatab.model.Duration.Quarter.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.Eighth = ["Eighth",3];
alphatab.model.Duration.Eighth.toString = $estr;
alphatab.model.Duration.Eighth.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.Sixteenth = ["Sixteenth",4];
alphatab.model.Duration.Sixteenth.toString = $estr;
alphatab.model.Duration.Sixteenth.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.ThirtySecond = ["ThirtySecond",5];
alphatab.model.Duration.ThirtySecond.toString = $estr;
alphatab.model.Duration.ThirtySecond.__enum__ = alphatab.model.Duration;
alphatab.model.Duration.SixtyFourth = ["SixtyFourth",6];
alphatab.model.Duration.SixtyFourth.toString = $estr;
alphatab.model.Duration.SixtyFourth.__enum__ = alphatab.model.Duration;
alphatab.model.DynamicValue = $hxClasses["alphatab.model.DynamicValue"] = { __ename__ : ["alphatab","model","DynamicValue"], __constructs__ : ["PPP","PP","P","MP","MF","F","FF","FFF"] }
alphatab.model.DynamicValue.PPP = ["PPP",0];
alphatab.model.DynamicValue.PPP.toString = $estr;
alphatab.model.DynamicValue.PPP.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.PP = ["PP",1];
alphatab.model.DynamicValue.PP.toString = $estr;
alphatab.model.DynamicValue.PP.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.P = ["P",2];
alphatab.model.DynamicValue.P.toString = $estr;
alphatab.model.DynamicValue.P.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.MP = ["MP",3];
alphatab.model.DynamicValue.MP.toString = $estr;
alphatab.model.DynamicValue.MP.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.MF = ["MF",4];
alphatab.model.DynamicValue.MF.toString = $estr;
alphatab.model.DynamicValue.MF.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.F = ["F",5];
alphatab.model.DynamicValue.F.toString = $estr;
alphatab.model.DynamicValue.F.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.FF = ["FF",6];
alphatab.model.DynamicValue.FF.toString = $estr;
alphatab.model.DynamicValue.FF.__enum__ = alphatab.model.DynamicValue;
alphatab.model.DynamicValue.FFF = ["FFF",7];
alphatab.model.DynamicValue.FFF.toString = $estr;
alphatab.model.DynamicValue.FFF.__enum__ = alphatab.model.DynamicValue;
alphatab.model.GraceType = $hxClasses["alphatab.model.GraceType"] = { __ename__ : ["alphatab","model","GraceType"], __constructs__ : ["None","OnBeat","BeforeBeat"] }
alphatab.model.GraceType.None = ["None",0];
alphatab.model.GraceType.None.toString = $estr;
alphatab.model.GraceType.None.__enum__ = alphatab.model.GraceType;
alphatab.model.GraceType.OnBeat = ["OnBeat",1];
alphatab.model.GraceType.OnBeat.toString = $estr;
alphatab.model.GraceType.OnBeat.__enum__ = alphatab.model.GraceType;
alphatab.model.GraceType.BeforeBeat = ["BeforeBeat",2];
alphatab.model.GraceType.BeforeBeat.toString = $estr;
alphatab.model.GraceType.BeforeBeat.__enum__ = alphatab.model.GraceType;
alphatab.model.HarmonicType = $hxClasses["alphatab.model.HarmonicType"] = { __ename__ : ["alphatab","model","HarmonicType"], __constructs__ : ["None","Natural","Artificial","Pinch","Tap","Semi","Feedback"] }
alphatab.model.HarmonicType.None = ["None",0];
alphatab.model.HarmonicType.None.toString = $estr;
alphatab.model.HarmonicType.None.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Natural = ["Natural",1];
alphatab.model.HarmonicType.Natural.toString = $estr;
alphatab.model.HarmonicType.Natural.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Artificial = ["Artificial",2];
alphatab.model.HarmonicType.Artificial.toString = $estr;
alphatab.model.HarmonicType.Artificial.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Pinch = ["Pinch",3];
alphatab.model.HarmonicType.Pinch.toString = $estr;
alphatab.model.HarmonicType.Pinch.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Tap = ["Tap",4];
alphatab.model.HarmonicType.Tap.toString = $estr;
alphatab.model.HarmonicType.Tap.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Semi = ["Semi",5];
alphatab.model.HarmonicType.Semi.toString = $estr;
alphatab.model.HarmonicType.Semi.__enum__ = alphatab.model.HarmonicType;
alphatab.model.HarmonicType.Feedback = ["Feedback",6];
alphatab.model.HarmonicType.Feedback.toString = $estr;
alphatab.model.HarmonicType.Feedback.__enum__ = alphatab.model.HarmonicType;
alphatab.model.MasterBar = $hxClasses["alphatab.model.MasterBar"] = function() {
	this.alternateEndings = 0;
	this.repeatCount = 0;
	this.index = 0;
	this.keySignature = 0;
	this.isDoubleBar = false;
	this.isRepeatStart = false;
	this.repeatCount = 0;
	this.timeSignatureDenominator = 4;
	this.timeSignatureNumerator = 4;
	this.tripletFeel = alphatab.model.TripletFeel.NoTripletFeel;
	this.start = 0;
};
alphatab.model.MasterBar.__name__ = ["alphatab","model","MasterBar"];
alphatab.model.MasterBar.prototype = {
	calculateDuration: function() {
		return this.timeSignatureNumerator * alphatab.audio.MidiUtils.valueToTicks(this.timeSignatureDenominator);
	}
	,start: null
	,score: null
	,volumeAutomation: null
	,tempoAutomation: null
	,isSectionStart: function() {
		return this.section != null;
	}
	,section: null
	,tripletFeel: null
	,timeSignatureNumerator: null
	,timeSignatureDenominator: null
	,repeatCount: null
	,isRepeatEnd: function() {
		return this.repeatCount > 0;
	}
	,isRepeatStart: null
	,isDoubleBar: null
	,keySignature: null
	,index: null
	,previousMasterBar: null
	,nextMasterBar: null
	,alternateEndings: null
	,__class__: alphatab.model.MasterBar
}
alphatab.model.ModelUtils = $hxClasses["alphatab.model.ModelUtils"] = function() { }
alphatab.model.ModelUtils.__name__ = ["alphatab","model","ModelUtils"];
alphatab.model.ModelUtils.getDurationValue = function(duration) {
	switch( (duration)[1] ) {
	case 0:
		return 1;
	case 1:
		return 2;
	case 2:
		return 4;
	case 3:
		return 8;
	case 4:
		return 16;
	case 5:
		return 32;
	case 6:
		return 64;
	default:
		return 1;
	}
}
alphatab.model.ModelUtils.getDurationIndex = function(duration) {
	var index = 0;
	var value = alphatab.model.ModelUtils.getDurationValue(duration);
	while((value = value >> 1) > 0) index++;
	return index;
}
alphatab.model.ModelUtils.keySignatureIsFlat = function(ks) {
	return ks < 0;
}
alphatab.model.ModelUtils.keySignatureIsNatural = function(ks) {
	return ks == 0;
}
alphatab.model.ModelUtils.keySignatureIsSharp = function(ks) {
	return ks > 0;
}
alphatab.model.ModelUtils.getClefIndex = function(clef) {
	switch( (clef)[1] ) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	case 3:
		return 3;
	default:
		return 0;
	}
}
alphatab.model.Note = $hxClasses["alphatab.model.Note"] = function() {
	this.bendPoints = new Array();
	this.trillFret = -1;
	this.dynamicValue = alphatab.model.DynamicValue.F;
	this.accentuated = alphatab.model.AccentuationType.None;
	this.fret = -1;
	this.isGhost = false;
	this.string = 0;
	this.isHammerPullDestination = false;
	this.isHammerPullOrigin = false;
	this.harmonicValue = 0;
	this.harmonicType = alphatab.model.HarmonicType.None;
	this.isLetRing = false;
	this.isPalmMute = false;
	this.isDead = false;
	this.slideType = alphatab.model.SlideType.None;
	this.vibrato = alphatab.model.VibratoType.None;
	this.isStaccato = false;
	this.tapping = false;
	this.isTieOrigin = false;
	this.isTieDestination = false;
	this.leftHandFinger = -1;
	this.rightHandFinger = -1;
	this.isFingering = false;
	this.trillFret = -1;
	this.trillSpeed = 0;
	this.durationPercent = 1;
};
alphatab.model.Note.__name__ = ["alphatab","model","Note"];
alphatab.model.Note.prototype = {
	realValue: function() {
		return this.fret + this.beat.voice.bar.track.tuning[this.string];
	}
	,dynamicValue: null
	,beat: null
	,durationPercent: null
	,trillSpeed: null
	,isTrill: function() {
		return this.trillFret >= 0;
	}
	,trillFret: null
	,isFingering: null
	,rightHandFinger: null
	,leftHandFinger: null
	,isTieDestination: null
	,isTieOrigin: null
	,tapping: null
	,isStaccato: null
	,vibrato: null
	,slideType: null
	,isDead: null
	,isPalmMute: null
	,isLetRing: null
	,harmonicType: null
	,harmonicValue: null
	,isHammerPullOrigin: null
	,isHammerPullDestination: null
	,string: null
	,isGhost: null
	,fret: null
	,hasBend: function() {
		return this.bendPoints.length > 0;
	}
	,bendPoints: null
	,accentuated: null
	,__class__: alphatab.model.Note
}
alphatab.model.PickStrokeType = $hxClasses["alphatab.model.PickStrokeType"] = { __ename__ : ["alphatab","model","PickStrokeType"], __constructs__ : ["None","Up","Down"] }
alphatab.model.PickStrokeType.None = ["None",0];
alphatab.model.PickStrokeType.None.toString = $estr;
alphatab.model.PickStrokeType.None.__enum__ = alphatab.model.PickStrokeType;
alphatab.model.PickStrokeType.Up = ["Up",1];
alphatab.model.PickStrokeType.Up.toString = $estr;
alphatab.model.PickStrokeType.Up.__enum__ = alphatab.model.PickStrokeType;
alphatab.model.PickStrokeType.Down = ["Down",2];
alphatab.model.PickStrokeType.Down.toString = $estr;
alphatab.model.PickStrokeType.Down.__enum__ = alphatab.model.PickStrokeType;
alphatab.model.PlaybackInformation = $hxClasses["alphatab.model.PlaybackInformation"] = function() {
};
alphatab.model.PlaybackInformation.__name__ = ["alphatab","model","PlaybackInformation"];
alphatab.model.PlaybackInformation.prototype = {
	isSolo: null
	,isMute: null
	,secondaryChannel: null
	,primaryChannel: null
	,program: null
	,port: null
	,balance: null
	,volume: null
	,__class__: alphatab.model.PlaybackInformation
}
alphatab.model.Score = $hxClasses["alphatab.model.Score"] = function() {
	this.masterBars = new Array();
	this.tracks = new Array();
};
alphatab.model.Score.__name__ = ["alphatab","model","Score"];
alphatab.model.Score.prototype = {
	addTrack: function(track) {
		track.score = this;
		track.index = this.tracks.length;
		this.tracks.push(track);
	}
	,addMasterBar: function(bar) {
		bar.score = this;
		bar.index = this.masterBars.length;
		if(this.masterBars.length != 0) {
			bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
			bar.previousMasterBar.nextMasterBar = bar;
			bar.start = bar.previousMasterBar.start + bar.previousMasterBar.calculateDuration();
		}
		this.masterBars.push(bar);
	}
	,tracks: null
	,masterBars: null
	,tempoLabel: null
	,tempo: null
	,tab: null
	,words: null
	,title: null
	,subTitle: null
	,notices: null
	,music: null
	,instructions: null
	,copyright: null
	,artist: null
	,album: null
	,__class__: alphatab.model.Score
}
alphatab.model.Section = $hxClasses["alphatab.model.Section"] = function() {
};
alphatab.model.Section.__name__ = ["alphatab","model","Section"];
alphatab.model.Section.prototype = {
	text: null
	,marker: null
	,__class__: alphatab.model.Section
}
alphatab.model.SlideType = $hxClasses["alphatab.model.SlideType"] = { __ename__ : ["alphatab","model","SlideType"], __constructs__ : ["None","Shift","Legato","IntoFromBelow","IntoFromAbove","OutUp","OutDown"] }
alphatab.model.SlideType.None = ["None",0];
alphatab.model.SlideType.None.toString = $estr;
alphatab.model.SlideType.None.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.Shift = ["Shift",1];
alphatab.model.SlideType.Shift.toString = $estr;
alphatab.model.SlideType.Shift.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.Legato = ["Legato",2];
alphatab.model.SlideType.Legato.toString = $estr;
alphatab.model.SlideType.Legato.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.IntoFromBelow = ["IntoFromBelow",3];
alphatab.model.SlideType.IntoFromBelow.toString = $estr;
alphatab.model.SlideType.IntoFromBelow.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.IntoFromAbove = ["IntoFromAbove",4];
alphatab.model.SlideType.IntoFromAbove.toString = $estr;
alphatab.model.SlideType.IntoFromAbove.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.OutUp = ["OutUp",5];
alphatab.model.SlideType.OutUp.toString = $estr;
alphatab.model.SlideType.OutUp.__enum__ = alphatab.model.SlideType;
alphatab.model.SlideType.OutDown = ["OutDown",6];
alphatab.model.SlideType.OutDown.toString = $estr;
alphatab.model.SlideType.OutDown.__enum__ = alphatab.model.SlideType;
alphatab.model.Track = $hxClasses["alphatab.model.Track"] = function() {
	this.tuning = new Array();
	this.bars = new Array();
	this.playbackInfo = new alphatab.model.PlaybackInformation();
};
alphatab.model.Track.__name__ = ["alphatab","model","Track"];
alphatab.model.Track.prototype = {
	addBar: function(bar) {
		bar.track = this;
		bar.index = this.bars.length;
		if(this.bars.length > 0) {
			bar.previousBar = this.bars[this.bars.length - 1];
			bar.previousBar.nextBar = bar;
		}
		this.bars.push(bar);
	}
	,bars: null
	,score: null
	,isPercussion: null
	,playbackInfo: null
	,tuningName: null
	,tuning: null
	,shortName: null
	,name: null
	,index: null
	,capo: null
	,__class__: alphatab.model.Track
}
alphatab.model.TripletFeel = $hxClasses["alphatab.model.TripletFeel"] = { __ename__ : ["alphatab","model","TripletFeel"], __constructs__ : ["NoTripletFeel","Triplet16th","Triplet8th","Dotted16th","Dotted8th","Scottish16th","Scottish8th"] }
alphatab.model.TripletFeel.NoTripletFeel = ["NoTripletFeel",0];
alphatab.model.TripletFeel.NoTripletFeel.toString = $estr;
alphatab.model.TripletFeel.NoTripletFeel.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Triplet16th = ["Triplet16th",1];
alphatab.model.TripletFeel.Triplet16th.toString = $estr;
alphatab.model.TripletFeel.Triplet16th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Triplet8th = ["Triplet8th",2];
alphatab.model.TripletFeel.Triplet8th.toString = $estr;
alphatab.model.TripletFeel.Triplet8th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Dotted16th = ["Dotted16th",3];
alphatab.model.TripletFeel.Dotted16th.toString = $estr;
alphatab.model.TripletFeel.Dotted16th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Dotted8th = ["Dotted8th",4];
alphatab.model.TripletFeel.Dotted8th.toString = $estr;
alphatab.model.TripletFeel.Dotted8th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Scottish16th = ["Scottish16th",5];
alphatab.model.TripletFeel.Scottish16th.toString = $estr;
alphatab.model.TripletFeel.Scottish16th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.TripletFeel.Scottish8th = ["Scottish8th",6];
alphatab.model.TripletFeel.Scottish8th.toString = $estr;
alphatab.model.TripletFeel.Scottish8th.__enum__ = alphatab.model.TripletFeel;
alphatab.model.Tuning = $hxClasses["alphatab.model.Tuning"] = function(name,tuning,isStandard) {
	this.name = name;
	this.tuning = tuning;
	this.isStandard = isStandard;
};
alphatab.model.Tuning.__name__ = ["alphatab","model","Tuning"];
alphatab.model.Tuning._sevenStrings = null;
alphatab.model.Tuning._sixStrings = null;
alphatab.model.Tuning._fiveStrings = null;
alphatab.model.Tuning._fourStrings = null;
alphatab.model.Tuning.isTuning = function(name) {
	var regex = alphatab.model.Tuning.TUNING_REGEX;
	return regex.match(name);
}
alphatab.model.Tuning.getTextForTuning = function(tuning,includeOctave) {
	var octave = Math.floor(tuning / 12);
	var note = tuning % 12;
	var notes = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
	var result = notes[note];
	if(includeOctave) result += Std.string(octave);
	return result;
}
alphatab.model.Tuning.getTuningForText = function(str) {
	var base = 0;
	var regex = alphatab.model.Tuning.TUNING_REGEX;
	if(regex.match(str.toLowerCase())) {
		var note = regex.matched(1);
		var octave = Std.parseInt(regex.matched(2));
		if(note == "c") base = 0; else if(note == "db") base = 1; else if(note == "d") base = 2; else if(note == "eb") base = 3; else if(note == "e") base = 4; else if(note == "f") base = 5; else if(note == "gb") base = 6; else if(note == "g") base = 7; else if(note == "ab") base = 8; else if(note == "a") base = 9; else if(note == "bb") base = 10; else if(note == "b") base = 11; else return -1;
		base += (octave + 1) * 12;
	} else return -1;
	return base;
}
alphatab.model.Tuning.getPresetsFor = function(strings) {
	if(alphatab.model.Tuning._sevenStrings == null) alphatab.model.Tuning.initialize();
	if(strings == 7) return alphatab.model.Tuning._sevenStrings;
	if(strings == 6) return alphatab.model.Tuning._sixStrings;
	if(strings == 5) return alphatab.model.Tuning._fiveStrings;
	if(strings == 4) return alphatab.model.Tuning._fourStrings;
	return new Array();
}
alphatab.model.Tuning.initialize = function() {
	alphatab.model.Tuning._sevenStrings = new Array();
	alphatab.model.Tuning._sixStrings = new Array();
	alphatab.model.Tuning._fiveStrings = new Array();
	alphatab.model.Tuning._fourStrings = new Array();
	alphatab.model.Tuning._sevenStrings.push(new alphatab.model.Tuning("Guitar 7 strings",[64,59,55,50,45,40,35],true));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Standard Tuning",[64,59,55,50,45,40],true));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Tune down ½ step",[63,58,54,49,44,39],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Tune down 1 step",[62,57,53,48,43,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Tune down 2 step",[60,55,51,46,41,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Dropped D Tuning",[64,59,55,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Dropped D Tuning variant",[64,57,55,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Double Dropped D Tuning",[62,59,55,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Dropped E Tuning",[66,61,57,52,47,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Dropped C Tuning",[62,57,53,48,43,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open C Tuning",[64,60,55,48,43,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Cm Tuning",[63,60,55,48,43,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open C6 Tuning",[64,57,55,48,43,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Cmaj7 Tuning",[64,59,55,52,43,36],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open D Tuning",[62,57,54,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Dm Tuning",[62,57,53,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open D5 Tuning",[62,57,50,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open D6 Tuning",[62,59,54,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Dsus4 Tuning",[62,57,55,50,45,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open E Tuning",[64,59,56,52,47,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Em Tuning",[64,59,55,52,47,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Esus11 Tuning",[64,59,55,52,45,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open F Tuning",[65,60,53,48,45,41],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open G Tuning",[62,59,55,50,43,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Gm Tuning",[62,58,55,50,43,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open G6 Tuning",[64,59,55,50,43,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Gsus4 Tuning",[62,60,55,50,43,38],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open A Tuning",[64,61,57,52,45,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Open Am Tuning",[64,60,57,52,45,40],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Guitar Nashville Tuning",[64,59,67,62,57,52],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Bass 6 Strings Tuning",[48,43,38,33,28,23],false));
	alphatab.model.Tuning._sixStrings.push(new alphatab.model.Tuning("Lute or Vihuela Tuning",[64,59,54,50,45,40],false));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Bass 5 Strings Tuning",[43,38,33,28,23],true));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Banjo Dropped C Tuning",[62,59,55,48,67],false));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Banjo Open D Tuning",[62,57,54,50,69],false));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Banjo Open G Tuning",[62,59,55,50,67],false));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Banjo G Minor Tuning",[62,58,55,50,67],false));
	alphatab.model.Tuning._fiveStrings.push(new alphatab.model.Tuning("Banjo G Modal Tuning",[62,57,55,50,67],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Bass Standard Tuning",[43,38,33,28],true));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Bass Tune down ½ step",[42,37,32,27],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Bass Tune down 1 step",[41,36,31,26],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Bass Tune down 2 step",[39,34,29,24],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Bass Dropped D Tuning",[43,38,33,26],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Ukulele C Tuning",[45,40,36,43],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Ukulele G Tuning",[52,47,43,38],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Mandolin Standard Tuning",[64,57,50,43],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Mandolin or Violin Tuning",[76,69,62,55],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Viola Tuning",[69,62,55,48],false));
	alphatab.model.Tuning._fourStrings.push(new alphatab.model.Tuning("Cello Tuning",[57,50,43,36],false));
}
alphatab.model.Tuning.findTuning = function(strings) {
	var tunings = alphatab.model.Tuning.getPresetsFor(strings.length);
	var _g = 0;
	while(_g < tunings.length) {
		var tuning = tunings[_g];
		++_g;
		var equals = true;
		var _g2 = 0, _g1 = strings.length;
		while(_g2 < _g1) {
			var i = _g2++;
			if(strings[i] != tuning.tuning[i]) {
				equals = false;
				break;
			}
		}
		if(equals) return tuning;
	}
	return null;
}
alphatab.model.Tuning.prototype = {
	tuning: null
	,name: null
	,isStandard: null
	,__class__: alphatab.model.Tuning
}
alphatab.model.VibratoType = $hxClasses["alphatab.model.VibratoType"] = { __ename__ : ["alphatab","model","VibratoType"], __constructs__ : ["None","Slight","Wide"] }
alphatab.model.VibratoType.None = ["None",0];
alphatab.model.VibratoType.None.toString = $estr;
alphatab.model.VibratoType.None.__enum__ = alphatab.model.VibratoType;
alphatab.model.VibratoType.Slight = ["Slight",1];
alphatab.model.VibratoType.Slight.toString = $estr;
alphatab.model.VibratoType.Slight.__enum__ = alphatab.model.VibratoType;
alphatab.model.VibratoType.Wide = ["Wide",2];
alphatab.model.VibratoType.Wide.toString = $estr;
alphatab.model.VibratoType.Wide.__enum__ = alphatab.model.VibratoType;
alphatab.model.Voice = $hxClasses["alphatab.model.Voice"] = function() {
	this.beats = new Array();
};
alphatab.model.Voice.__name__ = ["alphatab","model","Voice"];
alphatab.model.Voice.prototype = {
	isEmpty: function() {
		return this.beats.length == 0;
	}
	,addBeat: function(beat) {
		beat.voice = this;
		beat.index = this.beats.length;
		if(this.beats.length > 0) {
			beat.previousBeat = this.beats[this.beats.length - 1];
			beat.previousBeat.nextBeat = beat;
			beat.start = beat.previousBeat.start + beat.previousBeat.calculateDuration();
		}
		this.beats.push(beat);
	}
	,beats: null
	,bar: null
	,index: null
	,__class__: alphatab.model.Voice
}
if(!alphatab.platform) alphatab.platform = {}
alphatab.platform.ICanvas = $hxClasses["alphatab.platform.ICanvas"] = function() { }
alphatab.platform.ICanvas.__name__ = ["alphatab","platform","ICanvas"];
alphatab.platform.ICanvas.prototype = {
	measureText: null
	,strokeText: null
	,fillText: null
	,setTextAlign: null
	,setFont: null
	,stroke: null
	,fill: null
	,circle: null
	,rect: null
	,bezierCurveTo: null
	,quadraticCurveTo: null
	,lineTo: null
	,moveTo: null
	,closePath: null
	,beginPath: null
	,strokeRect: null
	,fillRect: null
	,clear: null
	,setLineWidth: null
	,setColor: null
	,setHeight: null
	,getHeight: null
	,setWidth: null
	,getWidth: null
	,__class__: alphatab.platform.ICanvas
}
alphatab.platform.IFileLoader = $hxClasses["alphatab.platform.IFileLoader"] = function() { }
alphatab.platform.IFileLoader.__name__ = ["alphatab","platform","IFileLoader"];
alphatab.platform.IFileLoader.prototype = {
	loadBinaryAsync: null
	,loadBinary: null
	,__class__: alphatab.platform.IFileLoader
}
alphatab.platform.PlatformFactory = $hxClasses["alphatab.platform.PlatformFactory"] = function() { }
alphatab.platform.PlatformFactory.__name__ = ["alphatab","platform","PlatformFactory"];
alphatab.platform.PlatformFactory.getLoader = function() {
	return new alphatab.platform.js.JsFileLoader();
}
alphatab.platform.PlatformFactory.getCanvas = function(object) {
	if(object == alphatab.platform.PlatformFactory.SVG_CANVAS) return new alphatab.platform.svg.SvgCanvas();
	return new alphatab.platform.js.Html5Canvas(object);
}
if(!alphatab.platform.js) alphatab.platform.js = {}
alphatab.platform.js.Html5Canvas = $hxClasses["alphatab.platform.js.Html5Canvas"] = function(dom) {
	this._canvas = dom;
	this._context = dom.getContext("2d");
	this._context.textBaseline = "top";
};
alphatab.platform.js.Html5Canvas.__name__ = ["alphatab","platform","js","Html5Canvas"];
alphatab.platform.js.Html5Canvas.__interfaces__ = [alphatab.platform.ICanvas];
alphatab.platform.js.Html5Canvas.prototype = {
	measureText: function(text) {
		return this._context.measureText(text).width;
	}
	,strokeText: function(text,x,y) {
		this._context.strokeText(text,x,y);
	}
	,fillText: function(text,x,y) {
		this._context.fillText(text,x,y);
	}
	,setTextAlign: function(value) {
		switch( (value)[1] ) {
		case 0:
			this._context.textAlign = "left";
			break;
		case 1:
			this._context.textAlign = "center";
			break;
		case 2:
			this._context.textAlign = "right";
			break;
		}
	}
	,setFont: function(font) {
		this._context.font = font.toCssString();
	}
	,stroke: function() {
		this._context.stroke();
	}
	,fill: function() {
		this._context.fill();
	}
	,rect: function(x,y,w,h) {
		this._context.rect(x,y,w,h);
	}
	,circle: function(x,y,radius) {
		this._context.arc(x,y,radius,0,Math.PI * 2,true);
	}
	,bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y) {
		this._context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
	}
	,quadraticCurveTo: function(cpx,cpy,x,y) {
		this._context.quadraticCurveTo(cpx,cpy,x,y);
	}
	,lineTo: function(x,y) {
		this._context.lineTo(x - 0.5,y - 0.5);
	}
	,moveTo: function(x,y) {
		this._context.moveTo(x - 0.5,y - 0.5);
	}
	,closePath: function() {
		this._context.closePath();
	}
	,beginPath: function() {
		this._context.beginPath();
	}
	,strokeRect: function(x,y,w,h) {
		this._context.strokeRect(x - 0.5,y - 0.5,w,h);
	}
	,fillRect: function(x,y,w,h) {
		this._context.fillRect(x - 0.5,y - 0.5,w,h);
	}
	,clear: function() {
		var lineWidth = this._context.lineWidth;
		this._canvas.width = this._canvas.width;
		this._context.lineWidth = lineWidth;
	}
	,setLineWidth: function(value) {
		this._context.lineWidth = value;
	}
	,setColor: function(color) {
		this._context.strokeStyle = color.toRgbaString();
		this._context.fillStyle = color.toRgbaString();
	}
	,setHeight: function(height) {
		var lineWidth = this._context.lineWidth;
		this._canvas.height = height;
		this._context = this._canvas.getContext("2d");
		this._context.textBaseline = "top";
		this._context.lineWidth = lineWidth;
		this._height = height;
	}
	,setWidth: function(width) {
		var lineWidth = this._context.lineWidth;
		this._canvas.width = width;
		this._context = this._canvas.getContext("2d");
		this._context.textBaseline = "top";
		this._context.lineWidth = lineWidth;
		this._width = width;
	}
	,getHeight: function() {
		return this._canvas.offsetHeight;
	}
	,getWidth: function() {
		return this._canvas.offsetWidth;
	}
	,_height: null
	,_width: null
	,_context: null
	,_canvas: null
	,__class__: alphatab.platform.js.Html5Canvas
}
alphatab.platform.js.JsFileLoader = $hxClasses["alphatab.platform.js.JsFileLoader"] = function() {
};
alphatab.platform.js.JsFileLoader.__name__ = ["alphatab","platform","js","JsFileLoader"];
alphatab.platform.js.JsFileLoader.__interfaces__ = [alphatab.platform.IFileLoader];
alphatab.platform.js.JsFileLoader.isIE = function() {
	var agent = navigator.userAgent;
	return agent.indexOf("MSIE") != -1;
}
alphatab.platform.js.JsFileLoader.getBytes = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		a.push(HxOverrides.cca(s,i) & 255);
	}
	return haxe.io.Bytes.ofData(a);
}
alphatab.platform.js.JsFileLoader.prototype = {
	loadBinaryAsync: function(path,success,error) {
		if(alphatab.platform.js.JsFileLoader.isIE()) {
			var vbArr = VbAjaxLoader(method,file);
			var fileContents = vbArr.toArray();
			var data = "";
			var i = 0;
			while(i < fileContents.length - 1) {
				data += String.fromCharCode(fileContents[i]);
				i++;
			}
			var reader = alphatab.platform.js.JsFileLoader.getBytes(data);
			success(reader);
		} else {
			var xhr = new js.XMLHttpRequest();
			xhr.overrideMimeType("text/plain; charset=x-user-defined");
			xhr.onreadystatechange = function() {
				try {
					if(xhr.readyState == 4) {
						if(xhr.status == 200) {
							var reader = alphatab.platform.js.JsFileLoader.getBytes(xhr.responseText);
							success(reader);
						} else if(xhr.status == 0) error("You are offline!!\n Please Check Your Network."); else if(xhr.status == 404) error("Requested URL not found."); else if(xhr.status == 500) error("Internel Server Error."); else if(xhr.statusText == "parsererror") error("Error.\nParsing JSON Request failed."); else if(xhr.statusText == "timeout") error("Request Time out."); else error("Unknow Error: " + xhr.responseText);
					}
				} catch( e ) {
					error("Error loading file: " + Std.string(e));
				}
			};
			xhr.open("GET",path,true);
			xhr.send(null);
		}
	}
	,loadBinary: function(path) {
		if(alphatab.platform.js.JsFileLoader.isIE()) {
			var vbArr = VbAjaxLoader(method,file);
			var fileContents = vbArr.toArray();
			var data = "";
			var i = 0;
			while(i < fileContents.length - 1) {
				data += String.fromCharCode(fileContents[i]);
				i++;
			}
			var reader = alphatab.platform.js.JsFileLoader.getBytes(data);
			return reader;
		} else {
			var xhr = new js.XMLHttpRequest();
			xhr.overrideMimeType("text/plain; charset=x-user-defined");
			xhr.open("GET",path,false);
			xhr.send(null);
			if(xhr.status == 200) {
				var reader = alphatab.platform.js.JsFileLoader.getBytes(xhr.responseText);
				return reader;
			} else if(xhr.status == 0) throw "You are offline!!\n Please Check Your Network."; else if(xhr.status == 404) throw "Requested URL not found."; else if(xhr.status == 500) throw "Internel Server Error."; else if(xhr.statusText == "parsererror") throw "Error.\nParsing JSON Request failed."; else if(xhr.statusText == "timeout") throw "Request Time out."; else throw "Unknow Error: " + xhr.responseText;
		}
	}
	,__class__: alphatab.platform.js.JsFileLoader
}
if(!alphatab.platform.model) alphatab.platform.model = {}
alphatab.platform.model.Color = $hxClasses["alphatab.platform.model.Color"] = function(r,g,b,a) {
	if(a == null) a = 255;
	this._higherBits = (a & 255) << 8 | r & 255;
	this._lowerBits = (g & 255) << 8 | b & 255;
};
alphatab.platform.model.Color.__name__ = ["alphatab","platform","model","Color"];
alphatab.platform.model.Color.prototype = {
	toRgbaString: function() {
		return "rgba(" + this.getR() + "," + this.getG() + "," + this.getB() + "," + this.getA() / 255.0 + ")";
	}
	,toHexString: function() {
		return "#" + StringTools.hex(this.getA(),2) + StringTools.hex(this.getR(),2) + StringTools.hex(this.getG(),2) + StringTools.hex(this.getB(),2);
	}
	,getB: function() {
		return this._lowerBits & 255;
	}
	,getG: function() {
		return this._lowerBits >> 8 & 255;
	}
	,getR: function() {
		return this._higherBits & 255;
	}
	,getA: function() {
		return this._higherBits >> 8 & 255;
	}
	,_higherBits: null
	,_lowerBits: null
	,__class__: alphatab.platform.model.Color
}
alphatab.platform.model.Font = $hxClasses["alphatab.platform.model.Font"] = function(family,size,style) {
	if(style == null) style = 0;
	this._family = family;
	this._size = size;
	this._style = style;
};
alphatab.platform.model.Font.__name__ = ["alphatab","platform","model","Font"];
alphatab.platform.model.Font.prototype = {
	toCssString: function() {
		var buf = new StringBuf();
		if((this.getStyle() & 1) != 0) buf.b += Std.string("bold ");
		if((this.getStyle() & 2) != 0) buf.b += Std.string("italic ");
		buf.b += Std.string(this._size);
		buf.b += Std.string("px");
		buf.b += Std.string("'");
		buf.b += Std.string(this._family);
		buf.b += Std.string("'");
		return buf.b;
	}
	,isItalic: function() {
		return (this.getStyle() & 2) != 0;
	}
	,isBold: function() {
		return (this.getStyle() & 1) != 0;
	}
	,getStyle: function() {
		return this._style;
	}
	,getSize: function() {
		return this._size;
	}
	,getFamily: function() {
		return this._family;
	}
	,_style: null
	,_size: null
	,_family: null
	,__class__: alphatab.platform.model.Font
}
alphatab.platform.model.TextAlign = $hxClasses["alphatab.platform.model.TextAlign"] = { __ename__ : ["alphatab","platform","model","TextAlign"], __constructs__ : ["Left","Center","Right"] }
alphatab.platform.model.TextAlign.Left = ["Left",0];
alphatab.platform.model.TextAlign.Left.toString = $estr;
alphatab.platform.model.TextAlign.Left.__enum__ = alphatab.platform.model.TextAlign;
alphatab.platform.model.TextAlign.Center = ["Center",1];
alphatab.platform.model.TextAlign.Center.toString = $estr;
alphatab.platform.model.TextAlign.Center.__enum__ = alphatab.platform.model.TextAlign;
alphatab.platform.model.TextAlign.Right = ["Right",2];
alphatab.platform.model.TextAlign.Right.toString = $estr;
alphatab.platform.model.TextAlign.Right.__enum__ = alphatab.platform.model.TextAlign;
if(!alphatab.platform.svg) alphatab.platform.svg = {}
alphatab.platform.svg.FontSizes = $hxClasses["alphatab.platform.svg.FontSizes"] = function() { }
alphatab.platform.svg.FontSizes.__name__ = ["alphatab","platform","svg","FontSizes"];
alphatab.platform.svg.FontSizes.measureString = function(s,f,size) {
	var data;
	var dataSize;
	if(f == alphatab.platform.svg.SupportedFonts.TimesNewRoman) {
		data = alphatab.platform.svg.FontSizes.TIMES_NEW_ROMAN_11PT;
		dataSize = 11;
	} else if(f == alphatab.platform.svg.SupportedFonts.Arial) {
		data = alphatab.platform.svg.FontSizes.ARIAL_11PT;
		dataSize = 11;
	} else {
		data = [8];
		dataSize = 11;
	}
	var stringSize = 0;
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var code = (Math.min(data.length - 1,HxOverrides.cca(s,i)) | 0) - alphatab.platform.svg.FontSizes.CONTROL_CHARS;
		if(code >= 0) {
			var charSize = data[code];
			stringSize += data[code] * size / dataSize | 0;
		}
	}
	return stringSize;
}
alphatab.platform.svg.SupportedFonts = $hxClasses["alphatab.platform.svg.SupportedFonts"] = { __ename__ : ["alphatab","platform","svg","SupportedFonts"], __constructs__ : ["TimesNewRoman","Arial"] }
alphatab.platform.svg.SupportedFonts.TimesNewRoman = ["TimesNewRoman",0];
alphatab.platform.svg.SupportedFonts.TimesNewRoman.toString = $estr;
alphatab.platform.svg.SupportedFonts.TimesNewRoman.__enum__ = alphatab.platform.svg.SupportedFonts;
alphatab.platform.svg.SupportedFonts.Arial = ["Arial",1];
alphatab.platform.svg.SupportedFonts.Arial.toString = $estr;
alphatab.platform.svg.SupportedFonts.Arial.__enum__ = alphatab.platform.svg.SupportedFonts;
alphatab.platform.svg.SvgCanvas = $hxClasses["alphatab.platform.svg.SvgCanvas"] = function() {
	this._buffer = new StringBuf();
	this._currentPath = new StringBuf();
	this._currentPathIsEmpty = true;
	this._color = new alphatab.platform.model.Color(255,255,255);
	this._lineWidth = 1;
	this._width = 0;
	this._height = 0;
	this._font = new alphatab.platform.model.Font("sans-serif",10);
	this._textAlign = alphatab.platform.model.TextAlign.Left;
};
alphatab.platform.svg.SvgCanvas.__name__ = ["alphatab","platform","svg","SvgCanvas"];
alphatab.platform.svg.SvgCanvas.__interfaces__ = [alphatab.platform.ICanvas];
alphatab.platform.svg.SvgCanvas.prototype = {
	measureText: function(text) {
		var font = alphatab.platform.svg.SupportedFonts.Arial;
		if(this._font.getFamily().indexOf("Times") >= 0) font = alphatab.platform.svg.SupportedFonts.TimesNewRoman;
		return alphatab.platform.svg.FontSizes.measureString(text,font,this._font.getSize());
	}
	,getSvgBaseLine: function() {
		return "top";
	}
	,getSvgTextAlignment: function() {
		switch( (this._textAlign)[1] ) {
		case 0:
			return "start";
		case 1:
			return "middle";
		case 2:
			return "end";
		default:
			return "start";
		}
	}
	,strokeText: function(text,x,y) {
		this._buffer.b += Std.string("<text x=\"");
		this._buffer.b += Std.string(x);
		this._buffer.b += Std.string("\" y=\"");
		this._buffer.b += Std.string(y);
		this._buffer.b += Std.string("\" style=\"font:");
		this._buffer.b += Std.string(this._font.toCssString());
		this._buffer.b += Std.string("\" stroke:");
		this._buffer.b += Std.string(this._color.toRgbaString());
		this._buffer.b += Std.string("; stroke-width:");
		this._buffer.b += Std.string(this._lineWidth);
		this._buffer.b += Std.string(";\" ");
		this._buffer.b += Std.string(" dominant-baseline=\"");
		this._buffer.b += Std.string("top");
		this._buffer.b += Std.string("\" text-anchor=\"");
		this._buffer.b += Std.string(this.getSvgTextAlignment());
		this._buffer.b += Std.string("\">\n");
		this._buffer.b += Std.string(text);
		this._buffer.b += Std.string("</text>\n");
	}
	,fillText: function(text,x,y) {
		this._buffer.b += Std.string("<text x=\"");
		this._buffer.b += Std.string(x);
		this._buffer.b += Std.string("\" y=\"");
		this._buffer.b += Std.string(y);
		this._buffer.b += Std.string("\" style=\"font:");
		this._buffer.b += Std.string(this._font.toCssString());
		this._buffer.b += Std.string("; fill:");
		this._buffer.b += Std.string(this._color.toRgbaString());
		this._buffer.b += Std.string(";\" ");
		this._buffer.b += Std.string(" dominant-baseline=\"");
		this._buffer.b += Std.string("top");
		this._buffer.b += Std.string("\" text-anchor=\"");
		this._buffer.b += Std.string(this.getSvgTextAlignment());
		this._buffer.b += Std.string("\">\n");
		this._buffer.b += Std.string(text);
		this._buffer.b += Std.string("</text>\n");
	}
	,setTextAlign: function(textAlign) {
		this._textAlign = textAlign;
	}
	,_textAlign: null
	,setFont: function(font) {
		this._font = font;
	}
	,_font: null
	,stroke: function() {
		var path = this._currentPath.b;
		if(!this._currentPathIsEmpty) {
			this._buffer.b += Std.string("<path d=\"");
			this._buffer.b += Std.string(this._currentPath.b);
			this._buffer.b += Std.string("\" style=\"stroke:");
			this._buffer.b += Std.string(this._color.toRgbaString());
			this._buffer.b += Std.string("; stroke-width:");
			this._buffer.b += Std.string(this._lineWidth);
			this._buffer.b += Std.string(";\" fill=\"none\" />\n");
		}
		this._currentPath = new StringBuf();
		this._currentPathIsEmpty = true;
	}
	,fill: function() {
		var path = this._currentPath.b;
		if(!this._currentPathIsEmpty) {
			this._buffer.b += Std.string("<path d=\"");
			this._buffer.b += Std.string(this._currentPath.b);
			this._buffer.b += Std.string("\" style=\"fill:");
			this._buffer.b += Std.string(this._color.toRgbaString());
			this._buffer.b += Std.string("\" stroke=\"none\"/>\n");
		}
		this._currentPath = new StringBuf();
		this._currentPathIsEmpty = true;
	}
	,rect: function(x,y,w,h) {
		this._currentPathIsEmpty = false;
		this._currentPath.b += Std.string(" M");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
		this._currentPath.b += Std.string(" L");
		this._currentPath.b += Std.string(x + w);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
		this._currentPath.b += Std.string(" ");
		this._currentPath.b += Std.string(x + w);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y + h);
		this._currentPath.b += Std.string(" ");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y + h);
		this._currentPath.b += Std.string(" z");
	}
	,circle: function(x,y,radius) {
		this._currentPathIsEmpty = false;
		this._currentPath.b += Std.string(" M");
		this._currentPath.b += Std.string(x - radius);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
		this._currentPath.b += Std.string(" A1,1 0 0,0 ");
		this._currentPath.b += Std.string(x + radius);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
		this._currentPath.b += Std.string(" A1,1 0 0,0 ");
		this._currentPath.b += Std.string(x - radius);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
		this._currentPath.b += Std.string(" z");
	}
	,bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y) {
		this._currentPathIsEmpty = false;
		this._currentPath.b += Std.string(" C");
		this._currentPath.b += Std.string(cp1x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(cp1y);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(cp2x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(cp2y);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
	}
	,quadraticCurveTo: function(cpx,cpy,x,y) {
		this._currentPathIsEmpty = false;
		this._currentPath.b += Std.string(" Q");
		this._currentPath.b += Std.string(cpx);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(cpy);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
	}
	,lineTo: function(x,y) {
		this._currentPathIsEmpty = false;
		this._currentPath.b += Std.string(" L");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
	}
	,moveTo: function(x,y) {
		this._currentPath.b += Std.string(" M");
		this._currentPath.b += Std.string(x);
		this._currentPath.b += Std.string(",");
		this._currentPath.b += Std.string(y);
	}
	,closePath: function() {
		this._currentPath.b += Std.string(" z");
	}
	,beginPath: function() {
	}
	,strokeRect: function(x,y,w,h) {
		this._buffer.b += Std.string("<rect x=\"");
		this._buffer.b += Std.string(x);
		this._buffer.b += Std.string("\" y=\"");
		this._buffer.b += Std.string(y);
		this._buffer.b += Std.string("\" width=\"");
		this._buffer.b += Std.string(w);
		this._buffer.b += Std.string("\" height=\"");
		this._buffer.b += Std.string(h);
		this._buffer.b += Std.string("\" style=\"stroke:");
		this._buffer.b += Std.string(this._color.toRgbaString());
		this._buffer.b += Std.string("; stroke-width:");
		this._buffer.b += Std.string(this._lineWidth);
		this._buffer.b += Std.string(";\" />\n");
	}
	,fillRect: function(x,y,w,h) {
		this._buffer.b += Std.string("<rect x=\"");
		this._buffer.b += Std.string(x);
		this._buffer.b += Std.string("\" y=\"");
		this._buffer.b += Std.string(y);
		this._buffer.b += Std.string("\" width=\"");
		this._buffer.b += Std.string(w);
		this._buffer.b += Std.string("\" height=\"");
		this._buffer.b += Std.string(h);
		this._buffer.b += Std.string("\" style=\"fill:");
		this._buffer.b += Std.string(this._color.toRgbaString());
		this._buffer.b += Std.string(";\" />\n");
	}
	,clear: function() {
		this._buffer = new StringBuf();
		this._currentPath = new StringBuf();
		this._currentPathIsEmpty = true;
	}
	,setLineWidth: function(value) {
		this._lineWidth = value;
	}
	,_lineWidth: null
	,setColor: function(color) {
		this._color = color;
	}
	,_color: null
	,setHeight: function(height) {
		this._height = height;
	}
	,setWidth: function(width) {
		this._width = width;
	}
	,getHeight: function() {
		return this._height;
	}
	,getWidth: function() {
		return this._width;
	}
	,toSvg: function(includeWrapper,className) {
		var out = new haxe.io.BytesOutput();
		this.writeTo(out,includeWrapper,className);
		out.flush();
		return out.getBytes().toString();
	}
	,writeTo: function(stream,includeWrapper,className) {
		if(includeWrapper) {
			stream.writeString("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"");
			alphatab.io.OutputExtensions.writeAsString(stream,this._width);
			stream.writeString("px\" height=\"");
			alphatab.io.OutputExtensions.writeAsString(stream,this._height);
			stream.writeString("px\"");
			if(className != null) {
				stream.writeString(" class=\"");
				stream.writeString(className);
				stream.writeString("\"");
			}
			stream.writeString(">\n");
		}
		stream.writeString(this._buffer.b);
		if(includeWrapper) stream.writeString("</svg>");
	}
	,_height: null
	,_width: null
	,_currentPathIsEmpty: null
	,_currentPath: null
	,_buffer: null
	,__class__: alphatab.platform.svg.SvgCanvas
}
if(!alphatab.rendering) alphatab.rendering = {}
alphatab.rendering.BarRendererBase = $hxClasses["alphatab.rendering.BarRendererBase"] = function(bar) {
	this._bar = bar;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.index = 0;
};
alphatab.rendering.BarRendererBase.__name__ = ["alphatab","rendering","BarRendererBase"];
alphatab.rendering.BarRendererBase.prototype = {
	paint: function(cx,cy,canvas) {
	}
	,doLayout: function() {
	}
	,getBottomPadding: function() {
		return 0;
	}
	,getTopPadding: function() {
		return 0;
	}
	,isLast: function() {
		return this._bar.index == this._bar.track.bars.length - 1;
	}
	,isLastOfLine: function() {
		return this.index == this.stave.barRenderers.length - 1;
	}
	,isFirstOfLine: function() {
		return this.index == 0;
	}
	,getResources: function() {
		return this.stave.staveGroup.layout.renderer.renderingResources;
	}
	,getLayout: function() {
		return this.stave.staveGroup.layout;
	}
	,getScale: function() {
		return this.stave.staveGroup.layout.renderer.scale;
	}
	,applyBarSpacing: function(spacing) {
	}
	,registerOverflowBottom: function(bottomOverflow) {
		if(bottomOverflow > this.bottomOverflow) this.bottomOverflow = bottomOverflow;
	}
	,registerOverflowTop: function(topOverflow) {
		if(topOverflow > this.topOverflow) this.topOverflow = topOverflow;
	}
	,_bar: null
	,bottomOverflow: null
	,topOverflow: null
	,index: null
	,height: null
	,width: null
	,y: null
	,x: null
	,stave: null
	,__class__: alphatab.rendering.BarRendererBase
}
alphatab.rendering.BarRendererFactory = $hxClasses["alphatab.rendering.BarRendererFactory"] = function() {
};
alphatab.rendering.BarRendererFactory.__name__ = ["alphatab","rendering","BarRendererFactory"];
alphatab.rendering.BarRendererFactory.prototype = {
	create: function(bar) {
		return null;
	}
	,__class__: alphatab.rendering.BarRendererFactory
}
alphatab.rendering.Glyph = $hxClasses["alphatab.rendering.Glyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
alphatab.rendering.Glyph.__name__ = ["alphatab","rendering","Glyph"];
alphatab.rendering.Glyph.prototype = {
	paint: function(cx,cy,canvas) {
	}
	,doLayout: function() {
	}
	,canScale: function() {
		return true;
	}
	,getScale: function() {
		return this.renderer.stave.staveGroup.layout.renderer.scale;
	}
	,applyGlyphSpacing: function(spacing) {
		if(this.canScale()) this.width += spacing;
	}
	,renderer: null
	,width: null
	,y: null
	,x: null
	,index: null
	,__class__: alphatab.rendering.Glyph
}
alphatab.rendering.GlyphBarRenderer = $hxClasses["alphatab.rendering.GlyphBarRenderer"] = function(bar) {
	alphatab.rendering.BarRendererBase.call(this,bar);
	this.glyphs = new Array();
	this.scaleGlyphs = new Array();
};
alphatab.rendering.GlyphBarRenderer.__name__ = ["alphatab","rendering","GlyphBarRenderer"];
alphatab.rendering.GlyphBarRenderer.__super__ = alphatab.rendering.BarRendererBase;
alphatab.rendering.GlyphBarRenderer.prototype = $extend(alphatab.rendering.BarRendererBase.prototype,{
	paintBackground: function(cx,cy,canvas) {
	}
	,paint: function(cx,cy,canvas) {
		this.paintBackground(cx,cy,canvas);
		var _g = 0, _g1 = this.glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.paint(cx + this.x,cy + this.y,canvas);
		}
	}
	,applyBarSpacing: function(spacing) {
		var oldWidth = this.width;
		this.width += spacing;
		var glyphSpacing = spacing / this.scaleGlyphs.length | 0;
		var _g1 = 0, _g = this.glyphs.length;
		while(_g1 < _g) {
			var i = _g1++;
			var g = this.glyphs[i];
			if(i == 0) g.x = 0; else g.x = this.glyphs[i - 1].x + this.glyphs[i - 1].width;
			if(g == this.scaleGlyphs[this.scaleGlyphs.length - 1]) g.applyGlyphSpacing(glyphSpacing + (spacing - glyphSpacing * this.scaleGlyphs.length)); else g.applyGlyphSpacing(glyphSpacing);
		}
	}
	,addGlyph: function(glyph,ignoreSize) {
		if(ignoreSize == null) ignoreSize = false;
		glyph.x = this.width + glyph.x;
		glyph.index = this.glyphs.length;
		glyph.renderer = this;
		glyph.doLayout();
		if(!ignoreSize && glyph.x + glyph.width > this.width) this.width = glyph.x + glyph.width;
		this.glyphs.push(glyph);
		if(!ignoreSize && glyph.canScale()) this.scaleGlyphs.push(glyph);
	}
	,createGlyphs: function() {
	}
	,doLayout: function() {
		this.createGlyphs();
	}
	,scaleGlyphs: null
	,glyphs: null
	,__class__: alphatab.rendering.GlyphBarRenderer
});
alphatab.rendering.RenderingResources = $hxClasses["alphatab.rendering.RenderingResources"] = function(scale) {
	this.init(scale);
};
alphatab.rendering.RenderingResources.__name__ = ["alphatab","rendering","RenderingResources"];
alphatab.rendering.RenderingResources.prototype = {
	init: function(scale) {
		var sansFont = "Arial";
		var serifFont = "Times New Roman";
		this.effectFont = new alphatab.platform.model.Font(serifFont,11 * scale,2);
		this.copyrightFont = new alphatab.platform.model.Font(sansFont,12 * scale,1);
		this.titleFont = new alphatab.platform.model.Font(serifFont,32 * scale);
		this.subTitleFont = new alphatab.platform.model.Font(serifFont,20 * scale);
		this.wordsFont = new alphatab.platform.model.Font(serifFont,15 * scale);
		this.tablatureFont = new alphatab.platform.model.Font(sansFont,12 * scale);
		this.staveLineColor = new alphatab.platform.model.Color(165,165,165);
		this.barSeperatorColor = new alphatab.platform.model.Color(34,34,17);
		this.barNumberFont = new alphatab.platform.model.Font(sansFont,11 * scale);
		this.barNumberColor = new alphatab.platform.model.Color(200,0,0);
		this.mainGlyphColor = new alphatab.platform.model.Color(0,0,0);
	}
	,mainGlyphColor: null
	,barNumberColor: null
	,barNumberFont: null
	,barSeperatorColor: null
	,staveLineColor: null
	,tablatureFont: null
	,effectFont: null
	,wordsFont: null
	,subTitleFont: null
	,titleFont: null
	,copyrightFont: null
	,__class__: alphatab.rendering.RenderingResources
}
alphatab.rendering.ScoreBarRenderer = $hxClasses["alphatab.rendering.ScoreBarRenderer"] = function(bar) {
	alphatab.rendering.GlyphBarRenderer.call(this,bar);
	this._accidentalHelper = new alphatab.rendering.utils.AccidentalHelper();
	this._beamHelpers = new Array();
};
alphatab.rendering.ScoreBarRenderer.__name__ = ["alphatab","rendering","ScoreBarRenderer"];
alphatab.rendering.ScoreBarRenderer.paintSingleBar = function(canvas,x1,y1,x2,y2,size) {
	canvas.beginPath();
	canvas.moveTo(x1,y1);
	canvas.lineTo(x2,y2);
	canvas.lineTo(x2,y2 - size);
	canvas.lineTo(x1,y1 - size);
	canvas.closePath();
	canvas.fill();
}
alphatab.rendering.ScoreBarRenderer.__super__ = alphatab.rendering.GlyphBarRenderer;
alphatab.rendering.ScoreBarRenderer.prototype = $extend(alphatab.rendering.GlyphBarRenderer.prototype,{
	paintBackground: function(cx,cy,canvas) {
		var res = this.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.staveLineColor);
		var lineY = cy + this.y + this.getGlyphOverflow();
		var startY = lineY;
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			if(i > 0) lineY += 9 * this.stave.staveGroup.layout.renderer.scale | 0;
			canvas.beginPath();
			canvas.moveTo(cx + this.x,lineY);
			canvas.lineTo(cx + this.x + this.width,lineY);
			canvas.stroke();
		}
	}
	,getGlyphOverflow: function() {
		var res = this.stave.staveGroup.layout.renderer.renderingResources;
		return res.tablatureFont.getSize() / 2 + res.tablatureFont.getSize() * 0.2 | 0;
	}
	,getScoreY: function(steps,correction) {
		if(correction == null) correction = 0;
		return 9 * this.stave.staveGroup.layout.renderer.scale / 2 * steps + correction * this.stave.staveGroup.layout.renderer.scale | 0;
	}
	,getNoteLine: function(n) {
		var ks = n.beat.voice.bar.getMasterBar().keySignature;
		var clef = n.beat.voice.bar.clef;
		var value = n.realValue();
		var index = value % 12;
		var octave = value / 12 | 0;
		var steps = alphatab.rendering.ScoreBarRenderer.OCTAVE_STEPS[alphatab.model.ModelUtils.getClefIndex(clef)];
		steps -= octave * 7;
		steps -= ks > 0 || ks == 0?alphatab.rendering.ScoreBarRenderer.SHARP_NOTE_STEPS[index]:alphatab.rendering.ScoreBarRenderer.FLAT_NOTE_STEPS[index];
		return steps + 1;
	}
	,createAccidentalGlyph: function(n,accidentals) {
		var noteLine = this.getNoteLine(n);
		var accidental = this._accidentalHelper.applyAccidental(n,noteLine);
		switch( (accidental)[1] ) {
		case 2:
			accidentals.addGlyph(new alphatab.rendering.glyphs.SharpGlyph(0,this.getScoreY(noteLine - 1,-1)));
			break;
		case 3:
			accidentals.addGlyph(new alphatab.rendering.glyphs.FlatGlyph(0,this.getScoreY(noteLine - 1,-8)));
			break;
		case 1:
			accidentals.addGlyph(new alphatab.rendering.glyphs.NaturalizeGlyph(0,this.getScoreY(noteLine - 1,-2)));
			break;
		default:
		}
	}
	,createNoteGlyph: function(n,noteglyphs) {
		var noteHeadGlyph;
		if(n.harmonicType == alphatab.model.HarmonicType.None) noteHeadGlyph = new alphatab.rendering.glyphs.NoteHeadGlyph(null,null,n.beat.duration); else noteHeadGlyph = new alphatab.rendering.glyphs.DiamondNoteHeadGlyph();
		var line = this.getNoteLine(n);
		noteHeadGlyph.y = this.getScoreY(line,-1);
		noteglyphs.addNoteGlyph(noteHeadGlyph,line);
		if(n.isStaccato && !noteglyphs.beatEffects.exists("STACCATO")) noteglyphs.beatEffects.set("STACCATO",new alphatab.rendering.glyphs.CircleGlyph(0,0,1.5));
		if(n.accentuated == alphatab.model.AccentuationType.Normal && !noteglyphs.beatEffects.exists("ACCENT")) noteglyphs.beatEffects.set("ACCENT",new alphatab.rendering.glyphs.AccentuationGlyph(0,0,alphatab.model.AccentuationType.Normal));
		if(n.accentuated == alphatab.model.AccentuationType.Heavy && !noteglyphs.beatEffects.exists("HACCENT")) noteglyphs.beatEffects.set("HACCENT",new alphatab.rendering.glyphs.AccentuationGlyph(0,0,alphatab.model.AccentuationType.Heavy));
	}
	,getBeatDurationWidth: function(d) {
		switch( (d)[1] ) {
		case 0:
			return 82;
		case 1:
			return 56;
		case 2:
			return 36;
		case 3:
			return 24;
		case 4:
			return 14;
		case 5:
			return 14;
		case 6:
			return 14;
		default:
			return 0;
		}
	}
	,createRestGlyph: function(b) {
		var line = 0;
		var correction = 0;
		switch( (b.duration)[1] ) {
		case 0:
			line = 2;
			correction = 8;
			break;
		case 1:
			line = 4;
			correction = 3;
			break;
		case 2:
			line = 3;
			break;
		case 3:
			line = 4;
			correction - 2;
			break;
		case 4:
			line = 2;
			correction - 2;
			break;
		case 5:
			line = 2;
			correction - 2;
			break;
		case 6:
			line = 0;
			correction - 2;
			break;
		}
		var y = this.getScoreY(line,correction);
		this.addGlyph(new alphatab.rendering.glyphs.RestGlyph(0,y,b.duration));
	}
	,createBeatDot: function(n,group) {
		group.addGlyph(new alphatab.rendering.glyphs.CircleGlyph(0,this.getScoreY(this.getNoteLine(n),2 * this.stave.staveGroup.layout.renderer.scale | 0),1.5 * this.stave.staveGroup.layout.renderer.scale));
	}
	,createBeatGlyphs: function(b) {
		var _g = this;
		if(!b.isRest()) {
			var noteLoop = function(action) {
				var i = b.notes.length - 1;
				while(i >= 0) action(b.notes[i--]);
			};
			var accidentals = new alphatab.rendering.glyphs.AccidentalGroupGlyph(0,0);
			noteLoop(function(n) {
				_g.createAccidentalGlyph(n,accidentals);
			});
			this.addGlyph(accidentals);
			var noteglyphs = new alphatab.rendering.glyphs.NoteChordGlyph();
			noteglyphs.beat = b;
			noteglyphs.beamingHelper = this._currentBeamHelper;
			noteLoop(function(n) {
				_g.createNoteGlyph(n,noteglyphs);
			});
			this.addGlyph(noteglyphs);
			noteglyphs.updateBeamingHelper();
			var _g1 = 0, _g2 = b.dots;
			while(_g1 < _g2) {
				var i = _g1++;
				var group = [new alphatab.rendering.glyphs.GlyphGroup()];
				noteLoop((function(group) {
					return function(n) {
						_g.createBeatDot(n,group[0]);
					};
				})(group));
				this.addGlyph(group[0]);
			}
		} else this.createRestGlyph(b);
		this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,this.getBeatDurationWidth(b.duration) * this.stave.staveGroup.layout.renderer.scale | 0));
	}
	,applyBarSpacing: function(spacing) {
		alphatab.rendering.GlyphBarRenderer.prototype.applyBarSpacing.call(this,spacing);
	}
	,createVoiceGlyphs: function(v) {
		var _g = 0, _g1 = v.beats;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			if(!b.isRest()) {
				if(this._currentBeamHelper == null || !this._currentBeamHelper.checkBeat(b)) {
					this._currentBeamHelper = new alphatab.rendering.utils.BeamingHelper();
					this._currentBeamHelper.checkBeat(b);
					this._beamHelpers.push(this._currentBeamHelper);
				}
			}
			this.createBeatGlyphs(b);
		}
		this._currentBeamHelper = null;
	}
	,createTimeSignatureGlyphs: function() {
		this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,5 * this.stave.staveGroup.layout.renderer.scale | 0,false));
		this.addGlyph(new alphatab.rendering.glyphs.TimeSignatureGlyph(0,0,this._bar.getMasterBar().timeSignatureNumerator,this._bar.getMasterBar().timeSignatureDenominator));
	}
	,createKeySignatureGlyphs: function() {
		var offsetClef = 0;
		var currentKey = this._bar.getMasterBar().keySignature;
		var previousKey = this._bar.previousBar == null?0:this._bar.previousBar.getMasterBar().keySignature;
		switch( (this._bar.clef)[1] ) {
		case 3:
			offsetClef = 0;
			break;
		case 2:
			offsetClef = 2;
			break;
		case 0:
			offsetClef = -1;
			break;
		case 1:
			offsetClef = 1;
			break;
		}
		var naturalizeSymbols = Math.abs(previousKey) | 0;
		var previousKeyPositions = previousKey > 0?alphatab.rendering.ScoreBarRenderer.SHARP_KS_STEPS:alphatab.rendering.ScoreBarRenderer.FLAT_KS_STEPS;
		var _g = 0;
		while(_g < naturalizeSymbols) {
			var i = _g++;
			this.addGlyph(new alphatab.rendering.glyphs.NaturalizeGlyph(0,this.getScoreY(previousKeyPositions[i] + offsetClef,-2) | 0));
		}
		var offsetSymbols = currentKey <= 7?currentKey:currentKey - 7;
		if(currentKey > 0) {
			var _g1 = 0, _g = Math.abs(currentKey) | 0;
			while(_g1 < _g) {
				var i = _g1++;
				this.addGlyph(new alphatab.rendering.glyphs.SharpGlyph(0,this.getScoreY(alphatab.rendering.ScoreBarRenderer.SHARP_KS_STEPS[i] + offsetClef,-1) | 0));
			}
		} else {
			var _g1 = 0, _g = Math.abs(currentKey) | 0;
			while(_g1 < _g) {
				var i = _g1++;
				this.addGlyph(new alphatab.rendering.glyphs.FlatGlyph(0,this.getScoreY(alphatab.rendering.ScoreBarRenderer.FLAT_KS_STEPS[i] + offsetClef,-8) | 0));
			}
		}
	}
	,createStartGlyphs: function() {
		if(this.index == 0 || this._bar.clef != this._bar.previousBar.clef) {
			var offset = 0;
			switch( (this._bar.clef)[1] ) {
			case 2:
				offset = 1;
				break;
			case 0:
				offset = 6;
				break;
			case 1:
				offset = 4;
				break;
			case 3:
				offset = 5;
				break;
			default:
				offset = 0;
			}
			this.createStartSpacing();
			this.addGlyph(new alphatab.rendering.glyphs.ClefGlyph(0,this.getScoreY(offset),this._bar.clef));
		}
		if(this._bar.previousBar == null && this._bar.getMasterBar().keySignature != 0 || this._bar.previousBar != null && this._bar.getMasterBar().keySignature != this._bar.previousBar.getMasterBar().keySignature) {
			this.createStartSpacing();
			this.createKeySignatureGlyphs();
		}
		if(this._bar.previousBar == null || this._bar.previousBar != null && this._bar.getMasterBar().timeSignatureNumerator != this._bar.previousBar.getMasterBar().timeSignatureNumerator || this._bar.previousBar != null && this._bar.getMasterBar().timeSignatureDenominator != this._bar.previousBar.getMasterBar().timeSignatureDenominator) {
			this.createStartSpacing();
			this.createTimeSignatureGlyphs();
		}
		if(this.stave.index == 0) this.addGlyph(new alphatab.rendering.glyphs.BarNumberGlyph(0,this.getScoreY(-1,-3),this._bar.index + 1)); else this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,8 * this.stave.staveGroup.layout.renderer.scale | 0,false));
	}
	,createBarEndGlyphs: function() {
		if(this._bar.getMasterBar().repeatCount > 0) {
			this.addGlyph(new alphatab.rendering.glyphs.RepeatCloseGlyph(this.x,0));
			if(this._bar.getMasterBar().repeatCount > 1) {
				var line = this._bar.index == this._bar.track.bars.length - 1 || this.index == this.stave.barRenderers.length - 1?-1:-4;
				this.addGlyph(new alphatab.rendering.glyphs.RepeatCountGlyph(0,this.getScoreY(line,-3),this._bar.getMasterBar().repeatCount + 1));
			}
		} else if(this._bar.getMasterBar().isDoubleBar) {
			this.addGlyph(new alphatab.rendering.glyphs.BarSeperatorGlyph());
			this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,3 * this.stave.staveGroup.layout.renderer.scale | 0,false));
			this.addGlyph(new alphatab.rendering.glyphs.BarSeperatorGlyph());
		} else if(this._bar.nextBar == null || !this._bar.nextBar.getMasterBar().isRepeatStart) this.addGlyph(new alphatab.rendering.glyphs.BarSeperatorGlyph(0,0,this._bar.index == this._bar.track.bars.length - 1));
	}
	,createBarStartGlyphs: function() {
		if(this._bar.getMasterBar().isRepeatStart) this.addGlyph(new alphatab.rendering.glyphs.RepeatOpenGlyph());
	}
	,createStartSpacing: function() {
		if(this._startSpacing) return;
		this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,2 * this.stave.staveGroup.layout.renderer.scale | 0,false));
		this._startSpacing = true;
	}
	,_startSpacing: null
	,createGlyphs: function() {
		this.createBarStartGlyphs();
		this.createStartGlyphs();
		if(this._bar.isEmpty()) this.addGlyph(new alphatab.rendering.glyphs.SpacingGlyph(0,0,30 * this.stave.staveGroup.layout.renderer.scale | 0,false));
		this.createVoiceGlyphs(this._bar.voices[0]);
		this.createBarEndGlyphs();
	}
	,paintFooter: function(cx,cy,canvas,h) {
		var beat = h.beats[0];
		var stemSize = this.getStemSize(h.maxDuration);
		var correction = 4;
		var beatLineX = h.getBeatLineX(beat) + this.stave.staveGroup.layout.renderer.scale | 0;
		var direction = h.getDirection();
		var topY = this.getScoreY(this.getNoteLine(beat.maxNote),correction - 1);
		var bottomY = this.getScoreY(this.getNoteLine(beat.minNote),correction - 1);
		var beamY;
		if(direction == alphatab.rendering.utils.BeamDirection.Down) {
			bottomY += stemSize;
			beamY = bottomY + 3 * this.stave.staveGroup.layout.renderer.scale | 0;
		} else {
			topY -= stemSize;
			beamY = topY - 6 * this.stave.staveGroup.layout.renderer.scale | 0;
		}
		canvas.setColor(this.stave.staveGroup.layout.renderer.renderingResources.mainGlyphColor);
		canvas.beginPath();
		canvas.moveTo(cx + this.x + beatLineX | 0,cy + this.y + topY);
		canvas.lineTo(cx + this.x + beatLineX | 0,cy + this.y + bottomY);
		canvas.stroke();
		var gx = beatLineX - this.stave.staveGroup.layout.renderer.scale | 0;
		var glyph = new alphatab.rendering.glyphs.BeamGlyph(gx,beamY,beat.duration,direction);
		glyph.renderer = this;
		glyph.doLayout();
		glyph.paint(cx + this.x,cy + this.y,canvas);
	}
	,isFullBarJoin: function(a,b,barIndex) {
		return alphatab.model.ModelUtils.getDurationIndex(a.duration) - 2 - barIndex > 0 && alphatab.model.ModelUtils.getDurationIndex(b.duration) - 2 - barIndex > 0;
	}
	,paintBar: function(cx,cy,canvas,h) {
		var _g1 = 0, _g = h.beats.length;
		while(_g1 < _g) {
			var i = _g1++;
			var beat = h.beats[i];
			var correction = 4;
			var beatLineX = h.getBeatLineX(beat) + this.stave.staveGroup.layout.renderer.scale | 0;
			var direction = h.getDirection();
			var y1 = cy + this.y + (direction == alphatab.rendering.utils.BeamDirection.Up?this.getScoreY(this.getNoteLine(beat.minNote),correction - 1):this.getScoreY(this.getNoteLine(beat.maxNote),correction - 1));
			var y2 = cy + this.y + this.calculateBeamY(h,beatLineX);
			canvas.setColor(this.stave.staveGroup.layout.renderer.renderingResources.mainGlyphColor);
			canvas.beginPath();
			canvas.moveTo(cx + this.x + beatLineX | 0,y1);
			canvas.lineTo(cx + this.x + beatLineX | 0,y2);
			canvas.stroke();
			var brokenBarOffset = 6 * this.stave.staveGroup.layout.renderer.scale | 0;
			var barSpacing = 6 * this.stave.staveGroup.layout.renderer.scale | 0;
			var barSize = 3 * this.stave.staveGroup.layout.renderer.scale | 0;
			var barCount = alphatab.model.ModelUtils.getDurationIndex(beat.duration) - 2;
			var barStart = cy + this.y;
			if(direction == alphatab.rendering.utils.BeamDirection.Down) barSpacing = -barSpacing;
			var _g2 = 0;
			while(_g2 < barCount) {
				var barIndex = _g2++;
				var barStartX;
				var barEndX;
				var barStartY;
				var barEndY;
				var barY = barStart + barIndex * barSpacing;
				if(i < h.beats.length - 1) {
					if(this.isFullBarJoin(beat,h.beats[i + 1],barIndex)) {
						barStartX = beatLineX;
						barEndX = h.getBeatLineX(h.beats[i + 1]) + this.stave.staveGroup.layout.renderer.scale | 0;
					} else if(i == 0 || !this.isFullBarJoin(h.beats[i - 1],beat,barIndex)) {
						barStartX = beatLineX;
						barEndX = barStartX + brokenBarOffset;
					} else continue;
					barStartY = barY + this.calculateBeamY(h,barStartX) | 0;
					barEndY = barY + this.calculateBeamY(h,barEndX) | 0;
					alphatab.rendering.ScoreBarRenderer.paintSingleBar(canvas,cx + this.x + barStartX,barStartY,cx + this.x + barEndX,barEndY,barSize);
				} else if(i > 0 && !this.isFullBarJoin(beat,h.beats[i - 1],barIndex)) {
					barStartX = beatLineX - brokenBarOffset;
					barEndX = beatLineX;
					barStartY = barY + this.calculateBeamY(h,barStartX) | 0;
					barEndY = barY + this.calculateBeamY(h,barEndX) | 0;
					alphatab.rendering.ScoreBarRenderer.paintSingleBar(canvas,cx + this.x + barStartX,barStartY,cx + this.x + barEndX,barEndY,barSize);
				}
			}
		}
	}
	,calculateBeamY: function(h,x) {
		var _g = this;
		var correction = 4;
		var stemSize = this.getStemSize(h.maxDuration);
		return h.calculateBeamY(stemSize,this.stave.staveGroup.layout.renderer.scale | 0,x,this.stave.staveGroup.layout.renderer.scale,function(n) {
			return _g.getScoreY(_g.getNoteLine(n),correction - 1);
		});
	}
	,getStemSize: function(duration) {
		var size;
		switch( (duration)[1] ) {
		case 1:
			size = 6;
			break;
		case 2:
			size = 6;
			break;
		case 3:
			size = 6;
			break;
		case 4:
			size = 6;
			break;
		case 5:
			size = 7;
			break;
		case 6:
			size = 8;
			break;
		default:
			size = 0;
		}
		return this.getScoreY(size);
	}
	,paintBeamHelper: function(cx,cy,canvas,h) {
		if(h.beats.length == 1) this.paintFooter(cx,cy,canvas,h); else this.paintBar(cx,cy,canvas,h);
	}
	,paintBeams: function(cx,cy,canvas) {
		var _g = 0, _g1 = this._beamHelpers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			this.paintBeamHelper(cx,cy,canvas,h);
		}
	}
	,paint: function(cx,cy,canvas) {
		alphatab.rendering.GlyphBarRenderer.prototype.paint.call(this,cx,cy,canvas);
		this.paintBeams(cx,cy,canvas);
	}
	,doLayout: function() {
		alphatab.rendering.GlyphBarRenderer.prototype.doLayout.call(this);
		this.height = (9 * this.stave.staveGroup.layout.renderer.scale * 4 | 0) + this.getTopPadding() + this.getBottomPadding();
		if(this.index == 0) {
			this.stave.registerStaveTop(this.getGlyphOverflow());
			this.stave.registerStaveBottom(this.getGlyphOverflow());
		}
		var top = this.getScoreY(0);
		var bottom = this.getScoreY(8);
		var _g = 0, _g1 = this._beamHelpers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			var maxNoteY = this.getScoreY(this.getNoteLine(h.maxNote));
			if(h.getDirection() == alphatab.rendering.utils.BeamDirection.Up) maxNoteY -= this.getStemSize(h.maxDuration);
			if(maxNoteY < top) this.registerOverflowTop(Math.abs(maxNoteY) | 0);
			var minNoteY = this.getScoreY(this.getNoteLine(h.minNote));
			if(h.getDirection() == alphatab.rendering.utils.BeamDirection.Down) minNoteY += this.getStemSize(h.maxDuration);
			if(minNoteY > bottom) this.registerOverflowBottom((Math.abs(minNoteY) | 0) - bottom);
		}
	}
	,getLineOffset: function() {
		return 9 * this.stave.staveGroup.layout.renderer.scale;
	}
	,getBottomPadding: function() {
		return this.getGlyphOverflow();
	}
	,getTopPadding: function() {
		return this.getGlyphOverflow();
	}
	,_currentBeamHelper: null
	,_beamHelpers: null
	,_accidentalHelper: null
	,__class__: alphatab.rendering.ScoreBarRenderer
});
alphatab.rendering.ScoreBarRendererFactory = $hxClasses["alphatab.rendering.ScoreBarRendererFactory"] = function() {
	alphatab.rendering.BarRendererFactory.call(this);
};
alphatab.rendering.ScoreBarRendererFactory.__name__ = ["alphatab","rendering","ScoreBarRendererFactory"];
alphatab.rendering.ScoreBarRendererFactory.__super__ = alphatab.rendering.BarRendererFactory;
alphatab.rendering.ScoreBarRendererFactory.prototype = $extend(alphatab.rendering.BarRendererFactory.prototype,{
	create: function(bar) {
		return new alphatab.rendering.ScoreBarRenderer(bar);
	}
	,__class__: alphatab.rendering.ScoreBarRendererFactory
});
alphatab.rendering.ScoreRenderer = $hxClasses["alphatab.rendering.ScoreRenderer"] = function(source) {
	this.canvas = alphatab.platform.PlatformFactory.getCanvas(source);
	this.settings = new Hash();
	this.updateScale(1.0);
	this.layout = new alphatab.rendering.layout.PageViewLayout(this);
};
alphatab.rendering.ScoreRenderer.__name__ = ["alphatab","rendering","ScoreRenderer"];
alphatab.rendering.ScoreRenderer.prototype = {
	getLayoutSetting: function(setting,defaultValue) {
		var value = this.settings.get("layout." + setting);
		return value != null?value:defaultValue;
	}
	,setLayoutSetting: function(setting,value) {
		this.settings.set("layout." + setting,value);
	}
	,getStaveSetting: function(staveId,setting,defaultValue) {
		var value = this.settings.get(staveId + "." + setting);
		return value != null?value:defaultValue;
	}
	,setStaveSetting: function(staveId,setting,value) {
		this.settings.set(staveId + "." + setting,value);
	}
	,paintBackground: function() {
		var msg = "Rendered using alphaTab (http://www.alphaTab.net)";
		this.canvas.setColor(new alphatab.platform.model.Color(62,62,62));
		this.canvas.setFont(this.renderingResources.copyrightFont);
		this.canvas.setTextAlign(alphatab.platform.model.TextAlign.Center);
		var x = this.canvas.getWidth() / 2;
		this.canvas.fillText(msg,x,this.canvas.getHeight() - this.renderingResources.copyrightFont.getSize() * 2);
	}
	,paintScore: function() {
		this.paintBackground();
		this.layout.paintScore();
	}
	,doLayout: function() {
		this.layout.doLayout();
		this.canvas.setHeight(this.layout.height + this.renderingResources.copyrightFont.getSize() * 2 | 0);
		this.canvas.setWidth(this.layout.width);
	}
	,getScore: function() {
		if(this.track == null) return null;
		return this.track.score;
	}
	,invalidate: function() {
		this.canvas.clear();
		this.doLayout();
		this.paintScore();
	}
	,render: function(track) {
		this.track = track;
		this.invalidate();
	}
	,updateScale: function(scale) {
		this.scale = scale;
		this.renderingResources = new alphatab.rendering.RenderingResources(scale);
		this.canvas.setLineWidth(scale);
	}
	,settings: null
	,renderingResources: null
	,layout: null
	,scale: null
	,track: null
	,score: null
	,canvas: null
	,__class__: alphatab.rendering.ScoreRenderer
	,__properties__: {get_score:"getScore"}
}
alphatab.rendering.TabBarRenderer = $hxClasses["alphatab.rendering.TabBarRenderer"] = function(bar) {
	alphatab.rendering.GlyphBarRenderer.call(this,bar);
};
alphatab.rendering.TabBarRenderer.__name__ = ["alphatab","rendering","TabBarRenderer"];
alphatab.rendering.TabBarRenderer.__super__ = alphatab.rendering.GlyphBarRenderer;
alphatab.rendering.TabBarRenderer.prototype = $extend(alphatab.rendering.GlyphBarRenderer.prototype,{
	paintBackground: function(cx,cy,canvas) {
		var res = this.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.staveLineColor);
		var lineY = cy + this.y + this.getNumberOverflow();
		var startY = lineY;
		var _g1 = 0, _g = this._bar.track.tuning.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i > 0) lineY += 11 * this.stave.staveGroup.layout.renderer.scale | 0;
			canvas.beginPath();
			canvas.moveTo(cx + this.x,lineY);
			canvas.lineTo(cx + this.x + this.width,lineY);
			canvas.stroke();
		}
		canvas.setColor(res.barSeperatorColor);
		canvas.beginPath();
		canvas.moveTo(cx + this.x + this.width,startY);
		canvas.lineTo(cx + this.x + this.width,lineY);
		canvas.stroke();
	}
	,getNumberOverflow: function() {
		var res = this.stave.staveGroup.layout.renderer.renderingResources;
		return res.tablatureFont.getSize() / 2 + res.tablatureFont.getSize() * 0.2 | 0;
	}
	,createGlyphs: function() {
		alphatab.rendering.GlyphBarRenderer.prototype.createGlyphs.call(this);
		this.addGlyph(new alphatab.rendering.glyphs.DummyTablatureGlyph(0,0));
		this.addGlyph(new alphatab.rendering.glyphs.DummyTablatureGlyph(0,0));
		this.addGlyph(new alphatab.rendering.glyphs.DummyTablatureGlyph(0,0));
	}
	,doLayout: function() {
		alphatab.rendering.GlyphBarRenderer.prototype.doLayout.call(this);
		this.height = (11 * this.stave.staveGroup.layout.renderer.scale * (this._bar.track.tuning.length - 1) | 0) + this.getNumberOverflow() * 2;
		if(this.index == 0) {
			this.stave.registerStaveTop(this.getNumberOverflow());
			this.stave.registerStaveBottom(this.height - this.getNumberOverflow());
		}
	}
	,getLineOffset: function() {
		return 11 * this.stave.staveGroup.layout.renderer.scale;
	}
	,__class__: alphatab.rendering.TabBarRenderer
});
alphatab.rendering.TabBarRendererFactory = $hxClasses["alphatab.rendering.TabBarRendererFactory"] = function() {
	alphatab.rendering.BarRendererFactory.call(this);
};
alphatab.rendering.TabBarRendererFactory.__name__ = ["alphatab","rendering","TabBarRendererFactory"];
alphatab.rendering.TabBarRendererFactory.__super__ = alphatab.rendering.BarRendererFactory;
alphatab.rendering.TabBarRendererFactory.prototype = $extend(alphatab.rendering.BarRendererFactory.prototype,{
	create: function(bar) {
		return new alphatab.rendering.TabBarRenderer(bar);
	}
	,__class__: alphatab.rendering.TabBarRendererFactory
});
if(!alphatab.rendering.glyphs) alphatab.rendering.glyphs = {}
alphatab.rendering.glyphs.SvgGlyph = $hxClasses["alphatab.rendering.glyphs.SvgGlyph"] = function(x,y,svg,xScale,yScale) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._svg = svg;
	this._xGlyphScale = xScale;
	this._yGlyphScale = yScale;
};
alphatab.rendering.glyphs.SvgGlyph.__name__ = ["alphatab","rendering","glyphs","SvgGlyph"];
alphatab.rendering.glyphs.SvgGlyph.isNumber = function(s,allowSign) {
	if(allowSign == null) allowSign = true;
	if(s.length == 0) return false;
	var c = HxOverrides.cca(s,0);
	return allowSign && c == 45 || c >= 48 && c <= 57;
}
alphatab.rendering.glyphs.SvgGlyph.isWhiteSpace = function(s) {
	if(s.length == 0) return false;
	var c = s.charAt(0);
	return c == " " || c == "\t" || c == "\r" || c == "\n";
}
alphatab.rendering.glyphs.SvgGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.SvgGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	peekChar: function() {
		if(this._currentIndex >= this._svg.length) return "";
		return this._svg.charAt(this._currentIndex);
	}
	,nextChar: function() {
		if(this._currentIndex >= this._svg.length) return "";
		return this._svg.charAt(this._currentIndex++);
	}
	,nextToken: function() {
		var token = new StringBuf();
		var c;
		do c = this.nextChar(); while(!(this._currentIndex >= this._svg.length) && (alphatab.rendering.glyphs.SvgGlyph.isWhiteSpace(c) || c == ","));
		if(!(this._currentIndex >= this._svg.length)) {
			token.b += Std.string(c);
			if(alphatab.rendering.glyphs.SvgGlyph.isNumber(c)) {
				c = this.peekChar();
				while(!(this._currentIndex >= this._svg.length) && (alphatab.rendering.glyphs.SvgGlyph.isNumber(c,false) || c == ".")) {
					token.b += Std.string(this.nextChar());
					c = this.peekChar();
				}
			}
		}
		this._currentToken = token.b;
	}
	,eof: function() {
		return this._currentIndex >= this._svg.length;
	}
	,getNumber: function() {
		return Std.parseFloat(this.getString());
	}
	,getString: function() {
		var t = this._currentToken;
		this.nextToken();
		return t;
	}
	,currentTokenIsNumber: function() {
		return alphatab.rendering.glyphs.SvgGlyph.isNumber(this._currentToken);
	}
	,parseCommand: function(cx,cy,canvas) {
		var command = this.getString();
		var canContinue;
		switch(command) {
		case "M":
			this._currentX = cx + this.getNumber() * this._xScale;
			this._currentY = cy + this.getNumber() * this._yScale;
			canvas.moveTo(this._currentX,this._currentY);
			break;
		case "m":
			this._currentX += this.getNumber() * this._xScale;
			this._currentY += this.getNumber() * this._yScale;
			canvas.moveTo(this._currentX,this._currentY);
			break;
		case "Z":case "z":
			canvas.closePath();
			break;
		case "L":
			do {
				this._currentX = cx + this.getNumber() * this._xScale;
				this._currentY = cy + this.getNumber() * this._yScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "l":
			do {
				this._currentX += this.getNumber() * this._xScale;
				this._currentY += this.getNumber() * this._yScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "V":
			do {
				this._currentY = cy + this.getNumber() * this._yScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "v":
			do {
				this._currentY += this.getNumber() * this._yScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "H":
			do {
				this._currentX = cx + this.getNumber() * this._xScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "h":
			do {
				this._currentX += this.getNumber() * this._xScale;
				canvas.lineTo(this._currentX,this._currentY);
			} while(this.currentTokenIsNumber());
			break;
		case "C":
			do {
				var x1 = cx + this.getNumber() * this._xScale;
				var y1 = cy + this.getNumber() * this._yScale;
				var x2 = cx + this.getNumber() * this._xScale;
				var y2 = cy + this.getNumber() * this._yScale;
				var x3 = cx + this.getNumber() * this._xScale;
				var y3 = cy + this.getNumber() * this._yScale;
				this._lastControlX = x2;
				this._lastControlY = y2;
				this._currentX = x3;
				this._currentY = y3;
				canvas.bezierCurveTo(x1,y1,x2,y2,x3,y3);
			} while(this.currentTokenIsNumber());
			break;
		case "c":
			do {
				var x1 = this._currentX + this.getNumber() * this._xScale;
				var y1 = this._currentY + this.getNumber() * this._yScale;
				var x2 = this._currentX + this.getNumber() * this._xScale;
				var y2 = this._currentY + this.getNumber() * this._yScale;
				var x3 = this._currentX + this.getNumber() * this._xScale;
				var y3 = this._currentY + this.getNumber() * this._yScale;
				this._lastControlX = x2;
				this._lastControlY = y2;
				this._currentX = x3;
				this._currentY = y3;
				canvas.bezierCurveTo(x1,y1,x2,y2,x3,y3);
			} while(this.currentTokenIsNumber());
			break;
		case "S":
			do {
				var x1 = cx + this.getNumber() * this._xScale;
				var y1 = cy + this.getNumber() * this._yScale;
				canContinue = this._lastCommand == "c" || this._lastCommand == "C" || this._lastCommand == "S" || this._lastCommand == "s";
				var x2 = canContinue?this._currentX + (this._currentX - this._lastControlX):this._currentX;
				var y2 = canContinue?this._currentY + (this._currentY - this._lastControlY):this._currentY;
				var x3 = cx + this.getNumber() * this._xScale;
				var y3 = cy + this.getNumber() * this._yScale;
				this._lastControlX = x2;
				this._lastControlY = y2;
				this._currentX = x3;
				this._currentY = y3;
				canvas.bezierCurveTo(x1,y1,x2,y2,x3,y3);
			} while(this.currentTokenIsNumber());
			break;
		case "s":
			do {
				var x1 = this._currentX + this.getNumber() * this._xScale;
				var y1 = this._currentY + this.getNumber() * this._yScale;
				canContinue = this._lastCommand == "c" || this._lastCommand == "C" || this._lastCommand == "S" || this._lastCommand == "s";
				var x2 = canContinue?this._currentX + (this._currentX - this._lastControlX):this._currentX;
				var y2 = canContinue?this._currentY + (this._currentY - this._lastControlY):this._currentY;
				var x3 = this._currentX + this.getNumber() * this._xScale;
				var y3 = this._currentY + this.getNumber() * this._yScale;
				this._lastControlX = x2;
				this._lastControlY = y2;
				this._currentX = x3;
				this._currentY = y3;
				canvas.bezierCurveTo(x1,y1,x2,y2,x3,y3);
			} while(this.currentTokenIsNumber());
			break;
		case "Q":
			do {
				var x1 = cx + this.getNumber() * this._xScale;
				var y1 = cy + this.getNumber() * this._yScale;
				var x2 = cx + this.getNumber() * this._xScale;
				var y2 = cy + this.getNumber() * this._yScale;
				this._lastControlX = x1;
				this._lastControlY = y1;
				this._currentX = x2;
				this._currentY = y2;
				canvas.quadraticCurveTo(x1,y1,x2,y2);
			} while(this.currentTokenIsNumber());
			break;
		case "q":
			do {
				var x1 = this._currentX + this.getNumber() * this._xScale;
				var y1 = this._currentY + this.getNumber() * this._yScale;
				var x2 = this._currentX + this.getNumber() * this._xScale;
				var y2 = this._currentY + this.getNumber() * this._yScale;
				this._lastControlX = x1;
				this._lastControlY = y1;
				this._currentX = x2;
				this._currentY = y2;
				canvas.quadraticCurveTo(x1,y1,x2,y2);
			} while(this.currentTokenIsNumber());
			break;
		case "T":
			do {
				var x1 = cx + this.getNumber() * this._xScale;
				var y1 = cy + this.getNumber() * this._yScale;
				canContinue = this._lastCommand == "q" || this._lastCommand == "Q" || this._lastCommand == "t" || this._lastCommand == "T";
				var cpx = canContinue?this._currentX + (this._currentX - this._lastControlX):this._currentX;
				var cpy = canContinue?this._currentY + (this._currentY - this._lastControlY):this._currentY;
				this._currentX = x1;
				this._currentY = y1;
				this._lastControlX = cpx;
				this._lastControlY = cpy;
				canvas.quadraticCurveTo(cpx,cpy,x1,y1);
			} while(this.currentTokenIsNumber());
			break;
		case "t":
			do {
				var x1 = this._currentX + this.getNumber() * this._xScale;
				var y1 = this._currentY + this.getNumber() * this._yScale;
				var cpx = this._currentX + (this._currentX - this._lastControlX);
				var cpy = this._currentY + (this._currentY - this._lastControlY);
				canContinue = this._lastCommand == "q" || this._lastCommand == "Q" || this._lastCommand == "t" || this._lastCommand == "T";
				var cpx1 = canContinue?this._currentX + (this._currentX - this._lastControlX):this._currentX;
				var cpy1 = canContinue?this._currentY + (this._currentY - this._lastControlY):this._currentY;
				this._lastControlX = cpx1;
				this._lastControlY = cpy1;
				canvas.quadraticCurveTo(cpx1,cpy1,x1,y1);
			} while(this.currentTokenIsNumber());
			break;
		}
		this._lastCommand = command;
	}
	,paint: function(cx,cy,canvas) {
		this._xScale = this._xGlyphScale * this.renderer.stave.staveGroup.layout.renderer.scale;
		this._yScale = this._yGlyphScale * this.renderer.stave.staveGroup.layout.renderer.scale;
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.mainGlyphColor);
		var startX = this.x + cx;
		var startY = this.y + cy;
		this._currentIndex = 0;
		this._currentX = startX;
		this._currentY = startY;
		canvas.setColor(new alphatab.platform.model.Color(0,0,0));
		canvas.beginPath();
		this.nextToken();
		while(!(this._currentIndex >= this._svg.length)) this.parseCommand(startX,startY,canvas);
		canvas.fill();
	}
	,_lastControlY: null
	,_lastControlX: null
	,_lastCommand: null
	,_yGlyphScale: null
	,_xGlyphScale: null
	,_yScale: null
	,_xScale: null
	,_currentY: null
	,_currentX: null
	,_currentToken: null
	,_currentIndex: null
	,_svg: null
	,__class__: alphatab.rendering.glyphs.SvgGlyph
});
alphatab.rendering.glyphs.AccentuationGlyph = $hxClasses["alphatab.rendering.glyphs.AccentuationGlyph"] = function(x,y,accentuation) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getSvg(accentuation),0.8,0.8);
};
alphatab.rendering.glyphs.AccentuationGlyph.__name__ = ["alphatab","rendering","glyphs","AccentuationGlyph"];
alphatab.rendering.glyphs.AccentuationGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.AccentuationGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getSvg: function(accentuation) {
		switch( (accentuation)[1] ) {
		case 1:
			return alphatab.rendering.glyphs.MusicFont.Accent;
		case 2:
			return alphatab.rendering.glyphs.MusicFont.AccentHeavy;
		default:
			return "";
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 9 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.AccentuationGlyph
});
alphatab.rendering.glyphs.GlyphGroup = $hxClasses["alphatab.rendering.glyphs.GlyphGroup"] = function(x,y,glyphs) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._glyphs = glyphs != null?glyphs:new Array();
};
alphatab.rendering.glyphs.GlyphGroup.__name__ = ["alphatab","rendering","glyphs","GlyphGroup"];
alphatab.rendering.glyphs.GlyphGroup.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.GlyphGroup.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.paint(cx + this.x,cy + this.y,canvas);
		}
	}
	,addGlyph: function(g) {
		this._glyphs.push(g);
	}
	,doLayout: function() {
		var w = 0;
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.renderer = this.renderer;
			g.doLayout();
			w = Math.max(w,g.width) | 0;
		}
		this.width = w;
	}
	,_glyphs: null
	,__class__: alphatab.rendering.glyphs.GlyphGroup
});
alphatab.rendering.glyphs.AccidentalGroupGlyph = $hxClasses["alphatab.rendering.glyphs.AccidentalGroupGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.GlyphGroup.call(this,x,y,new Array());
};
alphatab.rendering.glyphs.AccidentalGroupGlyph.__name__ = ["alphatab","rendering","glyphs","AccidentalGroupGlyph"];
alphatab.rendering.glyphs.AccidentalGroupGlyph.__super__ = alphatab.rendering.glyphs.GlyphGroup;
alphatab.rendering.glyphs.AccidentalGroupGlyph.prototype = $extend(alphatab.rendering.glyphs.GlyphGroup.prototype,{
	doLayout: function() {
		this._glyphs.sort(function(a,b) {
			if(a.y == b.y) return 0;
			if(a.y < b.y) return -1; else return 1;
		});
		var columns = new Array();
		columns.push(-3000);
		var accidentalSize = 21 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.renderer = this.renderer;
			g.doLayout();
			var gColumn = 0;
			while(columns[gColumn] > g.y) {
				gColumn++;
				if(gColumn == columns.length) columns.push(-3000);
			}
			g.x = gColumn;
			columns[gColumn] = g.y + accidentalSize;
		}
		var columnWidth = 8 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
		this.width = columnWidth * columns.length;
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.x = this.width - (g.x + 1) * columnWidth;
		}
	}
	,__class__: alphatab.rendering.glyphs.AccidentalGroupGlyph
});
alphatab.rendering.glyphs.BarNumberGlyph = $hxClasses["alphatab.rendering.glyphs.BarNumberGlyph"] = function(x,y,number) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._number = number;
};
alphatab.rendering.glyphs.BarNumberGlyph.__name__ = ["alphatab","rendering","glyphs","BarNumberGlyph"];
alphatab.rendering.glyphs.BarNumberGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.BarNumberGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.barNumberColor);
		canvas.setFont(res.barNumberFont);
		canvas.fillText(Std.string(this._number),cx + this.x,cy + this.y);
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		var scoreRenderer = this.renderer.stave.staveGroup.layout.renderer;
		scoreRenderer.canvas.setFont(scoreRenderer.renderingResources.barNumberFont);
		this.width = this.renderer.stave.staveGroup.layout.renderer.canvas.measureText(Std.string(this._number)) + 3 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,_number: null
	,__class__: alphatab.rendering.glyphs.BarNumberGlyph
});
alphatab.rendering.glyphs.BarSeperatorGlyph = $hxClasses["alphatab.rendering.glyphs.BarSeperatorGlyph"] = function(x,y,isLast) {
	if(isLast == null) isLast = false;
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._isLast = isLast;
};
alphatab.rendering.glyphs.BarSeperatorGlyph.__name__ = ["alphatab","rendering","glyphs","BarSeperatorGlyph"];
alphatab.rendering.glyphs.BarSeperatorGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.BarSeperatorGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.barSeperatorColor);
		var blockWidth = 4 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var top = cy + this.y + this.renderer.getTopPadding();
		var bottom = cy + this.y + this.renderer.height - this.renderer.getBottomPadding();
		var left = cx + this.x;
		var h = bottom - top;
		canvas.beginPath();
		canvas.moveTo(left,top);
		canvas.lineTo(left,bottom);
		canvas.stroke();
		if(this._isLast) {
			left += 3 * this.renderer.stave.staveGroup.layout.renderer.scale + 0.5;
			canvas.fillRect(left,top,blockWidth,h);
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = (this._isLast?8:1) * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,_isLast: null
	,__class__: alphatab.rendering.glyphs.BarSeperatorGlyph
});
alphatab.rendering.glyphs.BeamGlyph = $hxClasses["alphatab.rendering.glyphs.BeamGlyph"] = function(x,y,duration,direction) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getRestSvg(duration,direction),1.1,this.getSvgScale(duration,direction));
};
alphatab.rendering.glyphs.BeamGlyph.__name__ = ["alphatab","rendering","glyphs","BeamGlyph"];
alphatab.rendering.glyphs.BeamGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.BeamGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getRestSvg: function(duration,direction) {
		switch( (duration)[1] ) {
		case 3:
			return alphatab.rendering.glyphs.MusicFont.FooterEighth;
		case 4:
			return alphatab.rendering.glyphs.MusicFont.FooterSixteenth;
		default:
			return "";
		}
	}
	,doLayout: function() {
		this.width = 0;
	}
	,getSvgScale: function(duration,direction) {
		if(direction == alphatab.rendering.utils.BeamDirection.Up) return 1; else return -1;
	}
	,__class__: alphatab.rendering.glyphs.BeamGlyph
});
alphatab.rendering.glyphs.CircleGlyph = $hxClasses["alphatab.rendering.glyphs.CircleGlyph"] = function(x,y,size) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._size = size;
};
alphatab.rendering.glyphs.CircleGlyph.__name__ = ["alphatab","rendering","glyphs","CircleGlyph"];
alphatab.rendering.glyphs.CircleGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.CircleGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		canvas.beginPath();
		canvas.circle(cx + this.x,cy + this.y,this._size);
		canvas.fill();
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = this._size + 3 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,_size: null
	,__class__: alphatab.rendering.glyphs.CircleGlyph
});
alphatab.rendering.glyphs.ClefGlyph = $hxClasses["alphatab.rendering.glyphs.ClefGlyph"] = function(x,y,clef) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getClefSvg(clef),this.getClefScale(clef),this.getClefScale(clef));
};
alphatab.rendering.glyphs.ClefGlyph.__name__ = ["alphatab","rendering","glyphs","ClefGlyph"];
alphatab.rendering.glyphs.ClefGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.ClefGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getClefScale: function(clef) {
		switch( (clef)[1] ) {
		case 0:
		case 1:
			return 1.1;
		default:
			return 1.02;
		}
	}
	,getClefSvg: function(clef) {
		switch( (clef)[1] ) {
		case 0:
			return alphatab.rendering.glyphs.MusicFont.ClefC;
		case 1:
			return alphatab.rendering.glyphs.MusicFont.ClefC;
		case 2:
			return alphatab.rendering.glyphs.MusicFont.ClefF;
		case 3:
			return alphatab.rendering.glyphs.MusicFont.ClefG;
		default:
			return "";
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 28 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.ClefGlyph
});
alphatab.rendering.glyphs.DiamondNoteHeadGlyph = $hxClasses["alphatab.rendering.glyphs.DiamondNoteHeadGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,alphatab.rendering.glyphs.MusicFont.NoteWholeDiamond,1,1);
};
alphatab.rendering.glyphs.DiamondNoteHeadGlyph.__name__ = ["alphatab","rendering","glyphs","DiamondNoteHeadGlyph"];
alphatab.rendering.glyphs.DiamondNoteHeadGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.DiamondNoteHeadGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 9 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.DiamondNoteHeadGlyph
});
alphatab.rendering.glyphs.DigitGlyph = $hxClasses["alphatab.rendering.glyphs.DigitGlyph"] = function(x,y,digit) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getDigit(digit),1.1,1.1);
	this._digit = digit;
};
alphatab.rendering.glyphs.DigitGlyph.__name__ = ["alphatab","rendering","glyphs","DigitGlyph"];
alphatab.rendering.glyphs.DigitGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.DigitGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getDigit: function(digit) {
		switch(digit) {
		case 0:
			return alphatab.rendering.glyphs.MusicFont.Num0;
		case 1:
			return alphatab.rendering.glyphs.MusicFont.Num1;
		case 2:
			return alphatab.rendering.glyphs.MusicFont.Num2;
		case 3:
			return alphatab.rendering.glyphs.MusicFont.Num3;
		case 4:
			return alphatab.rendering.glyphs.MusicFont.Num4;
		case 5:
			return alphatab.rendering.glyphs.MusicFont.Num5;
		case 6:
			return alphatab.rendering.glyphs.MusicFont.Num6;
		case 7:
			return alphatab.rendering.glyphs.MusicFont.Num7;
		case 8:
			return alphatab.rendering.glyphs.MusicFont.Num8;
		case 9:
			return alphatab.rendering.glyphs.MusicFont.Num9;
		default:
			return "";
		}
	}
	,getDigitWidth: function(digit) {
		switch(digit) {
		case 0:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:
			return 14;
		case 1:
			return 10;
		default:
			return 0;
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.y += 7 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
		this.width = this.getDigitWidth(this._digit) * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,_digit: null
	,__class__: alphatab.rendering.glyphs.DigitGlyph
});
alphatab.rendering.glyphs.DummyTablatureGlyph = $hxClasses["alphatab.rendering.glyphs.DummyTablatureGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
};
alphatab.rendering.glyphs.DummyTablatureGlyph.__name__ = ["alphatab","rendering","glyphs","DummyTablatureGlyph"];
alphatab.rendering.glyphs.DummyTablatureGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.DummyTablatureGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(new alphatab.platform.model.Color(Std.random(256),Std.random(256),Std.random(256),128));
		canvas.fillRect(cx + this.x,cy + this.y,this.width,this.renderer.height);
		canvas.setFont(res.tablatureFont);
		canvas.setColor(new alphatab.platform.model.Color(0,0,0));
		canvas.fillText("0 1 2 3 4 5 6 7 9 0",cx + this.x,cy + this.y);
	}
	,doLayout: function() {
		this.width = 100;
	}
	,__class__: alphatab.rendering.glyphs.DummyTablatureGlyph
});
alphatab.rendering.glyphs.FlatGlyph = $hxClasses["alphatab.rendering.glyphs.FlatGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,alphatab.rendering.glyphs.MusicFont.KeyFlat,1.2,1.2);
};
alphatab.rendering.glyphs.FlatGlyph.__name__ = ["alphatab","rendering","glyphs","FlatGlyph"];
alphatab.rendering.glyphs.FlatGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.FlatGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 8 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.FlatGlyph
});
alphatab.rendering.glyphs.MusicFont = $hxClasses["alphatab.rendering.glyphs.MusicFont"] = function() { }
alphatab.rendering.glyphs.MusicFont.__name__ = ["alphatab","rendering","glyphs","MusicFont"];
alphatab.rendering.glyphs.NaturalizeGlyph = $hxClasses["alphatab.rendering.glyphs.NaturalizeGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,alphatab.rendering.glyphs.MusicFont.KeyNatural,1.2,1.2);
};
alphatab.rendering.glyphs.NaturalizeGlyph.__name__ = ["alphatab","rendering","glyphs","NaturalizeGlyph"];
alphatab.rendering.glyphs.NaturalizeGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.NaturalizeGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 8 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.NaturalizeGlyph
});
alphatab.rendering.glyphs.NoteChordGlyph = $hxClasses["alphatab.rendering.glyphs.NoteChordGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._infos = new Array();
	this.beatEffects = new Hash();
};
alphatab.rendering.glyphs.NoteChordGlyph.__name__ = ["alphatab","rendering","glyphs","NoteChordGlyph"];
alphatab.rendering.glyphs.NoteChordGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.NoteChordGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var scoreRenderer = this.renderer;
		var effectY = this.beamingHelper.getDirection() == alphatab.rendering.utils.BeamDirection.Up?scoreRenderer.getScoreY(this.maxNote.line,13):scoreRenderer.getScoreY(this.minNote.line,-4);
		var effectSpacing = this.beamingHelper.getDirection() == alphatab.rendering.utils.BeamDirection.Up?7 * this.renderer.stave.staveGroup.layout.renderer.scale | 0:-7 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
		var $it0 = this.beatEffects.iterator();
		while( $it0.hasNext() ) {
			var g = $it0.next();
			g.y = effectY;
			g.x = this.width / 2 | 0;
			g.paint(cx + this.x,cy + this.y,canvas);
			effectY += effectSpacing;
		}
		canvas.setColor(this.renderer.stave.staveGroup.layout.renderer.renderingResources.staveLineColor);
		if(this.hasTopOverflow()) {
			var l = -1;
			while(l >= this.minNote.line) {
				var lY = cy + this.y + scoreRenderer.getScoreY(l + 1,-1);
				canvas.beginPath();
				canvas.moveTo(cx + this.x,lY);
				canvas.lineTo(cx + this.x + this.width,lY);
				canvas.stroke();
				l -= 2;
			}
		}
		if(this.hasBottomOverflow()) {
			var l = 11;
			while(l <= this.maxNote.line) {
				var lY = cy + this.y + scoreRenderer.getScoreY(l + 1,-1);
				canvas.beginPath();
				canvas.moveTo(cx + this.x,lY);
				canvas.lineTo(cx + this.x + this.width,lY);
				canvas.stroke();
				l += 2;
			}
		}
		var _g = 0, _g1 = this._infos;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.glyph.paint(cx + this.x,cy + this.y,canvas);
		}
	}
	,doLayout: function() {
		this._infos.sort(function(a,b) {
			if(a.line == b.line) return 0; else if(a.line < b.line) return 1; else return -1;
		});
		var padding = 4 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
		var displacedX = 0;
		var lastDisplaced = false;
		var lastLine = 0;
		var anyDisplaced = false;
		var w = 0;
		var _g1 = 0, _g = this._infos.length;
		while(_g1 < _g) {
			var i = _g1++;
			var g = this._infos[i].glyph;
			g.renderer = this.renderer;
			g.doLayout();
			g.x = padding;
			if(i == 0) displacedX = g.width + padding; else if(Math.abs(lastLine - this._infos[i].line) <= 1) {
				if(!lastDisplaced) {
					g.x = displacedX - this.renderer.stave.staveGroup.layout.renderer.scale | 0;
					anyDisplaced = true;
					lastDisplaced = true;
				} else lastDisplaced = false;
			} else lastDisplaced = false;
			lastLine = this._infos[i].line;
			w = Math.max(w,g.x + g.width) | 0;
		}
		if(anyDisplaced) {
			this.upLineX = displacedX;
			this.downLineX = displacedX;
		} else {
			this.upLineX = w;
			this.downLineX = padding;
		}
		var $it0 = this.beatEffects.iterator();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			e.renderer = this.renderer;
			e.doLayout();
		}
		this.width = w + padding;
	}
	,hasBottomOverflow: function() {
		return this.maxNote != null && this.maxNote.line > 8;
	}
	,hasTopOverflow: function() {
		return this.minNote != null && this.minNote.line < 0;
	}
	,applyGlyphSpacing: function(spacing) {
		alphatab.rendering.Glyph.prototype.applyGlyphSpacing.call(this,spacing);
		this.updateBeamingHelper();
	}
	,updateBeamingHelper: function() {
		this.beamingHelper.registerBeatLineX(this.beat,this.x + this.upLineX,this.x + this.downLineX);
	}
	,canScale: function() {
		return false;
	}
	,addNoteGlyph: function(noteGlyph,noteLine) {
		var info = { glyph : noteGlyph, line : noteLine};
		this._infos.push(info);
		if(this.minNote == null || this.minNote.line > info.line) this.minNote = info;
		if(this.maxNote == null || this.maxNote.line < info.line) this.maxNote = info;
	}
	,beamingHelper: null
	,beat: null
	,beatEffects: null
	,downLineX: null
	,upLineX: null
	,spacingChanged: null
	,maxNote: null
	,minNote: null
	,_infos: null
	,__class__: alphatab.rendering.glyphs.NoteChordGlyph
});
alphatab.rendering.glyphs.NoteHeadGlyph = $hxClasses["alphatab.rendering.glyphs.NoteHeadGlyph"] = function(x,y,duration) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getNoteSvg(duration),1,1);
};
alphatab.rendering.glyphs.NoteHeadGlyph.__name__ = ["alphatab","rendering","glyphs","NoteHeadGlyph"];
alphatab.rendering.glyphs.NoteHeadGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.NoteHeadGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getNoteSvg: function(duration) {
		switch( (duration)[1] ) {
		case 0:
			return alphatab.rendering.glyphs.MusicFont.NoteHalf;
		case 1:
			return alphatab.rendering.glyphs.MusicFont.NoteHalf;
		default:
			return alphatab.rendering.glyphs.MusicFont.NoteQuarter;
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 9 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.NoteHeadGlyph
});
alphatab.rendering.glyphs.NumberGlyph = $hxClasses["alphatab.rendering.glyphs.NumberGlyph"] = function(x,y,number) {
	alphatab.rendering.glyphs.GlyphGroup.call(this,x,y,new Array());
	this._number = number;
};
alphatab.rendering.glyphs.NumberGlyph.__name__ = ["alphatab","rendering","glyphs","NumberGlyph"];
alphatab.rendering.glyphs.NumberGlyph.__super__ = alphatab.rendering.glyphs.GlyphGroup;
alphatab.rendering.glyphs.NumberGlyph.prototype = $extend(alphatab.rendering.glyphs.GlyphGroup.prototype,{
	doLayout: function() {
		var i = this._number;
		while(i > 0) {
			var num = i % 10;
			var gl = new alphatab.rendering.glyphs.DigitGlyph(0,0,num);
			this._glyphs.push(gl);
			i = i / 10 | 0;
		}
		this._glyphs.reverse();
		var cx = 0;
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.x = cx;
			g.y = 0;
			g.renderer = this.renderer;
			g.doLayout();
			cx += g.width;
		}
		this.width = cx;
	}
	,canScale: function() {
		return false;
	}
	,_number: null
	,__class__: alphatab.rendering.glyphs.NumberGlyph
});
alphatab.rendering.glyphs.RepeatCloseGlyph = $hxClasses["alphatab.rendering.glyphs.RepeatCloseGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
};
alphatab.rendering.glyphs.RepeatCloseGlyph.__name__ = ["alphatab","rendering","glyphs","RepeatCloseGlyph"];
alphatab.rendering.glyphs.RepeatCloseGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.RepeatCloseGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.mainGlyphColor);
		var blockWidth = 4 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var top = cy + this.y + this.renderer.getTopPadding();
		var bottom = cy + this.y + this.renderer.height - this.renderer.getBottomPadding();
		var left = cx + this.x;
		var h = bottom - top;
		var circleSize = 1.5 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var middle = (top + bottom) / 2;
		var dotOffset = 3;
		canvas.beginPath();
		canvas.circle(left,middle - circleSize * dotOffset,circleSize);
		canvas.circle(left,middle + circleSize * dotOffset,circleSize);
		canvas.fill();
		left += 4 * this.renderer.stave.staveGroup.layout.renderer.scale;
		canvas.beginPath();
		canvas.moveTo(left,top);
		canvas.lineTo(left,bottom);
		canvas.stroke();
		left += 3 * this.renderer.stave.staveGroup.layout.renderer.scale + 0.5;
		canvas.fillRect(left,top,blockWidth,h);
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		var base = this.renderer.isLast()?11:13;
		this.width = base * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.RepeatCloseGlyph
});
alphatab.rendering.glyphs.RepeatCountGlyph = $hxClasses["alphatab.rendering.glyphs.RepeatCountGlyph"] = function(x,y,count) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this._count = count;
};
alphatab.rendering.glyphs.RepeatCountGlyph.__name__ = ["alphatab","rendering","glyphs","RepeatCountGlyph"];
alphatab.rendering.glyphs.RepeatCountGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.RepeatCountGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.mainGlyphColor);
		canvas.setFont(res.barNumberFont);
		var s = "x" + Std.string(this._count);
		var w = canvas.measureText(s) / 1.5 | 0;
		canvas.fillText(s,cx + this.x - w,cy + this.y);
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 0;
	}
	,_count: null
	,__class__: alphatab.rendering.glyphs.RepeatCountGlyph
});
alphatab.rendering.glyphs.RepeatOpenGlyph = $hxClasses["alphatab.rendering.glyphs.RepeatOpenGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
};
alphatab.rendering.glyphs.RepeatOpenGlyph.__name__ = ["alphatab","rendering","glyphs","RepeatOpenGlyph"];
alphatab.rendering.glyphs.RepeatOpenGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.RepeatOpenGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	paint: function(cx,cy,canvas) {
		var res = this.renderer.stave.staveGroup.layout.renderer.renderingResources;
		canvas.setColor(res.mainGlyphColor);
		var blockWidth = 4 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var top = cy + this.y + this.renderer.getTopPadding();
		var bottom = cy + this.y + this.renderer.height - this.renderer.getBottomPadding();
		var left = cx + this.x + 0.5;
		var h = bottom - top;
		canvas.fillRect(left,top,blockWidth,h);
		left += blockWidth * 2 - 0.5;
		canvas.beginPath();
		canvas.moveTo(left,top);
		canvas.lineTo(left,bottom);
		canvas.stroke();
		left += 3 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var circleSize = 1.5 * this.renderer.stave.staveGroup.layout.renderer.scale;
		var middle = (top + bottom) / 2;
		var dotOffset = 3;
		canvas.beginPath();
		canvas.circle(left,middle - circleSize * dotOffset,circleSize);
		canvas.circle(left,middle + circleSize * dotOffset,circleSize);
		canvas.fill();
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 13 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.RepeatOpenGlyph
});
alphatab.rendering.glyphs.RestGlyph = $hxClasses["alphatab.rendering.glyphs.RestGlyph"] = function(x,y,duration) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,this.getRestSvg(duration),1.1,1.1);
};
alphatab.rendering.glyphs.RestGlyph.__name__ = ["alphatab","rendering","glyphs","RestGlyph"];
alphatab.rendering.glyphs.RestGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.RestGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	getRestSvg: function(duration) {
		switch( (duration)[1] ) {
		case 0:
		case 1:
			return alphatab.rendering.glyphs.MusicFont.RestHalf;
		case 2:
			return alphatab.rendering.glyphs.MusicFont.RestQuarter;
		case 3:
			return alphatab.rendering.glyphs.MusicFont.RestEighth;
		case 4:
			return alphatab.rendering.glyphs.MusicFont.RestSixteenth;
		case 5:
			return alphatab.rendering.glyphs.MusicFont.RestThirtySecond;
		case 6:
			return alphatab.rendering.glyphs.MusicFont.RestSixtyFourth;
		default:
			return "";
		}
	}
	,canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 9 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.RestGlyph
});
alphatab.rendering.glyphs.SharpGlyph = $hxClasses["alphatab.rendering.glyphs.SharpGlyph"] = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.glyphs.SvgGlyph.call(this,x,y,alphatab.rendering.glyphs.MusicFont.KeySharp,1.2,1.2);
};
alphatab.rendering.glyphs.SharpGlyph.__name__ = ["alphatab","rendering","glyphs","SharpGlyph"];
alphatab.rendering.glyphs.SharpGlyph.__super__ = alphatab.rendering.glyphs.SvgGlyph;
alphatab.rendering.glyphs.SharpGlyph.prototype = $extend(alphatab.rendering.glyphs.SvgGlyph.prototype,{
	canScale: function() {
		return false;
	}
	,doLayout: function() {
		this.width = 8 * this.renderer.stave.staveGroup.layout.renderer.scale | 0;
	}
	,__class__: alphatab.rendering.glyphs.SharpGlyph
});
alphatab.rendering.glyphs.SpacingGlyph = $hxClasses["alphatab.rendering.glyphs.SpacingGlyph"] = function(x,y,width,scaling) {
	if(scaling == null) scaling = true;
	if(y == null) y = 0;
	if(x == null) x = 0;
	alphatab.rendering.Glyph.call(this,x,y);
	this.width = width;
	this._scaling = scaling;
};
alphatab.rendering.glyphs.SpacingGlyph.__name__ = ["alphatab","rendering","glyphs","SpacingGlyph"];
alphatab.rendering.glyphs.SpacingGlyph.__super__ = alphatab.rendering.Glyph;
alphatab.rendering.glyphs.SpacingGlyph.prototype = $extend(alphatab.rendering.Glyph.prototype,{
	canScale: function() {
		return this._scaling;
	}
	,_scaling: null
	,__class__: alphatab.rendering.glyphs.SpacingGlyph
});
alphatab.rendering.glyphs.TimeSignatureGlyph = $hxClasses["alphatab.rendering.glyphs.TimeSignatureGlyph"] = function(x,y,numerator,denominator) {
	alphatab.rendering.glyphs.GlyphGroup.call(this,x,y,new Array());
	this._numerator = numerator;
	this._denominator = denominator;
};
alphatab.rendering.glyphs.TimeSignatureGlyph.__name__ = ["alphatab","rendering","glyphs","TimeSignatureGlyph"];
alphatab.rendering.glyphs.TimeSignatureGlyph.__super__ = alphatab.rendering.glyphs.GlyphGroup;
alphatab.rendering.glyphs.TimeSignatureGlyph.prototype = $extend(alphatab.rendering.glyphs.GlyphGroup.prototype,{
	doLayout: function() {
		var numerator = new alphatab.rendering.glyphs.NumberGlyph(0,0,this._numerator);
		var denominator = new alphatab.rendering.glyphs.NumberGlyph(0,18 * this.renderer.stave.staveGroup.layout.renderer.scale | 0,this._denominator);
		this._glyphs.push(numerator);
		this._glyphs.push(denominator);
		alphatab.rendering.glyphs.GlyphGroup.prototype.doLayout.call(this);
		var _g = 0, _g1 = this._glyphs;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.x = (this.width - g.width) / 2 | 0;
		}
	}
	,canScale: function() {
		return false;
	}
	,_denominator: null
	,_numerator: null
	,__class__: alphatab.rendering.glyphs.TimeSignatureGlyph
});
if(!alphatab.rendering.layout) alphatab.rendering.layout = {}
alphatab.rendering.layout.HeaderFooterElements = $hxClasses["alphatab.rendering.layout.HeaderFooterElements"] = function() { }
alphatab.rendering.layout.HeaderFooterElements.__name__ = ["alphatab","rendering","layout","HeaderFooterElements"];
alphatab.rendering.layout.ScoreLayout = $hxClasses["alphatab.rendering.layout.ScoreLayout"] = function(renderer) {
	this.renderer = renderer;
};
alphatab.rendering.layout.ScoreLayout.__name__ = ["alphatab","rendering","layout","ScoreLayout"];
alphatab.rendering.layout.ScoreLayout.prototype = {
	createEmptyStaveGroup: function() {
		var group = new alphatab.rendering.staves.StaveGroup();
		group.layout = this;
		group.addStave(new alphatab.rendering.staves.Stave(new alphatab.rendering.ScoreBarRendererFactory()));
		return group;
	}
	,paintScore: function() {
	}
	,doLayout: function() {
	}
	,height: null
	,width: null
	,renderer: null
	,__class__: alphatab.rendering.layout.ScoreLayout
}
alphatab.rendering.layout.PageViewLayout = $hxClasses["alphatab.rendering.layout.PageViewLayout"] = function(renderer) {
	alphatab.rendering.layout.ScoreLayout.call(this,renderer);
	this._groups = new Array();
	renderer.setLayoutSetting(alphatab.rendering.layout.PageViewLayout.SCORE_INFOS,511);
};
alphatab.rendering.layout.PageViewLayout.__name__ = ["alphatab","rendering","layout","PageViewLayout"];
alphatab.rendering.layout.PageViewLayout.__super__ = alphatab.rendering.layout.ScoreLayout;
alphatab.rendering.layout.PageViewLayout.prototype = $extend(alphatab.rendering.layout.ScoreLayout.prototype,{
	getSheetWidth: function() {
		return Math.round(795 * this.renderer.scale);
	}
	,getMaxWidth: function() {
		return this.getSheetWidth() - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[0] - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[2];
	}
	,createStaveGroup: function(currentBarIndex) {
		var group = this.createEmptyStaveGroup();
		var maxWidth = this.getSheetWidth() - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[0] - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[2];
		var _g1 = currentBarIndex, _g = this.renderer.track.bars.length;
		while(_g1 < _g) {
			var i = _g1++;
			var bar = this.renderer.track.bars[i];
			group.addBar(bar);
			var groupIsFull = false;
			if(group.width >= maxWidth && group.bars.length != 0) groupIsFull = true;
			if(groupIsFull) {
				group.revertLastBar();
				group.isFull = true;
				return group;
			}
			group.x = 0;
		}
		return group;
	}
	,fitGroup: function(group) {
		var barSpace = 0;
		if(group.isFull) {
			var freeSpace = this.getSheetWidth() - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[0] - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[2] - group.width;
			if(freeSpace != 0 && group.bars.length > 0) barSpace = Math.round(freeSpace / group.bars.length);
		}
		group.applyBarSpacing(barSpace);
		this.width = Math.round(Math.max(this.width,group.width));
	}
	,isNullOrEmpty: function(s) {
		return s == null || StringTools.trim(s) == "";
	}
	,paintScoreInfo: function(x,y) {
		var flags = js.Boot.__cast(this.renderer.getLayoutSetting(alphatab.rendering.layout.PageViewLayout.SCORE_INFOS) , Int);
		var score = this.renderer.getScore();
		var scale = this.renderer.scale;
		var canvas = this.renderer.canvas;
		var res = this.renderer.renderingResources;
		canvas.setColor(new alphatab.platform.model.Color(0,0,0));
		canvas.setTextAlign(alphatab.platform.model.TextAlign.Center);
		var tX;
		var size;
		var str = "";
		if(!this.isNullOrEmpty(score.title) && (flags & 1) != 0) {
			this.drawCentered(score.title,res.titleFont,y);
			y += Math.floor(35 * scale);
		}
		if(!this.isNullOrEmpty(score.subTitle) && (flags & 2) != 0) {
			this.drawCentered(score.subTitle,res.subTitleFont,y);
			y += Math.floor(20 * scale);
		}
		if(!this.isNullOrEmpty(score.artist) && (flags & 4) != 0) {
			this.drawCentered(score.artist,res.subTitleFont,y);
			y += Math.floor(20 * scale);
		}
		if(!this.isNullOrEmpty(score.album) && (flags & 8) != 0) {
			this.drawCentered(score.album,res.subTitleFont,y);
			y += Math.floor(20 * scale);
		}
		if(!this.isNullOrEmpty(score.music) && score.music == score.words && (flags & 64) != 0) {
			this.drawCentered(score.words,res.wordsFont,y);
			y += Math.floor(20 * scale);
		} else {
			canvas.setFont(res.wordsFont);
			if(!this.isNullOrEmpty(score.music) && (flags & 32) != 0) {
				var size1 = canvas.measureText(score.music);
				canvas.fillText(score.music,this.width - size1 - alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[2],y);
			}
			if(!this.isNullOrEmpty(score.words) && (flags & 16) != 0) canvas.fillText(score.music,x,y);
			y += Math.floor(20 * scale);
		}
		y += Math.floor(20 * scale);
		if(!this.renderer.track.isPercussion) {
			canvas.setTextAlign(alphatab.platform.model.TextAlign.Left);
			var tuning = alphatab.model.Tuning.findTuning(this.renderer.track.tuning);
			if(tuning != null) {
				canvas.setFont(res.effectFont);
				canvas.fillText(tuning.name,x,y);
				y += Math.floor(15 * scale);
				if(!tuning.isStandard) {
					var stringsPerColumn = Math.ceil(this.renderer.track.tuning.length / 2);
					var currentX = x;
					var currentY = y;
					var _g1 = 0, _g = this.renderer.track.tuning.length;
					while(_g1 < _g) {
						var i = _g1++;
						str = "(" + Std.string(i + 1) + ") = " + alphatab.model.Tuning.getTextForTuning(this.renderer.track.tuning[i],false);
						canvas.fillText(str,currentX,currentY);
						currentY += Math.floor(15 * scale);
						if(i == stringsPerColumn - 1) {
							currentY = y;
							currentX += Math.floor(43 * scale);
						}
					}
					y += stringsPerColumn * Math.floor(15 * scale);
				}
			}
		}
		y += Math.floor(25 * scale);
		return y;
	}
	,drawCentered: function(text,font,y) {
		this.renderer.canvas.setFont(font);
		this.renderer.canvas.fillText(text,this.width / 2,y);
	}
	,paintScore: function() {
		var x = alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[0];
		var y = alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[1];
		y = this.paintScoreInfo(x,y);
		var _g = 0, _g1 = this._groups;
		while(_g < _g1.length) {
			var g = _g1[_g];
			++_g;
			g.paint(0,0,this.renderer.canvas);
		}
	}
	,doScoreInfoLayout: function(y) {
		var flags = js.Boot.__cast(this.renderer.getLayoutSetting(alphatab.rendering.layout.PageViewLayout.SCORE_INFOS) , Int);
		var score = this.renderer.getScore();
		var scale = this.renderer.scale;
		if(!this.isNullOrEmpty(score.title) && (flags & 1) != 0) y += Math.floor(35 * scale);
		if(!this.isNullOrEmpty(score.subTitle) && (flags & 2) != 0) y += Math.floor(20 * scale);
		if(!this.isNullOrEmpty(score.artist) && (flags & 4) != 0) y += Math.floor(20 * scale);
		if(!this.isNullOrEmpty(score.album) && (flags & 8) != 0) y += Math.floor(20 * scale);
		if(!this.isNullOrEmpty(score.music) && score.music == score.words && (flags & 64) != 0) y += Math.floor(20 * scale); else {
			if(!this.isNullOrEmpty(score.music) && (flags & 32) != 0) y += Math.floor(20 * scale);
			if(!this.isNullOrEmpty(score.words) && (flags & 16) != 0) y += Math.floor(20 * scale);
		}
		y += Math.floor(20 * scale);
		if(!this.renderer.track.isPercussion) {
			var tuning = alphatab.model.Tuning.findTuning(this.renderer.track.tuning);
			if(tuning != null) {
				y += Math.floor(15 * scale);
				if(!tuning.isStandard) {
					var stringsPerColumn = Math.ceil(this.renderer.track.tuning.length / 2);
					y += stringsPerColumn * Math.floor(15 * scale);
				}
				y += Math.floor(15 * scale);
			}
		}
		y += Math.floor(40 * scale);
		return y;
	}
	,doLayout: function() {
		this._groups = new Array();
		var currentBarIndex = 0;
		var endBarIndex = this.renderer.track.bars.length - 1;
		var x = alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[0];
		var y = alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[1];
		y = this.doScoreInfoLayout(y);
		while(currentBarIndex <= endBarIndex) {
			var group = this.createStaveGroup(currentBarIndex);
			this._groups.push(group);
			group.x = x;
			group.y = y;
			this.fitGroup(group);
			group.finalizeGroup(this);
			y += group.calculateHeight() + (20 * this.renderer.scale | 0);
			currentBarIndex = group.bars[group.bars.length - 1].index + 1;
		}
		this.height = y + alphatab.rendering.layout.PageViewLayout.PAGE_PADDING[3];
		this.width = 795 * this.renderer.scale | 0;
	}
	,_groups: null
	,__class__: alphatab.rendering.layout.PageViewLayout
});
if(!alphatab.rendering.staves) alphatab.rendering.staves = {}
alphatab.rendering.staves.Stave = $hxClasses["alphatab.rendering.staves.Stave"] = function(barRendererFactory) {
	this.barRenderers = new Array();
	this._factory = barRendererFactory;
	this.topSpacing = 10;
	this.bottomSpacing = 10;
};
alphatab.rendering.staves.Stave.__name__ = ["alphatab","rendering","staves","Stave"];
alphatab.rendering.staves.Stave.prototype = {
	paint: function(cx,cy,canvas) {
		var _g = 0, _g1 = this.barRenderers;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			r.paint(cx + this.x,cy + this.y,canvas);
		}
	}
	,finalizeStave: function(layout) {
		var x = 0;
		this.height = 0;
		var topOverflow = this.getTopOverflow();
		var bottomOverflow = this.getBottomOverflow();
		var _g1 = 0, _g = this.barRenderers.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.barRenderers[i].x = x;
			this.barRenderers[i].y = this.topSpacing + topOverflow;
			this.height = Math.max(this.height,this.barRenderers[i].height) | 0;
			x += this.barRenderers[i].width;
		}
		this.height += this.topSpacing + topOverflow + bottomOverflow + this.bottomSpacing;
	}
	,getBottomOverflow: function() {
		var m = 0;
		var _g = 0, _g1 = this.barRenderers;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.bottomOverflow > m) m = r.bottomOverflow;
		}
		return m;
	}
	,getTopOverflow: function() {
		var m = 0;
		var _g = 0, _g1 = this.barRenderers;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.topOverflow > m) m = r.topOverflow;
		}
		return m;
	}
	,applyBarSpacing: function(spacing) {
		var _g = 0, _g1 = this.barRenderers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.applyBarSpacing(spacing);
		}
	}
	,revertLastBar: function() {
		this.barRenderers.pop();
	}
	,addBar: function(bar) {
		var renderer = this._factory.create(bar);
		renderer.stave = this;
		renderer.index = this.barRenderers.length;
		renderer.doLayout();
		this.barRenderers.push(renderer);
	}
	,registerStaveBottom: function(offset) {
		this.staveBottom = offset;
	}
	,registerStaveTop: function(offset) {
		this.staveTop = offset;
	}
	,staveBottom: null
	,bottomSpacing: null
	,topSpacing: null
	,staveTop: null
	,index: null
	,height: null
	,y: null
	,x: null
	,barRenderers: null
	,_factory: null
	,staveGroup: null
	,__class__: alphatab.rendering.staves.Stave
}
alphatab.rendering.staves.StaveGroup = $hxClasses["alphatab.rendering.staves.StaveGroup"] = function() {
	this.bars = new Array();
	this.staves = new Array();
	this.width = 0;
};
alphatab.rendering.staves.StaveGroup.__name__ = ["alphatab","rendering","staves","StaveGroup"];
alphatab.rendering.staves.StaveGroup.prototype = {
	finalizeGroup: function(scoreLayout) {
		var currentY = 0;
		var _g1 = 0, _g = this.staves.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i > 0) currentY += 0 * scoreLayout.renderer.scale;
			this.staves[i].x = 0;
			this.staves[i].y = currentY | 0;
			this.staves[i].finalizeStave(scoreLayout);
			currentY += this.staves[i].height;
		}
	}
	,paint: function(cx,cy,canvas) {
		var _g = 0, _g1 = this.staves;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			s.paint(cx + this.x,cy + this.y,canvas);
		}
		var res = this.layout.renderer.renderingResources;
		if(this.staves.length > 0) {
			var firstStart = cy + this.y + this.staves[0].y + this.staves[0].staveTop + this.staves[0].topSpacing + this.staves[0].getTopOverflow();
			var lastEnd = cy + this.y + this.staves[this.staves.length - 1].y + this.staves[this.staves.length - 1].height - this.staves[this.staves.length - 1].getBottomOverflow() - this.staves[this.staves.length - 1].bottomSpacing - this.staves[this.staves.length - 1].staveBottom;
			canvas.setColor(res.barSeperatorColor);
			canvas.beginPath();
			canvas.moveTo(cx + this.x + this.staves[0].x,firstStart);
			canvas.lineTo(cx + this.x + this.staves[this.staves.length - 1].x,lastEnd);
			canvas.stroke();
			var barSize = 3 * this.layout.renderer.scale | 0;
			var barOffset = barSize;
			var accoladeStart = firstStart - barSize * 4;
			var accoladeEnd = lastEnd + barSize * 4;
			canvas.fillRect(cx + this.x - barOffset - barSize,accoladeStart,barSize,accoladeEnd - accoladeStart);
			var spikeStartX = cx + this.x - barOffset - barSize;
			var spikeEndX = cx + this.x + barSize * 2;
			canvas.beginPath();
			canvas.moveTo(spikeStartX,accoladeStart);
			canvas.bezierCurveTo(spikeStartX,accoladeStart,this.x,accoladeStart,spikeEndX,accoladeStart - barSize);
			canvas.bezierCurveTo(cx + this.x,accoladeStart + barSize,spikeStartX,accoladeStart + barSize,spikeStartX,accoladeStart + barSize);
			canvas.closePath();
			canvas.fill();
			canvas.beginPath();
			canvas.moveTo(spikeStartX,accoladeEnd);
			canvas.bezierCurveTo(spikeStartX,accoladeStart,this.x,accoladeStart,spikeEndX,accoladeStart - barSize);
			canvas.bezierCurveTo(cx + this.x,accoladeStart + barSize,spikeStartX,accoladeStart + barSize,spikeStartX,accoladeStart + barSize);
			canvas.closePath();
			canvas.beginPath();
			canvas.moveTo(spikeStartX,accoladeEnd);
			canvas.bezierCurveTo(spikeStartX,accoladeEnd,this.x,accoladeEnd,spikeEndX,accoladeEnd + barSize);
			canvas.bezierCurveTo(this.x,accoladeEnd - barSize,spikeStartX,accoladeEnd - barSize,spikeStartX,accoladeEnd - barSize);
			canvas.closePath();
			canvas.fill();
		}
	}
	,applyBarSpacing: function(spacing) {
		var _g = 0, _g1 = this.staves;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			s.applyBarSpacing(spacing);
		}
		this.width += this.bars.length * spacing;
	}
	,revertLastBar: function() {
		if(this.bars.length > 1) {
			this.bars.pop();
			var w = 0;
			var _g = 0, _g1 = this.staves;
			while(_g < _g1.length) {
				var s = _g1[_g];
				++_g;
				w = Math.max(w,s.barRenderers[s.barRenderers.length - 1].width) | 0;
				s.revertLastBar();
			}
			this.width -= w;
		}
	}
	,calculateHeight: function() {
		return this.staves[this.staves.length - 1].y + this.staves[this.staves.length - 1].height;
	}
	,addStave: function(stave) {
		stave.staveGroup = this;
		stave.index = this.staves.length;
		this.staves.push(stave);
	}
	,addBar: function(bar) {
		this.bars.push(bar);
		var maxW = 0;
		var _g = 0, _g1 = this.staves;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			s.addBar(bar);
			if(s.barRenderers[s.barRenderers.length - 1].width > maxW) maxW = s.barRenderers[s.barRenderers.length - 1].width;
		}
		var _g = 0, _g1 = this.staves;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			var diff = maxW - s.barRenderers[s.barRenderers.length - 1].width;
			if(diff > 0) s.barRenderers[s.barRenderers.length - 1].applyBarSpacing(diff);
		}
		this.width += maxW;
	}
	,getLastBarIndex: function() {
		return this.bars[this.bars.length - 1].index;
	}
	,layout: null
	,staves: null
	,bars: null
	,width: null
	,isFull: null
	,y: null
	,x: null
	,__class__: alphatab.rendering.staves.StaveGroup
}
if(!alphatab.rendering.utils) alphatab.rendering.utils = {}
alphatab.rendering.utils.AccidentalHelper = $hxClasses["alphatab.rendering.utils.AccidentalHelper"] = function() {
	this._registeredAccidentals = new IntHash();
};
alphatab.rendering.utils.AccidentalHelper.__name__ = ["alphatab","rendering","utils","AccidentalHelper"];
alphatab.rendering.utils.AccidentalHelper.prototype = {
	getKeySignatureIndex: function(ks) {
		return ks + 7;
	}
	,applyAccidental: function(note,noteLine) {
		var noteValue = note.realValue();
		var ks = note.beat.voice.bar.getMasterBar().keySignature;
		var index = noteValue % 12;
		var octave = noteValue / 12 | 0;
		var accidentalToSet = alphatab.rendering.utils.AccidentalHelper.ACCIDENTAL_NOTES[ks + 7][index];
		if(this._registeredAccidentals.exists(noteLine)) {
			var registeredAccidental = this._registeredAccidentals.get(noteLine);
			if(registeredAccidental == accidentalToSet) accidentalToSet = alphatab.model.AccidentalType.None; else if(accidentalToSet == alphatab.model.AccidentalType.None) accidentalToSet = alphatab.model.AccidentalType.Natural;
		}
		if(accidentalToSet == alphatab.model.AccidentalType.None || accidentalToSet == alphatab.model.AccidentalType.Natural) this._registeredAccidentals.remove(noteLine); else this._registeredAccidentals.set(noteLine,accidentalToSet);
		return accidentalToSet;
	}
	,_registeredAccidentals: null
	,__class__: alphatab.rendering.utils.AccidentalHelper
}
alphatab.rendering.utils.BeamDirection = $hxClasses["alphatab.rendering.utils.BeamDirection"] = { __ename__ : ["alphatab","rendering","utils","BeamDirection"], __constructs__ : ["Up","Down"] }
alphatab.rendering.utils.BeamDirection.Up = ["Up",0];
alphatab.rendering.utils.BeamDirection.Up.toString = $estr;
alphatab.rendering.utils.BeamDirection.Up.__enum__ = alphatab.rendering.utils.BeamDirection;
alphatab.rendering.utils.BeamDirection.Down = ["Down",1];
alphatab.rendering.utils.BeamDirection.Down.toString = $estr;
alphatab.rendering.utils.BeamDirection.Down.__enum__ = alphatab.rendering.utils.BeamDirection;
alphatab.rendering.utils.BeamBarType = $hxClasses["alphatab.rendering.utils.BeamBarType"] = { __ename__ : ["alphatab","rendering","utils","BeamBarType"], __constructs__ : ["Full","PartLeft","PartRight"] }
alphatab.rendering.utils.BeamBarType.Full = ["Full",0];
alphatab.rendering.utils.BeamBarType.Full.toString = $estr;
alphatab.rendering.utils.BeamBarType.Full.__enum__ = alphatab.rendering.utils.BeamBarType;
alphatab.rendering.utils.BeamBarType.PartLeft = ["PartLeft",1];
alphatab.rendering.utils.BeamBarType.PartLeft.toString = $estr;
alphatab.rendering.utils.BeamBarType.PartLeft.__enum__ = alphatab.rendering.utils.BeamBarType;
alphatab.rendering.utils.BeamBarType.PartRight = ["PartRight",2];
alphatab.rendering.utils.BeamBarType.PartRight.toString = $estr;
alphatab.rendering.utils.BeamBarType.PartRight.__enum__ = alphatab.rendering.utils.BeamBarType;
alphatab.rendering.utils.BeamingHelper = $hxClasses["alphatab.rendering.utils.BeamingHelper"] = function() {
	this.beats = new Array();
	this.valueCalculator = function(n) {
		return n.realValue();
	};
	this._beatLineXPositions = new IntHash();
	this.maxDuration = alphatab.model.Duration.Whole;
};
alphatab.rendering.utils.BeamingHelper.__name__ = ["alphatab","rendering","utils","BeamingHelper"];
alphatab.rendering.utils.BeamingHelper.canJoin = function(b1,b2) {
	if(b1 == null || b2 == null || b1.isRest() || b2.isRest()) return false;
	var m1 = b1.voice.bar;
	var m2 = b1.voice.bar;
	if(m1 != m2) return false;
	var start1 = b1.start;
	var start2 = b2.start;
	if(!alphatab.rendering.utils.BeamingHelper.canJoinDuration(b1.duration) || !alphatab.rendering.utils.BeamingHelper.canJoinDuration(b2.duration)) return start1 == start2;
	var divisionLength = 960;
	switch(m1.track.score.masterBars[m1.index].timeSignatureDenominator) {
	case 8:
		if(m1.track.score.masterBars[m1.index].timeSignatureNumerator % 3 == 0) divisionLength += Math.floor(480.);
		break;
	}
	var division1 = (divisionLength + start1) / divisionLength | 0;
	var division2 = (divisionLength + start2) / divisionLength | 0;
	return division1 == division2;
}
alphatab.rendering.utils.BeamingHelper.calculateDivision = function(b,l) {
	var start = 0;
}
alphatab.rendering.utils.BeamingHelper.canJoinDuration = function(d) {
	switch( (d)[1] ) {
	case 0:
	case 1:
	case 2:
		return false;
	default:
		return true;
	}
}
alphatab.rendering.utils.BeamingHelper.prototype = {
	calculateBeamY: function(stemSize,xCorrection,xPosition,scale,yPosition) {
		var direction = this.getDirection();
		if(this.beats.length == 1) {
			if(this.getDirection() == alphatab.rendering.utils.BeamDirection.Up) return yPosition(this.maxNote) - stemSize; else return yPosition(this.minNote) + stemSize;
		}
		var maxDistance = 10 * scale | 0;
		if(direction == alphatab.rendering.utils.BeamDirection.Down && this.minNote != this.firstMinNote && this.minNote != this.lastMinNote) return yPosition(this.minNote) + stemSize; else if(direction == alphatab.rendering.utils.BeamDirection.Up && this.maxNote != this.firstMaxNote && this.maxNote != this.lastMaxNote) return yPosition(this.maxNote) - stemSize;
		var startX = this.getBeatLineX(this.firstMinNote.beat) + xCorrection;
		var startY = direction == alphatab.rendering.utils.BeamDirection.Up?yPosition(this.firstMaxNote) - stemSize:yPosition(this.firstMinNote) + stemSize;
		var endX = this.getBeatLineX(this.lastMaxNote.beat) + xCorrection;
		var endY = direction == alphatab.rendering.utils.BeamDirection.Up?yPosition(this.lastMaxNote) - stemSize:yPosition(this.lastMinNote) + stemSize;
		if(direction == alphatab.rendering.utils.BeamDirection.Down && startY > endY && startY - endY > maxDistance) endY = startY - maxDistance;
		if(direction == alphatab.rendering.utils.BeamDirection.Down && endY > startY && endY - startY > maxDistance) startY = endY - maxDistance;
		if(direction == alphatab.rendering.utils.BeamDirection.Up && startY < endY && endY - startY > maxDistance) endY = startY + maxDistance;
		if(direction == alphatab.rendering.utils.BeamDirection.Up && endY < startY && startY - endY > maxDistance) startY = endY + maxDistance;
		return (endY - startY) / (endX - startX) * (xPosition - startX) + startY | 0;
	}
	,checkNote: function(note) {
		var value = note.realValue();
		if(this.firstMinNote == null || note.beat.index < this.firstMinNote.beat.index) this.firstMinNote = note; else if(note.beat.index == this.firstMinNote.beat.index) {
			if(note.realValue() < this.firstMinNote.realValue()) this.firstMinNote = note;
		}
		if(this.firstMaxNote == null || note.beat.index < this.firstMaxNote.beat.index) this.firstMaxNote = note; else if(note.beat.index == this.firstMaxNote.beat.index) {
			if(note.realValue() > this.firstMaxNote.realValue()) this.firstMaxNote = note;
		}
		if(this.lastMinNote == null || note.beat.index > this.lastMinNote.beat.index) this.lastMinNote = note; else if(note.beat.index == this.lastMinNote.beat.index) {
			if(note.realValue() < this.lastMinNote.realValue()) this.lastMinNote = note;
		}
		if(this.lastMaxNote == null || note.beat.index > this.lastMaxNote.beat.index) this.lastMaxNote = note; else if(note.beat.index == this.lastMaxNote.beat.index) {
			if(note.realValue() > this.lastMaxNote.realValue()) this.lastMaxNote = note;
		}
		if(this.maxNote == null || value > this.maxNote.realValue()) this.maxNote = note;
		if(this.minNote == null || value < this.minNote.realValue()) this.minNote = note;
	}
	,checkBeat: function(beat) {
		var add = false;
		if(this.beats.length == 0) add = true; else if(alphatab.rendering.utils.BeamingHelper.canJoin(this._lastBeat,beat)) add = true;
		if(add) {
			this._lastBeat = beat;
			this.beats.push(beat);
			this.checkNote(beat.minNote);
			this.checkNote(beat.maxNote);
			if(alphatab.model.ModelUtils.getDurationValue(this.maxDuration) < alphatab.model.ModelUtils.getDurationValue(beat.duration)) this.maxDuration = beat.duration;
		}
		return add;
	}
	,getDirection: function() {
		var avg = (this.valueCalculator(this.maxNote) + this.valueCalculator(this.minNote)) / 2 | 0;
		return avg <= alphatab.rendering.utils.BeamingHelper.SCORE_MIDDLE_KEYS[this._lastBeat.voice.bar.clef[1]]?alphatab.rendering.utils.BeamDirection.Up:alphatab.rendering.utils.BeamDirection.Down;
	}
	,registerBeatLineX: function(beat,up,down) {
		this._beatLineXPositions.set(beat.index,{ up : up, down : down});
	}
	,getBeatLineX: function(beat) {
		if(this._beatLineXPositions.exists(beat.index)) {
			if(this.getDirection() == alphatab.rendering.utils.BeamDirection.Up) return this._beatLineXPositions.get(beat.index).up; else return this._beatLineXPositions.get(beat.index).down;
		}
		return 0;
	}
	,_beatLineXPositions: null
	,valueCalculator: null
	,maxNote: null
	,minNote: null
	,lastMaxNote: null
	,lastMinNote: null
	,firstMaxNote: null
	,firstMinNote: null
	,maxDuration: null
	,_lastBeat: null
	,beats: null
	,__class__: alphatab.rendering.utils.BeamingHelper
}
var haxe = haxe || {}
haxe.Int32 = $hxClasses["haxe.Int32"] = function() { }
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = $hxClasses["haxe.io.BytesBuffer"] = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,b: null
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = $hxClasses["haxe.io.Input"] = function() { }
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return Std.parseInt((((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * Math.pow(2,32)).toString()) + Std.parseInt(((bytes[4] >> 7) * Math.pow(2,31)).toString()) + Std.parseInt(((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]).toString());
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?(ch1 << 8 | ch2) << 16 | (ch3 << 8 | ch4):(ch4 << 8 | ch3) << 16 | (ch2 << 8 | ch1);
	}
	,readUInt30: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if((this.bigEndian?ch1:ch4) >= 64) throw haxe.io.Error.Overflow;
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readInt31: function() {
		var ch1, ch2, ch3, ch4;
		if(this.bigEndian) {
			ch4 = this.readByte();
			ch3 = this.readByte();
			ch2 = this.readByte();
			ch1 = this.readByte();
		} else {
			ch1 = this.readByte();
			ch2 = this.readByte();
			ch3 = this.readByte();
			ch4 = this.readByte();
		}
		if((ch4 & 128) == 0 != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,bigEndian: null
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesInput = $hxClasses["haxe.io.BytesInput"] = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,len: null
	,pos: null
	,b: null
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = $hxClasses["haxe.io.Output"] = function() { }
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.Output.prototype = {
	writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,writeInput: function(i,bufsize) {
		if(bufsize == null) bufsize = 4096;
		var buf = haxe.io.Bytes.alloc(bufsize);
		try {
			while(true) {
				var len = i.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				var p = 0;
				while(len > 0) {
					var k = this.writeBytes(buf,p,len);
					if(k == 0) throw haxe.io.Error.Blocked;
					p += k;
					len -= k;
				}
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
	}
	,prepare: function(nbytes) {
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(haxe.Int32.toInt(x >>> 24));
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
		} else {
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 24));
		}
	}
	,writeUInt30: function(x) {
		if(x < 0 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeInt31: function(x) {
		if(x < -1073741824 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeUInt24: function(x) {
		if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 16);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16);
		}
	}
	,writeInt24: function(x) {
		if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
		this.writeUInt24(x & 16777215);
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt16: function(x) {
		if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
		this.writeUInt16(x & 65535);
	}
	,writeInt8: function(x) {
		if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
		this.writeByte(x & 255);
	}
	,writeDouble: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
		var sig_h = sig & 34359738367;
		var sig_l = Math.floor(sig / Math.pow(2,32));
		var b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15, b3 = sig_l >> 8 & 255, b4 = sig_l & 255, b5 = sig_h >> 24 & 255, b6 = sig_h >> 16 & 255, b7 = sig_h >> 8 & 255, b8 = sig_h & 255;
		if(this.bigEndian) {
			this.writeByte(b8);
			this.writeByte(b7);
			this.writeByte(b6);
			this.writeByte(b5);
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
			this.writeByte(b5);
			this.writeByte(b6);
			this.writeByte(b7);
			this.writeByte(b8);
		}
	}
	,writeFloat: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
		var b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 127 << 7 & 255 | sig >> 16 & 127, b3 = sig >> 8 & 255, b4 = sig & 255;
		if(this.bigEndian) {
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,flush: function() {
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,writeByte: function(c) {
		throw "Not implemented";
	}
	,bigEndian: null
	,__class__: haxe.io.Output
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesOutput = $hxClasses["haxe.io.BytesOutput"] = function() {
	this.b = new haxe.io.BytesBuffer();
};
haxe.io.BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	getBytes: function() {
		return this.b.getBytes();
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,b: null
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = $hxClasses["haxe.io.Eof"] = function() {
};
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
alphatab.audio.MidiUtils.QUARTER_TIME = 960;
alphatab.importer.ScoreImporter.UNSUPPORTED_FORMAT = "unsupported file";
alphatab.importer.AlphaTexImporter.EOL = String.fromCharCode(0);
alphatab.importer.AlphaTexImporter.TRACK_CHANNELS = [0,1];
alphatab.importer.Gp3To5Importer.VERSION_STRING = "FICHIER GUITAR PRO ";
alphatab.importer.Gp3To5Importer.BEND_STEP = 25;
alphatab.model.Tuning.TUNING_REGEX = new EReg("([a-g]b?)([0-9])","i");
alphatab.platform.PlatformFactory.SVG_CANVAS = "svg";
alphatab.platform.model.Font.STYLE_PLAIN = 0;
alphatab.platform.model.Font.STYLE_BOLD = 1;
alphatab.platform.model.Font.STYLE_ITALIC = 2;
alphatab.platform.svg.FontSizes.TIMES_NEW_ROMAN_11PT = [3,4,5,6,6,9,9,2,4,4,6,6,3,4,3,3,6,6,6,6,6,6,6,6,6,6,3,3,6,6,6,5,10,8,7,7,8,7,6,7,8,4,4,8,7,10,8,8,7,8,7,5,8,8,7,11,8,8,7,4,3,4,5,6,4,5,5,5,5,5,4,5,6,3,3,6,3,9,6,6,6,5,4,4,4,5,6,7,6,6,5,5,2,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,6,6,6,6,2,5,4,8,4,6,6,0,8,6,4,6,3,3,4,5,5,4,4,3,3,6,8,8,8,5,8,8,8,8,8,8,11,7,7,7,7,7,4,4,4,4,8,8,8,8,8,8,8,6,8,8,8,8,8,8,6,5,5,5,5,5,5,5,8,5,5,5,5,5,3,3,3,3,6,6,6,6,6,6,6,6,6,5,5,5,5,6,6];
alphatab.platform.svg.FontSizes.ARIAL_11PT = [3,2,4,6,6,10,7,2,4,4,4,6,3,4,3,3,6,6,6,6,6,6,6,6,6,6,3,3,6,6,6,6,11,8,7,7,7,6,6,8,7,2,5,7,6,8,7,8,6,8,7,7,6,7,8,10,7,8,7,3,3,3,5,6,4,6,6,6,6,6,4,6,6,2,2,5,2,8,6,6,6,6,4,6,3,6,6,10,6,6,6,4,2,4,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,6,6,7,6,2,6,4,8,4,6,6,0,8,6,4,6,4,4,4,6,6,4,4,4,5,6,9,10,10,6,8,8,8,8,8,8,11,7,6,6,6,6,2,2,2,2,8,7,8,8,8,8,8,6,8,7,7,7,7,8,7,7,6,6,6,6,6,6,10,6,6,6,6,6,2,2,2,2,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6];
alphatab.platform.svg.FontSizes.CONTROL_CHARS = 32;
alphatab.rendering.GlyphBarRenderer.FirstGlyphSpacing = 10;
alphatab.rendering.ScoreBarRenderer.STEPS_PER_OCTAVE = 7;
alphatab.rendering.ScoreBarRenderer.OCTAVE_STEPS = [32,30,26,38];
alphatab.rendering.ScoreBarRenderer.SHARP_NOTE_STEPS = [0,0,1,1,2,3,3,4,4,5,5,6];
alphatab.rendering.ScoreBarRenderer.FLAT_NOTE_STEPS = [0,1,1,2,2,3,4,4,5,5,6,6];
alphatab.rendering.ScoreBarRenderer.SHARP_KS_STEPS = [1,4,0,3,6,2,5];
alphatab.rendering.ScoreBarRenderer.FLAT_KS_STEPS = [7,4,8,5,9,6,10];
alphatab.rendering.ScoreBarRenderer.LineSpacing = 8;
alphatab.rendering.ScoreBarRenderer.NOTE_STEP_CORRECTION = 1;
alphatab.rendering.TabBarRenderer.LineSpacing = 10;
alphatab.rendering.glyphs.AccidentalGroupGlyph.NON_RESERVED = -3000;
alphatab.rendering.glyphs.DiamondNoteHeadGlyph.noteHeadHeight = 9;
alphatab.rendering.glyphs.FlatGlyph.CORRECTION = -8;
alphatab.rendering.glyphs.MusicFont.Accent = "M 1 -1 L 156 45 L 1 92 V 80 L 116 45 L 1 10 V -1 Z ";
alphatab.rendering.glyphs.MusicFont.AccentHeavy = "M 42 -2 L 97 153 H 71 L 36 53 L 8 153 H 0 L 42 -2 Z ";
alphatab.rendering.glyphs.MusicFont.Caesura = "M 0 190 L 106 0 H 124 L 18 190 H 0 Z M 65 190 L 171 0 H 190 L 83 190 H 65 Z ";
alphatab.rendering.glyphs.MusicFont.ClefC = "M 0 153 V -193 V -201 H 40 V 145 V 153 H 0 Z M 61 153 V -193 V -201 H 74 V -27 Q 83 -32 93 -48 T 109 -81 T 116 -108 Q 120 -89 126 -77 T 141 -61 T 157 -56 Q 178 -56 183 -75 T 189 -119 Q 189 -131 188 -141 T 185 -160 T 177 -178 T 162 -188 Q 154 -190 146 -190 Q 138 -190 133 -188 T 128 -181 Q 129 -177 134 -171 T 140 -163 T 142 -155 Q 142 -146 136 -139 T 119 -133 Q 108 -133 102 -140 T 95 -158 Q 95 -172 105 -182 T 127 -197 T 154 -202 Q 170 -202 184 -196 T 210 -180 T 228 -155 T 234 -120 Q 234 -93 224 -76 T 198 -50 T 165 -41 Q 147 -42 134 -49 L 118 -24 L 134 1 Q 151 -4 167 -4 Q 188 -4 203 6 T 226 36 T 234 73 Q 234 95 225 113 T 197 142 T 157 153 Q 131 152 113 141 T 95 107 Q 96 97 103 91 T 118 84 Q 128 84 135 91 T 143 107 Q 143 111 141 115 T 136 122 T 131 129 T 129 134 Q 129 138 134 141 T 147 144 Q 172 143 181 123 T 189 73 Q 189 47 183 28 T 157 8 Q 139 8 130 23 T 117 59 Q 114 42 108 26 T 92 -2 T 74 -21 V 153 H 61 Z ";
alphatab.rendering.glyphs.MusicFont.ClefF = "M 0 290 Q 37 265 54 252 T 92 220 T 124 176 Q 134 159 142 135 T 149 91 Q 149 71 144 53 T 126 23 T 93 11 Q 74 11 56 19 T 32 45 Q 32 46 31 49 Q 31 53 35 55 T 41 57 Q 42 57 49 56 T 59 54 Q 71 54 81 63 T 91 84 Q 91 93 86 101 T 73 113 T 54 118 Q 35 118 22 106 T 9 76 Q 9 52 23 35 T 60 9 T 105 0 Q 130 0 153 13 T 188 48 T 201 95 Q 201 140 171 179 T 97 246 Q 68 265 2 298 L 0 290 Z M 216 49 Q 216 40 222 35 T 237 29 Q 245 29 251 35 T 257 49 Q 257 58 251 64 T 236 69 Q 228 69 222 63 T 216 49 Z M 216 131 Q 216 122 222 116 T 237 110 Q 244 110 251 117 T 257 131 Q 257 139 251 145 T 237 151 Q 228 151 222 145 T 216 131 Z ";
alphatab.rendering.glyphs.MusicFont.ClefG = "M 129 43 Q 115 47 103 61 T 90 92 Q 90 103 97 116 T 118 134 Q 123 135 123 139 Q 123 140 119 141 Q 97 135 83 118 T 69 77 Q 70 53 84 32 T 120 2 L 109 -53 Q 73 -23 50 9 T 26 81 Q 26 99 33 115 T 53 145 Q 80 172 123 173 Q 137 172 154 168 L 129 43 Z M 141 42 L 165 164 Q 202 149 202 100 Q 200 84 192 70 T 171 49 T 141 42 Z M 108 -122 Q 116 -127 126 -139 T 145 -166 T 159 -197 T 165 -227 Q 165 -233 164 -238 Q 163 -247 158 -251 T 147 -256 Q 132 -256 121 -238 Q 112 -223 107 -202 T 101 -161 Q 102 -137 108 -122 Z M 98 -113 Q 87 -152 86 -192 Q 86 -218 91 -240 T 105 -279 T 125 -304 Q 136 -312 140 -312 Q 143 -312 145 -310 T 152 -302 Q 180 -262 180 -206 Q 180 -179 173 -153 T 152 -103 T 120 -63 L 133 0 Q 143 -2 147 -2 Q 165 -2 180 5 T 205 26 T 222 55 T 227 90 Q 227 118 213 141 T 168 175 Q 170 187 175 209 T 182 243 T 184 268 Q 184 287 175 302 T 150 325 T 116 333 Q 90 333 70 318 T 50 278 Q 51 267 55 257 T 68 241 T 87 234 Q 97 234 105 239 T 118 253 T 123 272 Q 123 286 114 296 T 90 306 H 86 Q 95 321 117 321 Q 127 321 138 316 T 157 304 T 168 288 Q 171 278 171 261 Q 171 250 169 238 T 163 208 T 156 180 Q 142 184 126 184 Q 100 184 77 173 T 37 143 T 10 100 T 0 50 Q 0 26 9 4 T 31 -37 T 59 -73 T 98 -113 Z ";
alphatab.rendering.glyphs.MusicFont.ClefNeutral = "M 21 -1 V 185 H 0 V -1 H 21 Z M 64 -1 V 185 H 42 V -1 H 64 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicF = "M 128 59 H 160 V 72 H 124 Q 108 125 96 151 Q 88 170 79 183 T 59 205 T 29 217 Q 18 217 9 209 T 0 190 Q 0 182 4 175 T 19 166 Q 25 166 30 171 T 35 182 Q 35 186 33 189 T 27 196 T 21 203 Q 22 207 25 207 Q 36 207 45 193 T 60 160 T 73 112 T 85 72 H 61 V 59 H 90 Q 97 43 108 29 T 135 7 T 167 -1 Q 174 -1 178 0 T 185 5 T 189 11 T 192 16 Q 192 27 186 37 T 169 47 Q 168 46 164 44 T 159 41 T 157 35 Q 158 22 168 18 Q 175 16 175 13 Q 175 8 167 7 Q 153 7 142 26 Q 135 37 128 59 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicFf = "M 127 72 Q 123 91 116 112 T 102 150 T 87 176 Q 66 212 40 217 Q 33 217 31 217 Q 18 217 10 209 T 3 189 Q 3 173 23 167 Q 29 168 34 172 T 38 183 Q 38 188 36 192 T 30 198 T 26 202 Q 24 204 24 204 Q 24 207 29 207 Q 42 207 50 192 T 63 161 Q 67 150 72 133 T 81 100 T 89 72 H 64 V 60 H 94 Q 100 45 112 31 T 139 8 T 174 0 Q 184 0 190 6 T 195 21 Q 195 31 189 38 T 173 46 Q 162 46 161 36 Q 162 30 166 24 T 177 16 Q 179 16 179 13 Q 179 12 176 11 T 169 9 Q 145 9 131 59 H 193 Q 203 34 224 17 T 273 0 Q 284 0 289 7 T 294 22 Q 294 32 288 38 T 272 46 Q 261 46 260 36 Q 261 29 265 24 T 276 16 Q 278 16 278 13 Q 278 12 275 11 T 268 9 Q 253 9 244 25 T 230 60 H 263 V 72 H 227 Q 219 102 208 132 T 186 176 Q 177 192 166 203 T 138 217 Q 132 217 130 217 Q 117 217 109 209 T 101 189 Q 102 179 107 175 T 121 167 Q 128 168 133 172 T 137 183 Q 137 188 134 193 T 123 204 Q 123 207 127 207 Q 149 207 162 161 Q 167 147 170 135 T 180 101 T 188 72 H 127 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicFff = "M 224 72 Q 217 102 206 131 T 184 176 Q 174 192 163 203 T 136 217 Q 130 217 127 217 Q 114 217 107 209 T 99 189 Q 100 179 104 175 T 118 167 Q 125 168 130 172 T 134 183 Q 134 190 120 204 Q 120 207 125 207 Q 146 207 160 161 Q 164 149 168 132 T 177 99 T 185 72 H 125 Q 118 101 106 131 T 84 176 Q 63 212 37 217 Q 31 217 29 217 Q 15 217 8 209 T 0 189 Q 1 179 5 174 T 19 167 Q 26 168 31 172 T 35 183 Q 35 187 33 191 T 27 198 T 21 204 Q 21 207 25 207 Q 32 207 38 202 T 48 190 T 54 179 T 61 161 Q 64 151 69 133 T 78 99 T 86 72 H 61 V 60 H 91 Q 97 44 109 30 T 136 8 T 171 0 Q 182 0 187 6 T 193 21 Q 193 31 187 38 T 171 46 Q 159 46 158 36 Q 159 30 163 24 T 174 16 Q 177 16 177 13 Q 177 12 174 11 T 166 9 Q 151 9 142 25 T 128 59 H 190 Q 200 34 221 17 T 270 0 Q 281 0 286 6 T 291 21 Q 291 31 286 38 T 270 46 Q 258 46 257 36 Q 258 29 262 24 T 273 16 Q 275 16 275 13 Q 275 12 273 11 T 265 9 Q 240 9 227 60 H 289 Q 299 35 320 17 T 369 0 Q 380 0 385 6 T 391 22 Q 391 31 384 38 T 369 46 Q 358 46 357 36 Q 357 30 362 24 T 372 16 Q 375 16 375 13 Q 375 12 372 11 T 364 9 Q 339 9 326 60 H 359 V 72 H 323 Q 319 92 312 112 T 297 150 T 283 176 Q 273 191 262 202 T 235 217 Q 229 217 227 217 Q 213 217 206 209 T 198 189 Q 199 179 204 174 T 218 167 Q 225 168 229 172 T 233 182 Q 233 187 231 190 T 225 198 T 219 204 Q 219 207 224 207 Q 236 207 244 193 T 259 161 Q 263 148 267 133 T 276 101 T 284 72 H 224 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicMf = "M 209 59 Q 215 44 227 30 T 254 7 T 290 0 Q 300 0 305 6 T 310 21 Q 310 31 304 38 T 289 45 Q 278 45 277 35 Q 278 29 282 23 T 292 15 Q 294 15 294 13 Q 294 11 292 10 T 284 8 Q 259 8 246 59 H 279 V 72 H 243 Q 239 91 232 112 T 217 149 T 203 176 Q 193 191 182 202 T 155 216 Q 149 217 147 217 Q 134 217 126 208 T 118 189 Q 119 179 124 174 T 138 166 Q 145 167 149 171 T 154 182 Q 154 187 152 190 T 146 197 T 139 204 Q 139 206 144 206 Q 166 206 178 160 Q 183 148 186 137 T 196 102 T 205 72 H 180 V 59 H 209 Z M 16 153 L 44 78 Q 45 72 45 70 Q 45 66 41 66 Q 35 66 26 77 T 8 109 H 0 Q 11 85 22 70 T 52 54 Q 65 54 67 69 Q 83 53 96 53 Q 111 53 112 69 Q 119 62 128 58 T 146 53 Q 160 53 160 65 Q 160 68 159 74 L 139 133 Q 138 136 137 138 T 136 142 Q 136 145 140 146 Q 152 145 171 113 H 178 Q 172 123 166 134 T 151 151 T 133 159 Q 114 159 109 142 Q 110 136 113 127 T 117 117 L 131 78 Q 132 77 132 75 T 133 72 Q 133 67 128 67 Q 117 67 112 82 L 87 153 H 60 L 87 77 Q 88 75 88 72 Q 88 67 83 67 Q 73 67 68 82 L 42 153 H 16 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicMp = "M 14 153 L 40 80 Q 42 74 42 72 Q 42 67 38 67 Q 32 67 23 79 T 8 109 H 0 Q 6 88 20 70 T 52 51 Q 67 51 67 67 Q 72 61 81 56 T 97 52 Q 111 52 111 67 Q 118 60 127 56 T 144 52 Q 158 52 158 66 Q 158 71 158 74 L 137 135 Q 137 137 136 142 Q 136 147 139 148 Q 145 147 153 138 T 169 112 L 175 114 Q 165 136 155 148 T 129 160 Q 112 160 108 143 Q 108 139 109 134 T 112 125 T 114 117 L 128 80 Q 130 75 130 72 Q 130 65 125 65 Q 122 65 119 68 T 114 78 T 111 85 L 85 153 H 58 L 85 80 Q 86 73 86 72 Q 86 65 81 65 Q 78 65 76 68 T 70 79 T 67 85 L 43 153 H 14 Z M 187 129 L 205 80 Q 206 74 206 71 Q 206 67 203 67 Q 200 67 196 71 Q 187 81 181 91 H 172 Q 175 83 181 75 T 195 60 T 212 54 Q 226 54 231 67 Q 238 61 248 57 T 267 53 Q 283 53 291 65 T 300 94 Q 300 110 292 125 T 272 150 T 243 160 Q 229 160 216 149 L 202 191 Q 201 193 200 198 Q 200 202 205 204 T 219 206 V 217 H 134 V 206 Q 150 206 157 201 T 166 188 L 187 129 Z M 234 97 Q 228 111 226 133 Q 228 148 233 148 Q 252 144 264 105 Q 267 91 267 80 Q 267 66 260 65 Q 248 65 234 97 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicP = "M 125 65 Q 114 65 106 78 T 94 107 T 90 132 Q 90 146 99 146 Q 108 146 116 133 T 129 103 T 134 78 Q 134 65 125 65 Z M 35 109 H 26 Q 39 84 51 68 T 82 53 Q 86 53 90 57 T 93 69 Q 98 66 103 63 T 114 58 T 124 54 T 133 53 Q 150 53 158 63 T 165 91 Q 165 102 161 114 T 148 136 T 130 152 T 107 159 Q 101 159 94 155 T 83 145 L 64 199 Q 64 199 63 201 Q 64 205 67 205 H 86 V 217 H 0 V 205 H 19 Q 22 205 24 203 T 28 198 L 72 73 V 71 Q 72 68 71 67 T 69 65 Q 64 65 59 71 T 49 83 T 41 98 T 35 109 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicPp = "M 82 146 L 64 199 Q 64 199 63 201 Q 64 205 67 205 H 86 V 217 H 0 V 205 H 19 Q 22 205 24 203 T 28 198 L 72 73 V 71 Q 72 68 71 67 T 69 65 Q 64 65 59 71 T 49 83 T 41 98 T 35 109 H 26 Q 39 84 51 69 T 81 53 Q 86 53 89 57 T 93 69 Q 110 53 133 53 Q 144 53 151 58 T 162 72 T 165 91 Q 165 106 157 122 T 136 149 T 107 159 Q 95 159 82 146 Z M 222 146 L 203 199 Q 203 199 203 200 T 203 200 Q 204 205 208 205 H 226 V 217 H 139 V 205 H 159 Q 162 205 165 203 T 168 198 L 213 73 V 72 Q 213 69 211 67 T 209 65 Q 201 65 191 81 T 176 109 H 167 Q 174 94 181 82 T 198 62 T 222 53 Q 226 53 229 57 T 234 69 Q 250 53 273 53 Q 289 53 297 64 T 305 91 Q 305 106 297 122 T 276 148 T 247 159 Q 240 159 234 155 T 222 146 Z M 266 65 Q 254 65 246 78 T 234 107 T 230 132 Q 232 146 240 146 Q 248 146 256 133 T 269 103 T 274 78 Q 274 65 266 65 Z M 125 65 Q 114 65 106 78 T 94 107 T 90 132 Q 90 146 99 146 Q 108 146 116 133 T 129 103 T 134 78 Q 134 65 125 65 Z ";
alphatab.rendering.glyphs.MusicFont.DynamicPpp = "M 82 146 L 64 199 Q 64 199 63 201 Q 64 205 67 205 H 86 V 217 H 0 V 205 H 19 Q 22 205 24 203 T 28 198 L 72 73 V 71 Q 72 68 71 67 T 69 65 Q 64 65 59 71 T 49 83 T 41 98 T 35 109 H 26 Q 39 84 51 69 T 81 53 Q 86 53 89 57 T 93 69 Q 110 53 133 53 Q 144 53 151 58 T 162 72 T 165 91 Q 165 106 157 122 T 136 149 T 107 159 Q 95 159 82 146 Z M 222 146 L 203 199 Q 203 199 203 200 T 203 200 Q 204 205 208 205 H 226 V 217 H 139 V 205 H 159 Q 162 205 165 203 T 168 198 L 213 73 V 72 Q 213 69 211 67 T 209 65 Q 201 65 191 81 T 176 109 H 167 Q 174 94 181 82 T 198 62 T 222 53 Q 226 53 229 57 T 234 69 Q 250 53 273 53 Q 289 53 297 64 T 305 91 Q 305 106 297 122 T 276 148 T 247 159 Q 240 159 234 155 T 222 146 Z M 363 146 L 345 200 Q 345 200 345 200 T 344 201 Q 345 205 348 205 H 366 V 217 H 281 V 205 H 300 Q 302 205 305 203 T 309 198 L 353 73 V 71 Q 353 68 352 67 T 349 66 Q 336 66 316 110 H 307 Q 320 84 332 69 T 362 53 Q 366 53 370 58 T 375 69 Q 391 53 414 53 Q 430 53 438 64 T 446 91 Q 446 106 438 122 T 417 149 T 388 159 Q 373 159 363 146 Z M 407 65 Q 395 65 387 78 T 375 107 T 371 132 Q 371 139 373 143 T 380 146 Q 388 146 396 133 T 409 103 T 414 78 Q 414 65 407 65 Z M 266 65 Q 254 65 246 78 T 234 107 T 230 132 Q 232 146 240 146 Q 248 146 256 133 T 269 103 T 274 78 Q 274 65 266 65 Z M 125 65 Q 114 65 106 78 T 94 107 T 90 132 Q 90 146 99 146 Q 108 146 116 133 T 129 103 T 134 78 Q 134 65 125 65 Z ";
alphatab.rendering.glyphs.MusicFont.FooterEighth = "M 2 106 V -1 H 11 Q 14 20 20 34 T 32 59 T 54 85 T 77 113 Q 104 147 104 185 Q 104 223 71 279 H 65 Q 70 269 75 256 T 84 233 T 90 212 T 93 192 Q 93 176 86 160 T 68 130 T 42 108 T 11 99 V 106 H 2 Z ";
alphatab.rendering.glyphs.MusicFont.FooterSixteenth = "M 98 196 Q 108 217 108 241 Q 108 272 89 303 H 83 Q 100 267 100 242 Q 100 224 92 210 T 71 186 T 38 163 T 11 147 V 154 H 2 V -1 H 11 Q 12 15 18 27 T 29 45 T 52 66 T 77 92 Q 91 109 97 125 T 103 159 Q 103 173 98 196 Z M 93 185 Q 93 183 94 178 T 94 171 Q 94 114 11 68 Q 12 86 20 102 T 44 133 T 72 161 T 93 185 Z ";
alphatab.rendering.glyphs.MusicFont.GraceBeforeBeatUp = "M 52 142 V 95 L 32 109 V 103 L 52 88 V 0 H 58 Q 58 13 63 23 T 79 43 T 93 60 L 107 52 V 58 L 96 66 Q 102 77 102 90 Q 102 112 87 137 H 84 Q 96 112 96 96 Q 96 82 90 70 L 57 92 V 155 Q 57 165 45 175 T 19 184 Q 4 184 0 168 Q 0 162 6 155 T 20 143 T 38 138 Q 45 138 52 142 Z M 87 66 Q 78 50 57 48 V 86 L 87 66 Z ";
alphatab.rendering.glyphs.MusicFont.KeyFlat = "M 0 65 V -140 H 8 V -20 Q 21 -32 35 -32 Q 46 -32 53 -25 T 61 -6 Q 60 2 54 10 T 38 28 T 17 46 T 0 65 Z M 8 -6 V 44 Q 23 28 30 17 T 38 -5 Q 37 -13 34 -16 T 25 -20 Q 15 -20 8 -6 Z ";
alphatab.rendering.glyphs.MusicFont.KeyNatural = "M 10 111 V 159 L 54 148 V 100 L 10 111 Z M 0 197 V 0 H 10 V 76 L 65 62 V 261 H 54 V 184 L 0 197 Z ";
alphatab.rendering.glyphs.MusicFont.KeySharp = "M 14 42 V -1 L 0 1 V -28 L 14 -32 V -93 H 23 V -35 L 44 -40 V -100 H 54 V -42 L 69 -46 V -15 L 54 -11 V 32 L 69 28 V 60 L 54 64 V 121 H 44 V 66 L 23 72 V 132 H 14 V 74 L 0 78 V 46 L 14 42 Z M 44 34 V -9 L 23 -4 V 39 L 44 34 Z ";
alphatab.rendering.glyphs.MusicFont.NaturalHarmonic = "M 21 5 Q 13 5 9 10 T 4 23 Q 4 31 9 36 T 22 41 Q 30 41 35 35 T 39 21 Q 38 5 21 5 Z M 22 46 Q 12 46 6 39 T 0 23 Q 0 13 6 7 T 22 0 Q 31 0 37 6 T 44 21 Q 44 32 38 39 T 22 46 Z ";
alphatab.rendering.glyphs.MusicFont.NoteDead = "M 64 96 V 80 Q 64 72 60 68 T 48 64 Q 41 64 36 68 T 32 79 V 96 H 0 V 64 H 20 Q 25 63 28 59 T 32 48 Q 32 42 28 36 T 22 31 H 0 V 0 H 32 V 18 Q 32 23 36 27 T 48 31 Q 55 31 59 27 T 64 19 V 0 H 99 V 31 H 77 Q 72 32 68 37 T 64 48 Q 64 54 68 59 T 77 64 H 99 V 96 H 64 Z ";
alphatab.rendering.glyphs.MusicFont.NoteFull = "M 46 37 Q 47 57 58 71 T 85 84 Q 97 83 102 76 T 107 53 Q 105 32 94 19 T 67 5 Q 55 7 51 13 T 46 37 Z M 0 45 Q 0 28 12 17 T 42 2 T 74 -1 Q 91 -1 108 2 T 139 17 T 153 45 Q 153 62 141 72 T 111 87 T 77 92 Q 61 92 43 88 T 13 73 T 0 45 Z ";
alphatab.rendering.glyphs.MusicFont.NoteHalf = "M 0 60 Q 0 44 11 30 T 38 9 T 71 0 Q 94 0 102 9 T 111 40 Q 111 56 99 69 T 71 91 T 39 100 Q 18 100 9 91 T 0 60 Z M 38 39 Q 28 45 20 57 T 11 76 Q 11 85 21 85 Q 30 85 44 78 T 67 64 Q 99 39 99 22 Q 98 14 88 14 Q 72 14 38 39 Z ";
alphatab.rendering.glyphs.MusicFont.NoteQuarter = "M 111 31 Q 111 47 99 61 T 70 83 T 37 91 Q 22 91 11 82 T 0 58 Q 0 41 11 28 T 41 6 T 74 0 Q 91 0 101 6 T 111 31 Z ";
alphatab.rendering.glyphs.MusicFont.NoteQuarterDiamond = "M 111 55 L 55 110 L 0 55 L 55 0 L 111 55 Z ";
alphatab.rendering.glyphs.MusicFont.NoteRideCrymbal = "M 0 49 Q 37 22 55 0 Q 65 12 74 21 T 92 37 T 112 50 Q 80 69 55 99 Q 48 86 32 70 T 0 49 Z M 25 40 L 66 76 L 87 57 L 45 21 L 25 40 Z ";
alphatab.rendering.glyphs.MusicFont.NoteTriangle = "M 55 2 L 111 103 H 0 L 55 2 Z ";
alphatab.rendering.glyphs.MusicFont.NoteWholeDiamond = "M 111 55 L 55 110 L 0 55 L 55 0 L 111 55 Z M 94 55 L 55 16 L 16 55 L 55 94 L 94 55 Z ";
alphatab.rendering.glyphs.MusicFont.NoteX = "M 54 44 L 101 -1 L 111 9 L 65 54 L 110 100 L 100 110 L 55 65 L 9 110 L 0 98 L 45 54 L 0 9 L 9 0 L 54 44 Z ";
alphatab.rendering.glyphs.MusicFont.Num0 = "M 0 90 Q 0 66 8 47 T 33 19 T 67 9 Q 85 9 101 19 T 125 49 T 134 90 Q 134 111 125 130 T 100 160 T 68 171 Q 51 171 35 161 T 10 133 T 0 90 Z M 67 160 Q 93 160 94 90 Q 94 61 87 40 T 67 19 Q 53 19 46 40 T 38 90 Q 39 120 45 140 T 67 160 Z ";
alphatab.rendering.glyphs.MusicFont.Num1 = "M 15 168 V 157 Q 26 157 30 151 T 34 133 V 54 L 8 95 L 0 91 L 33 12 H 74 V 135 Q 74 146 78 151 T 93 157 V 168 H 15 Z ";
alphatab.rendering.glyphs.MusicFont.Num2 = "M 0 165 Q 0 162 0 156 Q 0 144 5 136 T 18 122 T 41 106 T 67 87 Q 74 82 79 70 T 85 48 Q 85 36 78 28 T 55 20 Q 47 20 39 23 T 32 30 Q 33 34 35 35 T 42 41 T 50 47 T 53 56 Q 53 66 45 72 T 28 79 Q 19 79 11 71 T 4 50 Q 4 37 14 28 T 37 13 T 67 8 Q 91 8 107 20 T 123 54 Q 123 69 113 79 T 88 96 T 59 109 T 41 121 Q 51 119 56 119 Q 66 119 74 121 T 91 128 T 103 132 Q 112 132 115 112 H 126 Q 126 143 116 156 T 90 170 Q 82 170 75 167 T 60 158 T 45 149 T 32 145 Q 25 145 19 151 T 12 165 H 0 Z ";
alphatab.rendering.glyphs.MusicFont.Num3 = "M 80 86 Q 92 88 101 93 T 115 106 T 120 124 Q 120 139 111 150 T 85 165 T 52 170 Q 27 169 14 159 T 0 135 Q 0 125 6 117 T 22 109 Q 22 109 22 109 T 23 109 Q 35 110 41 116 T 47 132 Q 47 136 43 142 T 39 151 Q 42 159 51 159 Q 61 159 71 152 T 81 133 Q 81 112 70 102 T 36 93 V 81 Q 59 81 69 74 T 79 49 Q 79 36 71 28 T 51 20 Q 38 20 34 28 Q 34 29 38 32 T 46 38 T 48 50 Q 48 59 41 65 T 25 70 Q 16 70 9 63 T 3 46 Q 3 29 20 19 T 61 8 Q 82 8 100 18 T 118 46 Q 118 80 80 86 Z ";
alphatab.rendering.glyphs.MusicFont.Num4 = "M 45 167 V 156 Q 54 156 59 151 T 64 134 V 125 H 0 V 113 Q 18 92 28 70 T 42 12 H 96 Q 94 17 85 29 T 64 57 T 38 87 T 13 113 H 64 V 81 L 104 42 V 113 H 122 V 125 H 104 V 136 Q 104 157 122 157 V 167 H 45 Z ";
alphatab.rendering.glyphs.MusicFont.Num5 = "M 4 93 L 6 12 Q 31 17 55 17 Q 75 17 97 12 Q 94 30 81 38 T 48 46 Q 32 46 16 42 L 15 77 Q 33 65 55 65 Q 70 65 83 71 T 103 89 T 111 115 Q 111 131 102 143 T 77 161 T 45 167 Q 34 167 23 163 T 6 151 T 0 131 Q 0 119 6 112 T 22 105 Q 32 105 38 112 T 44 128 Q 44 131 43 133 T 38 139 T 34 145 T 33 149 Q 33 157 45 157 Q 60 157 67 144 T 74 115 Q 74 106 70 97 T 59 82 T 43 76 Q 36 76 28 81 T 14 93 H 4 Z ";
alphatab.rendering.glyphs.MusicFont.Num6 = "M 64 90 Q 54 90 49 101 T 42 125 Q 42 139 48 149 T 64 160 Q 74 160 80 148 T 85 119 Q 84 107 78 98 T 64 90 Z M 39 92 Q 58 80 78 80 Q 91 80 102 85 T 118 99 T 124 119 Q 124 134 115 146 T 93 165 T 64 171 Q 44 171 29 160 T 8 130 T 0 92 Q 0 67 9 46 T 36 18 Q 56 9 71 9 Q 84 9 95 14 T 111 27 T 117 43 Q 116 54 110 60 T 93 66 Q 84 66 77 60 T 70 47 Q 70 44 73 37 T 76 25 Q 76 20 68 20 Q 41 20 39 80 Q 39 84 39 92 Z ";
alphatab.rendering.glyphs.MusicFont.Num7 = "M 104 52 Q 88 66 74 67 Q 64 65 60 61 Q 51 52 45 47 T 32 41 Q 20 41 11 63 H 0 V 14 H 11 Q 13 22 18 23 Q 22 22 25 21 T 32 16 T 41 11 T 50 9 Q 69 9 84 26 Q 89 33 98 34 Q 111 33 115 14 H 127 Q 124 38 118 52 T 101 85 T 84 123 T 79 170 H 24 Q 24 148 35 132 T 68 95 T 97 69 T 104 52 Z ";
alphatab.rendering.glyphs.MusicFont.Num8 = "M 42 97 Q 32 105 28 112 T 22 127 Q 25 141 35 150 T 60 159 Q 71 159 79 153 T 89 137 Q 89 130 83 123 T 70 112 T 53 103 T 42 97 Z M 77 73 Q 94 60 94 45 Q 94 33 83 26 T 58 20 Q 47 20 40 25 T 32 37 Q 34 46 41 53 T 56 64 T 77 73 Z M 29 90 Q 17 84 10 74 T 3 51 Q 4 30 22 19 T 61 8 Q 72 8 85 12 T 107 24 T 117 44 Q 117 63 94 82 Q 106 89 113 99 T 121 121 Q 121 137 110 148 T 84 165 T 54 170 Q 40 170 27 166 T 7 151 T 0 128 Q 0 104 29 90 Z ";
alphatab.rendering.glyphs.MusicFont.Num9 = "M 60 88 Q 70 88 75 77 T 80 52 Q 80 39 74 30 T 60 20 Q 51 20 45 31 T 38 54 Q 38 68 44 78 T 60 88 Z M 84 88 Q 69 100 45 100 Q 31 100 19 93 T 3 75 Q 1 70 0 58 Q 0 45 7 34 T 28 16 T 61 9 Q 76 9 89 15 T 109 31 T 121 56 T 125 85 Q 125 101 120 116 T 107 143 T 86 162 T 58 170 Q 43 170 31 166 T 14 153 T 7 138 Q 7 127 14 120 T 30 113 Q 39 113 46 119 T 54 134 Q 54 138 51 145 T 47 155 Q 48 160 57 160 Q 84 158 84 88 Z ";
alphatab.rendering.glyphs.MusicFont.PickstrokeDown = "M 85 0 L 42 155 L 0 0 H 10 L 43 122 L 74 0 H 85 Z ";
alphatab.rendering.glyphs.MusicFont.PickstrokeUp = "M 0 -1 H 126 V 130 H 115 V 55 H 10 V 130 H 0 V -1 Z ";
alphatab.rendering.glyphs.MusicFont.RestEighth = "M 39 171 L 74 44 Q 49 57 34 57 Q 21 57 10 49 T 0 28 Q 0 17 5 9 T 22 0 Q 35 0 43 7 T 51 24 Q 51 27 50 30 T 48 35 T 47 39 Q 47 41 51 41 Q 72 41 90 9 H 97 L 52 171 H 39 Z ";
alphatab.rendering.glyphs.MusicFont.RestHalf = "M 0 -1 H 116 V 45 H 0 V -1 Z ";
alphatab.rendering.glyphs.MusicFont.RestQuarter = "M 35 -1 L 95 71 Q 75 95 66 111 T 56 141 Q 57 155 66 171 T 93 209 L 87 217 Q 72 208 57 206 Q 47 206 42 213 T 36 230 Q 37 254 55 273 L 50 280 Q 28 263 14 248 T 0 213 Q 0 198 9 190 T 34 182 Q 46 182 63 190 V 190 L 6 113 Q 43 80 43 51 Q 43 29 19 -1 H 35 Z ";
alphatab.rendering.glyphs.MusicFont.RestSixteenth = "M 80 116 L 99 43 Q 86 50 78 53 T 59 56 Q 46 56 35 48 T 24 27 Q 24 16 30 8 T 48 -1 Q 62 -1 69 6 T 77 25 Q 77 30 74 38 Q 74 40 78 41 Q 101 33 116 8 H 123 L 52 261 H 39 L 74 134 Q 49 147 34 147 Q 21 147 10 139 T 0 118 Q 0 106 7 97 T 26 88 Q 37 89 44 97 T 51 118 Q 51 119 49 123 T 47 128 Q 48 132 53 132 Q 61 132 80 116 Z ";
alphatab.rendering.glyphs.MusicFont.RestSixtyFourth = "M 131 117 L 152 45 Q 138 51 129 55 T 111 58 Q 98 58 87 49 T 77 28 Q 77 17 83 10 T 99 0 Q 112 0 120 7 T 128 25 Q 128 29 126 34 T 124 40 Q 124 41 128 43 Q 141 38 150 30 T 168 10 H 174 L 71 382 L 52 451 H 39 L 74 324 Q 49 337 34 337 Q 21 337 10 329 T 0 308 Q 0 296 7 287 T 26 278 Q 36 279 43 286 T 51 305 Q 51 307 49 312 T 47 318 Q 48 322 53 322 Q 58 322 66 316 T 80 304 L 100 232 Q 87 238 78 242 T 60 245 Q 46 245 36 236 T 25 215 Q 25 203 33 195 T 52 186 Q 59 186 65 190 T 73 200 T 77 215 Q 77 216 75 220 T 73 227 Q 74 230 78 230 Q 84 230 93 223 T 106 211 L 125 138 Q 100 151 85 151 Q 72 151 61 142 T 51 121 Q 51 111 57 103 T 74 93 Q 86 93 94 100 T 102 118 Q 102 121 101 124 T 100 129 T 99 133 Q 99 135 103 136 Q 105 135 109 135 Q 120 131 131 117 Z ";
alphatab.rendering.glyphs.MusicFont.RestThirtySecond = "M 80 209 L 100 137 Q 87 143 78 147 T 60 150 Q 46 150 36 141 T 25 120 Q 25 108 33 100 T 52 91 Q 63 92 70 99 T 77 120 Q 76 123 74 128 T 72 132 Q 73 135 78 135 Q 84 135 93 128 T 106 116 L 125 43 Q 100 56 85 56 Q 72 56 61 47 T 51 26 Q 51 15 57 7 T 74 -1 Q 88 -1 95 5 T 102 23 Q 102 30 99 37 Q 99 40 104 41 Q 126 33 142 8 H 149 L 52 356 H 39 L 74 229 Q 49 242 34 242 Q 21 242 10 234 T 0 213 Q 0 201 7 192 T 26 183 Q 37 184 44 192 T 51 210 Q 51 212 50 215 T 49 219 T 48 223 Q 49 227 53 227 Q 58 227 66 221 T 80 209 Z ";
alphatab.rendering.glyphs.MusicFont.Segno = "M 70 139 Q 2 105 0 58 Q 1 43 8 29 T 27 7 T 55 -1 Q 73 -1 86 8 T 99 35 Q 99 43 93 48 T 78 53 Q 63 52 60 41 Q 58 36 57 30 T 52 21 T 42 17 Q 34 17 29 25 T 23 42 Q 24 54 31 63 T 47 79 T 69 91 T 93 102 L 160 0 H 181 L 109 109 Q 127 118 142 130 T 167 157 T 177 190 Q 177 206 169 220 T 148 242 T 115 250 Q 99 248 89 238 T 78 215 Q 79 207 84 202 T 98 196 Q 108 196 112 200 T 119 214 T 123 227 T 133 231 Q 143 231 149 224 T 155 206 Q 155 190 144 180 T 111 159 T 85 146 L 19 248 H 0 L 70 139 Z M 1 158 Q 1 148 7 143 T 20 139 Q 27 139 32 144 T 38 158 Q 38 164 32 170 T 20 175 Q 12 175 7 171 T 1 158 Z M 155 93 Q 155 84 160 79 T 173 74 Q 181 74 186 78 T 192 93 Q 192 99 186 104 T 174 109 Q 166 109 160 105 T 155 93 Z ";
alphatab.rendering.glyphs.MusicFont.Tempo = "M 54 142 V -1 L 58 0 V 155 Q 58 167 46 176 T 21 184 Q 5 184 2 171 Q 2 159 13 149 T 39 138 Q 48 138 54 142 Z M 87 152 V 145 H 138 V 152 H 87 Z M 87 167 H 138 V 175 H 87 V 167 Z ";
alphatab.rendering.glyphs.MusicFont.TremoloPickingThirtySecond = "M 0 180 V 151 L 111 94 V 124 L 0 180 Z M 0 133 V 105 L 111 48 V 76 L 0 133 Z M 0 86 V 58 L 111 1 V 30 L 0 86 Z ";
alphatab.rendering.glyphs.MusicFont.Trill = "M 19 114 L 38 56 H 0 L 4 43 H 42 L 51 17 L 76 0 H 83 L 68 43 Q 76 43 92 40 T 117 37 Q 123 37 125 39 T 127 47 Q 127 49 125 59 Q 140 37 158 37 Q 173 39 174 54 Q 174 63 170 66 T 161 70 Q 152 70 150 59 Q 152 54 152 50 Q 152 48 149 48 Q 133 48 121 82 L 104 137 H 79 L 83 124 Q 79 126 71 131 T 56 139 T 43 142 Q 33 142 25 136 T 17 122 Q 17 120 18 118 T 19 114 Z M 85 110 L 104 56 Q 104 55 104 53 T 104 52 Q 104 50 101 50 Q 94 50 83 53 T 64 56 L 45 112 Q 44 117 43 120 Q 43 126 50 127 Q 60 126 85 110 Z ";
alphatab.rendering.glyphs.MusicFont.UpperMordent = "M 0 79 V 57 L 48 1 Q 53 -2 54 -2 Q 57 -2 58 0 L 98 34 Q 101 37 104 38 Q 108 37 109 35 L 139 1 Q 144 -2 145 -2 Q 148 -2 149 0 L 189 34 Q 192 38 195 38 Q 199 37 200 35 L 225 6 V 28 L 177 83 Q 172 87 170 87 Q 167 87 166 85 L 127 50 Q 124 47 120 47 Q 117 47 116 48 L 86 83 Q 82 87 79 87 Q 76 87 75 85 L 36 50 Q 33 47 29 47 Q 26 47 25 48 L 0 79 Z ";
alphatab.rendering.glyphs.NaturalizeGlyph.CORRECTION = -2;
alphatab.rendering.glyphs.NoteHeadGlyph.noteHeadHeight = 9;
alphatab.rendering.glyphs.SharpGlyph.CORRECTION = -1;
alphatab.rendering.layout.HeaderFooterElements.NONE = 0;
alphatab.rendering.layout.HeaderFooterElements.TITLE = 1;
alphatab.rendering.layout.HeaderFooterElements.SUBTITLE = 2;
alphatab.rendering.layout.HeaderFooterElements.ARTIST = 4;
alphatab.rendering.layout.HeaderFooterElements.ALBUM = 8;
alphatab.rendering.layout.HeaderFooterElements.WORDS = 16;
alphatab.rendering.layout.HeaderFooterElements.MUSIC = 32;
alphatab.rendering.layout.HeaderFooterElements.WORDS_AND_MUSIC = 64;
alphatab.rendering.layout.HeaderFooterElements.COPYRIGHT = 128;
alphatab.rendering.layout.HeaderFooterElements.PAGE_NUMBER = 256;
alphatab.rendering.layout.HeaderFooterElements.ALL = 511;
alphatab.rendering.layout.PageViewLayout.SCORE_INFOS = "scoreInfos";
alphatab.rendering.layout.PageViewLayout.PAGE_PADDING = [20,20,20,20];
alphatab.rendering.layout.PageViewLayout.WIDTH_ON_100 = 795;
alphatab.rendering.layout.PageViewLayout.GroupSpacing = 20;
alphatab.rendering.staves.StaveGroup.StaveSpacing = 0;
alphatab.rendering.utils.AccidentalHelper.ACCIDENTAL_NOTES = [[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Flat,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.None],[alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural,alphatab.model.AccidentalType.Sharp,alphatab.model.AccidentalType.Natural]];
alphatab.rendering.utils.BeamingHelper.SCORE_MIDDLE_KEYS = [48,45,38,59];
haxe.io.Output.LN2 = Math.log(2);
js.Lib.onerror = null;
alphatab.Main.main();
