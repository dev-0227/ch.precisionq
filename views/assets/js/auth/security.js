$(document).ready(function () {
  "use strict";
  sendRequestWithToken('POST', localStorage.getItem('authToken'), {userid:localStorage.getItem('userid')}, "login/getsecurity", (xhr, err) => {
    let result = JSON.parse(xhr.responseText)['data'];
    if (!err) {
      if(typeof result == "undefined" || result == null){
        localStorage.removeItem("userid");
        localStorage.removeItem("usertype");
        localStorage.removeItem('username');
        localStorage.removeItem("permission");
        window.location.replace("./");
      }
      else{
        $("#qdesc").html(result['question']);
        $("#qid").val(result['id']);
      }
      
    }
    else {
      toastr.error('Credential is invalid');
    }
  });

  $('#password-addon').click(function(){
    if ($("#answer").data("view")=="0") {
      $("#answer").attr("type", "text");
      $("#answer").data("view", "1");
      $(".eye-icon").removeClass("ki-eye");
      $(".eye-icon").addClass("ki-eye-slash");
    }else{
      $("#answer").attr("type", "password");
      $("#answer").data("view", "0");
      $(".eye-icon").addClass("ki-eye");
      $(".eye-icon").removeClass("ki-eye-slash");
    }
  })


  $('#answer').keypress(function(e){
    if (e.which === 13) {
      $("#security_submit").trigger("click");
    }
  })
  $('#answer').focus();
  $("#security_submit").click(function(){
    let entry = {
      userid: localStorage.getItem('userid'),
      qid: document.getElementById('qid').value,
      answer: document.getElementById('answer').value
    }
    if(entry.answer == ""){
      toastr.info('Please enter answer');
      $("#answer").focus();
      return;
    }
    sendRequestWithToken('POST', localStorage.getItem('authToken'), entry, "login/checksecurity", (xhr, err) => {
      let result = JSON.parse(xhr.responseText);
      if (!err) {
        if(result.status == "success"){
          localStorage.setItem("chosen_clinic",result.chosen_clinic);
          localStorage.setItem("loginid",result.loginid);
          
          // /getPermission

          window.location.replace("./pages/dash");
          
        }
        else{
          localStorage.removeItem("userid");
          localStorage.removeItem("usertype");
          localStorage.removeItem('username');
          localStorage.removeItem("permission");
          window.location.replace("./");
        }
      }
      else {
        localStorage.removeItem("userid");
        localStorage.removeItem("usertype");
        localStorage.removeItem('username');
        localStorage.removeItem("permission");
        window.location.replace("./");
      }
    });
  });
});
