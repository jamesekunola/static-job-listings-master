const searchBoxEl = document.querySelector(".filtered-categories");
const jobContainerEl = document.querySelector(".jobs-container");
const filterBox = document.querySelector(".filtered-jobs");
const clearBtn = document.querySelector(".clear");
let jobToFilter = JSON.parse(localStorage.getItem("storedJobs"));

// event listener
window.addEventListener("DOMContentLoaded", fetchData());

// functions
async function fetchData() {
  const response = await fetch("/data.json");
  const data = await response.json();
  displayJobsOnUi(data);
}

function jobRequirements(job) {
  const selectedJob = [job.role, job.level, ...job.languages, ...job.tools];
  return selectedJob.map((item) => `<button>${item}</button>`).join("");
}

function renderJobCard(job) {
  return `
    <div class="job-card ${job.new && job.featured ? "active" : ""}">
      <div class="job-desc">
        <div class="job-logo">
          <img src="${job.logo}" alt="companys logo">
        </div>
        <div class="job-info">
          <div class="flex job-title">
            <h4>${job.company}</h4>
            ${
              job.new && job.featured
                ? "<div><span>new!</span><span>featured</span></div>"
                : job.new
                ? "<div><span>new!</span></div>"
                : ""
            }
          </div>
          <h4>${job.position}</h4>
          <p>${job.postedAt} <span></span> ${job.contract} <span></span> ${
    job.location
  }</p>
        </div>
      </div>
      <div class="flex job-category-card">
        ${jobRequirements(job)}
      </div>
    </div>
  `;
}

function renderJobs(jobs) {
  jobContainerEl.innerHTML = jobs.map(renderJobCard).join("");
}

function displayJobsOnUi(jobs) {
  // if there is a stored jobs on the local storage render the job else render all jobs
  if (jobToFilter) {
    renderSearchBox();
    renderFilteredJobs(jobs);
  } else {
    renderJobs(jobs);
  }

  // add a click event to jobs requirement button
  jobContainerEl.addEventListener("click", (e) => {
    const filterBtn = e.target.closest("button");
    const selectedJob = filterBtn.innerText;

    if (!jobToFilter) {
      jobToFilter = [];
    }

    if (filterBtn && !jobToFilter.includes(selectedJob)) {
      jobToFilter.push(selectedJob);
      localStorage.setItem("storedJobs", JSON.stringify(jobToFilter));
      // jobToFilter = JSON.parse(localStorage.getItem("storedJobs"));
      renderSearchBox();
      renderFilteredJobs(jobs);
    }
  });

  searchBoxEl.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("button[data-id]");
    if (removeBtn) {
      const index = removeBtn.dataset.id;
      jobToFilter.splice(index, 1);
      localStorage.setItem("storedJobs", JSON.stringify(jobToFilter));
      renderSearchBox();
      renderFilteredJobs(jobs);

      if (jobToFilter.length === 0) {
        filterBox.classList.remove("visible");
      }
    }
  });

  clearBtn.addEventListener("click", () => {
    jobToFilter = [];
    localStorage.setItem("storedJobs", JSON.stringify(jobToFilter));
    searchBoxEl.innerHTML = "";
    filterBox.classList.remove("visible");
    renderJobs(jobs);
  });
}

function renderSearchBox() {
  searchBoxEl.innerHTML = jobToFilter
    .map(
      (item, index) => `
      <div class="flex option">
        <p>${item}</p>
        <button data-id=${index}><img src="/images/icon-remove.svg" alt="remove"></button>
      </div>
    `
    )
    .join("");
  if (jobToFilter.length !== 0) {
    filterBox.classList.add("visible");
  }
}

function renderFilteredJobs(jobs) {
  const filteredJobs = jobs.filter((job) =>
    jobToFilter.every(
      (filter) =>
        job.role === filter ||
        job.level === filter ||
        job.languages.includes(filter) ||
        job.tools.includes(filter)
    )
  );
  renderJobs(filteredJobs);
}
