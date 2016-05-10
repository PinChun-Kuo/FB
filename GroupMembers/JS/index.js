$(document).ready( function(){
  var theEnd = false;
//  var dataNum = 0;
  var accessToken;
  var postsList = new Array;
  var ractive = new Ractive({
    el: "#fb-root",
    template: "#postsTemplate",
    data: {
      postsTotal:postsList
    }
  });

  // initial the FB JS SDK
  window.fbAsyncInit = function() {
    FB.init({
      appId      : "1599739017009719",
      xfbml      : true,
      version    : "v2.6"
    });

  };

  // Load the SDK's source Asynchronously
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "facebook-jssdk"));

  // login
  ractive.on("login", function() {
    FB.getLoginStatus( function(response) {
      if(response.status === "connected") {  // 程式有連結到 Facebook 帳號
        confirm("目前為已登入狀態");
      }
      else if(response.status === "not_authorized") {  // 程式沒有連結到 Facebook 帳號程式
        FB.login(function() {
        }, {scope: ""});
      }
      else{
        FB.login(function() {
        }, {scope: ""});
      }
    });
  });

  // fetch posts
  ractive.on("fetch", function() {
    var url = "/319079701472351/members?limit=1000";
    console.log("ready to fetch login status");
    FB.getLoginStatus( function(response) {
      if(response.status === "connected") {  // 程式有連結到 Facebook 帳號
        var uid = response.authResponse.userID;  // 取得 UID
        accessToken = response.authResponse.accessToken;  // 取得 accessToken
        getInfo();
        getData(url);
        $("#userInfo").css("display","block");
        $("#postsBlock").css("display","block");
      }
      else if(response.status === "not_authorized") {  // 程式沒有連結到 Facebook 帳號程式
        confirm("請先登入");
      }
      else {
        confirm("請先登入");
      }
    });
  });

  function getInfo() {
    FB.api("/319079701472351?fields=id,name", "get", {access_token:accessToken}, function(response) {
      console.log("response is : ", response);
      console.log("response.id is : ", response.id);
      console.log("response.name is : ", response.name);

      $("#id").html("<span>ID is : </span>" + response.id);
      $("#name").html("<span>Name is : </span>" + response.name);
      // 顯示有bug
    });
  }

  function getData(url) {
    FB.api(url, "get", {access_token:accessToken}, function(response) {
      console.log("response is : ", response);
      console.log("response.id is : ", response.id);
      console.log("response.name is : ", response.name);
      console.log("length is : ", response.data.length);

      if(response.data.length > 0 ) {
        for(var i in response.data) {
          var temp = new Object;
          temp.name = response.data[i].name;
          temp.administrator = response.data[i].administrator;
          postsList.push(temp);
          totalMember();
        }
        if(response.data.length === 1000) {
          getData(response.paging.next);
        }
      }
    });
    $("#userInfo").css("display","block");
    $("#postsBlock").css("display","block");
  }

  function totalMember(){
    $("#memberNum").html("<span>Numbers of group members is : </span>" + postsList.length);
  }
});
