"use strict";

// Part 2 starting...

// Get Elements From HTML
const serviceCategories = document.querySelectorAll(
  ".pricing-sidebar > .pricing-category"
);

const questionStartBtn = document.querySelector(
  ".pricing-placeholder-container > button"
);
const questionsPlaceholderContiner = document.querySelector(
  ".pricing-question-placeholder-container"
);

const prevQuestionBtn = document.querySelector(
  ".pricing-question-action-buttons > button.prev"
);
const nextQuestionBtn = document.querySelector(
  ".pricing-question-action-buttons > button.next"
);

const questionsContainer = document.querySelector(
  ".pricing-questions-container > ul.pricing-question-list"
);
const questionsHeading = document.querySelector(
  ".pricing-questions-container > .question-category"
);

const priceElem = document.querySelectorAll(".price-per-month > .price");

// Global reusable veriables
const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H"];

let monthlyCost = 0;
const questions = [];

let activeQuestion = "";
let activeQuestionBtn = "";

let activeCategoryIndex = 0;
let completedCategoriesIndex = [];

let is_started = false;

let selectedOptions = {};

let pauseNextBtn = false;
let pausePrevBtn = false;

let questionBtnClicked = false;

let part2Eligible = false;

// show/hide the service Error
let errorElem;
function showCategoyError(elem, msg) {
  elem.querySelector("p").innerText = msg;
  elem.classList.add("show");
  errorElem = elem;
}
function hideCategoryError() {
  if (errorElem && errorElem.classList.contains("show")) {
    errorElem.classList.remove("show");
  }
}

// Activating services to startup
function allQuestionsAreCompleted(activeCateQuestions) {
  let counter = 0;
  activeCateQuestions.forEach((question) => {
    if (
      question.classList.contains("completed") ||
      question.getAttribute("question-type") === "optional"
    )
      counter++;
  });
  return activeCateQuestions.length == counter;
}

// Adding completed services categories into an array
function updateCategories() {
  completedCategoriesIndex = [];
  serviceCategories.forEach((cate, c_index) => {
    if (cate.classList.contains("completed")) {
      completedCategoriesIndex.push(c_index);
    }
  });
}

// Working with all logic when any question show/hide
function manuplateWithCategories() {
  // Getting all question of active service category
  const activeCateQuestions = document.querySelectorAll(
    `li.pricing-question-li[cate-index='${activeCategoryIndex}']`
  );

  // Add/Remove completed classes with proper checking of questions
  const isLastQuestion =
    activeQuestion.getAttribute("id") ===
    activeCateQuestions[activeCateQuestions.length - 1].getAttribute("id");

  if (allQuestionsAreCompleted(activeCateQuestions)) {
    if (
      !serviceCategories[activeCategoryIndex].classList.contains("completed")
    ) {
      serviceCategories[activeCategoryIndex].classList.add("completed");
    }
  } else {
    serviceCategories[activeCategoryIndex].classList.remove("completed");
  }

  updateCategories();

  // Checking is the active question last question ?
  if (isLastQuestion) {
    nextQuestionBtn.textContent = "Next Section";
    if (allQuestionsAreCompleted(activeCateQuestions)) {
      if (!pausePrevBtn) {
        serviceCategories[0].classList.add("closed");
        serviceCategories[1].classList.remove("closed");
        pausePrevBtn = false;
      }
      activeCategoryIndex = 1;
    } else {
      showCategoyError(
        document.querySelectorAll(".category-error")[activeCategoryIndex],
        "Please completed all the questions"
      );
      pauseNextBtn = true;
    }
  }
}

// Working with previous button
function manuplateWithCategories2() {
  const activeCateQuestions = document.querySelectorAll(
    `li.pricing-question-li[cate-index='1']`
  );

  const isFirstQuestion =
    activeQuestion.getAttribute("id") ===
    activeCateQuestions[0].getAttribute("id");

  if (isFirstQuestion) {
    pausePrevBtn = true;
    prevQuestionBtn.textContent = "Previous Section";
  } else {
    pausePrevBtn = false;
    prevQuestionBtn.textContent = "Previous";
  }
}

