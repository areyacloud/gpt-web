<style>
.text {
  text-align: center;
  font-size: 14px;
}

.box-card {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bolder;
  max-width: 50rem;
  margin: auto;
  color: #f4f4f5;
  background-color: #30b987a1;
  text-align: center;
}

.send-btn {
  color: #ffffff;
  margin: auto;
  width: 100%;
}
.send-btn:hover {
  color: #c4c4c4;
  margin: auto;
  width: 100%;
}
.chat-card {
  width: auto;
  max-width: 50rem;
  margin: auto;
  height: 100%;
  overflow-y: auto;
  background-color: #f4f4f5;
}

.msg-form {
  width: auto;
  max-width: 50rem;
  margin: auto;
}

.chat-input {
  margin: auto;
  width: 100%;
}

html,
body,
#app,
.common-layout,
.el-container {
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: #ffffff;
}

.el-main {
  overflow-x: hidden;
  overflow-y: hidden;
}

/* .msg-row {
   margin: auto; 
} */

.msg {
  margin: 5px;
  border-radius: 3px;
  width: fit-content;
  line-height: normal;
  background-color: #30b987a1;
  font-size: small;
}

.msg-ai {
  margin: 5px;
  border-radius: 3px;
  width: fit-content;
  background-color: #ffffff;
  font-size: small;
}
</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-header>
          <el-card class="box-card">V0.0.1 AI/GPT-3/text-davinci-003</el-card>
        </el-header>

        <el-main>
          <el-card class="chat-card">
            <el-list>
              <el-list-item v-for="message in messages" :key="message.id">
                <el-row v-if="message.isMine" class="msg-row">
                  <el-col :span="1"> </el-col>
                  <el-col
                    :span="22"
                    style="display: flex; justify-content: flex-end"
                  >
                    <v-md-preview
                      class="msg"
                      height="10px"
                      :text="message.text"
                    ></v-md-preview>
                  </el-col>
                  <el-col
                    :span="1"
                    style="display: flex; justify-content: flex-end"
                  >
                    <el-avatar
                      shape="square"
                      size="small"
                      :src="userAvatarUrl"
                      @error="errorHandler"
                    />
                  </el-col>
                </el-row>
                <el-row v-else class="msg-row">
                  <el-col
                    :span="1"
                    style="display: flex; justify-content: flex-start"
                  >
                    <el-avatar
                      shape="square"
                      size="small"
                      :src="aiAvatarUrl"
                      @error="errorHandler"
                    />
                  </el-col>
                  <el-col
                    :span="22"
                    style="display: flex; justify-content: flex-start"
                  >
                    <v-md-preview
                      class="msg-ai"
                      :text="message.text"
                    ></v-md-preview>
                  </el-col>
                  <el-col :span="1"> </el-col>
                </el-row>
              </el-list-item>
            </el-list>
          </el-card>
        </el-main>

        <el-footer>
          <el-form :model="form" class="msg-form" @submit.native.prevent>
            <el-row :gutter="5">
              <el-col :span="20">
                <el-form-item>
                  <el-input
                    class="chat-input"
                    v-model="form.message"
                    rows="2"
                    maxlength="100"
                    show-word-limit
                    :disabled="disableForm"
                    @keyup.enter.native="checkTextLen()"
                    :placeholder="placeHolder"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <!-- <el-popover :visible="popoverVisible" placement="bottom" title="Title" :width="200"
content="this is content, this is content, this is content">
                <template #reference> -->
                  <el-button
                    class="send-btn"
                    @click="checkTextLen()"
                    icon="Position"
                    :disabled="disableForm"
                    :loading="disableForm"
                    color="#30b987a1"
                    type="primary"
                    >{{ sendBtnText }}</el-button
                  >
                  <!-- </template>
                </el-popover> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-footer>
      </el-container>
    </el-container>
    <el-message></el-message>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      messages: [
        {
          id: this.nextId,
          isMine: false,
          text: "我是openai大型自然语言ai模型gpt-3/text-davinci-003，可以回答您的任何问题，请您吩咐。",
        },
      ],
      resMessages: [],
      disableForm: false,
      popoverVisible: true,
      sendBtnText: "发 送",
      placeHolder: "    给AI下达指令，描述越详细回复质量越高噢~",
      form: {
        message: "",
      },
      prompt: "",
      nextId: 1,
      auth: import.meta.env.VITE_APP_OPENAI_AUTHORIZATION,
      userAvatarUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      aiAvatarUrl:
        "https://img1.baidu.com/it/u=2333513229,2298335749&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    };
  },
  methods: {
    generatePrompt() {
      this.prompt = `I am a highly intelligent question answering bot.If you ask me a question that is rooted in truth, I will give you the answer.If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown."\nQ: What is human life expectancy in the United States.\nA: Human life expectancy in the United States is 78 years."`;
      this.prompt += "\nQ:你是谁";
      this.prompt += "\nA:";
      this.prompt += this.messages[0].text;
      if (this.messages.length > 20) {
        for (
          let index = this.messages.length - 20;
          index < this.messages.length;
          index++
        ) {
          if (this.messages[index].isMine) {
            this.prompt += "\nQ:";
            this.prompt += this.messages[index].text;
          } else {
            this.prompt += "\nA:";
            this.prompt += this.messages[index].text;
          }
        }
      } else {
        for (let index = 0; index < this.messages.length; index++) {
          if (index === 0) {
            continue;
          }
          if (this.messages[index].isMine) {
            this.prompt += "\nQ:";
            this.prompt += this.messages[index].text;
          } else {
            this.prompt += "\nA:";
            this.prompt += this.messages[index].text;
          }
        }
      }

      console.log(this.prompt);
    },
    checkTextLen() {
      if (this.form.message.trim().length === 0) {
        this.popoverVisible = true;
        ElMessage({
          showClose: true,
          message: "还没有输入任何消息噢",
          center: true,
          type: "warning",
          grouping: true,
          offset: 300,
        });
        return;
      } else {
        this.sendMessage();
      }
    },
    disableFormComp() {
      this.disableForm = true;
      this.sendBtnText = "请稍等...";
      this.placeHolder = "AI正在努力思考中...";
    },
    enableFormComp() {
      this.disableForm = false;
      this.sendBtnText = "发送";
      this.placeHolder = "给AI下达指令 描述越详细回复质量越高噢~";
    },
    sendMessage() {
      this.messages.push({
        id: this.nextId++,
        isMine: true,
        text: this.form.message,
      });
      this.generatePrompt();
      this.disableFormComp();
      var RES, ERR;
      fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: " Bearer " + this.auth,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: this.prompt,
          temperature: 0.3,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: [" Human:", " AI:"],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          RES = data.choices[0].text;
          console.log(RES);
          this.messages.push({
            id: this.nextId++,
            isMine: false,
            text: RES,
          });
        })
        .catch((error) => {
          this.messages.push({
            id: this.nextId++,
            isMine: false,
            text: "出错啦 重试一下吧",
          });
          console.error(ERR);
        })
        .finally(() => {
          this.enableFormComp();
        });
      this.form.message = "";
    },
  },
  watch: {
    messages: {
      handler(val) {
        this.$nextTick(() => {
          setTimeout(() => {
            let x = document.getElementsByClassName("chat-card")[0];
            x.scrollTop = x.scrollHeight;
          }, 0);
        });
      },
      deep: true,
    },
  },
};
</script>
