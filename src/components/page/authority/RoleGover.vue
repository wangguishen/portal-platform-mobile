<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top orgcha">
			<group>
				<swipeout>
					<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe1">
						<div slot="right-menu">
      						<swipeout-button @click.native="onButtonClick('xz')" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
						</div>
						<div slot="content" class="vux-1px-b">
							<cell
								class="my_cell"
								:title="currentFrim.comp_name"
								:border-intent="false"
								:arrow-direction="currentFrim.systemShow ? 'down' : 'right'"
								@click.native="lookClassify(currentFrim)"
								:is-link="currentFrim.children ? true : false">
							</cell>
						</div>
					</swipeout-item>
					<template v-if="currentFrim.systemShow">
						<template v-if="currentFrim.children.length !== 0">
							<template v-for="(first,index) in currentFrim.children">
								<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe2">
									<div slot="right-menu">
			      						<swipeout-button @click.native="onButtonClick('bj',first,'2',index,currentFrim.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
			      						<swipeout-button @click.native="onButtonClick('sc',first,'2',index,currentFrim.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
									</div>
									<div slot="content" class="vux-1px-b">
										<cell
											class="first_cell"
											:class="{'user_styl':first.isRole}"
											:title="first.roleName"
											:border-intent="false">
										</cell>
									</div>
								</swipeout-item>
							</template>
						</template>
						<template v-else>
							<div class="remind">
								暂无角色，请添加角色
							</div>
						</template>
					</template>
				</swipeout>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton
    },
	data(){
		return{
			currentFrim: {},//集团
			current: {},
			gover:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            items:[],
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.$set(self.currentFrim, 'moduleWeight',true)
		self.$set(self.currentFrim, 'systemShow',false)
		self.$set(self.currentFrim, 'children',[])
		self.currentFrim.oldId = self.currentFrim.id;
		self.currentFrim.id = "sys_6";
		self.gover = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.gover.name;
	},
	methods:{
		backWay(data){//返回页面
			let self = this;
			self.$router.back('/mangenallot')
		},
		lookClassify(firm){//点击系统请求
			let self = this;
			console.log(self.currentFrim.children.length)
			firm.systemShow = !firm.systemShow
			if(self.currentFrim.children.length == 0){
				self.$axios({
	                url: "/UAMS/role/queryRole",
	                method: 'post',
	                responseType: 'json',
	                data:  {
			    		'compCode':self.currentFrim.comp_code,
			    	}
	            })
	            .then(function(res) {
	                console.log(res)
	                if(res.data.success){
	                	let list = res.data.data;
	                	list.forEach(function(item, index){
	                		self.$set(item, 'isRole', true);
	                		self.currentFrim.children.push(item)
	                	})
	                }else{
	                	self.$vux.toast.text(response.data.msg, 'middle')
	                }
	            })
	            .catch(function(res) {
	                console.log("error", res)
	            })
			}				
		},
		onButtonClick(type, obj, num, index, list){//新增、编辑、删除等操作
			let self = this;
			let data = {};
      		let url = "";
      		if(type == 'xz'){//新增
      			self.$vux.confirm.show({
    				title: '新增角色',
    				closeOnConfirm: false,
    				content:`<div>
								<div style="overflow: hidden;margin-top: .5rem;">
									<input style="width: 100%;box-sizing: border-box;height: 2.5rem;padding-left: .5rem;border: 1px solid #dcdcdc;border-radius: .3rem;outline:none;" placeholder="角色名称" type="text" id="ipt">
								</div>
								<div style="overflow: hidden;margin-top: .5rem;">
									<textarea style="width: 100%;box-sizing: border-box;height: 3.5rem;padding-left: .5rem;border: 1px solid #dcdcdc;border-radius: .3rem;resize: none;outline:none;" placeholder="角色描述" rows="3" id="area"></textarea>
								</div>
							</div>`,
    				onCancel () {
			          	self.$refs.swipe1.close();
			        },
			        onConfirm () {
			        	let name = document.getElementById('ipt').value;
			        	let intro = document.getElementById('area').value;
			          	if(name == ""){
			          		self.$vux.toast.show({
			          			text: "请输入新增角色名称",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else{
			          		url = "/UAMS/role/addRole";
			      			data = {
			                    'compCode': self.currentFrim.comp_code,
			                    'roleDesc': intro,
			                    'roleName': name,
			                    'deptCode': self.currentFrim.id,
			                    'sysCode': self.currentFrim.oldId
			                }
				    		console.log(data)
				    		self.askChangeData(url, data, type);
			          	}
			        }
    			})
      		}else if(type == "bj"){//编辑
      			self.$vux.confirm.show({
    				title: '修改角色',
    				closeOnConfirm: false,
    				content:'<div>'+
								'<div style="overflow: hidden;margin-top: .5rem;">'+
									'<input style="width: 100%;box-sizing: border-box;height: 2.5rem;padding-left: .5rem;border: 1px solid #dcdcdc;border-radius: .3rem;outline:none;" placeholder="角色名称" value="'+obj.roleName+'" type="text" id="ipt">'+
								'</div>'+
								'<div style="overflow: hidden;margin-top: .5rem;">'+
									'<textarea style="width: 100%;box-sizing: border-box;height: 3.5rem;padding-left: .5rem;border: 1px solid #dcdcdc;border-radius: .3rem;resize: none;outline:none;" placeholder="角色描述" rows="3" id="area">'+obj.description+'</textarea>'+
								'</div>'+
							'</div>',
    				onCancel () {
			          	// self.numClose(num, index);
          				self.$refs.swipe2[index].close()
			        },
			        onConfirm (msg) {
			        	let name = document.getElementById('ipt').value;
			        	let intro = document.getElementById('area').value;
			          	if(name == ""){
			          		self.$vux.toast.show({
			          			text: "请输入角色名称",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else{
			          		url = "/UAMS/role/updateRole";
			          		console.log(obj)
			      			data = {
			                    'compCode': self.currentFrim.comp_code,
			                    'newDesc': intro,
			                    'newRoleName': name == obj.roleName?'':name,
			                    'deptCode': obj.dept_code,
			                    'sysCode': self.currentFrim.oldId,
			                    'roleId': obj.id
			                }
				    		console.log(data)
				    		self.askChangeData(url, data, type, obj, num, index, list);
			          	}
			        }
    			})
      		}else if(type == 'sc'){//删除
      			self.$vux.confirm.show({
					title: '删除角色',
					content: '您确定要删除此角色吗？',
					onCancel () {
						// self.numClose(num, index);
						self.$refs.swipe2[index].close()
					},
					onConfirm () {
						url = "/UAMS/role/deleteRole";
		      			data = {
		      				'compCode':self.currentFrim.comp_code,
			    			'sysCode':obj.id,
			    			'roleId': obj.id,
				    		'deptCode':	obj.dept_code,
		      			}
		      			console.log(data)
		      			self.askChangeData(url, data, type, obj, num, index, list);
					}
				})
      		}
		},
		askChangeData(url, data, type, obj, num, index, list){
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
    				self.$nextTick(()=>{
    					if(type == 'xz'){
    						let str = res.data.data;
    						self.$set(str, 'isRole', true);
    						self.currentFrim.children.push(str);
    						document.getElementById('ipt').value = '';
    						document.getElementById('area').value = '';
    						self.$vux.confirm.hide();//弹框隐藏
    						self.$refs.swipe1.close();
    						self.$vux.toast.text('新增角色成功', 'middle')
	    				}else if(type == 'bj'){
	    					data.newRoleName != ''?obj.dept_name = data.newRoleName:obj.dept_name = obj.dept_name;
	    					obj.roleName = data.newRoleName;
	    					obj.description = data.newDesc;
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	          				self.$vux.toast.text('修改角色成功', 'middle')
	    				}else if(type == 'sc'){
	    					list.splice(index,1)
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	          				self.$vux.toast.text('删除角色成功', 'middle')
	    				}
    				})
		    			
	    		}else{
          			self.$vux.toast.text(res.data.msg, 'middle')
          			// self.numClose(num, index);
          			self.$refs.swipe2[index].close()
          			self.$refs.swipe1.close()
          		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
		},
		numClose(num, index){//关闭右侧滑动
			let self = this;
			if(num == 2){
				self.$refs.swipe2[index].close();
			}
		},
	}
}
</script>
<style lang="less" scoped>
	.remind{
		height: 3.5rem;
		line-height: 3.5rem;
		width:100%;
		text-align: center;
		font-size: 1rem;
		color:#999;
	}
</style>