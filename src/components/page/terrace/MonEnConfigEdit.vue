<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group>
				<x-input title="企业名称" text-align="right" placeholder="请输入企业名称" v-model="paras.compName"></x-input>
				<!-- <popup-radio title="是否集团" :options="options" :placeholder="option" @on-change="change(paras.isGroup)" v-model="paras.isGroup"></popup-radio> -->
				<cell class="dem" title="是否集团" :value="paras.isGroup || '请选择集团类型'" @click.native="select(paras.isGroup)" is-link></cell>
				<x-input title="父集团ID" text-align="right" v-show="showParentId" placeholder="请输入父集团ID" v-model="paras.parentId"></x-input>
			</group>
		</div>
		<div v-transfer-dom>
            <popup v-model="typeShow" height="170px" is-transparent>
                <div style="width: 95%;background-color:#fff;height:150px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <div style="padding:20px 15px 0;" v-for="type in types">
                        <x-button :type="type.typeText" @click.native="selectType(type)">{{ type.name }}</x-button>
                    </div>
                </div>
            </popup>
        </div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, XInput, PopupRadio, Toast, PopupPicker, TransferDom, XButton, Popup } from 'vux'
export default{
	directives: {
        TransferDom
    },
	components: {
        VHeader, Group, XInput, PopupRadio, Toast, PopupPicker, Cell, XButton, Popup
    },
	data(){
		return{
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            paras:{},
            TempData:{},// 临时数据
            option:'',
            options:[
            	{
            		key:'Y',
            		value:'是'
            	},
            	{
            		key:'N',
            		value:'否'
            	}
            ],
            // pickerList:[[{name:'是',value:'Y'},{name:'否',value:'N'}]],
            pickerList:[['是','否']],
            valueComp:[''],
            showParentId:false,
            action:0,//是否有操作
            types: [
                {
                    typeText: 'default',//选种颜色
                    name: '是',
                    state: 0,
                }, {
                    typeText: 'default',
                    name: '否',
                    state: 0,
                }
            ],
            typeShow: false,
		}
	},
	mounted(){
		let self = this;
		let compList = JSON.parse(localStorage.getItem('compList'));
		console.log(compList)
		self.headObj.title=compList.compName;
		if(compList.isGroup == 'N'){
			compList.isGroup = '否'
			self.showParentId = true
		}else{
			compList.isGroup = '是'
			self.showParentId = false
		}
		self.paras = compList;
		self.TempData.compName = compList.compName;
		self.TempData.isGroup = compList.isGroup;
	},
	watch:{
		'paras':{
			handler: function(val, old){
				let self = this;
				console.log("go watch methods")
				console.log(val, "---" , self.paras,"-----",self.TempData)
				if (self.TempData.compName == val.compName && self.TempData.isGroup == val.isGroup) {
					self.action = 0;
				}
				self.action++;
				if (self.action == 1) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
	},
	methods:{
		change(isGroup){
			let self = this;
			console.log(isGroup)
			self.showParentId = isGroup[0] === 'N' ? true : false
			console.log(self.showParentId)
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonEnConfig')
		},
		select(isGroup){
			let self = this;
			
			self.typeShow = !self.typeShow;
			if(isGroup != ''){
                self.types.forEach(function(item, index){
					if(isGroup == item.name){
						item.state = 1;
		                item.typeText = "primary";
					}
				})
            }
            if(self.paras.parentId == 0){
            	self.paras.parentId = '';
            }
		},
		selectType(type){
            let self = this;
            self.types.forEach(function(item, index){
                item.state = 0;
                item.typeText = 'default';
            });
            type.state = 1;
            type.typeText = 'primary';
            self.typeShow = false;
            self.paras.isGroup = type.name;
            if(type.name == '否'){
                self.showParentId = true;
            }else{
                self.showParentId = false;
            }
        },
		finish(data){
			let self = this;
			console.log(data)
			if (self.paras.compName == '') {
				self.$vux.toast.text('请输入企业名称','middle');
			}else if(self.paras.isGroup == ''){
				self.$vux.toast.text('请选择是否为集团!','middle');
			}else {
				let tempGroup = self.paras.isGroup === '是' ? 'Y' : 'N'
				if (tempGroup == 'N') {
					if (self.paras.parentId == '') {
						self.$vux.toast.text('请输入父集团ID!','middle');
						return
					}
				}
				if (tempGroup === 'Y') {
					self.paras.parentId = 0;
				}
				let datas = {
					'id' : self.paras.id,
					'compName' : self.paras.compName,
					'isGroup' : tempGroup,
					'parentId' : self.paras.parentId
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/enterprise/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res);
					if (res.status == 200) {
						self.$vux.toast.show({
							type:'text',
							position:'middle',
							text:'修改企业成功!'
						})
						self.$router.back('/MonEnConfig')
					}else{
						self.$vux.toast.show({
							type:'text',
							position:'middle',
							text:'修改企业失败!'
						})
					}
				})
				.catch(function(res){
					console.log('error',res);
				})
			}
		},
		onShow () {
	      	console.log('on show')
	    },
	    onHide (type) {
	      	console.log('on hide', type)
	    }
	}
}
</script>
<style lang="less" scoped>
	.dem.weui-cell{//改变cell的样式
        padding:0 15px;
    }
</style>