// Updating Monthly Cost on Every question get changed
function updateMonthlyCost() {
  let newMonthlyCost = 0;

  // Getting the difference of new cost and the previous cost
  for (let key in selectedOptions) {
    let opt = selectedOptions[key];
    for (let subKey in opt) {
      let o = opt[subKey];
      if (o.checked) {
        newMonthlyCost += o.price;
      }
    }
  }

  // Updating the price HTML elem in the doc
  priceElem.forEach((priceEm) => {
    const charges = priceEm.querySelector(".charges");
    const increase = priceEm.querySelector(".increase");
    const decrease = priceEm.querySelector(".decrease");

    priceEm.classList.remove("increased");
    priceEm.classList.remove("decreased");

    let timer = 700;

    // if new monthly cost is geater than the previous monthly cost
    if (newMonthlyCost > monthlyCost) {
      const addedFunds = newMonthlyCost - monthlyCost;
      const ms = timer / addedFunds;
      let a = monthlyCost;

      let intervals = setInterval(() => {
        a++;
        charges.textContent = a;
        if (a == newMonthlyCost) {
          clearInterval(intervals);
        }
      });

      priceEm.classList.add("increased");
      increase.innerText = `+$${addedFunds}`;
    }

    // if new monthly cost is lesser than the previous monthly cost
    else if (newMonthlyCost < monthlyCost) {
      const removedFunds = monthlyCost - newMonthlyCost;
      const ms = timer / removedFunds;
      let a = monthlyCost;
      let intervals = setInterval(() => {
        a--;
        charges.textContent = a;
        if (a == newMonthlyCost) {
          clearInterval(intervals);
        }
      });

      priceEm.classList.add("decreased");
      decrease.innerText = `-$${removedFunds}`;
    }

    // show/hide the animation in the HTML doc
    setTimeout(() => {
      priceEm.classList.remove("increased");
      priceEm.classList.remove("decreased");
    }, 700);
  });

  // updating the monthly cost
  monthlyCost = newMonthlyCost;
}

// ....
function updatePricings(question, q_index, options) {
  selectedOptions[`${question.getAttribute("id")}`] = {};

  options.forEach((opt, opt_index) => {
    let optionData = (selectedOptions[`${question.getAttribute("id")}`][
      `${opt.getAttribute("id")}`
    ] = {});
    optionData.price = questions[q_index].options[opt_index].price;
    optionData.checked = opt.checked;
  });
}

