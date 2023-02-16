//for achievements page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

  //[STEP 0]: Make sure our document is A-OK
  $(document).ready(function () {
    //what kind of interface we want at the start 
    const APIKEY = "63bb7050969f06502871acd4";
    getContacts();
    $("#add-update-msg").hide();
  
    //[STEP 1]: Create our submit form listener
    $("#username-submit").on("click", function (e) {
      //prevent default action of the button 
      e.preventDefault();
  
      //[STEP 2]: let's retrieve form data
      //for now we assume all information is valid
      //you are to do your own data validation
      let username = $("#username").val();
      let password= $("#password").val();
  
      //[STEP 3]: get form values when user clicks on send
      //Adapted from restdb api
      let jsondata = {
        "username": username,
        "password": password
      };
  
      //[STEP 4]: Create our AJAX settings. Take note of API key
      let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://interactivedev-c4d2.restdb.io/rest/username",
        "method": "POST", //[cher] we will use post to send info
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata),
        "beforeSend": function(){
          //@TODO use loading bar instead
          //disable our button or show loading bar
          $("#username-submit").prop( "disabled", true);
          //clear our form using the form id and triggering it's reset feature
          $("#add-username-form").trigger("reset");
        }
      }
  
      //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
      $.ajax(settings).done(function (response) {
        console.log(response);
        
        $("#username-submit").prop( "disabled", false);
        
        //@TODO update frontend UI 
        $("#add-update-msg").show().fadeOut(3000);
  
        //update our table 
        getContacts();
      });
    });//end click 
  
  
    //[STEP] 6
    //let's create a function to allow you to retrieve all the information in your usernames
    //by default we only retrieve 10 results
    function getContacts(limit = 10, all = true) {
  
      //[STEP 7]: Create our AJAX settings
      let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://interactivedev-c4d2.restdb.io/rest/username",
        "method": "GET", //[cher] we will use GET to retrieve info
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
      }
  
      //[STEP 8]: Make our AJAX calls
      //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
      //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
      $.ajax(settings).done(function (response) {
        
        let content = "";
  
        for (var i = 0; i < response.length && i < limit; i++) {
          //console.log(response[i]);
          //[METHOD 1]
          //let's run our loop and slowly append content
          //we can use the normal string append += method
          /*
          content += "<tr><td>" + response[i].name + "</td>" +
            "<td>" + response[i].email + "</td>" +
            "<td>" + response[i].message + "</td>
            "<td>Del</td><td>Update</td</tr>";
          */
  
          //[METHOD 2]
          //using our template literal method using backticks
          //take note that we can't use += for template literal strings
          //we use ${content} because -> content += content 
          //we want to add on previous content at the same time
          content = `${content}<tr id='${response[i]._id}'><td>${response[i].name}</td>
          <td>${response[i].username}</td>
          <td>${response[i].password}</td>
          <td><a href='#' class='delete' 
          data-id='${response[i]._id}'>Del</a></td><td><a href='#update-username-container' class='update' 
          data-id='${response[i]._id}' data-msg='${response[i].message}' data-name='${response[i].name}' 
          data-email='${response[i].email}'>Update</a></td></tr>`;
  
        }
  
        //[STEP 9]: Update our HTML content
        //let's dump the content into our table body
        $("#username-list tbody").html(content);
  
        $("#total-username").html(response.length);
      });
  
  
    }
  
    //[STEP 10]: Create our update listener
    //here we tap onto our previous table when we click on update
    //this is a delegation feature of jquery
    //because our content is dynamic in nature, we listen in on the main container which is "#username-list". For each row we have a class .update to help us
    $("#username-list").on("click", ".update", function (e) {
      e.preventDefault();
      //update our update form values
      let usernameName = $(this).data("username");
      let usernameusernameid= $(this).data("password");
      let usernameId = $(this).data("id");
      console.log($(this).data("msg"));
  
      //[STEP 11]: Load in our data from the selected row and add it to our update username form 
      $("#update-username").val(username);
      $("#update-password").val(password);
      $("#update-username-container").show();
  
    });//end username-list listener for update function
  
    //[STEP 12]: Here we load in our username form data
    //Update form listener
    $("#update-username-submit").on("click", function (e) {
      e.preventDefault();
      //retrieve all my update form values
      let usernameName = $("#update-username").val();
      let usernameusernameid = $("#update-password").val();
      let usernameId = $("#update-username-id").val();
  
      //console.log($("#update-username-msg").val());
      //console.log(usernameMsg);
  
      //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
      updateForm(username, password);
    });//end updateusernameform listener
  
    //[STEP 13]: function that makes an AJAX call and process it 
    //UPDATE Based on the ID chosen
    function updateForm(username, password) {
      //@TODO create validation methods for id etc. 
      
      var jsondata = { 
        "username": username, 
        "password": password };
  
      console.log(jsondata);
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://interactivedev-c4d2.restdb.io/rest/username/${id}`,//update based on the ID
        "method": "PUT",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
      }
  
      //[STEP 13a]: send our AJAX request and hide the update username form
      $.ajax(settings).done(function (response) {
        console.log(response);
        
        $("#update-username-container").fadeOut(5000);
        //update our usernames table
        getContacts();
      });
    }//end updateform function
  
  })
  
  function countCheckboxes(){
    var a = document.forms["main"];
    var x =a.querySelectorAll('input[type="checkbox"]:checked');
    let sentence = `Stars Accumulated: ${x.length}`
    alert(sentence);
   }

   function countCheckboxes1(){
    var a = document.forms["main1"];
    var x =a.querySelectorAll('input[type="checkbox"]:checked');
    let sentence = `Stars Accumulated: ${x.length}`
    alert(sentence);
   }