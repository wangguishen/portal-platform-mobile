<template>
    <div>
        <div class="orgcha relevance addAdmin" v-show="adminList.type == 'xq'">
            <group>
                <cell title="企业编码" :value="adminList.comp_code"></cell>
                <cell title="管理员帐号" :value="adminList.account"></cell>
                <cell title="管理员名称" :value="adminList.name"></cell>
                <cell title="管理员密码" :value="adminList.password"></cell>
            </group>
        </div>
        <div v-show="adminList.type == 'xz'">
            <group>
                <popup-picker
                    title="企业" 
                    :data="screenArr" 
                    placeholder='请选择企业' 
                    v-model="currentVal"
                    @on-change="shadowChange">
                </popup-picker>
            </group>
        </div>
    </div>
</template>
<script>
import { Group, Cell, XInput, Popup, XButton, PopupPicker } from 'vux'
export default{
    components: {
        Group, Cell, XInput, Popup, XButton, PopupPicker
    },
    props:{
        adminList: Object,
    },
    data(){
        return {
            jsonData:{},//企业对象
            accountCompCode: '',//企业管理员code
            screenArr: [],//企业集合
            backupsArr: [],//企业集合备份
            currentVal: [],//企业选中的值
            enterprise: {},//当前选中的企业
        }
    },
    mounted (){
        let self = this;
        self.jsonData = JSON.parse(localStorage.getItem('jsonData'))
        self.accountCompCode = localStorage.getItem('compCode')
        let uams = JSON.parse(localStorage.getItem('uams'))
        if(self.accountCompCode){
            self.accountCompCode = self.accountCompCode.replace("\"","").replace("\"","")
        }
        if(self.adminList.type == 'xz'){
            if(uams == self.PLAT_ADMIN){
                self.referCode()
            }else{
                self.queryData()
            }
        }
    },
    methods: {
        referCode(){//admin状态下请求集团与企业
            let self = this;
            self.$axios({
                url: '/UAMS/company/do_comp_query?pageSize=100000',
                method: 'post',
                data: {
                    "compName":""
                }
            })
            .then(function(res) {
                console.log('1',res)
                if(res.data.success){
                    let list = res.data.data.list;
                    self.backupsArr = [];
                    self.screenArr = [];
                    let arr = [];
                    list.forEach(function(item, index){
                        self.backupsArr.push(item)
                        arr.push(item.comp_name)
                    })
                    self.$nextTick(()=>{
                        self.screenArr.push(arr)
                        console.log(self.screenArr)
                    })
                }else{
                    self.$vux.toast.text(res.data.msg, 'middle')
                }
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })
        },
        queryData(){//企业状态下请求企业
            let self = this;
            self.$axios({
                url: '/UAMS/Auth/queryCompany?pageSize=10000',
                method: 'post',
                data: {
                    "compCode": self.accountCompCode ? self.accountCompCode : ''
                }
            })
            .then(function(res) {
                console.log('2',res)
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })
        },
        shadowChange(val){
            let self = this;
            self.backupsArr.forEach(function(item, index){
                if(val[0] == item.comp_name){
                    self.enterprise = item;
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
    .dem.weui-cell{//改变cell的样式
        padding:0 15px;
    }
    .ipt.weui-cell{
        padding-right:25px;
    }
</style>
<style>
    .codePic .weui-cell{
        padding: 18px 15px;
    }
</style>