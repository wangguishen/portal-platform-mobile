<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div class="container_top">
            <group class="boxAdd">
                <popup-picker title="空间" :data="spaceLists" v-model="spaceValue" @on-change="spaceChange" placeholder="请选择空间"></popup-picker>
                <x-input title="功能名称" text-align="right" placeholder="请输入功能名称" v-model="funcValue"></x-input>
            </group>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {LoadMore, Toast,Group, XInput,PopupPicker}from 'vux'
export default {
	components: {
		VHeader, Toast,Group, XInput,PopupPicker
	},
	data() {
		return {
			headObj: {
                title: '空间资源配置添加',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            spaceLists:[
                [
                    {
                        name:'海',
                        value:'海'
                    },
                    {
                        name:'宝',
                        value:'宝'
                    },
                    {
                        name:'娃',
                        value:'娃'
                    }
                ]
            ],
            spaceValue:[],//空间
            spaceVal:'',
            funcValue:'',//功能名称
		}
	},
	mounted() {
		let self = this;
	},
	methods: {
        spaceChange(val){//切换空间
            let self = this;
            console.log(val);
            if (val[0] == '海') {
                self.spaceVal = '1'
            }else if (val[0] == '宝') {
                self.spaceVal = '2'
            }else if (val[0] == '娃') {
                self.spaceVal = '3'
            }
            console.log(self.spaceVal)
        },
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/SpaceSetting');
		},
		finish(data){
			let self = this;
            console.log(data)
            let datas = {
                'url_name' : self.funcValue,
                'auditFlag' : self.spaceVal
            }
            console.log(datas)
            self.$axios({
                url:'/UAMS/url/addUrl',
                method:'post',
                responseType:'json',
                data:datas
            })
            .then(function(res){
                console.log('finish success',res)
                if (res.data.success) {
                    self.$vux.toast.text('添加成功!','middle');
                    self.$router.back('/SpaceSetting');
                }else {
                    self.$vux.toast.text('添加失败!','middle');
                }
            })
            .catch(function(res){
                console.log('finish error',res)
            })
		},
	}
}
</script>

<style lang="less" scoped>
</style>