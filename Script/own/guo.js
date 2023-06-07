let obj = JSON.parse($response.body);
   
    obj = {
    "result" : {
      "message" : "success",
      "data" : {
        "last_modify" : "",
        "user_is_pro" : true,
        "rc_id" : "",
        "blocked" : false,
        "permissions" : [
          -1
        ],
        "group_is_pro" : true,
        "event" : {
          "valid" : true,
          "id" : "",
          "icon" : "https://img.vanemu.com/assets/event004.png",
          "type" : "member",
          "name" : "SVIP",
          "desc" : "2099-99-99"
        },
        "user_id" : "",
        "group_name" : "",
        "deleted" : false,
        "group_id" : "",
        "locked" : false,
        "membership_type" : 0,
        "role" : 1,
        "nickname" : ""
      },
      "code" : 1
    }
}

$done({body : JSON.stringify(obj)});
