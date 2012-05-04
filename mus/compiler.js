// this is all you
// maybe some helper functions

var convertPitch = function(pitch){
    var pitches = {c: 0, d:2, e:4, f:6, g:8, a:9, b:11}
    var octave = pitch[1];
    var letter = pitches[pitch[0]];
    return 12+(12*octave)+letter;
};

var compile = function (musexpr) {
    var a = assemble(0,musexpr); 
   return a;
};

var assemble = function (time,expr) {
    if(!expr.tag || expr.tag == 'note'){
        return [{tag: 'note', pitch: convertPitch(expr.pitch), start: time, dur: expr.dur}];
    }
    if(expr.tag == 'rest')
	return [];
    if(expr.tag =='repeat'){
        var ret = [];
        for(var x=0; x < expr.count; x++){
	   var assem = assemble(time, expr.section);
	   ret = ret.concat(assem);
           time = endTime(time,expr.section);
	}
	return ret;
    }
    var a=assemble(time,expr.left);
    var b = [];
    if(expr.tag =='par')
        b=assemble(time,expr.right);
    else
        b=assemble(endTime(time,expr.left),expr.right);
    return a.concat(b);  
};

var endTime = function (time, expr) {
    if(!expr.tag || expr.tag == 'note' || expr.tag=='rest')
        return time+expr.dur;
    if (expr.tag == 'par'){
        var a = endTime(time, expr.left);
        var b = endTime(time, expr.right);
        if( a > b)
            time = a;
        else
            time = b;
    }else{
       time = endTime(time, expr.left);
       time = endTime(time, expr.right); 
    }
    return time;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', dur: 250 } },
      right:
       { tag: 'repeat',
            section: {
		tag: 'seq',
           	left: { tag: 'note', pitch: 'c4', dur: 500 },
           	right: { tag: 'note', pitch: 'd4', dur: 500 } 
		}, 
	     count: 5 } };

console.log(melody_mus);
console.log(compile(melody_mus));