// ....
serviceCategories.forEach((serviceCategory, c_index) => {
  // Opening & Closing the category
  const categoryOpener = serviceCategory.querySelector(".opener");
  const categoryError = serviceCategory.querySelector(".category-error");

  // Logic for completed and un-completed services categories
  categoryOpener.addEventListener("click", () => {
    if (
      completedCategoriesIndex.includes(c_index) ||
      activeCategoryIndex === c_index
    ) {
      serviceCategories.forEach((cate) => {
        if (!cate.classList.contains("closed")) {
          cate.classList.add("closed");
        }
      });

      serviceCategory.classList.remove("closed");
      hideCategoryError();
    } else {
      showCategoyError(
        categoryError,
        "Please complete the above Section first."
      );
    }
  });

  // Getting Requirements
  const requirementList = serviceCategory.querySelectorAll(
    ".pricing-cate-ul > li.pricing-cate-li"
  );

  requirementList.forEach((requirement, q_index) => {
    // Getting question data
    const questionDetails = requirement.querySelector(".details");

    const question = {};

    question.question_cate_index = c_index;
    question.question_index = q_index;
    question.question_icon_classes = requirement
      .querySelector(".item-name")
      .querySelector("i").classList.value;

    question.question_title = requirement
      .querySelector(".item-name")
      .querySelector("span").innerText;

    question.question_text =
      questionDetails.querySelector(".question").innerText;

    question.question_desc = questionDetails
      .querySelector(".desc")
      .hasAttribute("no-desc")
      ? null
      : questionDetails.querySelector(".desc").innerText;

    let question_type = questionDetails
      .querySelector("ul.options")
      .getAttribute("question-type");

    // Getting the type of question
    if (question_type === "multiple-choice") {
      question.question_type = "multiple";
    } else if (question_type === "single-choice") {
      question.question_type = "single";
    } else if (question_type === "optional") {
      question.question_type = "optional";
    }

    // Collecting all options of specific question
    const options = [];
    questionDetails
      .querySelectorAll("ul.options > li.option")
      .forEach((opt) => {
        const option = {};
        option.title = opt.querySelector(".text").innerText;
        option.price = Number(opt.querySelector(".price").innerText);
        option.desc = opt.querySelector(".desc").innerText.trim();
        options.push(option);
      });

    // Adding all information related of specific question
    question.options = options;

    // Adding question one by one
    questions.push(question);

    // Adding margin and z-index for category collapse
    requirement.style.zIndex = requirementList.length - q_index;
    requirement.setAttribute("index", q_index);

    requirement.style.marginTop = `-${43 + q_index}px`;

    // Creating an unique identifier for interlinking question and its title
    const uniqueID = `c-${question.question_cate_index}_q-${question.question_index}`;
    requirement.setAttribute("data-question", uniqueID);

    // Onclick function for showing questions
    requirement.addEventListener("click", () => {
      questionBtnClicked = true;
      showQuestion(uniqueID);
    });
  });
});

// Adding questions in the question container to showing by slight animation
questionsContainer.innerHTML = "";

questions.forEach((question, q_index) => {
  // Getting the question Type
  let choice_text = "";
  if (question.question_type === "multiple") {
    choice_text = `Multiple Options`;
  } else if (question.question_type === "single") {
    choice_text = `Only One option`;
  } else if (question.question_type === "optional") {
    choice_text = `Optional`;
  }

  // Getting all the options of the question
  let optionsHTML = "";
  for (let key in question.options) {
    if (question.options.hasOwnProperty(key)) {
      let option = question.options[key];
      optionsHTML += `

        <label class="question-option" for="c-${
          question.question_cate_index
        }_q-${question.question_index}_o-${key}">

        <input type="${
          question.question_type === "single" ? "radio" : "checkbox"
        }" id="c-${question.question_cate_index}_q-${
        question.question_index
      }_o-${key}" 
      
      ${
        question.question_type === "single"
          ? `name='c-${question.question_cate_index}_q-${question.question_index}'`
          : ""
      } />

        <div class="checkmark">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="index-name">
        <div>${alphabets[key]}</div>
        -
          <p>${option.title} </p>
        </div>
        <div class="price-desc">
          <span> 
            + 
            <i class="fa-regular fa-dollar-sign"></i> 
            ${option.price} 
          </span>
          <i class="fa-light fa-circle-info"></i>
        </div>
        <div class="desc">${option.desc}</div>
      </label>
   `;
    }
  }
  // Setting the HTML of one question
  questionsContainer.innerHTML += `
        <li class="pricing-question-li" id="c-${
          question.question_cate_index
        }_q-${question.question_index}" question-type="${
    question.question_type
  }" cate-index="${question.question_cate_index}">
            <!-- question name -->
            <div class="question-category-feature">
              <div class="question-index"> 
                ${question.question_index + 1}.
              </div>
              <i class="${question.question_icon_classes}"></i>
              <span>${question.question_title}</span>
            </div>
            <!-- question content -->
            <div class="question-content">
              <div class="question">${question.question_text}</div>
              ${
                question.question_desc === null
                  ? ""
                  : `<div class="question-desc"> 
                    <span>Description</span>
                    <p> ${question.question_desc} </p> 
                  </div>`
              } 
            <div class="choose">(${choice_text})</div>
            <div class="question-options">
              ${optionsHTML}
            </div>
          </div>
        </li>
  `;

  // Getting the actual height of every Question and setting its height to 0 for smooth animation
  const questionLi = questionsContainer.querySelectorAll(
    "li.pricing-question-li"
  )[q_index];
  questionLi.setAttribute("data-height", questionLi.clientHeight);
  questionLi.style.height = 0;
});

