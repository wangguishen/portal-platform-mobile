<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top orgcha">
			<group>
				<cell
					class="my_cell"
					:title="currentFrim.comp_name"
					:arrow-direction="goverShow ? 'down' : 'right'"
					:border-intent="false"
					@click.native="lookClassify()"
					is-link>
				</cell>
				<swipeout>
					<template v-if="goverShow">
						<template  v-for="(first,index) in firstList">
							<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe">
								<div slot="right-menu">
									<template v-if="first.isRole">
			      						<swipeout-button @click.native="onButtonClick('sq',first,index,firstList)" background-color="#38a9ce" class="iconfont" :width="60">&#xe8e2;</swipeout-button>
						          	</template>
								</div>
								<div slot="content" class="vux-1px-b">
									<cell
										class="first_cell"
										:class="{'user_styl':first.isRole}"
										:title="first.dept_name" 
										:border-intent="false">
									</cell>
								</div>
							</swipeout-item>
						</template>
					</template>
				</swipeout>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, XInput, XTextarea, CellBox, Swipeout, SwipeoutItem, SwipeoutButton, Confirm } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, CellBox, Swipeout, SwipeoutItem, SwipeoutButton, Confirm, XInput, XTextarea
    },
	data(){
		return{
			currentFrim: {},//集团
			gover:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            goverShow: false,//集团图标显示
            firstArr:[],//数组集合
            firstList:[],//渲染集合
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.gover = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.gover.name;
	},
	methods:{
		backWay(data){//返回页面
			let self = this;
			self.$router.back('/mangenallot')
		},
		lookClassify(){//点击系统请求
			let self = this;
			self.goverShow = !self.goverShow;
			if(self.goverShow){
				let url = "/UAMS/role/queryRole";
				let data = {
					"compCode": self.currentFrim.comp_code,
				}
				self.askClassify(url, data)
			}
		},
		askClassify(url, data){//公共请求
			let self = this;
			self.$axios({
                url: url,
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                	let list = res.data.data;
                	list.forEach(function(item, index){
	    				self.$set(item,'parent_id',item.dept_code)
	    				self.$set(item,'dept_name',item.roleName)
	    				self.$set(item,'isRole',true)
	    				self.firstArr.push(item)
	    			})
	    			self.$nextTick(()=>{
	    				self.firstList = [];
			        	let hash = {};
			        	for(let i = 0;i<self.firstArr.length;i++){
			        		hash[self.firstArr[i].id] = self.firstArr[i];
			        		// self.$set(hash,self.firstArr[i].id,self.firstArr[i])
			        	}
			        	for(let j = 0;j<self.firstArr.length;j++){
			        		let cur = self.firstArr[j],hashVP = hash[self.firstArr[j].parent_id];
			        		self.$set(self.firstArr[j],'firstShow',false)
			        		if (hashVP) {
			        			!hashVP['children'] && (self.$set(hashVP,'children',[]));
				 			 	hashVP['children'].push(cur);
			        		}else{
			        			self.firstList.push(cur)
			        		}
			        	}
			        	console.log(self.firstList)
	    			})
                }else{
                	self.$vux.toast.text(response.data.msg, 'middle')
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		onButtonClick(type, obj, index, list){//授权
			let self = this;
			obj.title= "授权操作";
			localStorage.setItem('accreditHandle',JSON.stringify(obj));
			self.$refs.swipe[index].close();
			self.$router.go('/accredithandle')
		},
	}
}
</script>
<style lang="less" scoped>
.prompt_text{
	width:100%;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
	font-size: 0.8rem;
	color:#aaa;
}
.my_cell{
	border-bottom: 1px solid #efefef;
}	
.toastCla{
	border-left: 1px solid #cfcfcf;
	border-right: 1px solid #cfcfcf;
}
.pop_box{
	overflow: hidden;
	margin-top: .5rem;
}
.pop_name{
    float: left;
    width: 30%;
    height: 2.5rem;
    line-height: 2.5rem;
}
.pop_ipt{
	// float: right;
    width: 100%;
    box-sizing: border-box;
    height: 2.5rem;
    padding-left: .5rem;
    border: 1px solid #dcdcdc;
    border-radius: .3rem;
}
.pop_ipt:focus{
	outline:none;
	border: 1px solid #999;
}
.pop_area{
	height: 3.5rem;
	resize: none;
}
.iconfont{
	font-size: 1.8rem;
}
</style>