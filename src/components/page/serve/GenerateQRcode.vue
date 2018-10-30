<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div style="margin-top: 46px;">
			<group>
				<x-input v-model="inputText" title="二维码生成" text-align="right" placeholder="请输入您想要的内容"></x-input>
			</group>
			<x-button mini style="margin: 10px 0 0 68%;" @click.native="ProduceQRcode">生成二维码</x-button>
		</div>
		<div id="qrcodejs" ref="tree" v-show="qrcodeShow">
            <img :src="qrUrl">
        </div>
	</div>	
</template>

<script>
	import VHeader from '../../common/Header'
	import {Group, XInput, XButton}from 'vux'
	export default{
		components:{
			VHeader,
			Group,
			XInput,
			XButton
		},
		data(){
			return{
				headObj:{
	                title:"生成为二维码",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                // icon: '&#xe6af;',
	            },
	            tab:false,
	            inputText:'',
	            type:0,//0为普通内容,1为网址
	            qrUrl:'',
	            qrcodeShow:false,
			}
		},
		mounted(){

		},
		methods:{
			ProduceQRcode(){
				let self = this;
				let reg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
	            if(reg.test(self.inputText)){
	                self.type = 1;
	            }else{
	                self.type = 0;
	            }
	            self.askQRcode();
			},
			askQRcode(){
				let self = this;
				let datas={
	                "moduleid": "1",
	                "content": self.inputText,
	                "type":self.type
	            };
	            console.log(datas);
	            self.$axios({
	                url:'/vr-qrcode/qr/generate',
	                method:'POST',
	                responseType:'json',
	                data:datas
	            })
	            .then(function(response){
	            	console.log(response);
	            	if (response.data.status == 200) {
	            		// let qr = self.$refs.tree;
	            		self.inputText='';
	            		// self.$vux.toast.text("二维码生成成功!",'middle');
	            		self.qrcodeShow = true;
	            		self.$nextTick(()=>{
	            			self.qrUrl = response.data.data.qrUrl;
	            		})
	            		// setTimeout(()=>{
	            		// 	self.qrUrl = response.data.data.qrUrl;
	            		// },300)
	            	}else{
	            		self.$vux.toast.text("二维码生成失败！",'middle');
	            	}
	            })
	            .catch(function(response){
	            	console.log("error");
	            })
			},
			finish(data){
				let self = this;
				console.log(data)
			},
			backWay(data){
				let self = this;
	        	self.$router.back('/ServeDetails');
	            console.log(data)
			}
		}
	}
</script>

<style lang="less" scoped>
	#qrcodejs{
		/*position: fixed;*/
        text-align: center; 
        padding:7px;
        /*background-color: #ccc;*/
        img{
        	width:100%;
        }
	}
</style>