// Getting and setting the height of Question when the screen size changes
window.onresize = () => {
  questionsContainer
    .querySelectorAll("li.pricing-question-li")
    .forEach((questionLi) => {
      questionLi.style.height = "auto";
      questionLi.setAttribute("data-height", questionLi.clientHeight);
      if (activeQuestion.getAttribute("id") === questionLi.getAttribute("id")) {
        questionLi.style.height = questionLi.getAttribute("data-height") + "px";
      } else {
        questionLi.style.height = 0;
      }
    });
};

// Adding/Removing active & completed classes in questions titles
function workWithQuestionBtns(_questionID) {
  activeQuestionBtn = document.querySelector(
    `li.pricing-cate-li[data-question=${_questionID}]`
  );
  const requirementList = document.querySelectorAll(
    ".pricing-cate-ul > li.pricing-cate-li[data-question]"
  );

  requirementList.forEach((requirementLi) => {
    requirementLi.classList.remove("active");
  });

  activeQuestionBtn.classList.add("active");
}

// working with question options
questionsContainer
  .querySelectorAll(".pricing-question-li")
  .forEach((question, q_index) => {
    const options = question.querySelectorAll(
      ".question-content > .question-options > label > input"
    );
    options.forEach((option) => {
      updatePricings(question, q_index, options);

      // event when any option of a specific question change
      option.addEventListener("change", () => {
        updatePricings(question, q_index, options);
        updateMonthlyCost();

        let questionOptions = selectedOptions[`${question.getAttribute("id")}`];
        let selectedOpts = 0;
        let price = 0;

        for (let key in questionOptions) {
          if (questionOptions[key].checked) {
            selectedOpts++;
            price += questionOptions[key].price;
          }
        }

        if (selectedOpts > 0) {
          if (!activeQuestionBtn.classList.contains("added"))
            activeQuestionBtn.classList.add("added");

          activeQuestion.classList.add("completed");
          nextQuestionBtn.disabled = false;

          if (activeQuestion.getAttribute("question-type") === "optional") {
            nextQuestionBtn.textContent = "Next";
          }
        } else {
          activeQuestionBtn.classList.remove("added");
          activeQuestion.classList.remove("completed");
          nextQuestionBtn.disabled = true;

          if (activeQuestion.getAttribute("question-type") === "optional") {
            nextQuestionBtn.textContent = "Skip";
          }
        }
        if (activeQuestion.getAttribute("question-type") === "optional") {
          nextQuestionBtn.disabled = false;
        }

        activeQuestionBtn.querySelector(
          ".price"
        ).innerHTML = `+ <i class="fa-regular fa-dollar-sign"></i> ${price} `;
      });
    });
  });

// Starting the question when the User clicks on 'Get Stated' Button
function startQuestions(_questionID) {
  questionsPlaceholderContiner.classList.add("opened");
  activeQuestion = document.getElementById(`${_questionID}`);
  //..
  is_started = true;
  serviceCategories[0].classList.remove("closed");

  showQuestion(_questionID);
}

// Starting questions Button functionalities
questionStartBtn.addEventListener("click", () => {
  startQuestions(
    questionsContainer
      .querySelector("li.pricing-question-li")
      .getAttribute("id")
  );
});

