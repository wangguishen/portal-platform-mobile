<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
        <div class="container_top">
            <group class="boxAdd">
                <x-input title="原密码" type="password" text-align="right" placeholder="请输入原密码" v-model="psdObj.oldPassword"></x-input>
                <x-input title="新密码" type="password" text-align="right" placeholder="请输入新密码" v-model="psdObj.newPassword"></x-input>
                <x-input title="确认新密码" type="password" text-align="right" placeholder="请再次输入新密码" v-model="psdObj.checkPassword"></x-input>
            </group>
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import md5 from 'js-md5'
import { Group, Cell, CellBox, LoadMore,XInput,Toast } from 'vux'
export default {
    components: {
        VHeader, Group, Cell, LoadMore, CellBox,XInput,Toast
    },
    data(){
        return {
            headObj:{
                title: '修改密码',
                isBack: true,
            },
            rightObj:{
                isMore: true,
                title: "完成",
            },
            psdObj:{
                oldPassword:'',
                newPassword:'',
                checkPassword:''
            },
            compCode:'',
            userId:'',
            account:'',
            name:''
        }
    },
    mounted(){
        let self = this;
        let loginStorage = JSON.parse(localStorage.getItem('jsonData'));
        let codeStorage = JSON.parse(localStorage.getItem('compCode'));
        console.log(loginStorage);
        self.compCode = codeStorage;
        self.userId = loginStorage.adminId;
        self.account = loginStorage.account;
        self.name = loginStorage.name;
    },
    methods: {
        backWay(){
            let self = this;
            self.$router.back('/userhome');
        },
        finish(data){
            let self = this;
            console.log(data);
            if (self.psdObj.oldPassword == '') {
                self.$vux.toast.text("请输入原密码!",'middle');
            }else if (self.psdObj.newPassword == '') {
                self.$vux.toast.text("请输入新密码!",'middle');
            }else if (self.psdObj.checkPassword == '') {
                self.$vux.toast.text("请再次输入新密码!",'middle');
            }else if (self.psdObj.checkPassword != self.psdObj.newPassword) {
                self.$vux.toast.text("两次密码不一致!",'middle');
            }else {
                let datas = {
                    'comp_code' : self.compCode,
                    'id' : self.userId,
                    'account' : self.account,
                    'name' : self.name,
                    'old_password' : md5(self.psdObj.oldPassword),
                    'password' : md5(self.psdObj.checkPassword)
                }
                console.log(datas);
                self.$axios({
                    url:'/UAMS/adminReq/updateAdminManager',
                    method:'post',
                    responseType:'json',
                    data:datas
                })
                .then(function(res){
                    console.log(res)
                    if (res.data.success == true) {
                        self.$vux.toast.text('修改密码成功!','middle');
                        // self.$router.go('/home')
                    }else {
                        self.$vux.toast.text('修改密码失败!','middle');
                    }
                })
                .catch(function(res){
                    console.log('error',res);
                    self.$vux.toast.text('服务器信息错误!','middle');
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
</style>