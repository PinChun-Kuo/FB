$(document).ready( function(){
//  var offsetNum = 0;
  var theEnd = false;
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
    console.log("ready to fetch login status");
    var url="/101615286547831/posts?fields=message,created_time,likes.summary(true)&since=2010";
    FB.getLoginStatus( function(response) {
      if(response.status === "connected") {  // 程式有連結到 Facebook 帳號
        var uid = response.authResponse.userID;  // 取得 UID
        accessToken = response.authResponse.accessToken;  // 取得 accessToken
        console.log("uid is : ", uid);
        console.log("accessToken is : ", accessToken);
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
    FB.api("/101615286547831?fields=id,name,about", "get", {access_token:accessToken}, function(response) {
      $("#id").html("<span>ID is : </span>" + response.id);
      $("#name").html("<span>Name is : </span>" + response.name);
      $("#about").html("<span>About " + response.name +" : </span>" + response.about);
    });
  }

  function getData(url) {
    FB.api(url, "get", {access_token:accessToken}, function(response) {
      console.log("response is : ", response);
      console.log("length is : ", response.data.length);
      if(response.data.length > 0) {
        for(var i in response.data) {
          var temp = new Object;
          temp.created_time = response.data[i].created_time.split("T", 1);;
          temp.like_num = response.data[i].likes.summary.total_count;
          temp.post = response.data[i].message;
          postsList.push(temp);
        }
        if(response.data.length === 25) {
          getData(response.paging.next);
        }
      }
    });
    $("#userInfo").css("display","block");
    $("#postsBlock").css("display","block");
  }
});
