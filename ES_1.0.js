// ==UserScript==
// @name         EnglyScript without Login System
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opening and resolving tasks assigned by the teacher
// @author       SL
// @match        https://engly.pl/*
// @match        https://engly.pl/student/assigned_tasks/*
// ==/UserScript==

(function() {
    var loginButton = $(".btn-primary")
      .map(function () {
        return $(this).attr("href");
      })
      .get();
    var links = $('.task_list a').map( function() {return $(this).attr('href');}).get();
    var linksToExe = $('.send_tasks').map( function() {return $(this).attr('href');}).get();
    l = linksToExe.length
    y = links.length
    z = document.getElementsByClassName("GapBox")
    z = z.length
    j = 0
    k = 0
    checker = false
    firstList = 0
    lastList = 0

    function openTabs(){
       g = document.URL;
       g = g.split("/");
        if(g[3] == ""){
           if (loginButton[0] == "auth/login") {
            window.alert("Zaloguj się na konto!");
            window.location.replace("https://engly.pl/auth/login");
            clearInterval(timerTabs);
          } else {
            location.replace("https://engly.pl/student");
          }
       } else if((g[3] == "student" && g[4] == undefined) || (g[3]="index.php" && g[4]=="student" && g[5] == undefined)){
           if(k==0){
               var numbOfExe = prompt("Wpisz od ktore listy zadan mam wykonać: ", "1,2");
               z = numbOfExe.split(",")
               if(numbOfExe == null || numbOfExe == ""){
                   window.alert("Odswiez strone i popraw numery list!")
                   clearInterval(timerTabs)
               } else if(parseInt(z) != NaN){
                         checker = true
                         }
               if(checker == true) {
                   firstList = z[0]
                   lastList = z[1]
                   if(firstList<lastList && lastList <= l && k<=l){
                       window.open("https://engly.pl/" +linksToExe[firstList-1], "_blank")
                       firstList++
                       k++
                   } else if(((z.length == 1) || ( z[0]== z[1])) && z[0] <=l) {
                       window.location.replace("https://engly.pl/" +linksToExe[firstList-1], "_blank")
                       clearInterval(timerTabs)
                   } else {
                       window.alert("Odswiez strone i popraw numery list!")
                       clearInterval(timerTabs)
                   }
               }
           } else if(firstList<=lastList && lastList <= l && k<=l){
               window.open("https://engly.pl/" +linksToExe[firstList-1], "_blank")
               firstList++
               k++
                     }

       }else if(g[4] == "assigned_tasks" && j<y){
           window.open("https://engly.pl/"+links[j], "_blank")
           j++

       } else if(g[4] == "text_task") {
           for(x=0;x<z;x++){for(i=0;i<100;i++){if(GetHint(x) != ""){SetGapValue(x,GetHint(x)) };}};CheckAnswers();
           clearInterval(timerTabs)
       } else {
           clearInterval(timerTabs)
       }
   }

   timerTabs = setInterval(function(){ openTabs(); }, 500);
})();