// Hiding the previous question and showing a specific question
function showQuestion(_questionID, _empty) {
  if (!is_started) startQuestions(_questionID);

  // Hiding previous Question
  activeQuestion.style.height = 0;
  const newQ = document.getElementById(_questionID);
  newQ.style.height = newQ.getAttribute("data-height") + "px";

  // Updating the questions titles
  workWithQuestionBtns(_questionID);
  hideCategoryError();

  // Checking is the question change from next/prev button OR by clicking on the question title
  if (questionBtnClicked) {
    activeQuestion = newQ;
    manuplateWithCategories();
    questionBtnClicked = false;
    activeCategoryIndex = Number(activeQuestion.getAttribute("cate-index"));
  } else {
    manuplateWithCategories();
    activeQuestion = newQ;
  }

  // Checking is the question first question of the service because We have to show the 'Previous Section' button
  if (activeCategoryIndex === 1 && !_empty) {
    manuplateWithCategories2();
  }

  if (_empty) {
    activeCategoryIndex = 0;
  }

  // Updating the services categories/sections by closing/opening the sidebar sections
  const non_activeCateIndex = activeCategoryIndex === 0 ? 1 : 0;

  serviceCategories[activeCategoryIndex].classList.remove("closed");

  if (!serviceCategories[non_activeCateIndex].classList.contains("closed"))
    serviceCategories[non_activeCateIndex].classList.add("closed");

  const questionsHeading = document.querySelector(
    ".pricing-questions-container .question-category"
  );

  // Maintaining the title in Question Container
  if (activeCategoryIndex === 0) {
    if (!questionsHeading.classList.contains("design"))
      questionsHeading.classList.add("design");
    questionsHeading.classList.remove("performance");
  } else {
    if (!questionsHeading.classList.contains("performance"))
      questionsHeading.classList.add("performance");
    questionsHeading.classList.remove("design");
  }

  prevQuestionBtn.disabled = activeQuestion.previousElementSibling
    ? false
    : true;

  // Checking is the question is completed OR not
  if (
    (activeQuestion.nextElementSibling &&
      activeQuestion.getAttribute("question-type") === "optional") ||
    activeQuestion.classList.contains("completed")
  ) {
    nextQuestionBtn.disabled = false;
  } else if (!activeQuestion.classList.contains("completed")) {
    nextQuestionBtn.disabled = true;
  }

  // Checking if the question is optional then changing the next button to skip
  if (activeQuestion.getAttribute("question-type") === "optional") {
    nextQuestionBtn.textContent = "Skip";
  } else {
    nextQuestionBtn.textContent = "Next";
  }

  // Getting is the active question, last question ?
  const activeCateQuestions = document.querySelectorAll(
    `li.pricing-question-li[cate-index='${activeCategoryIndex}']`
  );
  const isLastQuestion =
    activeQuestion.getAttribute("id") ===
    activeCateQuestions[activeCateQuestions.length - 1].getAttribute("id");

  if (isLastQuestion) {
    nextQuestionBtn.textContent = "Next Section";
  } else {
    nextQuestionBtn.textContent = "Next";
  }

  if (!activeQuestion.nextElementSibling) {
    part2Eligible = true;
    nextQuestionBtn.textContent = "Confirm Requirements";
  } else {
    part2Eligible = false;
  }
}

// Getting parameters from Prev & Next Button and calling showQuestion function
function moveQuestion(step) {
  let newQ =
    step === "N"
      ? activeQuestion.nextElementSibling
      : activeQuestion.previousElementSibling;

  if ((!newQ && step === "N") || part2Eligible) {
    part2Eligible = false;
    startPart2();
  } else {
    showQuestion(newQ.getAttribute("id"));
  }
}

// Next Question Button Functionalities
nextQuestionBtn.addEventListener("click", () => {
  if (!pauseNextBtn) {
    moveQuestion("N");
  } else {
    const unCompletedQuestion = document.querySelector(
      `li.pricing-question-li:not(.completed)[cate-index='${activeCategoryIndex}']:not([question-type='optional'])`
    );
    showQuestion(unCompletedQuestion.getAttribute("id"));
    pauseNextBtn = false;
  }
});

// Previous Question Button Functionalities
prevQuestionBtn.addEventListener("click", () => {
  if (pausePrevBtn) {
    serviceCategories[0].classList.remove("closed");
    serviceCategories[1].classList.add("closed");
    activeCategoryIndex = 0;
    prevQuestionBtn.textContent = "Previous";
    showQuestion(
      activeQuestion.previousElementSibling.getAttribute("id"),
      true
    );
  } else {
    moveQuestion("P");
  }
});
// Part 1 ends
// ---------------------------------------------------------------------
// Part 2 starting...

