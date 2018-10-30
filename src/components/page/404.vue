<template>
	<div id="page_box">
	    <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
        <div class="error" :style="{'height':hei+'px'}">
            <img src="../../assets/banner.png" alt="">
            <div class="backLogin">
            	<router-link to="/">
            		<span class="text_content">即将返回登录页</span>
            		<span class="text_icon icon1">></span>
                    <span class="text_icon icon2">></span>
                    <span class="text_icon icon3">></span>
            	</router-link>
            </div>
        </div>
	</div>
</template>

<script>
	import VHeader from '../common/Header'
	export default {
		components: {
			VHeader
		},
		data(){
			return {
				headObj:{
	                title:"404",
	                isBack:true,
	            },
	            rightObj:{
	                isMore: false,
	            },
	            hei:0
			}
		},
		mounted(){
			let self = this;
			self.toLogin();
        	self.hei = document.body.offsetHeight;
		},
		methods:{
			backWay(data){
	            let self = this;
	            self.$router.back('/login');
	            console.log(data)
	        },
	        toLogin(){
	        	let self = this;
	        	setTimeout(()=>{
	        		self.$router.back('/login');
	        	},3000);
	        },
		}
	}
</script>

<style scoped>
	.page_box {
		position: relative;
	}
	.error {
    	height: 100%;
		background: url("../../assets/bg.png") no-repeat;
		background-size: 100% 100%;
		z-index:10000;
	}
    .error img{
    	display: inline-block;
    	margin: 46% 23%;
    }
    .backLogin .text_content {
    	cursor: pointer;
    	display: inline-block;
    	text-decoration: none;
    	/* color: #fff; */
    	position: absolute;
    	top: 68%;
    	left: 34%;
    	font-size: 18px;
    	font-weight: bold;

    }
    .text_icon{
        /* color: #fff; */
        opacity:0;
    }
    .icon1{
        -webkit-animation:fill 3s linear 0s infinite normal;
        -moz-animation:fill 3s linear 0s infinite normal;
        position: absolute;
        top: 68%;
        left: 26%;
        display: inline-block;
        float: left;
    }
    .icon2{
    	position: absolute;
        top: 68%;
        left: 28%;
        display: inline-block;
        float: left;
        -webkit-animation:fill1 3s linear 0s infinite normal;
        -moz-animation:fill1 3s linear 0s infinite normal;
    }
    .icon3{
    	position: absolute;
        top: 68%;
        left: 30%;
        display: inline-block;
        float: left;
        -webkit-animation:fill2 3s linear 0s infinite normal;
        -moz-animation:fill2 3s linear 0s infinite normal;
    } 
    @-moz-keyframes fill {
        0%{ opacity:0; }
        33%{opacity:1;}
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill {
        0%{ opacity:0; }
        33%{opacity:1;}
        100%{ opacity:1; }  
    }
    @-moz-keyframes fill1 {
        0%{ opacity:0; }
        33%{ opacity:0; }
        66%{ opacity:1; }
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill1 {
        0%{ opacity:0; }
        33%{ opacity:0; }
        66%{ opacity:1; }
        100%{ opacity:1; }  
    }
     @-moz-keyframes fill2 {
        0%{ opacity:0; }
        66%{ opacity:0; }
        99%{ opacity:1; }
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill2 {
        0%{ opacity:0; }
        66%{ opacity:0; }
        99%{ opacity:1; }
        100%{ opacity:1; }  
    }
</style>