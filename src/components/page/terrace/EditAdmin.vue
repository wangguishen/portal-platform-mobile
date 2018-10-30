<template>
    <div>
      	<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
      	<div style="margin-top: 46px">
      	    <div v-show="isAdmin">
			    <add-admin :adminList="adminList"></add-admin>
      	    </div>

            <div v-show="isFlatcompany">
                <add-flatcompany :flatcompanyList="flatcompanyList"></add-flatcompany>
            </div>
      	</div>
    </div>
</template>

<script>
import VHeader from '../../common/Header'			//头部
import addAdmin from '../terrace/AddAdmin'   //新增管理员*/
import addFlatcompany from '../terrace/AddFlatcompany' //平台企业管理
	export default {
        components: {
            VHeader, addAdmin, addFlatcompany
        },
        data() {
        	return {
        		currentFrim: {},//数据
    			headObj: {
                    title: '',
                    isBack: true,
                },
                rightObj: {
      	            isMore: false,
            	    // title: "完成",
                },
        		isAdmin: false,
        		adminList: {
        			id: '',
        			comp_code: '',
                    account: '',
                    name: '',
                    password: '',
                    type: 'xq',
        		},
                isFlatcompany: false,
                flatcompanyList: {
                    id: '',
                    enterpriseCode: '',
                    name: '',
                    shortName: '',
                    isGroup: '',
                    enterpriseParentCode: 0,
                },
                tempData: {},  //备份
                dataJson: {},
        	}
        },
        mounted() {
            let self = this
            self.currentFrim = JSON.parse(localStorage.getItem('DetailsInfoMation'))
            self.dataJson = JSON.parse(localStorage.getItem('jsonData'))
            console.log(self.currentFrim)
            if(self.currentFrim.pathPage === '/newadmin') {
                self.headObj.title = self.currentFrim.name

                self.isAdmin = true
                self.adminList.id  = self.currentFrim.id
                self.adminList.comp_code = self.currentFrim.comp_code
                self.adminList.account = self.currentFrim.account
                self.adminList.name = self.currentFrim.name
                self.adminList.password = self.currentFrim.password

                /*备份*/
                self.tempData.id  = self.currentFrim.id
                self.tempData.comp_code = self.currentFrim.comp_code
                self.tempData.account = self.currentFrim.account
                self.tempData.name = self.currentFrim.name
                self.tempData.password = self.currentFrim.password
            } else if(self.currentFrim.pathPage === '/flatcompany') {
                self.headObj.title = self.currentFrim.comp_name

                self.isFlatcompany = true
                self.flatcompanyList.id = self.currentFrim.id
                self.flatcompanyList.enterpriseCode = self.currentFrim.comp_code
                self.flatcompanyList.name = self.currentFrim.comp_name
                self.flatcompanyList.shortName = self.currentFrim.comp_short_name
                self.flatcompanyList.enterpriseParentCode = self.currentFrim.comp_parent_code
                self.flatcompanyList.isGroup = self.currentFrim.isGroup === 'Y' ? '是' : '否'

                /*备份*/
                self.tempData.id = self.currentFrim.id
                self.tempData.enterpriseCode = self.currentFrim.comp_code
                self.tempData.name = self.currentFrim.comp_name
                self.tempData.shortName = self.currentFrim.comp_short_name
                self.tempData.enterpriseParentCode = self.currentFrim.comp_parent_code
                self.tempData.isGroup = self.currentFrim.isGroup === 'Y' ? '是' : '否'
            }
            console.log(',,,,,',self.adminList)
        },
        watch: {
            'adminList' : {
                handler: function(val, old) {
            	    let self = this
                    console.log(self.tempData, val)
            	    if(JSON.stringify(self.tempData) !== JSON.stringify(val)) {
            	        self.rightObj.isMore = true
            	    } else {
            		    self.rightObj.isMore = false
            	    }
                },
                deep: true
            },
            'flatcompanyList': {
                handler: function(val, old) {
                    let self = this
                    if(!self.cmp(self.tempData, val)) {
                        self.rightObj.isMore = true
                    } else {
                        self.rightObj.isMore = false
                    }
                },
                deep: true
            }
        },
        methods: {
	        backWay(data) {//返回
				let self = this
				self.$router.back(self.currentFrim.pathPage)
			},
			finish(data){//完成
				let self = this
                if(self.isAdmin) {
                    let url = '/UAMS/adminReq/updateAdminManager'
                    let data = self.adminList
                    self.amendSubmit(url, data)
                } else if(self.isFlatcompany) {
                    let url = '/basic-platform/updateComp'
                    let tempGroup = self.flatcompanyList.isGroup === '是' ? 'Y' : 'N'
                    let data = {
                        sessionId: self.dataJson.sessionId,
                        enterpriseCode: self.flatcompanyList.enterpriseCode,  //企业编码
                        shortName: self.flatcompanyList.shortName, //简称
                        name: self.flatcompanyList.name,//企业名称
                        isGroup: tempGroup,//是否为集团
                        enterpriseParentCode: self.flatcompanyList.enterpriseParentCode,
                        newCompName: self.flatcompanyList.name
                    }
                    self.amendSubmit(url, data)
                }
			},
            amendSubmit(url, data) {
                let self = this
                self.$axios({
                    url: url,
                    method: 'post',
                    responseType: 'json',
                    data: data
                })
                .then(function(res) {
                    if(res.status == 200) {
                        self.$vux.toast.text("修改成功", 'middle')
                        setTimeout(() => {
                            self.$router.back(self.currentFrim.pathPage)
                        },1500)
                    }
                })
                .catch(function(res) {
                    console.log("error", res)
                })
            },
            cmp( x, y ) {   //比较对象里的值是否相等
                if ( x === y ) { 
                    return true
                } 
 
                if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) { 
                    return false 
                } 
 
                if ( x.constructor !== y.constructor ) { 
                    return false; 
                } 
  
                for ( var p in x ) { 
                    if ( x.hasOwnProperty( p ) ) { 
                        if ( ! y.hasOwnProperty( p ) ) { 
                            return false; 
                        } 
         
                        if ( x[ p ] === y[ p ] ) { 
                            continue 
                        } 
         
                        if ( typeof( x[ p ] ) !== "object" ) { 
                            return false
                        } 
         
                        if ( ! Object.equals( x[ p ], y[ p ] ) ) { 
                            return false 
                        } 
                    }
                } 
 
                for ( p in y ) { 
                    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) { 
                        return false 
                    } 
                } 
                return true
            }
        }
	}
</script>