<template>
	<div id="page_box">
	    <v-header :headObj="headObj" :rightObj="rightObj"></v-header>
	    <div class="container_top operation">
	    	<group>
		    	<template v-for="direct in directory">
		    		<cell
		    			:title="direct.title"
		    			:border-intent="false"
		    			:arrow-direction="direct.isSublevel ? 'down' : 'right'"
		    			@click.native="lookClassify(direct, directory)"
		    			:is-link="direct.children ? true : false">
	    			</cell>
	    			<template v-if="direct.isSublevel">
	    				<template  v-for="(list,index) in direct.children">
	    					<cell
	    						class="first_cell"
				    			:title="list.title"
				    			:border-intent="false"
				    			arrow-direction="right"
				    			@click.native="skipDetail(list, direct.children)"
				    			is-link>
			    			</cell>
	    				</template>
	    			</template>
		    	</template>
	    	</group>
	    </div>
    </div>
</template>

<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellBox} from 'vux'
export default {
	components: {
		VHeader, Group, Cell, CellBox
	},
	data () {
		return {
			
			headObj:{
                title:"运维服务",
                isBack:false,
            },
            rightObj:{
            	title:'完成',
                isMore: false,
            },
            directory: [//目录列表
            	{
            		type: 'yjxxjk',
            		title: '硬件信息监控',
            		isSublevel: false,
            	},{
            		type: 'urlljjk',
            		title: 'url链接监控',
            		isSublevel: false,
            	}
            ],
		}
	},
	mounted () {
		let self = this;
		self.queryMessage();
		self.queryLink();
	},
	methods: {
		queryMessage(){//查询硬件信息监控
			let self = this;
			self.$axios({
	  	      	url: '/basic-platform/server/sel?pageSize=10000',
	  	      	method: 'get',
	  	      	responseType: 'json'	
	  	    })
	  	    .then(function(res) {
	  	    	// console.log(res)
	  	      	if(res.data.status == 200) {
	  	      		let list = res.data.data;
	  	      		if(list.length != 0){
	  	      			list.forEach(function(item, index){
	  	      				self.$set(item,'title',item.serviceName);
	  	      				self.$set(item,'value',item.serviceNumber);
	  	      			})
	  	      			self.directory.forEach(function(item, index){
	  	      				if(item.type == 'yjxxjk'){
	  	      					self.$set(item,'children',list);
	  	      				}
	  	      			})
	  	      		}
	  	      	}else{
	  	      		self.$vux.toast.text(res.data.message, 'middle')
	  	      	}
	  	    })
	  	    .catch(function(res) {
	  	      	console.log("queryData error", res)	
	  	    })
		},
		queryLink(){//查询url链接监控
			let self = this;
			self.$axios({
				url: '/basic-platform/enterprise/sel?compName=',
				method: 'get',
				responseType: 'json'
			})
			.then(function(res) {
				// console.log(res)
				if(res.data.status == 200) {
					let list = res.data.data;
					if(list.length != 0){
						list.forEach(function(item, index){
							self.$set(item,'title',item.compName);
						})
						self.directory.forEach(function(item, index){
	  	      				if(item.type == 'urlljjk'){
	  	      					self.$set(item,'children',list);
	  	      				}
	  	      			})
					}
				}
			})	
			.catch(function(res) {
				console.log("error", res)
			})
		},
		lookClassify(obj, list){//点击查看详情
			let self = this;
			list.forEach(function(item, index){
				if(item.type == obj.type){
					item.isSublevel = !item.isSublevel;
				}else{
					item.isSublevel = false;
				}
			})
		},
		skipDetail(obj, list){//点击跳转详情页面
			let self = this;
			localStorage.setItem("operationDetail", JSON.stringify(obj));
			if("parentId" in obj){
				self.$router.go('/urllink')
			}else{
				localStorage.setItem("s_title", obj.title)
				self.$router.go('/servermonitoring?mac=' + obj.serviceNumber)
			}
		},
	}
}
</script>

<style lang="less" scoped>
	
</style>