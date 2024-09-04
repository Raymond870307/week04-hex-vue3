<script setup>
import { ref } from 'vue';
import axios from 'axios';

const signField = ref({
  email: '',
  password: '',
  nickname: '',
  passwordCheck:'',
});

const errorMessage = ref('');

const api = 'https://todolist-api.hexschool.io';

const signup = async () => {
  // 清除錯誤消息
  errorMessage.value = '';

  // 密碼檢查
  if (signField.value.password !== signField.value.passwordCheck) {
    errorMessage.value = '密碼和確認密碼不一致。';
    return;
  }

  try {
    const res = await axios.post(`${api}/users/sign_up`, signField.value);
    console.log('Signup successful:', res);
    // 進一步處理註冊成功邏輯
  } catch (error) {
    console.error('Signup error:', error.response?.data?.message || error.message);
    errorMessage.value = '註冊失敗，請稍後再試。';
  }
};
</script>

<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
      </div>
      <div>
        <form class="formControls">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
           class="formControls_input" 
           type="text"
           id="email" 
           name="email"
           placeholder="請輸入 email" required
           v-model="signField.email">
          <label class="formControls_label" for="name">您的暱稱</label>
          <input class="formControls_input" 
          type="text"
           name="name" 
           id="name"
           placeholder="請輸入您的暱稱"
           v-model="signField.nickname">
          <label class="formControls_label" for="pwd">密碼</label>
          <input class="formControls_input"
           type="password"
           name="pwd"
           id="pwd"
           placeholder="請輸入密碼" required
           v-model="signField.password">
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input class="formControls_input" 
          type="password" 
          name="pwd" 
          id="pwd" 
          v-model="signField.passwordCheck"
          placeholder="請再次輸入密碼" required>
          <!-- 顯示錯誤消息 -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <input 
          class="formControls_btnSubmit" 
          type="button"
          value="註冊"
          @click="signup">
          <router-link to="/" class="formControls_btnLink">登入</router-link>
          <!-- email: {{ signField.email }}
          暱稱：{{ signField.nickname }}
          密碼:{{ signField.password }}
          確認密碼:{{signField.passwordCheck}} -->
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  font-size: 0.9em;
}
</style>
