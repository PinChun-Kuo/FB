$(document).ready( function(){
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
    console.log("initial the FB JS SDK");
    FB.init({
      appId      : "1599739017009719",
      xfbml      : true,
      version    : "v2.6"
    });

  };

  // Load the SDK's source Asynchronously
  (function(d, s, id){
    console.log("Load the SDK's source Asynchronously");
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "facebook-jssdk"));

  // login
  ractive.on("login", function(){
    FB.getLoginStatus( function(response){
      console.log("response is : ",response);
      if(response.status === "connected"){  // 程式有連結到 Facebook 帳號
        confirm("目前為已登入狀態");
      }
      else if(response.status === "not_authorized"){  // 程式沒有連結到 Facebook 帳號程式
        FB.login(function(){
          console.log("not_authorized.");
        }, {scope: "user_posts, user_birthday"});
      }
      else{
        FB.login(function(){
          console.log("others.");
        }, {scope: "user_posts, user_birthday"});
      }
    });
  });

  // fetch posts
  ractive.on("fetch", function(){
    console.log("ready to fetch login status");
    FB.getLoginStatus( function(response){
      console.log("response is : ",response);
      if(response.status === "connected"){  // 程式有連結到 Facebook 帳號
        var uid = response.authResponse.userID;  // 取得 UID
        var accessToken = response.authResponse.accessToken;  // 取得 accessToken

        console.log("uid is : ", uid);
        console.log("accessToken is : ", accessToken);
        FB.api("/me?fields=id,name,gender,birthday,posts.limit(1000)", "get", {access_token:accessToken}, function(response) {
          console.log("response is : ", response);
          console.log("length is : ", response.posts.data.length);
          $("#id").append("<span>ID is : </span>", response.id);
          $("#name").append("<span>Name is : </span>", response.name);
          $("#gender").append("<span>Gender is : </span>", response.gender);
          $("#birthday").append("<span>Birthday is : </span>", response.birthday);
          for(var i in response.posts.data){
            var temp = new Object;
            temp.posts = response.posts.data[i].message;
            temp.created_time = response.posts.data[i].created_time.split("T", 1);
            postsList.push(temp);
            console.log("api response is : ", response.posts.data[i]);
          }
        });
      }
      else if(response.status === "not_authorized"){  // 程式沒有連結到 Facebook 帳號程式
        confirm("請先登入");
      }
      else{
        confirm("請先登入");
      }
    });
  });
});
