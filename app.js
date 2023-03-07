//
const searchBoxEl = document.querySelector(".filtered-categories");
const jobContainerEl = document.querySelector(".jobs-container");
const filterBox = document.querySelector(".filtered-jobs");
const clearBtn = document.querySelector(".clear");
let jobToFilter = [];
let result = "";

// event listener
addEventListener("DOMContentLoaded", () => {
  fetchData();
});

// functions
function fetchData() {
  fetch("/data.json")
    .then((response) => response.json())
    .then((data) => {
      displayJobsOnUi(data);
    });
}

function renderAllJobs(item) {
  item.forEach((job) => {
    // create a button for filtering jobs
    function jobRequirements() {
      const selectedJob = [job.role, job.level, ...job.languages, ...job.tools];
      const resultOut = selectedJob
        .map((item, index) => {
          return `<button data-id =${index}> ${item} </button>`;
        })
        .join("");
      return resultOut;
    }

    // Dynamicaly display jobs on ui
    if (job.new && job.featured) {
      result = `<div class="job-card active">
        <div class="job-desc">
            <div class="job-logo">
                <img src= ${job.logo} alt="companys logo">
            </div>
            <div class="job-info">
                <div class="flex job-title">
                    <h4>${job.company}</h4>
                    <div>
                        <span>new!</span>
                        <span>featured</span>
                    </div>
                </div>

                <h4>${job.position}</h4>
                <p> ${job.postedAt} <span></span> ${
        job.contract
      } <span></span> ${job.location} </p>
            </div>
        </div>

        <div class="flex job-category-card">
          ${jobRequirements()}
        </div>
    </div>`;
    } else if (job.new) {
      result = ` <div class="job-card">
        <div class="job-desc">
            <div class="job-logo">
                <img src= ${job.logo} alt="companys logo">
            </div>
            <div class="job-info">
                <div class="flex job-title">
                    <h4>${job.company}</h4>
                    <div>
                        <span>new!</span>
                    </div>
                </div>

                <h4>${job.position}</h4>
                <p> ${job.postedAt} <span></span> ${
        job.contract
      } <span></span> ${job.location} </p>
            </div>
        </div>

        <div class="flex job-category-card">
        ${jobRequirements()}
        </div>
    </div>`;
    } else {
      result = ` <div class="job-card">
          <div class="job-desc">
              <div class="job-logo">
                  <img src= ${job.logo} alt="companys logo">
              </div>
              <div class="job-info">
                  <div class="flex job-title">
                      <h4>${job.company}</h4>
                      <div>
                      </div>
                  </div>
  
                  <h4>${job.position}</h4>
                  <p> ${job.postedAt} <span></span> ${
        job.contract
      } <span></span> ${job.location} </p>
              </div>
          </div>
  
          <div class="flex job-category-card">
          ${jobRequirements()}
          </div>
      </div>`;
    }

    jobContainerEl.innerHTML += result;
  });
}

function displayJobsOnUi(jobs) {
  renderAllJobs(jobs);
  addFilterEventListeners(jobs);
  removeItemFromSearchboxAndUpdateUI(jobs);
  removeAllItemFromSearchBox(jobs);
}

function addFilterEventListeners(jobs) {
  jobContainerEl.addEventListener("click", (e) => {
    const fliterBtn = e.target.dataset.id;
    const jobfilterOption = e.target.innerText;

    if (fliterBtn && !jobToFilter.includes(jobfilterOption)) {
      //  make search box visible
      filterBox.classList.add("visible");

      // store selected value in an array
      searchBoxEl.innerHTML = "";
      jobToFilter.push(jobfilterOption);

      renderFilterjob(jobs);
    }
  });
}

function renderFilterjob(jobs) {
  // display selected job in the search box
  jobToFilter.forEach((item, index) => {
    searchBoxEl.innerHTML += `<div class="flex option" data-id=${index}>
            <p>${item}</p>
            <button data-id=${index}><img src="/images/icon-remove.svg" alt="remove"></button>
            </div>`;
  });
  // filter for jobs that matches the search box list
  const filteredResult = jobs.filter((item) => {
    for (let job of jobToFilter) {
      if (
        !item.languages.includes(job) &&
        !item.tools.includes(job) &&
        job !== item.role &&
        job !== item.level
      ) {
        return false;
      }
    }
    return true;
  });

  // clear the job container before rendering filtered jobs
  jobContainerEl.innerHTML = "";
  renderAllJobs(filteredResult);
}

function removeItemFromSearchboxAndUpdateUI(jobs) {
  searchBoxEl.addEventListener("click", (e) => {
    const clickedValue = e.target.parentElement.dataset;

    if (clickedValue) {
      // delete item from search box and render new filtered result
      jobToFilter.splice(clickedValue, 1);
      console.log(jobToFilter.length);
      searchBoxEl.innerHTML = "";
      renderFilterjob(jobs);

      //  hide search box when there's no item left in it
      if (jobToFilter.length == 0) {
        filterBox.classList.remove("visible");
      }
    }
  });
}

function removeAllItemFromSearchBox(jobs) {
  clearBtn.addEventListener("click", () => {
    // hide search box
    filterBox.classList.remove("visible");
    jobToFilter = [];
    jobContainerEl.innerHTML = "";
    searchBoxEl.innerHTML = "";

    // render all jobs
    renderAllJobs(jobs);
  });
}
