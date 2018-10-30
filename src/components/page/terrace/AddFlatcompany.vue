<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
        <div class="container_top addZoolog">
            <group>
                <group-title slot="title">*为必填项</group-title>
                <x-input class="ipt" title="*企业名称" text-align="right" placeholder="请输入企业名称" v-model="companyObj.name"></x-input>
                <x-input v-show="!compCodeShow" class="ipt" title="*企业编码" text-align="right" placeholder="请输入企业编码" v-model="companyObj.code"></x-input>
                <cell v-show="compCodeShow" class="dem comp" title="*企业编码" :value="companyObj.code"></cell>
                <x-input class="ipt" title="*企业简称" text-align="right" placeholder="请输入企业简称" v-model="companyObj.shortName"></x-input>
                <cell v-show="compCodeShow" class="dem comp" title="企业类型" :value="addFlat.isGroup == 'Y' && addFlat.comp_parent_code === 0 ? '集团' : addFlat.comp_parent_code === 1 ? '生态企业' : '企业'"></cell>
                <x-address title="企业地址" @on-hide="logHide" @on-shadow-change="onShadowChange" :raw-value="true" v-model="companyObj.address" :list="addressData" placeholder="请选择企业地址">
                    <!-- <template slot="title" scope="props">
                        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                          <span style="vertical-align:middle;">地址</span>
                        </span>
                    </template> -->
                </x-address>
                <x-input class="ipt" title="详细地址" v-show="companyObj.address.length != 0" text-align="right" placeholder="请输入详细地址" v-model="companyObj.addresses"></x-input>
                <x-input class="ipt" title="联系人" text-align="right" placeholder="请输入企业联系人" v-model="companyObj.contact"></x-input>
                <x-input class="ipt" title="联系方式" text-align="right" placeholder="请输入企业电话" v-model="companyObj.contactPhone"></x-input>
                <cell class="dem" title="*是否集团企业" :value="companyObj.isGroup || '请选择企业类型'" @click.native="select()" is-link></cell>
                <popup-picker
                    class="codePic"
                    title="*选择集团编码"
                    :data="labList"
                    v-model="sureLab"
                    @on-change="onChange"
                    placeholder='请选择集团编码'
                    ref="picker1"
                    v-show="companyObj.isGroup == '否'?true:false">
                </popup-picker>
                <cell class="logo" title="企业LOGO" @click.native="selectImg()" is-link>
                    <div>
                        <span class="iconfont" v-show="!companyObj.logo">&#xe658;</span>
                        <img :src="companyObj.logo" alt="" v-show="companyObj.logo" width="30" height="30">
                    </div>
                </cell>
                <x-textarea title="备注" v-model="companyObj.remark" placeholder="请输入备注" :show-counter="false" :rows="1" autosize></x-textarea>
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
        <div v-transfer-dom>
            <popup v-model="imgShow" is-transparent>
                <div style="background-color:#fff;">
                    <div class="styless preview" v-show="companyObj.logo" @click="preview()">
                        预览
                    </div>
                    <form id="form" method="post" enctype="multipart/form-data">  
                        <input type="text" id="module_id" name="module_id" value="1" style="display:none;"/> 
                        <input type="text" id="imagesName" name="imagesName" value="imagesName" style="display:none;"/> 
                        <!-- <input type="file" id="file" name="file" @change="clickChange" for="submit_btn" style="display:none;"/> -->
                        <input id="file" style="display: none;" type="file" name="file" accept="image/*" @change="onFileChange" for="submit_btn">
                        <label for="file" class="styless">
                            本地上传
                        </label> 
                        <input style="display:none;" type="submit" id="submit_btn" value="提  交"/>  
                    </form>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showToast" class="dialog-demo">
                <div class="img-box">
                    <img :src="companyObj.logo" style="max-width:100%;display:block;margin:0 auto;">
                </div>
                <div @click="showToast=false">
                    <span class="vux-close"></span>
                </div>
            </x-dialog>
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, GroupTitle, Cell, XInput, XAddress, XButton, XTextarea, PopupPicker, ChinaAddressData, Value2nameFilter as value2name, Popup, TransferDom, Actionsheet, XDialog } from 'vux'
export default{
    directives: {
        TransferDom
    },
    components: {
        VHeader, Group, GroupTitle, Cell, XInput, XAddress, Popup, XButton, PopupPicker, XTextarea, Actionsheet, XDialog

    },
    data(){
        return {
            dataJson: {},
            addZoology: {},
            addFlat: {},
            headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
                isMore: true,
                title: '完成'
            },
            addressData: ChinaAddressData,
            companyBackUp:{
                name: '',//名字
                code: '',//编码
                shortName: '',//简称
                address: [],//地址
                addressArr: '',//地址数值
                contact: '',//联系人
                contactPhone: '',//联系方式
                isGroup: 0,//是否为集团
                groupCode: '',//集团编码
                logo: '',//图片
                remark: '',//备注
                addresses:'',//详细地址
            },//备份记录
            companyObj: {
                name: '',//名字
                code: '',//编码
                shortName: '',//简称
                address: [],//地址
                addressArr: '',//地址数值
                contact: '',//联系人
                contactPhone: '',//联系方式
                isGroup: 0,//是否为集团
                groupCode: '',//集团编码
                logo: '',//图片
                remark: '',//备注
                addresses:'',//详细地址
            },
            typeShow: false,//模型选择
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
            labList: [],//企业编码列表
            sureLab:[],//选中企业编码的值
            imgShow: false,
            showToast: false,
            photoes: {
                preview: '预览',
                updata: '本地选取'
            },
            compCodeShow: false,//添加或编辑不同显示
        }
    },
    mounted(){
        let self = this;
        self.dataJson = JSON.parse(localStorage.getItem('jsonData'))
        self.addZoology = JSON.parse(localStorage.getItem('addPage'))
        self.addFlat = JSON.parse(localStorage.getItem('DetailsInfoMation'))
        self.headObj.title = self.addZoology.title;
        self.transerfBloc();
        console.log('===',self.addZoology)
        console.log('---',self.addFlat)
        console.log('--------------',ChinaAddressData)
        if(self.addZoology.state == "0"){
            self.companyObj.name = self.addFlat.comp_name
            self.companyBackUp.name = self.addFlat.comp_name
            self.companyObj.code = self.addFlat.comp_code
            self.companyBackUp.code = self.addFlat.comp_code
            self.companyObj.shortName = self.addFlat.comp_short_name
            self.companyBackUp.shortName = self.addFlat.comp_short_name
            let addressArr = [],arr = [];
            if(self.addFlat.address){
                if(self.addFlat.address.indexOf('&') >= 0){
                    addressArr = self.addFlat.address.split('&')
                    arr = addressArr[0].split(' ')
                    self.companyObj.addresses = addressArr[1];
                    self.companyBackUp.addresses = addressArr[1];
                    self.companyObj.addressArr = addressArr[0];
                    self.companyBackUp.addressArr = addressArr[0];
                    self.companyObj.address = arr
                    console.log('arr',arr)
                    console.log('ChinaAddressData',ChinaAddressData)
                    // self.onShadowChange(arr)
                    self.companyBackUp.address = arr

                }else{
                    self.companyObj.address = self.addFlat.address.split(" ")
                    self.companyBackUp.address = self.addFlat.address.split(" ")
                    self.companyObj.addressArr = self.addFlat.address
                    self.companyBackUp.addressArr = self.addFlat.address
                }
            }
            self.companyObj.contact = self.addFlat.contact
            self.companyBackUp.contact = self.addFlat.contact
            self.companyObj.contactPhone = self.addFlat.telephone
            self.companyBackUp.contactPhone = self.addFlat.telephone
            self.companyObj.groupCode = self.addFlat.comp_parent_code
            self.companyBackUp.groupCode = self.addFlat.comp_parent_code
            self.companyObj.logo = self.addFlat.logo
            self.companyBackUp.logo = self.addFlat.logo
            self.companyObj.remark = self.addFlat.remarks
            self.companyBackUp.remark = self.addFlat.remarks
            if(self.addFlat.isGroup == "N"){
                self.companyObj.isGroup = "否"
                self.companyBackUp.isGroup = "否"
            }else{
                self.companyObj.isGroup = "是"
                self.companyBackUp.isGroup = "是"
            }
            self.compCodeShow = true;
            console.log(self.companyObj)
            console.log(self.companyBackUp)
        }else{
            self.addFlat.comp_parent_code = 10
        }
    },
    methods:{
        backWay(data){
            let self = this;
            self.$router.back('/flatcompany');
        },
        onShadowChange(id, name){
            let self = this;
            if(name.toString()==self.companyBackUp.address){
                self.companyBackUp.address = id
            }
        },
        finish(date){
            let self = this
            console.log(self.companyObj)
            if(!self.companyObj.code) {
                self.$vux.toast.text("请输入企业编码", 'middle')
            } else if(!self.companyObj.name) {
                self.$vux.toast.text("请输入企业名称", 'middle')
            } else if(!self.companyObj.shortName) {
                self.$vux.toast.text("请输入企业简称", 'middle')
            } else if(!self.companyObj.isGroup) {
                self.$vux.toast.text("请选择是否集团企业", 'middle')
            } else if(self.companyObj.isGroup == '否' && self.companyObj.groupCode == 0){
                self.$vux.toast.text("请选择集团编码", 'middle')
            } else {
                console.log("=====",self.companyObj)
                console.log("-----",self.companyBackUp)

                if(isObjectUtil(self.companyObj, self.companyBackUp)){
                    self.$vux.toast.text("你还没有进行任何修改", 'middle')
                    return
                }
                console.log(self.sureLab)
                let tempGroup = self.companyObj.isGroup === '是' ? 'Y' : 'N'
                if(tempGroup == 'Y'){
                    self.companyObj.groupCode = 0;
                }
                let url,data,ress;
                if(self.companyObj.addresses != ''){
                    ress = self.companyObj.addressArr + '&' + self.companyObj.addresses
                }else{
                    ress = self.companyObj.addressArr
                }
                if(self.addZoology.state == "0"){
                    url = self.BP_HOST + '/updateComp'
                    data = {
                        'sessionId': self.companyObj.code,
                        'enterpriseCode': self.companyObj.code,
                        'name': self.companyObj.name,
                        'shortName': self.companyObj.shortName,
                        'isGroup': tempGroup,
                        'enterpriseParentCode': self.companyObj.groupCode,
                        'address': ress,
                        'contact': self.companyObj.contact,
                        'telephone': self.companyObj.contactPhone,
                        'logo': self.companyObj.logo,
                        'remarks': self.companyObj.remark,
                        'newCompName': self.companyObj.name,//新企业名称
                        'type': 'SYSTEM'
                    }
                }else{
                    url = self.BP_HOST + '/addComp'
                    data = {
                        'enterpriseCode': self.companyObj.code,
                        'name': self.companyObj.name,
                        'shortName': self.companyObj.shortName,
                        'isGroup': tempGroup,
                        'enterpriseParentCode': self.companyObj.groupCode,
                        'address': ress,
                        'contact': self.companyObj.contact,
                        'telephone': self.companyObj.contactPhone,
                        'logo': self.companyObj.logo,
                        'remarks': self.companyObj.remark,
                        'type': 'SYSTEM'
                    }
                }
                console.log(data)
                self.$axios({
                    url: url,
                    method: 'post',
                    responseType: 'json',
                    data: data
                })
                .then(function(res) {
                    console.log("success", res);
                    let list = JSON.parse(res.data.data)
                    if(list.success){
                        if(self.addZoology.state == "0"){
                            // self.$vux.toast.text("修改企业成功", 'middle')
                            self.$nextTick(()=>{
                                self.$router.back('/flatcompany');
                            })
                        }else{
                            self.$router.back('/flatcompany');
                            self.$vux.toast.text("注册企业成功", 'middle')
                        }
                    }else{
                        self.$vux.toast.text(list.msg, 'middle') 
                    }
                })
                .catch(function(res) {
                    console.log("error", res);
                })
            }
        },
        transerfBloc() {//调取所有的企业编码
            let self = this
            let data = {}
            self.$axios({
                url: '/UAMS/company/do_comp_query?pageSize=10000',
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log("res",res)
                let list = res.data.data.list
                self.labList = [[]];
                list.forEach(function(item,index){
                    if(self.companyObj.groupCode == item.id){
                        self.sureLab.push(item.comp_code)
                    }
                    self.$set(item, 'name', item.comp_code);
                    self.$set(item, 'value', item.comp_code);
                    self.labList[0].push(item)
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        logHide (str) {//关闭选择企业地址框
            let self = this;
            console.log('on-hide', str)
            console.log(self.companyObj.address)
            self.companyObj.addressArr = self.getName(self.companyObj.address)  
            console.log(self.companyObj.addressArr)
        },
        getName (value) {//地址由id转为汉字
            return value2name(value, ChinaAddressData)
        },
        selectType(type){//切换是否为集团
            let self = this;
            self.types.forEach(function(item, index){
                item.state = 0;
                item.typeText = 'default';
            });
            type.state = 1;
            type.typeText = 'primary';
            self.typeShow = false;
            self.companyObj.isGroup = type.name;
            // if(type.name == '否'){
            //     self.codeShow = true;
            // }else{
            //     self.codeShow = false;
            // }
        },
        select(){//是否为集团
            let self = this;
            self.typeShow = !self.typeShow;
            if(self.companyObj.isGroup != ''){
                self.types.forEach(function(item, index){
                    if(self.companyObj.isGroup == item.name){
                        item.state = 1;
                        item.typeText = "primary";
                    }
                })
            }
        },
        onChange(val){//切换选中的值
            let self = this;
            self.labList[0].forEach(function(item, index){
                if(item.name == val[0]){
                    self.companyObj.groupCode = item.id
                    console.log(item)
                    console.log(self.companyObj.groupCode)
                }
            })
        },
        selectImg(){//调取图片
            let self = this;
            self.imgShow = !self.imgShow
        },
        click (key) {
            console.log(key)
        },
        onFileChange(e) {
            let self = this;
            let formData = new FormData(document.getElementById('form'));
            let url = '/vr-content/file/upload'
            self.$axios.create({
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).post(url,formData)
            .then(function(res) {
                console.log("success", res);
                let img = res.data.data[0]
                self.companyObj.logo = img.file_url
                self.imgShow = !self.imgShow  
            })
            .catch(function(res) {
                console.log("error", res);
            })
        },
        preview(){
            let self = this;
            self.imgShow = false;
            self.showToast = true 
        },
    },
}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close';
    .dem.weui-cell{//改变cell的样式
        padding:0 15px;
    }
    .comp.weui-cell{
        padding-right: 2rem;
    }
    .logo.weui-cell{
        padding:0 15px;
    }
    .ipt.weui-cell{
        padding-right:20px;
    }
    .iconfont{
        color: #ccc;
    }
    .styless{
        display: block;
        height: 50px;
        text-align: center;
        line-height: 50px;
    }
    .preview{
        border-bottom: 1px solid #d9d9d9;
        box-sizing: border-box;
    }
    .dialog-demo {
        .weui-dialog{
            border-radius: 8px;
            padding-bottom: 8px;
        }
        .dialog-title {
            line-height: 30px;
            color: #666;
        }
        .img-box {
            // height: 350px;
            overflow: hidden;
        }
        .vux-close {
            margin-top: 8px;
            margin-bottom: 8px;
        }
}
</style>