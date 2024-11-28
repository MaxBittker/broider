import copy from "copy-to-clipboard";
import { galleryLineString } from "./render";
import { loadSubmissionIntoEditor } from "../index";

function to_css_class(string: string): string {
  // Convert to lowercase
  string = string.toLowerCase();
  // Replace spaces with hyphens
  string = string.replace(/ /g, "-");
  // Remove invalid characters using regex
  string = string.replace(/[^a-z0-9-_]/g, "");
  // Ensure the first character is a letter or underscore
  if (string && !/^[a-z_]/.test(string)) {
    string = "_" + string;
  }
  return string;
}

let title = document.getElementById("title");
let submit = document.getElementById("submit");
let gallery = document.getElementById("gallery");
let renderCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("render")
);

export interface submission {
  dataUrl: string;
  title: string;
  pixelRatio: number;
  who: string;
}
let submissions: submission[] = [];

async function fetchSubmissions() {
  //fetch posts from:
  // https://maxbittker-broider.web.val.run/
  let data = await fetch("https://maxbittker-broider.web.val.run/").then(
    (res) => res.json()
  );

  submissions = data.submissions;
  console.log("submissions", submissions);
  setupGallery();
}

async function postSubmission(submission: submission) {
  //post submission to:
  // https://maxbittker-broider.web.val.run/
  let data = await fetch("https://maxbittker-broider.web.val.run/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  }).then((res) => res.json());
  submissions = data.submissions;
  setupGallery();
}
fetchSubmissions();

submit!.addEventListener("click", () => {
  let dataURI = renderCanvas.toDataURL();
  let pixelRatio = parseInt(renderCanvas.dataset.pixelRatio);
  submissions.push({
    title: to_css_class(title.value),
    dataUrl: dataURI,
    pixelRatio: pixelRatio,
    who: "",
  });

  // window.localStorage.setItem("submissions", JSON.stringify(submissions));
  postSubmission(submissions[submissions.length - 1]);
  setupGallery();
});
function setupGallery() {
  let submissionHTMLs = submissions.map((submission, index) => {
    return galleryLineString(
      submission.dataUrl,
      submission.title,
      submission.pixelRatio,
      index
    );
  });
  gallery!.innerHTML = submissionHTMLs.join("");
  document.querySelectorAll(".gallery-line").forEach((line) => {
    line.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const index = parseInt(target.dataset.index);
      loadSubmissionIntoEditor(submissions[index]);
      copy(line.textContent);
      line.setAttribute("data-after", "Copied to your clipboard!");
      line.classList.remove("flash");
      window.setTimeout(() => {
        line.classList.add("flash");
      }, 1);
      window.setTimeout(() => {
        line.setAttribute("data-after", "[Click to copy]");
      }, 2500);
    });
  });
}

export { setupGallery };
