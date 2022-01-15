import $ from "jquery";
let x = "20px";
let y = "110px";
let isMove = false;
// websocket 链接
var Chat = (function () {
  let username;
  let systemName;
  let ws_url;
  let web_url;
  let token_url;
  let ws;
  let token;

  function Chat(options) {
    options.username = options.username.replace(/&#95;/, "_");
    options.username = options.username.replace(/&#46;/, ".");

    x = options.x || "20px";
    y = options.y || "110px";
    username = options.username;
    // systemName = options.systemName;
    // ws_url = `${options.ws_url}/accesscontrol?name=${username}&systemName=${systemName}`;
    // web_url = options.http_url;
    token_url = `${web_url}/oauth/token`;
    ws = new WebSocket(ws_url);
    token = "";

    ws.onopen = function () {
      setInterval(function () {
        ping();
      }, 5000);
    };

    ws.onclose = function (event) {
      var code = event.code;
      var reason = event.reason;
      var wasClean = event.wasClean;
      // handle close event
      // console.log('web socket on close!')
    };

    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);

      // 处理数据 websocket自己的消息不返回
      if (data.sendFrom == username) {
        return;
      }

      // 处理数据
      let posi =
        data.sendFrom == username
          ? "public-chat-chat-right"
          : "public-chat-chat-left";
      let msg = `<div class="public-chat-clearfloat">
                                <div class="public-chat-author-name">
                                    <small class="public-chat-chat-date"></small>
                                </div>
                                <div class=${posi}>
                                    <div class="public-chat-chat-message">
                                        ${data.sendMessage}
                                    </div>
                                </div>
                            </div>`;
      //flag true-当前在聊天界面 false-当前不在聊天界面
      var ChatInfoName = "";
      if ($(".public-chat-ChatInfoName").children("b").length > 0) {
        ChatInfoName = $(".public-chat-ChatInfoName").children("b")[0]
          .innerHTML;
      }

      var flag =
        $(".public-chat-chatBox-kuang:visible").length > 0 &&
        $(".public-chat-chatBox-head-two:visible").length > 0 &&
        data.sendFrom == ChatInfoName;
      if (flag) {
        $("#public-chat-chatBox-content-demo").append(msg);
        // readMessage(ChatInfoName);  //把当前聊天界面的用户消息标为已读
      } else {
        unreadList(username);
      }
      chatToBottom();
    };

    ws.onerror = function (event) {
      // handle error event
      // console.log('web socket on error!')
    };

    /**
     * 发送心跳请求
     */
    function ping() {
      sendMsg(1, "");
    }

    /**
     * 发送ws消息
     * @param {*} type 类型码
     * @param {*} body 消息体
     */
    function sendMsg(type, body) {
      let msg = {
        type: type,
        body: body,
      };
      ws.send(JSON.stringify(msg));
    }

    /**
     * 打开聊天界面
     * @param {*} info
     */
    function openChat(send_to) {
      getUserName(send_to);
    }

    /**
     * 通过域账号获得用户姓名
     * @param { 域账号 } send_to
     */
    function getUserName(send_to) {
      let settings = {
        url: `${web_url}/chat/username/${send_to}`,
        method: "GET",
        timeout: 0,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      $.ajax(settings).done((response) => {
        if (response.code === 0) {
          $(".public-chat-chatBox").show();
          $(".public-chat-chatBox-head-one").hide();
          $(".public-chat-chatBox-head-two").show();
          $(".public-chat-chatBox-list").hide();
          $(".public-chat-chatBox-kuang").show();

          //传名字
          $(".public-chat-ChatInfoName").text(`${response.data}(${send_to})`);
          $(".public-chat-ChatInfoName").append(
            `<b style="display:none;">${send_to}</b>`
          );
          $("#public-chat-chatBox-content-demo").empty();
          chatHistory(send_to, 1, 20);

          readMessage(send_to);
          //聊天框默认最底部
          chatToBottom();
        } else if (response.code === 2001) {
          let httpRequest = new XMLHttpRequest();
          httpRequest.open("POST", token_url, true);
          httpRequest.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          httpRequest.send(
            "grant_type=client_credentials&client_id=access_control&client_secret=666666"
          );
          httpRequest.onreadystatechange = function () {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              //验证请求是否发送成功
              let result = httpRequest.responseText; //获取到服务端返回的数据
              var json = JSON.parse(result);
              token = json["access_token"];
              unreadList(send_to);
            }
          };
        } else if (response.code == 1004) {
          ShowTip(response.message, "info");
        }
      });
    }

    /**
     * 网上找的提示
     * @param { 提示语 } tip
     * @param { 'info' } type
     */
    function ShowTip(tip, type) {
      var $tip = $("#tip");
      if ($tip.length == 0) {
        $tip = $(
          '<span id="tip" style="transform:translate(-50%,-50%);position:fixed;top:50%;left: 50%;z-index:9999;height:28px; padding: 2px 16px;line-height: 28px;color:#fff;background:rgba(0,0,0,0.7);font-size:12px;border-radius:4px;"></span>'
        );
        $("body").append($tip);
      }
      $tip
        .stop(true)
        .prop("class", "alert alert-" + type)
        .text(tip)
        .fadeIn(500)
        .delay(1000)
        .fadeOut(500);
    }

    /**
     *
     * @param {排序的字段 } property
     * @param {循序 升序} bol
     */
    function dateData(property, bol) {
      //property是你需要排序传入的key,bol为true时是升序，false为降序
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (bol) {
          // 升序
          return Date.parse(value1) - Date.parse(value2);
        } else {
          // 降序
          return Date.parse(value2) - Date.parse(value1);
        }
      };
    }

    /**
     * 获取未读消息列表
     * @param { 消息接收人 } send_to
     */
    function unreadList(send_to) {
      let settings = {
        url: `${web_url}/chat/count/unread`,
        method: "POST",
        timeout: 0,

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          to: send_to,
          // systemName:systemName
        }),
      };

      $.ajax(settings).done((response) => {
        if (response.code === 0) {
          let data = response.data;
          // data = [
          //     {sendFrom: "zhangzx3", unReadCount: "0", name: "张仲夏",sendTime:'2021-12-24 17:56:35'},
          //     {sendFrom: "ex_jianxinwang", unReadCount: "0", name: "简新旺1",sendTime:'2021-12-24 17:57:35'},
          //     {sendFrom: "ex_limingxing1", unReadCount: "0", name: "神仙水1",sendTime:'2021-12-24 17:58:35'},
          //     {sendFrom: "autotest", unReadCount: "11", name: "神仙水1",sendTime:'2021-12-24 17:59:35'},
          //     {sendFrom: "admin", unReadCount: "17",sendTime:'2021-12-24 18:56:35'},
          //     {sendFrom: "ex_tanliping2", unReadCount: "1",sendTime:'2021-12-24 7:56:35'},
          //     {sendFrom: "ex_tanliping", unReadCount: "1", name: "谭李平(EX)",sendTime:'2021-12-25 17:56:35'},
          //     {sendFrom: "lingling.sheng", unReadCount: "0", name: "盛玲玲",sendTime:'2021-12-24 17:40:35'},
          //     {sendFrom: "aaatest", unReadCount: "1",sendTime:'2021-12-24 17:53:35'},
          // ]

          data.sort(dateData("sendTime"));

          // 消息为0 的数据
          let msgQuantityZero = data.filter((item) => {
            return item.unReadCount == 0;
          });

          // 消息为>0 的数据
          let msgQuantity = data.filter((item) => {
            return !msgQuantityZero.some(
              (ele) => ele.sendFrom === item.sendFrom
            );
          });

          // 合并2个数据 ， 主要是为了排序 和 没有消息的放再最下面
          let arr = msgQuantity.concat(msgQuantityZero);

          let unRead = 0;
          $("#public-chat-chat-list").html("");
          // <div class="public-chat-message-num">${item.unReadCount}</div>
          arr.forEach((item) => {
            let template = `<div class="public-chat-chat-list-people"  >`;

            if (item.unReadCount > 0) {
              template += `<div class="public-chat-message-num">${item.unReadCount}</div>`;
            }

            template += `<div class="public-chat-chat-name">
                                                <p>
                                                    <span>${
                                                      item.name || ""
                                                    }</span>
                                                    <span>${
                                                      item.name ? "(" : ""
                                                    }</span>${
              item.sendFrom
            }<span>${item.name ? ")" : ""}</span>
                                                    
                                                </p>
                                                <b  style="display:none;">${
                                                  item.sendFrom
                                                }</b>
                                            </div>
                                            <div class="public-chat-prople-icon">
                                                <img 
                                                    src="https://apps.axatp.com/fileServer/download.do?fileId=20211164419966876654216" 
                                                    alt="" srcset=""
                                                />
                                            </div>
                                        </div>`;

            $("#public-chat-chat-list").append(template);

            unRead += parseInt(item.unReadCount);
          });

          $("#public-chat-unread-message-count").text(unRead);
          setLIposition();
        } else if (response.code === 2001) {
          let httpRequest = new XMLHttpRequest();
          httpRequest.open("POST", token_url, true);
          httpRequest.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          httpRequest.send(
            "grant_type=client_credentials&client_id=access_control&client_secret=666666"
          );
          httpRequest.onreadystatechange = function () {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              //验证请求是否发送成功
              let result = httpRequest.responseText; //获取到服务端返回的数据
              var json = JSON.parse(result);
              token = json["access_token"];
              unreadList(send_to);
            }
          };
        }
      });
    }
    $("body").on("click", ".public-chat-chat-name", openChat2Person);
    /**
     * 打开聊天界面
     */
    function openChat2Person() {
      console.log("openChat");
      let str = $(this).children("b")[0].innerHTML;

      openChat(str);
    }

    /**
     * 设置列表的位置
     *
     * */
    function setLIposition() {
      // 元素
      var uls = document.querySelector("#public-chat-chat-list");

      var lis = uls.querySelectorAll(".public-chat-chat-list-people");
      // 批量添加监听
      for (var i = 0; i < lis.length; i++) {
        // 设置高度
        lis[i].style.top = i * 56 + "px";
        lis[i].index = i;
        // $('.public-chat-prople-icon')[i].onmousedown = function(event){
        //     event = event || window.event;
        //     // 鼠标到每个l元素内层最顶端和最左端的位置
        //     var lisx = event.clientX - $(this).parent()[0].offsetLeft;
        //     var lisy = event.clientY - $(this).parent()[0].offsetTop;
        //     var self = $(this).parent()[0];
        //     // 防止事件重复触发
        //     var lock = true;
        //     // 鼠标移动
        //     document.onmousemove = function(event){
        //         self.style.transition = "";
        //         event = event || window.event;
        //         lisL = event.clientX - lisx;
        //         lisT = event.clientY - lisy;
        //         // 拖拽的时候让拖拽的图片置于其他图片上面更改图片的显示权重
        //         self.className = "public-chat-active public-chat-chat-list-people";
        //         //改变移动盒子的定位，做到鼠标跟随
        //         // self.style.left = lisL + "px";
        //         self.style.top = lisT + "px";
        //         // 批量遍历每个盒子是否满足交换条件
        //         for(var j = 0;j < lis.length;j++){
        //             // 交换盒子的条件
        //             if(lis[j].offsetTop + lis[j].offsetHeight > self.offsetTop && lis[j].offsetTop < self.offsetTop){
        //                 if(lock){
        //                     // 事件触发就自锁不在改变
        //                     lock = false;
        //                     // 交换两个盒子备份的index
        //                     var temp = lis[j].index;
        //                     lis[j].index = self.index;
        //                     self.index = temp;
        //                     // 交换完成去改变盒子的top值
        //                     lis[j].style.top = lis[j].index * 56 + "px";
        //                     // 同时添加过渡属性
        //                     lis[j].style.transition = "all 0.3s ease 0s";
        //                     // 当动画运动完成，使用定时器来打开锁。
        //                     setTimeout(()=>lock = true,300);
        //                     break;
        //                 }
        //             }
        //         }
        //         event.stopPropagation();
        //     }
        //     event.stopPropagation();
        //     // 鼠标抬起事件
        //     document.onmouseup = function(event){
        //         document.onmousemove = null;
        //         self.className = "public-chat-chat-list-people";
        //         self.style.left = 0;
        //         self.style.top = self.index * 56 + "px";
        //     }
        //     // 阻止浏览器的默认事件
        //     return false;
        // }
      }
    }

    /**
     * 获取历史聊天记录
     * @param {*} send_to
     * @param {*} pageNum
     * @param {*} pageSize
     */
    function chatHistory(send_to, pageNum, pageSize) {
      let settings = {
        url: `${web_url}/chat/history`,
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          pageNum: pageNum,
          pageSize: pageSize,
          from: username,
          to: send_to,
          // "systemName":systemName
        }),
      };

      $.ajax(settings).done(function (response) {
        if (response.code === 0) {
          handlerMsg(response.data);
        } else if (response.code === 2001) {
          let httpRequest = new XMLHttpRequest();
          httpRequest.open("POST", token_url, true);
          httpRequest.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          httpRequest.send(
            "grant_type=client_credentials&client_id=access_control&client_secret=666666"
          );
          httpRequest.onreadystatechange = function () {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              //验证请求是否发送成功
              var result = httpRequest.responseText; //获取到服务端返回的数据
              var json = JSON.parse(result);
              token = json["access_token"];
              chatHistory(send_to, pageNum, pageSize);
            }
          };
        }
      });
    }

    /**
     * 对聊天记录进行处理
     * @param {*} chat_msg
     */
    function handlerMsg(chat_msg) {
      let records = chat_msg.records;
      records.forEach((element) => {
        handlerAMsg(element);
      });

      chatToBottom();
    }

    /**
     * 处理单条消息
     * @param {*} message
     */
    function handlerAMsg(message) {
      let posi =
        message.sendFrom == username
          ? "public-chat-chat-right"
          : "public-chat-chat-left";
      let msg = `<div class="public-chat-clearfloat">
                                <div class="public-chat-author-name">
                                    <small class="public-chat-chat-date"></small>
                                </div>
                                <div class="${posi}">
                                    <div class="public-chat-chat-message">
                                        ${message.sendMessage}
                                    </div>
                                </div>
                            </div>`;
      $("#public-chat-chatBox-content-demo").prepend(msg);
    }

    /**
     * 聊天框默认最底部
     */
    function chatToBottom() {
      $(document).ready(function () {
        $("#public-chat-chatBox-content-demo").scrollTop(
          $("#public-chat-chatBox-content-demo")[0].scrollHeight
        );
      });
      $("#public-chat-chatBox-content-demo").scrollTop(
        $("#public-chat-chatBox-content-demo")[0].scrollHeight
      );
    }

    // 发送数据
    $("body").on("click", "#public-chat-chat-fasong", sendMessage);
    function sendMessage() {
      var textContent = $(".textinput").val().replace(/\n/g, "<br/>");
      if (textContent != "") {
        sendMsg(3, {
          sendTo: $(".public-chat-ChatInfoName").children("b")[0].innerHTML,
          sendFrom: username,
          sendMessage: textContent,
          systemName: systemName,
        });

        let msg = `<div class="public-chat-clearfloat">
                                <div class="public-chat-author-name">
                                    <small class="public-chat-chat-date"></small>
                                </div>
                                <div class="public-chat-chat-right">
                                    <div class="public-chat-chat-message">
                                        ${textContent}
                                    </div>
                                </div>
                            </div>`;
        $(".public-chat-chatBox-content-demo").append(msg);
        //发送后清空输入框
        // $(".public-chat-div-textarea").html("");
        $(".textinput").val("");
        chatToBottom();
      }
    }

    /**
     * 获取路径参数
     * @param {*} name
     * @returns
     */
    function getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    }

    /**
     * 进入对话框则消息已读
     * @param {*} send_from
     */
    function readMessage(send_from) {
      let settings = {
        url: `${web_url}/chat/read/message`,
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          from: send_from,
          to: username,
          // "systemName":systemName
        }),
      };

      $.ajax(settings).done(function (response) {
        if (response.code === 0) {
          unreadList(username);
        } else if (response.code === 2001) {
          let httpRequest = new XMLHttpRequest();
          httpRequest.open("POST", token_url, true);
          httpRequest.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          httpRequest.send(
            "grant_type=client_credentials&client_id=access_control&client_secret=666666"
          );
          httpRequest.onreadystatechange = function () {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              //验证请求是否发送成功
              var result = httpRequest.responseText; //获取到服务端返回的数据
              var json = JSON.parse(result);
              token = json["access_token"];
              readMessage(send_from);
            }
          };
        }
      });
    }

    setTimeout(() => {
      // 给输入框 添加键盘事件
      $(".textinput").bind("keydown", function (e) {
        // 兼容FF和IE和Opera
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;

        if (e.shiftKey && code == 13) {
          // console.log("$('.textinput').val()",$('.textinput').val())
          // $('.textinput').val($('.textinput').val()+' \n ')
        } else if (code == 13) {
          e.preventDefault();
          sendMessage();
        }
      });
    }, 1000);

    // document.onkeydown = function (e) { // 回车提交表单
    //     // 兼容FF和IE和Opera
    //     var theEvent = window.event || e;
    //     var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    //     if (code == 13) {
    //         code.preventDefault()
    //         var textContent = $(".public-chat-div-textarea").html().replace(/[\n\r]/g, '<br>')
    //         console.log('发送的内容',textContent)
    //         sendMessage();
    //     }
    //     // keyup_submit()
    // }
    // function keyup_submit(e) {
    //     var evt = window.event || e;
    //     if (evt.shiftKey && evt.keyCode == 13) {
    //        console.log('回车了')
    //     }
    // }

    /**
     *
     * 页面 样式 事件部分
     *
     */
    // console.log('页面 样式 事件部分')

    // window.onload = function(){
    // console.log('window.onloadwindow.onload')
    /**
     *
     * HTML 和 绑定的事件代码
     *
     */
    var htmlstr = `
            <div class="public-chat-chatContainer" id="public-chat-chatContainer">
                <div class="public-chat-chatBtn" id="public-chat-chatBtn">
                   <img src="https://sits.axatp.com/fileServer/download.do?fileId=2021111142425533423633" />
                </div>
                <div id="public-chat-unread-message-count" class="public-chat-chat-message-num">0</div>
                <div class="public-chat-chatBox" id="public-chat-chatBox" ref="public-chat-chatBox">
                    <div class="public-chat-chatBox-head" id="public-chat-chatBox-head">
                        <div class="public-chat-chatBox-head-one">
                            Conversations
                            <div class="public-chat-chat-close" style="font-size: 14px">关闭</div>
                        </div>
                        <div class="public-chat-chatBox-head-two">
                            <div class="public-chat-chat-return">返回</div>
                            <div class="public-chat-chat-people">
                                <div class="public-chat-ChatInfoName">这是用户的名字，看看名字到底能有多长</div>
                            </div>
                            <div class="public-chat-chat-close">关闭</div>
                        </div>
                    </div>

                    <div class="public-chat-chatBox-info">
                        <!-- 消息记录列表 -->
                        <div id="public-chat-chat-list" class="public-chat-chatBox-list" ref="public-chat-chatBoxlist">

                        </div>

                        <!-- 消息展示列表 -->
                        <div class="public-chat-chatBox-kuang" ref="public-chat-chatBoxkuang">
                            <div class="public-chat-chatBox-content">
                                <div class="public-chat-chatBox-content-demo" id="public-chat-chatBox-content-demo">

                                </div>
                            </div>

                            <div class="public-chat-chatBox-send">
                                <!-- <div class="public-chat-div-textarea" contenteditable="true" ></div>  -->
                                <div class="public-chat-div-textarea">
                                    <textarea class="textinput" style="height:100px;" type="text"></textarea>
                                </div>
                                
                                <div class="public-chat-btnbox">
                                    <div class="public-chat-img">
                                        <!-- 暂时不需要图片上传 还没有接口
                                        <img src="https://apps.axatp.com/fileServer/download.do?fileId=20211264623875406202739" alt="" >
                                        -->
                                    </div>
                                    <div id="public-chat-chat-fasong"  class="public-chat-btn-default-styles">发送</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            `;
    // 插入htnl
    $("body").append(htmlstr);
    // console.log('插入html')
    // 设置样式
    screenFuc();

    // 窗口大小改变的时候
    (window.onresize = function () {
      screenFuc();
    })();

    function screenFuc() {
      var topHeight = $(".public-chat-chatBox-head").innerHeight(); //聊天头部高度
      //屏幕小于768px时候,布局change
      var winWidth = $(window).innerWidth();
      if (winWidth <= 768) {
        var totalHeight = $(window).height(); //页面整体高度
        $(".public-chat-chatBox-info").css("height", totalHeight - topHeight);
        var infoHeight = $(".public-chat-chatBox-info").innerHeight(); //聊天头部以下高度
        //中间内容高度
        $(".public-chat-chatBox-content").css("height", infoHeight - 46);
        $(".public-chat-chatBox-content-demo").css("height", infoHeight - 46);

        $(".public-chat-chatBox-list").css("height", totalHeight - topHeight);
        $(".public-chat-chatBox-kuang").css("height", totalHeight - topHeight);
        $(".public-chat-div-textarea").css("width", winWidth - 106);
      } else {
        $(".public-chat-chatBox-info").css("height", 525);
        $(".public-chat-chatBox-content").css("height", 448);
        $(".public-chat-chatBox-content-demo").css("height", 360);
        $(".public-chat-chatBox-list").css("height", 495);
        $(".public-chat-chatBox-kuang").css("height", 495);
        // $(".public-chat-div-textarea").css("width", 320);
      }
    }

    //打开/关闭聊天框
    $(".public-chat-chatBtn").click(function () {
      // 有没有 默认值
      if (JSON.parse(localStorage.getItem("public-chart-chartlist"))) {
        $("#public-chat-chatBox").css({
          left: `${
            JSON.parse(localStorage.getItem("public-chart-chartlist")).x
          }px`,
          top: `${
            JSON.parse(localStorage.getItem("public-chart-chartlist")).y
          }px`,
        });
      }

      if (!isMove) {
        if ($(".public-chat-chatBox:visible").length) {
          $(".public-chat-chatBox").hide();
          $(document.html).css({
            "overflow-x": "auto",
            "overflow-y": "auto",
          });
        } else {
          $(document.html).css({
            "overflow-x": "hidden",
            "overflow-y": "hidden",
          });
          $(".public-chat-chatBox").show();
          $(".public-chat-chatBox-head-one").show();
          $(".public-chat-chatBox-head-two").hide();
          $(".public-chat-chatBox-list").show();
          $(".public-chat-chatBox-kuang").hide();
        }
      }
    });

    $(".public-chat-chat-close").click(function () {
      $(".public-chat-chatBox").toggle(10);
      $(document.html).css({
        "overflow-x": "auto",
        "overflow-y": "auto",
      });
    });

    //返回列表
    $(".public-chat-chat-return").click(function () {
      $(".public-chat-chatBox-head-one").toggle(1);
      $(".public-chat-chatBox-head-two").toggle(1);
      $(".public-chat-chatBox-list").fadeToggle(1);
      $(".public-chat-chatBox-kuang").fadeToggle(1);
    });

    //      发送表情
    $("#public-chat-chat-biaoqing").click(function () {
      $(".public-chat-biaoqing-photo").toggle();
    });
    $(document).click(function () {
      $(".public-chat-biaoqing-photo").css("display", "none");
    });
    $("#public-chat-chat-biaoqing").click(function (event) {
      event.stopPropagation(); //阻止事件
    });

    //      发送图片
    // function selectImg(pic) {
    //     if (!pic.files || !pic.files[0]) {
    //         return;
    //     }
    //     var reader = new FileReader();
    //     reader.onload = function (evt) {
    //         var images = evt.target.result;
    //         $(".chatBox-content-demo").append("<div class=\"clearfloat\">" +
    //             "<div class=\"author-name\"><small class=\"chat-date\">2017-12-02 14:26:58</small> </div> " +
    //             "<div class=\"right\"> <div class=\"chat-message\"><img src=" + images + "></div> " +
    //             "<div class=\"chat-avatars\"><img src=\"img/icon01.png\" alt=\"头像\" /></div> </div> </div>");
    //         //聊天框默认最底部
    //         $(document).ready(function () {
    //             $("#chatBox-content-demo").scrollTop($("#chatBox-content-demo")[0].scrollHeight);
    //         });
    //     };
    //     reader.readAsDataURL(pic.files[0]);

    // }

    /**
     *
     * CSS 代码
     * CSS 代码
     * CSS 代码
     *
     */
    var nod = document.createElement("style"),
      str = `
            
            .public-chat-chatContainer,
            .public-chat-chatContainer div,
            .public-chat-chatContainer ul,
            .public-chat-chatContainer li,
            .public-chat-chatContainer p {
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
            
            
            /* 设置滚动条的样式 */
            
            .public-chat-chatContainer ::-webkit-scrollbar {
                width: 2px;
            }
            
            
            /* 滚动槽 */
            
            .public-chat-chatContainer ::-webkit-scrollbar-track {
                border-radius: 10px;
            }
            
            
            /* 滚动条滑块 */
            
            .public-chat-chatContainer ::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: #8C85E6;
            }
            
            .public-chat-chatContainer ::-webkit-scrollbar-thumb:window-inactive {
                background: rgba(175, 190, 255, 0.4);
            }
            
            
            /*按钮样式*/
            
            .public-chat-btn-default-styles {
                height: 30px;
                width: 75px;
                background: #01aee0;
                float: right;
                border-radius: 4px;
                color: #fff;
                font-size: 14px;
                text-align: center;
                line-height: 30px;
            }
            
            // .public-chat-btn-default-styles:focus {
            //     outline: none;
            // }
            
            .public-chat-btn-default-styles:hover {
                cursor: pointer;
                // background: #c5c5c5;
                // animation: anniu 1s infinite;
            }
            
            // .public-chat-btn-default-styles:active {
            //     box-shadow: 0 2px 3px rgba(0, 0, 0, .2) inset;
            // }
            
            .public-chat-chatContainer {
                position: fixed;
                bottom: ${y};
                right: ${x};
                z-index: 1000;
                width:50px;
                height:50px;
                -moz-user-select: none; -khtml-user-select: none; user-select: none;
            }
            
            .public-chat-chatBtn {
                width: 50px;
                height: 50px;
                background: #01bef0;
                color: #fff;
                line-height: 50px;
                text-align: center;
                border-radius: 50%;
        
                cursor: pointer;
                position: absolute;
                bottom: 0;
                right: 0;
                overflow: hidden;
            }
            
            .public-chat-chatBtn:hover {
                background: #01b3df;
  
            }
            
            .public-chat-chatBtn>i {
                font-size: 25px;
            }
            .public-chat-chatBtn>img{
                width:25px;
                height:25px;
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                margin:auto;
                pointer-events: none;
            }
            
            .public-chat-chatBox {
                width: 370px;
                min-width: 320px;
                height: 570px;
                border-radius: 10px;
                background: #f5ecff;
                position: fixed;
                bottom: 100px;
                right: 110px;
                overflow: hidden;
                border: solid 1px #d5d5d5;
           
                display: none;
                z-index: 1005;
                color: #333;
                
            }
            
            .public-chat-chatBox-head {
                width: 100%;
                height: 45px;
                line-height: 45px;
                background: #01aee0;
                position: absolute;
                top: 0;
                left: 0;
                -moz-user-select: none; -khtml-user-select: none; user-select: none;
            }
            .public-chat-chatBox-head:hover{
                cursor: pointer;
            }
            
            .public-chat-chatBox-head-one {
                width: 100%;
                height: 45px;
                line-height: 45px;
                color: #fff;
                font-size: 20px;
                text-align: center;
                position: absolute;
                top: 0;
                left: 0;
            }
            
            .public-chat-chatBox-head-two {
                width: 100%;
                height: 45px;
                line-height: 45px;
                color: #fff;
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                font-size:14px;
            }
            
            .public-chat-chat-return {
                float: left;
                width: 55px;
                height: 45px;
                line-height: 45px;
                border-radius: 10px;
                cursor: pointer;
                text-align: center;
            }
            
            .public-chat-chat-return:hover {
                background: #0188b7;
            }
            
            .public-chat-chat-close {
                float: right;
                width: 55px;
                height: 45px;
                line-height: 45px;
                border-radius: 10px;
                cursor: pointer;
                text-align: center;
            }
            
            .public-chat-chat-close:hover {
                background: #0188b7;
            }
            
            .public-chat-chat-people {
                float: left;
            }
            
            .public-chat-chatBox-info {
                width: 100%;
                height: 495px;
                background: #fff;
                text-align: left;
                position: absolute;
                top: 45px;
                left: 0;
                overflow-x: hidden;
                overflow-y: scroll;
            }
            
            .public-chat-chatBox-list {
                width: 100%;
                height: 495px;
                overflow-y: scroll;
            }
            #public-chat-chat-list{
                position: relative;
            }
            .public-chat-chat-list-people{
                position: absolute;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom:#ccc solid 1px;
                
            }
            .public-chat-chat-list-people:hover {
                cursor: pointer;
                background: #f8f8f8;
            }
            .public-chat-active{
                z-index: 10000000000000000000;
            }
            
            .public-chat-chat-list-people>div {
                height: 55px;
            }
            
            .public-chat-chat-name {
                width:100%;
            }
            
            .public-chat-chat-name>p {
                margin: 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-indent: 20px;
                max-width:300px;
            }
            
            .public-chat-chat-name>p:nth-of-type(1) {
                line-height: 55px;
            }
            
            .public-chat-chat-list-people .public-chat-message-num {
                margin-left:5px;
                height: 20px;
                min-width: 10px;
                padding: 3px 5px;
                font-size: 12px;
                font-weight: 700;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                border-radius: 10px;
                color: #fff;
                background: #f46266;
            }
            .public-chat-prople-icon{
                position: relative;
                width:20px;
                height:20px;
                padding:0 20px;
                margin-left:10px;
            }
            .public-chat-prople-icon img{
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                margin:auto;
                width:20px;
                height:20px;
            }
            
            .public-chat-chat-message-num {
                display: inline-block;
                height: auto;
                min-width: 10px;
                padding: 3px 5px;
                font-size: 12px;
                font-weight: 700;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                border-radius: 10px;
                margin-right: 15px;
                margin-top: 14px;
                color: #fff;
                background: #f46266;
                position: absolute;
                bottom: 40px;
                right: -24px;
            }
            
            .public-chat-chatBox-kuang {
                width: 100%;
                height: 495px;
                display: none;
            }
            
            .public-chat-chatBox-content {
                width: 100%;
            }
            
            .public-chat-chatBox-content-demo {
                width: 100%;
                overflow-y: scroll;
            }
            
            .public-chat-clearfloat:after {
                display: block;
                clear: both;
                content: "";
                visibility: hidden;
                height: 0;
            }
            
            .public-chat-clearfloat {
                zoom: 1;
                margin: 10px 10px;
            }
            
            .public-chat-clearfloat .public-chat-chat-right {
                float: right;
            }
            
            .public-chat-author-name {
                text-align: center;
                margin: 15px 0 5px 0;
                color: #888;
            }
            
            .public-chat-clearfloat .public-chat-chat-message {
                max-width: 252px;
                text-align: left;
                padding: 8px 12px;
                border-radius: 6px;
                word-wrap: break-word;
                display: inline-block;
                position: relative;
            }
            
            .public-chat-clearfloat .public-chat-chat-left .public-chat-chat-message {
                background: #D9D9D9;
                min-height: 36px;
            }
            
            .public-chat-clearfloat .public-chat-chat-left .public-chat-chat-message:before {
                position: absolute;
                content: "";
                top: 8px;
                left: -6px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-right: 10px solid #D9D9D9;
            }
            
            .public-chat-clearfloat .public-chat-chat-right {
                text-align: right;
            }
            
            .public-chat-clearfloat .public-chat-chat-right .public-chat-chat-message {
                background: #8c85e6;
                color: #fff;
                text-align: left;
                min-height: 36px;
            }
            
            .public-chat-clearfloat .public-chat-chat-right .public-chat-chat-message:before {
                position: absolute;
                content: "";
                top: 8px;
                right: -6px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid #8c85e6;
            }
            
            .public-chat-clearfloat .public-chat-chat-avatars {
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #eee;
                vertical-align: top;
                overflow: hidden;
            }
            
            .public-chat-clearfloat .public-chat-chat-avatars>img {
                width: 30px;
                height: 30px;
            }
            
            .public-chat-clearfloat .public-chat-chat-left .public-chat-chat-avatars {
                margin-right: 10px;
            }
            
            .public-chat-clearfloat .public-chat-chat-right .public-chat-chat-avatars {
                margin-left: 10px;
            }
            
            .public-chat-chatBox-send {
                height:154px;
                width: 100%;
                padding: 0 5px;
                border-top: 1px #D0D0D0 solid;
                position: absolute;
                bottom: 0;
                left: 0;
            }
            .public-chat-chatBox-send img{
                margin-left:10px;
                cursor: pointer;
            }
            .public-chat-div-textarea {
                width: 100%;
                _height: 120px;
                padding: 3px;
                outline: 0;
                background: #fff;
                font-size: 14px;
                line-height: 20px;
                word-wrap: break-word;
                overflow-x: hidden;
                overflow-y: auto;
                // user-modify: read-write-plaintext-only;
                // /*纯文本*/
                // -webkit-user-modify: read-write-plaintext-only;
                // -moz-user-modify: read-write-plaintext-only;
            }

            .public-chat-div-textarea textarea{
                width:100%;
                border: 0; 
                outline:none;
                background-color: rgba(0, 0, 0, 0) ;
                resize: none;
            }
            
            // .public-chat-div-textarea:focus {
            //     box-shadow: 0 0 15px rgba(82, 168, 236, 0.6);
            // }

            .public-chat-btnbox{
                width:100%;
                height:40px;
                display:flex;
                align-items: center;
                justify-content: space-between;
            }

            
            .public-chat-chatBox-send>div {
                float: left;
            }
            
            .public-chat-chatBox-send>div:nth-of-type(2) {
                font-size: 0;
            }
            
            .public-chat-chatBox-send>div button {
                padding: 1px 5px;
                margin-left: 3px;
            }
            
            .public-chat-chatBox-send>div label {
                padding: 1px 5px;
                margin-left: 3px;
            }
            
            #public-chat-chat-biaoqing {
                position: relative;
            }
            
            .public-chat-hidden {
                display: none;
            }
            
            .public-chat-biaoqing-photo {
                width: 200px;
                height: 160px;
                background: #ffffff;
                position: absolute;
                top: -160px;
                right: 40px;
                text-align: left;
                border-radius: 5px;
                border: solid 1px #c5c5c5;
                display: none;
            }
            
            .public-chat-biaoqing-photo::before {
                content: '';
                position: absolute;
                border-top: solid 7px #c5c5c5;
                border-left: solid 9px transparent;
                border-right: solid 9px transparent;
                bottom: -7px;
                right: 36px;
            }
            
            .public-chat-biaoqing-photo::after {
                content: '';
                position: absolute;
                border-top: solid 7px #fff;
                border-left: solid 10px transparent;
                border-right: solid 10px transparent;
                bottom: -5px;
                right: 35px;
            }
            
            .public-chat-biaoqing-photo>ul {
                margin: 0;
                width: 200px;
                height: 160px;
                padding: 3px 2px;
                list-style: none;
            }
            
            .public-chat-biaoqing-photo>ul>li {
                float: left;
                height: 30px;
                margin-left: 2px;
            }
            
            .public-chat-emoji-picker-image {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url(../img/bqxtb01.png) no-repeat;
                background-size: 200px auto;
                cursor: pointer;
            }
            
            .public-chat-biaoqing-photo>ul>li span.public-chat-emoji-picker-image:hover {
                border: solid 1px #f5f5f5;
            }
            
            .public-chat-chat-message img {
                width: 220px;
                height: auto;
            }
            
            @media all and (max-width: 768px) {
                .public-chat-chatBox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            
            @media all and (max-width: 370px) {
                .public-chat-chat-name {
                    width: 185px;
                }
                .public-chat-chat-people>div:nth-of-type(2) {
                    width: 120px;
                }
                .public-chat-clearfloat .public-chat-chat-message {
                    max-width: 240px;
                }
            }
            
            `;
    nod.type = "text/css";
    if (nod.styleSheet) {
      nod.styleSheet.cssText = str;
    } else {
      nod.innerHTML = str;
    }
    document.getElementsByTagName("head")[0].appendChild(nod);

    // 设置聊天logo 的默认位置
    if (JSON.parse(localStorage.getItem("public-chart-chartlogo"))) {
      $("#public-chat-chatContainer").css({
        left: `${
          JSON.parse(localStorage.getItem("public-chart-chartlogo")).x
        }px`,
        top: `${
          JSON.parse(localStorage.getItem("public-chart-chartlogo")).y
        }px`,
      });
    }

    // 最后获取 聊天列表
    unreadList(username);

    // 聊天列表 拖动
    $("#public-chat-chatBox-head").mousedown((e) => {
      var ev = e || window.event;
      var target = ev.target || ev.srcElement;

      if (target.className == "public-chat-chat-close") {
        return;
      }
      let ww = document.body.clientWidth; //可见区域宽度
      let hh = document.body.clientHeight; // 可见区域高度
      let domx = e.offsetX; // dom的X轴
      let domy = e.offsetY; // dom的Y轴
      let x, y; // 计算之后的XY 轴

      document.onmousemove = function (event) {
        let pagex = event.clientX; // 页面的X轴
        let pagey = event.clientY; // 页面的Y轴

        x = pagex - domx;
        if (pagex - domx >= ww - 368) {
          x = ww - 368;
        }
        if (pagex - domx <= 0) {
          x = 0;
        }

        y = pagey - domy;
        if (pagey - domy >= hh - 570) {
          y = hh - 570;
        }
        if (pagey - domy <= 0) {
          y = 0;
        }

        localStorage.setItem("public-chart-chartlist", `{"x":${x},"y":${y}}`);

        $("#public-chat-chatBox").css({
          left: `${
            JSON.parse(localStorage.getItem("public-chart-chartlist")).x
          }px`,
          top: `${
            JSON.parse(localStorage.getItem("public-chart-chartlist")).y
          }px`,
        });
      };

      e.stopPropagation();
    });

    // 聊天logo 拖动
    $("#public-chat-chatContainer").mousedown((e) => {
      var ev = e || window.event;
      var target = ev.target || ev.srcElement;

      if (target.className != "public-chat-chatBtn") {
        return;
      }

      isMove = false;

      let ww = document.body.clientWidth; //可见区域宽度
      let hh = document.body.clientHeight; // 可见区域高度
      let domx = e.offsetX; // dom的X轴
      let domy = e.offsetY; // dom的Y轴
      let x, y; // 计算之后的XY 轴

      document.onmousemove = function (event) {
        isMove = true;

        let pagex = event.clientX; // 页面的X轴
        let pagey = event.clientY; // 页面的Y轴

        x = pagex - domx;
        if (pagex - domx >= ww - 50) {
          x = ww - 50;
        }
        if (pagex - domx <= 0) {
          x = 0;
        }

        y = pagey - domy;
        if (pagey - domy >= hh - 50) {
          y = hh - 50;
        }
        if (pagey - domy <= 0) {
          y = 0;
        }

        localStorage.setItem("public-chart-chartlogo", `{"x":${x},"y":${y}}`);

        $("#public-chat-chatContainer").css({
          left: `${
            JSON.parse(localStorage.getItem("public-chart-chartlogo")).x
          }px`,
          top: `${
            JSON.parse(localStorage.getItem("public-chart-chartlogo")).y
          }px`,
        });
        event.stopPropagation();
      };

      e.stopPropagation();
    });

    document.onmouseup = function (event) {
      document.onmousemove = null;
    };

    // 阻止浏览器的默认事件
    // return false;

    // }

    // 返回发送消息
    return openChat;
  }

  return Chat;
})();
export { Chat };
