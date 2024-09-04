<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const api = 'https://todolist-api.hexschool.io';
const user = ref({
  nickname: '',
  uid: '',
});

const getToken = () => {
  // 確認從 Cookie 中正確取得 token
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)todolist\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  return token;
};
// onMounted 中執行 token 取得
onMounted(async () => {
  const token = getToken();
  if (!token) {
    console.error("Token not found in Cookie.");
    return;
  }

  try {
    const res = await axios.get(`${api}/users/checkout`, {
      headers: { Authorization: token },
    });
    user.value = res.data;
    console.log("User data:", res.data);
    await getTodos(); // 在這裡同時呼叫 getTodos
  } catch (error) {
    console.error('Checkout error:', error.response?.data?.message || error.message);
  }
});


const todos = ref([]); // 待辦事項

//取得待辦事項
const getTodos = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${api}/todos`, {
      headers: {
        Authorization: token,
      },
    });
    todos.value = response.data.data; // 將返回的待辦事項列表存入 todos 中
    console.log("已獲取待辦事項清單:", todos.value);
  } catch (error) {
    console.error("無法獲取待辦事項列表:", error.response?.data?.message || error.message);
  }
};


//新增代辦事項

const tempTodos = ref();
const addTodos = async () => {
  const token = getToken(); // 確保在這裡取得 token
  if (!token) {
    console.error("Token not found.");
    return;
  }
  
  try{
    const response = await axios.post(`${api}/todos`,
    { content: tempTodos.value }, // 傳送新增的代辦事項內容
    {
      headers: {
        Authorization: token,
      },
    });
    console.log("已新增待辦事項", response.data);
    tempTodos.value = ""; // 清空輸入框
    await getTodos(); // 新增後重新取得代辦事項列表
  }catch(error){
    console.error("新增失敗",error.response?.data?.message || error.message);
  
  }
};

//刪除代辦事項
const deleteTodos = async (id) => {
  const token = getToken(); // 確保在這裡取得 token
  if (!token) {
    console.error("Token not found.");
    return;
  }
  
  try{
    const response = await axios.delete(`${api}/todos/${id}`,{
      headers: {
        Authorization: token,
      },
    });
    console.log("已刪除待辦事項", response.data);
    await getTodos(); // 新增後重新取得代辦事項列表
  }catch(error){
    console.error("刪除失敗",error.response?.data?.message || error.message);
  
  }
};
//切換不同狀態的代辦事項
const toggleStatus = async (id) => {
  const todoToToggle = todos.value.find((todo) => todo.id === id);
  console.log("待切換的代辦事項:", todoToToggle); // 查看完整物件
  try {
    await axios.patch(`https://todolist-api.hexschool.io/todos/${id}/toggle`, {}, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(`待辦事項：「${todoToToggle.content}」已切換狀態`);
    getTodos();
  } catch (error) {
    console.error(`切換狀態失敗：「${todoToToggle.content}」，ID 為：${todoToToggle.id}，錯誤訊息：${error.message}`);
  }
};
// 根據選取的 tab 過濾待辦事項列表
const filteredTodos = computed(() => {
  if (activeTab.value === "all") {
    return todos.value; // 返回全部待辦事項
  } else if (activeTab.value === "process") {
    return todos.value.filter((todo) => !todo.status); // 返回未完成的待辦事項
  } else if (activeTab.value === "completed") {
    return todos.value.filter((todo) => todo.status); // 返回已完成的待辦事項
  }
});

const activeTab = ref('all'); // 用於追踪選中的按鈕
const setActiveTab = (tabName) => {
  activeTab.value = tabName; // 設定選中的按鈕
};


//計算已完成的項目

const completedTodosCount = computed(() => {
  return todos.value.filter((todo) => todo.status).length; // 計算 status 為 true 的項目數量
});


//登出配置
const removeToken = () => {
  document.cookie = 'todolist=; Max-Age=0';
};


const handleLogout = () => {
  removeToken();
  navigateToPage();
};

//跳轉首頁
const navigateToPage = () => {
  router.push('/');
};



</script>

<template>
<!-- ToDo List -->
<div id="todoListPage" class="bg-half">
  <nav>
    <h1><img src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt="logo"></h1>
    <ul>
      <li class="todo_sm">
        <p><span v-if="user.nickname">{{ user.nickname }} 的代辦</span></p>
      </li>
      <li>
        <a 
          href="#loginPage"
          @click.prevent="handleLogout"
        >登出</a>
      </li>
    </ul>
  </nav>
  <div class="conatiner todoListPage vhContainer">
    <div class="todoList_Content">
      <div class="inputBox">
        <input
         type="text"
         placeholder="請輸入待辦事項"
         v-model="tempTodos"
        >
        <button
         class="addItem"
         @click="addTodos"
         >
          <i class="fa fa-plus"></i>
        </button>
      </div>
      <!-- {{ tempTodos }} -->
      <div class="todoList_list">
        <ul class="todoList_tab">
          <li>
            <button 
              :class="{ active: activeTab === 'all' }" 
              @click.prevent="setActiveTab('all')"
            >
              全部
            </button>
          </li>
          <li>
            <button 
              :class="{ active: activeTab === 'process' }" 
              @click.prevent="setActiveTab('process')"
            >
              待完成
            </button>
          </li>
          <li>
            <button 
              :class="{ active: activeTab === 'completed' }" 
              @click.prevent="setActiveTab('completed')"
            >
              已完成
            </button>
          </li>
        </ul>
        <div class="todoList_items">
          <ul class="todoList_item">
              <li v-for="(todo, index) in filteredTodos" :key="index">
                <label class="todoList_label">
                  <input class="todoList_input" 
                  type="checkbox" 
                  :checked="todo.status"
                  @change="toggleStatus(todo.id)"
                  />
                  <span>{{ todo.content }}</span>
                </label>
                <button
                  class="square20"
                  @click.prevent="deleteTodos(todo.id)"
                >
                  <i 
                  class="fa fa-times"
                  ></i>
                </button>
              </li>
            </ul>
          <div class="todoList_statistics">
            <p>{{ completedTodosCount }} 個已完成項目</p> <!-- 顯示已完成的項目數 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
button{
  width: 100%;
  border: 0;
  background-color: #fff;
  font-size: 16px;
}
.todoList_list{
  padding-top: 12px;
  padding-bottom: 12px;
}
.todoList_tab{
  justify-content: space-between;
}
.active{
  font-weight: 800;
  border-bottom: 1px solid;
}
ul{
  padding-left: 0px;
}

nav img {
  width: 15rem;
  margin-left: 2rem;
}

span{
  font-weight: 800;
}
.addItem{
  display: block;
  width: 40px;
  height: 39px;
  position: absolute;
  background: #333333;
  color: white;
  font-size: 20px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  top: 4px;
  right: 4px;
  padding: 10px;
}
.square20{
  width: 20px;
  height: 20px;
}
</style>
