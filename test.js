
var jc=require("./chan.js")

var chan=new jc.chan()
var chan2=new jc.chan()
var reschan=new jc.chan()

function sleep(ms){
	return new Promise(function(resolve,reject){
		setTimeout(() => resolve(ms), ms)
	})
}

function timer(ms) {
	var c=new jc.chan()
	var a=async function(ms){
		while(true){
			await sleep(ms)
			await c.put(ms)
		}
	}
	a(ms)
	return c
}


// 
async function generate(){
	var c=timer(100)
	for(var i=0; ; i++){
		await c.get()
		//console.log("put ",i)
		await chan.put(i)
	}
}

async function copy(ch1,ch2){
	for(;true;){
		v=await ch1.get()
		await ch2.put(v)
		//console.log("copy ",v)
	}
}

async function process(id,ch,chr){
	console.log("start",id)
	var sum=0;
	for(var i=0;i<100;i++){
		var v=await ch.get()
		sum+=i
		console.log(id,v)
	}
	await chr.put({id:id,sum:sum})
	console.log("done",id)
}

async function main(){
	generate()
	copy(chan,chan2)
	for(var j=0; j<100; j++){
		process(j,chan2,reschan)
	}
	while(true){
		var res=await reschan.get()
		console.log(res.id,res.sum)
	}
}

main()



// other example
/* simple spider 
async function main(){
	// 或多个后端请求。
	for(var i=0; i<10; i++){
		fetch(i,ch)
	}
	for(var i=0; i<10; i++){
		console.log(await ch.get())
	}
}
*/
