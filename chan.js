
class chan {
	constructor(size){
		this.buf=[]
		this.getWaiter=[]
		this.putWaiter=[]
		this.size=size || 0
		console.log("chan")
	}
	put(v){
		var that=this
		return new Promise(function(resolve,reject){
			if(that.buf.length==0 && that.getWaiter.length>0){
				var watch=that.getWaiter.shift()
				watch(v)
				resolve()
				return
			}
			if(that.buf.length>=that.size){
				that.putWaiter.push({
					resolve:resolve,
					reject:reject,
					v:v,
				})
				return
			}else{
				that.buf.push(v)
				resolve(v)
				return
			}
		})
	}
	async get(){
		var that=this
		return new Promise(function(resolve,reject){
			if(that.buf.length>0){
				resolve(that.buf.shift())
				if(that.putWaiter.length>0){
					var puter=that.putWaiter.shift()
					that.buf.push(puter.v)
					puter.resolve(puter.v)
				}
			}else{
				if(that.putWaiter.length>0){
					var puter=that.putWaiter.shift()
					resolve(puter.v)
					puter.resolve(puter.v)
				}else{
					that.getWaiter.push(resolve)
				}

			}
		})
	}
}

//类比 golang
/*
async function func(){
	...
}

await func()  = func()
func() = go func()

 * */

module.exports = {
	chan:chan
}
