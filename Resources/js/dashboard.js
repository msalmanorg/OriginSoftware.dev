document.addEventListener("DOMContentLoaded", function () {
  const contentDataElement = document.getElementById(
    "timeline-chart-content-data"
  );

  if (!contentDataElement) return;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function addLeadingZero(value) {
    return value < 10 ? "0" + value : value.toString();
  }

  function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const day = addLeadingZero(dateObj.getDate());
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    return `${day} ${dayOfWeek}`;
  }

  function calculateDiffInDays(startDate, endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDiff = Math.abs(endDateObj - startDateObj);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  const numberOfDaysInCurrentMonth = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();
  const daysInCurrentMonth = [];
  const dateDataElement = [];

  for (let day = 1; day <= numberOfDaysInCurrentMonth; day++) {
    const date = new Date(currentYear, currentMonth - 1, day);
    const formattedDate = `${addLeadingZero(day)} ${daysOfWeek[date.getDay()]}`;
    daysInCurrentMonth.push(formattedDate);

    const color =
      date.getDay() === 0 || date.getDay() === 6 ? "color-3" : "color-1";
    dateDataElement.push({ date: formattedDate, color: color });
  }

  const contentData = JSON.parse(contentDataElement.textContent).contentData;

  const gridContainer = document.querySelector(
    "#timeline-chart > .grid-container"
  );

  dateDataElement.forEach((dateItem) => {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.textContent = dateItem.date;

    const dayContent = document.createElement("div");
    dayContent.classList.add("day-content");

    const colorItem = dateDataElement.find(
      (colorItem) => colorItem.date === dateItem.date
    );
    if (colorItem) {
      dayContent.classList.add(colorItem.color);
    }

    const contentItem = contentData.find(
      (contentItem) => formatDate(contentItem.date) === dateItem.date
    );

    if (contentItem) {
      const innerContent = document.createElement("div");
      innerContent.classList.add("inner-content");

      const diffDays = calculateDiffInDays(
        contentItem.start_date,
        contentItem.end_date
      );

      const formattedDateRange = `${contentItem.start_date.slice(
        -2
      )} Step - ${contentItem.end_date.slice(-2)} Step`;

      innerContent.style.width = `${85 * diffDays + 10}px`;

      if (
        contentItem.content_type === "content-type-2" ||
        contentItem.content_type === "content-type-3"
      ) {
        innerContent.classList.add(contentItem.content_type);
      }

      const contentWrapperLeft = document.createElement("div");
      contentWrapperLeft.classList.add("content-wrapper-left");
      const contentText = document.createElement("p");
      contentText.classList.add("content-text");
      contentText.textContent = contentItem.content;
      const dateRange = document.createElement("span");
      dateRange.classList.add("date-range");
      dateRange.textContent = formattedDateRange;
      contentWrapperLeft.appendChild(contentText);
      contentWrapperLeft.appendChild(dateRange);

      const contentWrapperRight = document.createElement("div");
      contentWrapperRight.classList.add("content-wrapper-right");

      contentItem.avatars.forEach((avatarSrc) => {
        const avatar = document.createElement("img");
        avatar.setAttribute("src", avatarSrc);
        avatar.setAttribute("alt", "Cloud Chen");
        contentWrapperRight.appendChild(avatar);
      });

      innerContent.appendChild(contentWrapperLeft);
      innerContent.appendChild(contentWrapperRight);
      dayContent.appendChild(innerContent);
    }

    gridItem.appendChild(dayHeader);
    gridItem.appendChild(dayContent);
    gridContainer.appendChild(gridItem);
  });
});
