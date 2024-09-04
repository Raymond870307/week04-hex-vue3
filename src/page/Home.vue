<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const signin = ref({
  email: '',
  password: '',
});
const signinRes = ref('');
const user = ref({
  nickname: '',
  uid: '',
});
const successMessage = ref(''); // 成功訊息
const errorMessage = ref('');   // 錯誤訊息
const api = 'https://todolist-api.hexschool.io';
const router = useRouter();

const getToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)todolist\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};

const setToken = (token) => {
  document.cookie = `todolist=${token}`;
};



const submit = async () => {
  console.log(`${api}/users/sign_in`);
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const res = await axios.post(`${api}/users/sign_in`, signin.value);
    console.log('Signin successful:', res);
    signinRes.value = res.data.token;
    setToken(res.data.token);
    successMessage.value = '登入成功！即將跳轉至代辦事項頁面。';

    // 驗證 token 並跳轉到 /Todolistpage
    setTimeout(() => {
      router.push('/Todolistpage'); // 跳轉到 Todolistpage
    }, 2000);
  } catch (error) {
    console.error('Signin error:', error.response?.data?.message || error.message);
    errorMessage.value = '登入失敗，請檢查您的帳號和密碼。';
  }
};

onMounted(async () => {
  const token = getToken();
  console.log('Token:', token);

  if (token) {
    try {
      const res = await axios.get(`${api}/users/checkout`, {
        headers: {
          Authorization: token,
        },
      });
      console.log('User data:', res);
      user.value = res.data;
    } catch (error) {
      console.error('Checkout error:', error.response?.data?.message || error.message);
    }
  }
});
</script>

<template>
  <div id="loginPage" class="bg-yellow">
    <div class="container loginPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
      </div>
      <div>
        <form class="formControls">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>

          <!-- 成功訊息 -->
          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" 
                 type="text"
                 id="email"
                 name="email" 
                 placeholder="請輸入 email"
                 v-model="signin.email"
                 required>
          <label class="formControls_label" for="pwd">密碼</label>
          <input class="formControls_input"
                 type="password"
                 name="pwd" 
                 id="pwd" 
                 placeholder="請輸入密碼" required
                 v-model="signin.password">
          <input class="formControls_btnSubmit"
                 type="button"
                 @click="submit"
                 value="登入">
          <router-link to="/SignUpPage" class="formControls_btnLink" type="button">註冊帳號</router-link>
          <!-- <p class="width-auto"> -->
            <!-- 電郵：{{ signin.email }}<br>
            密碼：{{ signin.password }}<br> -->
            <!-- token: {{ signinRes }}<br> -->
            <!-- username: {{ user.nickname }}<br>
            uid: {{ user.uid }} -->
          <!-- </p> -->
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert {
  max-width: 400px;
  margin: 0 auto 20px;
}
.formControls {
  max-width: 500px; /* 限制表單容器寬度 */
  margin: 0 auto;   /* 將表單置中 */
  padding: 20px;    /* 增加內邊距以避免 Alert 壓縮內容 */
}

@media (min-width: 1200px) {
    .container, .container-lg, .container-md, .container-sm, .container-xl {
        max-width: 860px;
    }
}
</style>