<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div :class="{'tabSpace':tabSpace}">
	    	<div style="margin-top: 46px;">
                <group class="spaceEdit">
                    <x-input title="空间" readonly text-align="right" placeholder="请输入空间名称" v-model="spaceName"></x-input>
                    <x-input title="功能名称" text-align="right" placeholder="请输入功能名称" v-model="funcName"></x-input>
                </group>
            </div>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Toast,XInput,Group}from 'vux'
export default {
	components: {
		VHeader, Toast, XInput, Group
	},
	data() {
		return {
			headObj: {
                title: '空间资源配置编辑',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            funcName:'',
            spaceName:'',
            tabSpace:false,
            results:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
            beginName:'',//修改之前的数据
            editId:'',
		}
	},
	mounted() {
		let self = this;
        let spaceStorage = JSON.parse(localStorage.getItem('jsonSpace'));
        console.log('spaceStorage',spaceStorage);
        self.funcName = spaceStorage.url_name;
        self.editId = spaceStorage.id;
        let spaceId = spaceStorage.auditFlag;
        self.beginName = spaceStorage.url_name;
        self.spaceName = spaceId == '1'? '海' : spaceId == '2'? '宝' : spaceId == '3' ? '娃' : '海'
	},
    watch:{
        'funcName': {
            handler:function(val,old){
                let self = this;
                if (self.beginName == val) {
                    self.rightObj.isMore = false;
                }else {
                    self.rightObj.isMore = true;
                }
            },
            deep:true
        }
    },
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/SpaceSetting');
		},
		finish(data){
			let self = this;
            console.log(data)
            let datas = {
                'id' : self.editId,
                'url_name': self.funcName
            }
            console.log(datas)
            self.$axios({
                url:'/UAMS/url/updateUrl',
                method:'post',
                responseType:'json',
                data:datas
            })
            .then(function(res){
                console.log('finish success',res);
                if (res.data.success) {
                    self.$vux.toast.text('修改成功!','middle')
                    self.$router.back('/SpaceSetting');
                }else {
                    self.$vux.toast.text('修改失败!','middle')
                }
            })
            .catch(function(res){
                console.log('finish error',res);
            })
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
		getResult(val){//搜索框
            let self = this;
            self.searchInput = val;
            self.loadText="正在加载";
            self.lists=[];
            self.showLoad=true;
            if (self.timer == null) {
            	self.timer=setTimeout(()=>{
            		clearTimeout(self.timer);
            		self.timer=null;
            		// self.queryCompany();
            	},1000)
            }
        },
         onSubmit () {
            let self = this;
            self.$refs.search.setBlur()
            self.$vux.toast.show({
                type: 'text',
                position: 'top',
                text: 'on submit'
            })
        },
        onFocus () {//搜索框获取焦点
        	let self = this;
            console.log('on focus')	
            self.tabMon = true;
        },
        onCancel () {//搜索框取消
        	let self = this;
            console.log('on cancel')
            self.tabMon = false;
        },
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
</style>