// Getting the elemenets from the HTML Doc
const developersTeamElem = document.getElementById("developers_team");
const basicDevsElem = document.querySelectorAll(
  ".developers-team-container > .details > ul.basic > li"
);
const advanceDevsElem = document.querySelectorAll(
  ".developers-team-container > .details > ul.advance > li"
);
const fastDeliveryBtn = document.getElementById(
  "super-fast-delivery-toggle-btn"
);
const timelineElem = document.querySelector(
  ".part-2-content > .timeline-container"
);
const extraCharges = Number(
  document
    .querySelector(".developers-team-container > .details > ul.advance")
    .getAttribute("extra-charges")
);
const newBudgetElems = document.querySelectorAll(".part-2 .next-monthlyCost");

const pricingLoader = document.querySelector(".price-loader");

const part1 = document.querySelector(".part-1");
const part2 = document.querySelector(".part-2");

const prevBtn = document.querySelector(".part2-btns > button.edit-btn");
const endBtn = document.querySelector(".part2-btns > button.confirm-btn");

let questionRendeners = document.querySelectorAll(
  ".part-2 .features-container .feature-cate ul"
);

// Global Variables
const basicDevs = [];
const advanceDevs = [];
let superFastDelivery = false;

basicDevsElem.forEach((dev) => {
  basicDevs.push([
    dev.textContent.trim().toLowerCase(),
    dev.getAttribute("img"),
  ]);
});
advanceDevsElem.forEach((dev) => {
  advanceDevs.push([
    dev.textContent.trim().toLowerCase(),
    dev.getAttribute("img"),
  ]);
});

// Rendering Selected Questions
function renderQuestions() {
  questionRendeners = document.querySelectorAll(
    ".part-2 .features-container .feature-cate ul"
  );

  questionRendeners.forEach((rendener, r_index) => {
    rendener.innerHTML = "";
    const cateQuestions = document.querySelectorAll(
      `li.pricing-question-li[cate-index='${r_index}']`
    );
    cateQuestions.forEach((cateQuestion, q_index) => {
      let question_title = document.querySelector(
        `.pricing-cate-li[data-question='${cateQuestion.getAttribute("id")}']`
      );

      let icon_classes =
        question_title.querySelector("div.item-name > i").classList.value;

      let question_heading = question_title.querySelector(
        "div.item-name > span"
      ).textContent;

      let queston_price = question_title.querySelector(
        "div.price-action > .price"
      ).textContent;
      queston_price = queston_price.slice(3);
      console.log(queston_price);
      queston_price = queston_price.substring(0, queston_price.length - 1);

      let questionAdded = question_title.classList.contains("added");

      rendener.innerHTML +=
        //  `
        // <li>
        //   <div>
        //     <i class="${icon_classes}"></i>
        //     <p>${question_heading}</p>
        //   </div>
        //   <i class="fa-solid ${questionAdded ? "fa-check" : "fa-xmark"}"></i>
        //   <span> $${questionAdded ? queston_price : 0} </span>
        // </li>
        // `

        `
      <li>
        <div>
          <i class="${icon_classes}"></i>
          <p>${question_heading}</p>
        </div>
        <span>
          <i class="fa-solid fa-dollar-sign"></i>
          <div> ${questionAdded ? queston_price : 0}</div>
        </span>
        <i class="fa-solid  ${questionAdded ? "fa-check" : "fa-xmark"}"></i>
      </li> 
      `;
    });
  });
}

