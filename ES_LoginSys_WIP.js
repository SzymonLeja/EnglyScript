// ==UserScript==
// @name         EnglyScript
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Opening and resolving tasks assigned by the teacher
// @author       SL
// @match        https://engly.pl/*
// @match        https://engly.pl/student/assigned_tasks/*
// ==/UserScript==

(function () {
    var toTheTasks = $(".task_list a")
      .map(function () {
        return $(this).attr("href");
      })
      .get();
    var linksToTaskList = $(".send_tasks")
      .map(function () {
        return $(this).attr("href");
      })
      .get();
    var loginButton = $(".btn-primary")
      .map(function () {
        return $(this).attr("href");
      })
      .get();
    let taskListLength = linksToTaskList.length;
    let lengthOfTasks = toTheTasks.length;
    let numberOfGaps = document.getElementsByClassName("GapBox").length;
    let taskWorker = 0;
    let numberOfEntries = 0;
    let checker = false;
    let firstToDoList = 0;
    let lastToDoList = 0;
    var activatedLogins = ["default@default.com", "test@test.com"];
    var currentLogin = "";

    function openTabs() {
      let g = document.URL;
      g = g.split("/");
      if (localStorage.getItem("loginApproval") == "true") {
        if (g[3] == "") {
          if (loginButton[0] == "auth/login") {
            window.alert("Zaloguj się na konto!");
            window.location.replace("https://engly.pl/auth/login");
            clearInterval(timerTabs);
          } else {
            window.location.replace("https://engly.pl/student");
          }
        } else if (
          (g[3] == "student" && g[4] == undefined) ||
          (g[3] = "index.php" && g[4] == "student" && g[5] == undefined)
        ) {
          if (numberOfEntries == 0) {
            let inputListsTODO = prompt("Przedział list do wykonania", "1,2");
            var listsTODO = inputListsTODO.split(",");
            if (inputListsTODO == null || inputListsTODO == "") {
              window.alert("Odswiez strone i popraw numery list!");
              clearInterval(timerTabs);
            } else if (parseInt(numberOfGaps) != NaN) {
              checker = true;
            }
            if (checker == true) {
              firstToDoList = listsTODO[0];
              lastToDoList = listsTODO[1];
              if (firstToDoList < lastToDoList && lastToDoList <= taskListLength && numberOfEntries <= taskListLength) {
                window.open(
                  "https://engly.pl/" + linksToTaskList[firstToDoList - 1],
                  "_blank"
                );
                firstToDoList++;
                numberOfEntries++;
              } else if ((listsTODO.length == 1 || listsTODO[0] == listsTODO[1]) && listsTODO[0] <= taskListLength) {
                window.location.replace(
                  "https://engly.pl/" + linksToTaskList[firstToDoList - 1],
                  "_blank"
                );
                clearInterval(timerTabs);
              } else {
                window.alert("Odswiez strone i popraw numery list!");
                clearInterval(timerTabs);
              }
            }
          } else if (firstToDoList <= lastToDoList && lastToDoList <= taskListLength && numberOfEntries <= taskListLength) {
            window.open(
              "https://engly.pl/" + linksToTaskList[firstToDoList - 1],
              "_blank"
            );
            firstToDoList++;
            numberOfEntries++;
          }
        } else if (g[4] == "assigned_tasks" && taskWorker < lengthOfTasks) {
          window.open("https://engly.pl/" + toTheTasks[taskWorker], "_blank");
          taskWorker++;
        } else if (g[4] == "text_task") {
          for (let x = 0; x < numberOfGaps; x++) {
            for (let i = 0; i < 100; i++) {
              if (GetHint(x) != "") {
                SetGapValue(x, GetHint(x));
              }
            }
          }
          CheckAnswers();
        } else {
          clearInterval(timerTabs);
          localStorage.clear();
        }
      } else {
        localStorage.clear();
      }
    }

    if (
      (
          localStorage.getItem("numbersOfLogin") == 0 ||
      localStorage.getItem("numbersOfLogin") == null
      ) &&
        (loginButton[0] != "auth/login")
    ) {
      currentLogin = prompt("Wpisz swoj email", "default@default.com");
      localStorage.setItem("activeEmail", currentLogin);
      localStorage.setItem("numbersOfLogin", 1);
      localStorage.getItem("numbersOfLogin");

      if (activatedLogins.includes(localStorage.getItem("activeEmail"))) {
        localStorage.setItem("loginApproval", true);
        timerTabs = setInterval(function () {
          openTabs();
        }, 500);
      } else {
        localStorage.clear();
        location.reload();
      }
    } else if (
      localStorage.getItem("numbersOfLogin") == 1 &&
      localStorage.getItem("loginApproval") == "true"
    ) {
      timerTabs = setInterval(function () {
        openTabs();
      }, 500);
    } else if (loginButton[0] == "auth/login") {
      if (document.URL != "https://engly.pl/auth/login") {
        window.alert("Zaloguj się na konto!");
        window.location.replace("https://engly.pl/auth/login");
        localStorage.clear();
      } else {
        localStorage.clear();
      }
    } else {
      localStorage.clear();
      location.reload();
    }
  })();
