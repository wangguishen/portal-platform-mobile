<template>
  	<div class="box" :style="{'height':hei+'px'}">
  		<div class="logoTitle">
            <img src="../../../static/images/phoneLOGO.png">
  		</div>
  		<div class="login_box">
	      		<x-input
                    title="账号"
                    v-model="ruleForm.username"
                    name="username"
                    placeholder="请输入账号"
                    class="account"
                    placeholder-align="right"
                    text-align="right"
                    style="font-size: 20px;">
                </x-input>
		      	<x-input
                    title="密码"
                    v-model="ruleForm.password"
                    name="mobile"
                    type="password"
                    placeholder="请输入密码"
                    class="psd"
                    placeholder-align="right"
                    text-align="right"
                    style="font-size: 20px;">
                </x-input>
		    <div class="login_btn">
		    	<flexbox>
			        <flexbox-item>
			          	<x-button plain type="primary"  style= "font-size: 20px;color:#fff;border-radius:20px;border: 1px solid #fff;" @click.native="submitGuest()">游客</x-button>
			        </flexbox-item>
			        <flexbox-item>
			          	<x-button plain type="primary" style= "font-size: 20px;color:#fff;border-radius:20px;border: 1px solid #fff;" @click.native="submit()">登录</x-button>
			        </flexbox-item>
      			</flexbox>
		    </div>
  		</div>
  	</div>
</template>

<script>
import { XInput, XButton, Flexbox, FlexboxItem, Alert,Toast} from 'vux'

export default {
  	components: {
        Alert,
    	XInput,
    	XButton,
    	Flexbox,
    	FlexboxItem,
        Toast
  	},
  	data () {
    	return {
            required: false,
            showDom:false,
    		ruleForm: {
    			username:'',
	      		password: ''
	      	},
            title:'提示',
            errshow:false,
            timer: null,
            switchValue:true,
            hei:0,
            adminData: {
                "appCode":"ACCOUNT",
                "clientIp":"127.0.0.1",
                "enterpriseCode":"SYSTEM",
                "account":"admin",
                "password":"e10adc3949ba59abbe56e057f20f883e"
            }
    	}
  	},
    watch:{
        'showDom':{
            handler(val, oldval){
                let self = this;
                clearTimeout(self.timer)
                if(val){
                    self.timer = setTimeout(() => {
                        self.showDom = false;
                    },3000)
                }
            },
            deep:true
        }
    },
    mounted(){
        let self = this;
        self.hei = document.body.offsetHeight;
    },
  	methods: {
    	submit(){//登录
    		console.log('登录入口');
    		let self = this;
            if (self.ruleForm.username == '') {
                self.$vux.toast.text('请输入账号!','middle');
            }else if(self.ruleForm.password == ''){
                self.$vux.toast.text('请输入密码!','middle');
            }else{
                self.$vux.loading.show({
                    text: '正在登录...',
                })
                FullToast('weui-loading_toast')
                let datas={"name":self.ruleForm.username,"password":self.ruleForm.password};
                console.log(datas)
                self.$axios({
                    url: self.BP_HOST+"/login",
                    method: 'post',
                    responseType: 'json',
                    data: datas
                })
                .then(function(response){
                    console.log(response);
                    self.$vux.loading.hide()
                    if (response.data != null) {
                        let msg = response.data;
                        console.log("msg.uams============", msg.uams)
                        if (msg.uams == self.PLAT_ADMIN) {
                            localStorage.setItem('jsonData',JSON.stringify(msg.data));
                            localStorage.setItem("compCode", JSON.stringify(msg.data.enterpriseCode));
                            localStorage.setItem("uams", JSON.stringify(msg.uams))
                        }else {
                            let dataJson = {
                                account: '',
                                adminId: '',
                                adminName: '',
                                email: '',
                                enabled: '',
                                enterpriseCode: '',
                                mobile: '',
                                name: '',
                                password: '',
                                sessionId: '',
                                compCode:''
                            }
                            let user = msg.data.user
                            dataJson.account = user.account
                            dataJson.email = user.email
                            dataJson.enabled = user.enabled
                            dataJson.mobile = user.mobile
                            dataJson.sessionId = user.sessionId
                            dataJson.name = user.name
                            dataJson.compCode = msg.compCode

                            localStorage.setItem("jsonData", JSON.stringify(dataJson))
                            localStorage.setItem("compCode", JSON.stringify(msg.compCode))
                            localStorage.setItem("uams", JSON.stringify(msg.uams))
                        }
                        /*用admin帐号登录用户中心，取session*/
                        self.adminLogin();
                        self.$vux.toast.text('登陆成功', 'middle');
                        self.$router.go('/home')
                    }else{
                        console.log('error')
                        self.$vux.toast.text('用户名或密码错误!','middle')
                    }
                })
                .catch(function(response){
                    console.log(response);
                }) 
            }
    	},
        adminLogin(){//用户中心管理员帐号登录
            let self = this;
            self.$axios({
                url: '/account_auth_admin/administrator-api.login',
                method: 'post',
                responseType: 'json',
                data: self.adminData
            })
            .then(function(res) {
                console.log("success", res)
                if(res.data.status === 1) {
                    localStorage.setItem("adminSessionId", res.data.data.sessionId)
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
    	submitGuest(){//游客入口
    		console.log('游客入口')
    		let self=this;
            let data = {
                name:'游客',
                pattern:'visitors',
                account:'visitors',
                uams: 'visitors',
            }
            localStorage.setItem("dataVisitor", JSON.stringify(data));
            localStorage.setItem("uams", JSON.stringify(data.uams))
            self.$router.go('/home');
    	}
  	}
}
</script>
<style lang="less" scoped>
	.box{
		background: url(../../../static/images/background4.jpg) no-repeat;
		background-size: 100% 100%;
        background-position: 58% 0;
		height: 100%;
        z-index:10000;
		.logoTitle{
			height: 40px;
            width: 100px;
			margin:0 auto;
			margin-top: 24%;
			img{
				display: block;
				/*text-align: center;*/
				/*color: #90c;*/
                margin:0 auto;
                height: 100%;
                width: 100%;
			}
		}
		.login_box{
			width: 66%;
			height: 44%;
			margin: 0 auto;
			margin-top: 16%;
            .account,.psd{
                border: 1px solid #ccc;
                border-radius: 20px;
                background: transparent;
                margin-bottom: 30px;
                color: #fff;
            }
            .psd:before{
                border:none;
            }
			.login_btn{
				margin-top: 15px;
			}
		}
	}
    
</style>
<style>
    .account input::-webkit-input-placeholder{
        color: #ccccff;
    } 
    .psd input::-webkit-input-placeholder{
        color: #ccccff;
    }
</style>