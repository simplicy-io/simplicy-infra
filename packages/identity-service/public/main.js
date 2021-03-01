const AppInfo = {};
var StripeCheckoutAPI;

window.onload = function() {
    getBalance();
    getInfo()
  };


  function getBalance(){
    this.httpGetAsync("/api/topup/v1/get_balance",(res)=>{
        res = JSON.parse(res);
        document.getElementById("balance").setAttribute('value',res.balance); 
        document.getElementById("address").setAttribute('value',res.address); 
    })
  }

  function getInfo(){
    this.httpGetAsync("/api/info",(res)=>{
        res = JSON.parse(res);
        Object.assign(AppInfo,res);
        this.configureStripe()
    })
  }

  function configureStripe(){
    StripeCheckoutAPI = StripeCheckout.configure({
        key: AppInfo.stripe_public_key,
        locale: 'en',
        token: (token) => stripeTokenCallback(token)
    })
  }

  function stripeTokenCallback(token){
      fetch('/api/topup/v1/add',{
          method: 'post',
          headers: {
              'Content-type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              id: token.id,
              stripeToken: token,
              amount: Number(document.getElementById("amount").value) * 100
          })
      })
      .then(response => {
            response.ok?
            window.alert("Payment Successful.") :
            window.alert("Payment Failed.")
        })
  }

  function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
    }

   function addTopup(){
       const amount = Number(document.getElementById("amount").value) * 100;
       if(!amount){
           window.alert("Please enter an amount for topup.");
           return;
       }
       StripeCheckoutAPI.open({
           amount
       })
   }

