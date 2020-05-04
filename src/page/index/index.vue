<template>
  <div class="container">    
    <div class="content-wrap" v-if="shareStatus===0">
      <div class="room-info">
        <div class="info-border">
          <p class="room-type">{{checkDetail.roomTypeName}}</p>
          <p class="address">{{checkDetail.hotelName}}</p>
          <p class="person">{{checkDetail.userName}}邀您入住</p>
          <p class="time">{{checkDetail.startDate}} - {{checkDetail.endDate}} {{checkDetail.days}}晚</p>
        </div>
      </div>
      <form id="form" class="form-wrap">
        <div class="infos">入住人使用添加的手机号登录{{checkDetail.hotelName}}APP，<br/>即可查看个人的待入住信息。</div>
        <div class="tit"><span class="line"></span><span>请您提供如下信息</span><span class="line"></span></div>
        <div class="edit-wrap">
          <div class="input-item card-type-wrap" v-on:click="handleShow">
            <span class="name">证件类型</span>
            <p class="input-card">{{selected.cardName}}</p>
            <span class="rightArrow"/>
            <input type="hidden" id="cardTypeIndex" value="1"/>
            
          </div>
          <div class="input-item">
            <span class="name">证件号码</span>
            <input type="text" id="cardNum" v-model="cardNumber" @input="handleCardmbernput" placeholder="请输入证件号码">
          </div>
          <div class="input-item">
            <span class="name">真实姓名</span>
            <input type="text" id="name" @input="handleNameInput" placeholder="请输入真实姓名">
          </div>
          <div class="input-item">
            <p class="name phone-wrap">
              <span>电话区号</span>
              <span>+86</span>
              <span class="line"></span>
            </p>
            <input type="number" id="phone" @input="handlePhoneInput" placeholder="请输入手机号码">
          </div>
          <div class="input-item flex-item">
            <input type="text" id="code" @input="handleCodeInput" style="text-align: left" placeholder="请输入手机验证码 ">
            <span v-if="showCodeBtn" class="get-code" @click="getCode">获取验证码</span>
            <span v-else class="time">{{count}}S</span>
          </div>
        </div>
        <button class="btn" :class="{'btnstyle':hasEntered}" @click.prevent="handleSubmit">提 交</button>
      </form>
      
      <p class="tips">此邀请页面为您保留<span style="color: #b09f84">30</span>分钟，填写的<br/>信息务必真实有效，请尽快提交。 </p>
    </div>
    
    <div class="content-wrap" v-if="shareStatus===1">
      <div class="success-tips">
        <div class="success-icon"></div>
        <p class="status">提交成功</p>
        <p class="text">您已获得{{checkDetail.hotelName}}入住权限，快去下载APP或打开小程序看看</p>
      </div>
      <div class="hotel-info">
        <p class="hotel-name">{{checkDetail.hotelName}}</p>
        <p class="room-type">{{checkDetail.roomTypeName}}</p>
        <p class="time">{{checkDetail.startDate}} - {{checkDetail.endDate}} {{checkDetail.days}}晚</p>
        <p class="address">{{checkDetail.fullAddress}}</p>
      </div>
      <div class="code-wrap">
        <p class="tit">微信扫码打开零壹酒店小程序</p>
        <div class="code" src=''/>
      </div>
      <button id="download-btn" class="btn btnstyle">下载零壹酒店客户端</button>
    </div>
    <div class="content-wrap" v-if="shareStatus===2">
      <div class="room-info">
        <div class="info-border">
          <p class="room-type">{{checkDetail.roomTypeName}}</p>
          <p class="address">{{checkDetail.hotelName}}</p>
          <p class="person">{{checkDetail.userName}}邀您入住</p>
          <p class="time">{{checkDetail.startDate}} - {{checkDetail.endDate}} {{checkDetail.days}}晚</p>
        </div>
      </div>
      <div class="timeout">
        <div class="infos">入住人使用添加的手机号登录{{checkDetail.hotelName}}APP，<br/>即可查看个人的待入住信息。</div>
        <span class="fail-icon"></span>
        <p>超过30分钟未提交<br>该邀请已失效</p>
      </div>
    </div>
    <div class="content-wrap nothingness-content" v-if="shareStatus===3">
      <p class="status">404</p>
      <p class="tips" style="color: #C0AD90">所请求的页面不存在或已被删除</p>
    </div>
    <div class="lose-content" v-if="shareStatus===4">
      <span class="lose-icon"></span>
      <p>该页面已失效</p>
    </div>
    <div class="wrapper" v-if="showIosSelect">
      <header class="col-header">
        <span @click.prevent="cancleShow" >取消</span>
        <span @click.prevent="handleOk">确定</span>
      </header>
      <SelectColumn  @select="getSelectValue" :listData="cardTypeList"></SelectColumn>
    </div>
    <div class="toast-wrap" v-if="showToast">
      <div class="wrap">
        <h3>{{title}}</h3>
      </div>
    </div>
  </div>
  
</template>
<script>
// /* eslint-disable */
import SelectColumn from "@component/selectColumn";
import { addUserByShare, getCheckInfoByShare, 
  getSmsCodeByShare, 
} from "@model/index";

