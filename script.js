function run() {
  const entryForm = document.querySelector('[name = "mealForm"]');
  const mealInput = document.querySelector(".mainInput");
  const dateInput = document.querySelector(".dateInput");
  const mealsList = document.querySelector(".plates");

  let mealDates = JSON.parse(localStorage.getItem("mealDates")) || [];

  let editing = {
    mode: false,
    index: null,
  };

  function addMeal(event) {
    event.preventDefault();
    if (!editing.mode) {
      const mealForDate = {
        meal: event.currentTarget.meal.value,
        date: event.currentTarget.mealDate.value,
        timestampMilliseconds: Date.parse(event.currentTarget.mealDate.value),
      };
      if (!mealForDate.meal || !mealForDate.date) {
        alert("Enter both a meal and a date!");
        return;
      } else {
        // console.log(mealForDate);
        mealDates.push(mealForDate);

        mealDates = mealDates.sort((a, b) => {
          return (
            (a.timestampMilliseconds || 0) - (b.timestampMilliseconds || 0)
          );
        });

        tidyStore(mealDates, mealsList);
      }
    }

    if (editing.mode) {
      const editedMealForDate = {
        meal: event.currentTarget.meal.value,
        date: event.currentTarget.mealDate.value,
        timestampMilliseconds: Date.parse(event.currentTarget.mealDate.value),
      };

      if (!editedMealForDate.meal || !editedMealForDate.date) {
        alert("Enter both a meal and a date!");
        return;
      }

      mealDates.splice(editing.index, 1, editedMealForDate);

      tidyStore(mealDates, mealsList);

      editing.mode = false;
    }
  }

  function tidyStore(mealDates, mealsList) {
    populatePlannerList(mealDates, mealsList);
    localStorage.setItem("mealDates", JSON.stringify(mealDates));
    document.activeElement.blur();
    mealInput.value = [];
    dateInput.value = [];
  }

  function formatDate(dateString) {
    let formattedDate = new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return formattedDate;
  }

  function populatePlannerList(meals = [], platesList) {
    platesList.innerHTML = meals
      .map((meal, i) => {
        // console.log(meal);
        return `
            <li>
                <span class="dates ${getRowClasses(meal)}">${formatDate(
          meal.date
        )}</span>
                <span class="dishes">
                    <span>${meal.meal}</span>
                    <button data-id="${i}" title="Edit item" class="editButton">Edit</button>
                    <button data-id="${i}" title="Remove item" class="deleteButton">Delete</button>
                </span>

            </li>
            `;
      })
      .join("");
    // console.log(platesList);
  }

  function editMeal(event) {
    if (!event.target.matches(".editButton")) {
      return;
    }
    const indexToEdit = parseInt(event.target.dataset.id, 10);

    // update the global state
    editing.mode = true;
    editing.index = indexToEdit;

    mealInput.value = mealDates[indexToEdit].meal;
    dateInput.value = mealDates[indexToEdit].date;
  }

  function deleteMeal(event) {
    if (!event.target.matches(".deleteButton")) {
      return;
    }

    const targetIndex = parseInt(event.target.dataset.id, 10);
    //console.log(targetIndex);
    mealDates.splice(targetIndex, 1);
    populatePlannerList(mealDates, mealsList);
    localStorage.setItem("mealDates", JSON.stringify(mealDates));
  }

  function getRowClasses(mealObj) {
    let rowClasses = " ";
    const todayDate = new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (formatDate(mealObj.date) == todayDate) {
      rowClasses += "today";
    }
    return rowClasses;
  }

  populatePlannerList(mealDates, mealsList);

  entryForm.addEventListener("submit", addMeal);
  mealsList.addEventListener("click", deleteMeal);
  mealsList.addEventListener("click", editMeal);
};

window.addEventListener("load", (event) => {run()});