// Rendering Super Fast devlivery funcationality
function renderDevs() {
  const devs = superFastDelivery ? advanceDevs : basicDevs;
  developersTeamElem.innerHTML = "";
  const degree_div = 360 / devs.length;

  devs.forEach((dev, dev_index) => {
    const rotate_deg = degree_div * dev_index;
    developersTeamElem.innerHTML += `
    <div class="developer-circle" data-rotate='${rotate_deg}' style='transform: rotate(${rotate_deg}deg)'>
      <div style='transform: rotate(${360 - rotate_deg}deg)' >
        <img src="${dev[1]}" alt="" />
        <span>${dev[0]}</span>
      </div>
    </div>
    `;
  });

  if (superFastDelivery) {
    timelineElem.classList.remove("basic");
    timelineElem.classList.add("advance");
  } else {
    timelineElem.classList.add("basic");
    timelineElem.classList.remove("advance");
  }

  updateBudget();
}

// Updating budget on super fast delivery
function updateBudget() {
  let a = superFastDelivery ? extraCharges : 0;
  newBudgetElems.forEach((elem) => {
    const span = elem.querySelector("span");
    span.innerHTML = `${monthlyCost + a}<sup>$</sup>`;
  });
}

// Super fast delivery toggle button
fastDeliveryBtn.addEventListener("change", () => {
  superFastDelivery = fastDeliveryBtn.checked;
  renderDevs();
});

// Starting part 2
function startPart2() {
  part1.style.display = "none";
  pricingLoader.classList.add("show");
  setTimeout(() => {
    pricingLoader.classList.remove("show");
  }, 3000);
  part2.style.display = "block";
  document.querySelector("body").classList.toggle("part1");
  document.querySelector("body").classList.toggle("part2");
  renderDevs();
  renderQuestions();
}

// Moving from part 2 to part 1
prevBtn.addEventListener("click", () => {
  part2.style.display = "none";
  pricingLoader.classList.add("show");
  document.querySelector("body").classList.toggle("part1");
  document.querySelector("body").classList.toggle("part2");
  setTimeout(() => {
    pricingLoader.classList.remove("show");
  }, 3000);
  part1.style.display = "block";
});

// Final Button, which get the data and send to the backend
endBtn.addEventListener("click", () => {
  const information = [];
  // categories
  serviceCategories.forEach((cate, c_index) => {
    // Category title ex. Design
    const title = cate.querySelector(
      ".pricing-cate-title > div > span"
    ).textContent;
    let service_category = {};
    service_category.service_category = title;

    // Category Questions
    service_category.questions = [];
    const cate_questions = document.querySelectorAll(
      `li.pricing-question-li[cate-index='${c_index}']`
    );

    // Category each Question
    cate_questions.forEach((cate_question, q_index) => {
      const question = {};

      // Question title
      const question_title = cate_question.querySelector(
        ".question-category-feature > span"
      ).textContent;
      question.question_title = question_title;

      //  Question price
      const question_price = document
        .querySelector(
          `li.pricing-cate-li[data-question='${cate_question.getAttribute(
            "id"
          )}']`
        )
        .querySelector(".price-action > .price").textContent;
      question.question_price = question_price;

      // Questions Options
      question.question_options = [];

      const options = cate_question.querySelectorAll(
        ".question-content > .question-options > label"
      );
      // Question each option
      options.forEach((opt, o_index) => {
        const question_option = {};

        // Option title
        question_option.option_title =
          opt.querySelector(".index-name > p").textContent;

        // Option Price
        question_option.option_price = opt
          .querySelector(".price-desc > span")
          .textContent.slice(4);

        // Is option selected?
        question_option.is_option_selected = opt.querySelector("input").checked;

        question.question_options.push(question_option);
      });
      service_category.questions.push(question);
    });
    information.push(service_category);
  });

  // Budget + Super Fasts delivery charges
  const totalBudget = {};
  totalBudget.totalBudget = superFastDelivery
    ? monthlyCost + extraCharges
    : monthlyCost;

  // Fast delivery
  const superFastDel = {};
  superFastDel.superFastDelivery = superFastDelivery;

  information.push(totalBudget);
  information.push(superFastDel);

  // showing information
  console.log(information);
  alert("Please check the Console, Before Clickon 'OK' ");

  // showing thank-you page
  pricingLoader.classList.add("show", "thank-you");
  setTimeout(() => {
    location.reload();
  }, 3000);
});
