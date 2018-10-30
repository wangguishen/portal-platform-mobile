<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group ref="ruleForm">
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
                title: '添加监控企业',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            paras:{
            	compName:'',
            	isGroup:'',
            	parentId:''
            },
            option:'',
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
            showParentId:false,
            routeId:0,
		}
	},
	mounted(){
		let self = this;
	},
	methods:{
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonEnConfig')
		},
		select(isGroup){
			let self = this;
			self.typeShow = !self.typeShow;
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
		finish(ruleForm){
			let self = this;
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
					'compName' : self.paras.compName,
					'isGroup' : tempGroup,
					'parentId' : self.paras.parentId
				}
				console.log(datas)
				self.$axios({
					url: '/basic-platform/enterprise/add',
					method: 'post',
					responseType: 'json',
					data: datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.show({
							type:'text',
							position:'middle',
							text:'添加企业成功!'
						})
						self.routeId++;
						self.$router.back('/MonEnConfig?routeId='+self.routeId)
					}else{
						self.$vux.toast.show({
							type:'text',
							position:'middle',
							text:'添加企业失败!'
						})
					}
				})
				.catch(function(res){
					console.log('error',res)
				})
			}	
		}
	}
}
</script>
<style lang="less" scoped>
	.dem.weui-cell{//改变cell的样式
        padding:0 15px;
    }
</style>