let timer = null;
let countTimer = null;
export default {
  components:{
    SelectColumn,
  },
  created(){
    const search = window.location.search.substring(1);
    if(search){
      search.split("&").map(it=>{
        this.option[it.split("=")[0]] = it.split("=")[1];
        return it;
      });
    }
    // console.log("进入-------------------", window.location, this.option);
  },
  data(){
    return{
      name: "",
      cardNumber: "",
      phone: "",
      code: "",
      option: {},
      checkDetail: {},
      cardTypeList: [],
      shareStatus: -1,
      showIosSelect: false,
      selected: {},
      selectCardValue: {},
      title: "aaaaaaaaaaaa",
      showToast: false,
      hasEntered: false,
      count: 5,
      showCodeBtn: true,
    };
  },
  methods:{
    handleShow(){
      this.showIosSelect = true;
    },
    cancleShow(){
      this.showIosSelect = false;
    },
    handleOk(){
      this.showIosSelect = false;
      this.selected = this.selectCardValue;
    },
    getSelectValue(value) {
      this.selectCardValue = value;
    },
    checkHasEntered(){
      if(this.cardNumber && this.phone && this.name && this.code){
        return true;
      }
      return false;      
    },
    handleCardmbernput(e){
      this.cardNumber = e.target.value;
      this.hasEntered = this.checkHasEntered();
    },
    handleNameInput(e){
      this.name = e.target.value;
      this.hasEntered = this.checkHasEntered();
    },
    handlePhoneInput(e){
      this.phone = e.target.value;
      this.hasEntered = this.checkHasEntered(); 
    },
    handleCodeInput(e){
      this.code = e.target.value;
      this.hasEntered = this.checkHasEntered(); 
    },
    checkValue(){
      const regName = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
      const regPhone = /^1[3456789]\d{9}$/;
      let regcardNumber = /[^\u4e00-\u9fa5]/;
      if(this.selected.cardId === 1){
        regcardNumber = /^\d{6}((1[89])|(2\d))\d{2}((0\d)|(1[0-2]))((3[01])|([0-2]\d))\d{3}(\d|X)$/i;
      }
      if(!regcardNumber.test(this.cardNumber)){
        this.title = "请输入正确的证件号码后再次提交";
        return true;
      }
      if(regName.test(this.name)){
        this.title = "请输入正确的姓名";
        return true;
      }
      if(!regPhone.test(this.phone)){
        this.title = "请输入正确的手机号码后再次提交";
        return true;
      }
      return false;
    },
    doShowToast(sec){
      this.showToast = true;
      if(timer) clearTimeout(timer);
      timer = setTimeout(()=>{
        this.showToast = false;
      }, sec);
    },
    async getCode(){
      this.showCodeBtn = false;
      if(!this.name){
        this.title = "请输入真实姓名";
        this.doShowToast(2000);
        return;
      }
      const regPhone = /^1[3456789]\d{9}$/;
      if(!this.phone || !regPhone.test(this.phone)){  
        this.title = "请输入正确的手机号码";
        this.doShowToast(2000);
        return;
      }
      this.timeChange();
      const res = await getSmsCodeByShare({
        mobile: this.phone.trim(),
      });
      if(!res.status){
        this.title = "糟糕，网络傲娇了";
        this.doShowToast(2000);
      }
    },
    timeChange(){
      countTimer = setTimeout(()=>{
        this.count--;
        this.timeChange();
        if(this.count===-1){
          this.showCodeBtn = true;
          clearTimeout(countTimer);
        }
      }, 1000);
    },
    async handleSubmit(){
      if(!this.hasEntered) return;
      if(this.checkValue()){
        this.doShowToast(2000);
        return;
      }
      const params = {
        name: this.name,
        mobile: this.phone,
        t: this.option.t,
        checkId: this.option.checkInId,
        code: this.code,
        card_type: this.selected.cardId,
        card_no: this.cardNumber,
      };
      const res = await addUserByShare(params);
      if(res.status){
        this.shareStatus = res.data.shareStatus;
      }else{
        this.title = res.message ||"糟糕，网络傲娇了";
        this.doShowToast(2000);
      }
    },
    async getCheckInfoByShare(){
      const params = {
        t: this.option.t,
        checkInId: this.option.checkInId,
      };
      const res = await getCheckInfoByShare(params);
      console.log("获取入住信息：", res);
      if(res.status){
        this.shareStatus = res.data.shareStatus;
        // 0：待添加；1：已添加；2：超时失效页面；3：404（不存在）；4：其他情况已失效 
        this.shareStatus = 0;
        const data = res.data;
        const startDate = data.startDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1.$2.$3");
        const endDate = data.endDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1.$2.$3");
        data.startDate = startDate;
        data.endDate = data.endDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$2.$3");
        data.days = (new Date(endDate.replace(/\./g, "/")).getTime() - new Date(startDate.replace(/\./g, "/")).getTime()) / (3600 * 24 * 1000);
        this.checkDetail = data;
        this.cardTypeList = data.cardType;
        this.selected = this.cardTypeList.filter(it=>it.cardId===1)[0];
        console.log("this.shareStatus-------", this.shareStatus, this.checkDetail.days);   
      }else{
        this.title = "糟糕，网络傲娇了";
        this.doShowToast(2000);
      }
    },
  },
  beforeMount(){
    
  },
  mounted(){
    this.getCheckInfoByShare();
  },
};
</script>
<style lang="scss">
@import "./style.scss"
</style>

