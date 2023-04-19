const articleForm = document.querySelector("#articleForm");
const { author, title, body, submitArticleBtn, cancelEditArticleBtn } = articleForm.elements;
// const cancelEditArticleBtn = document.querySelector("#cancelEditArticleBtn");
const articleList = document.querySelector("#articleList");
// const deleteArticleBtns = document.querySelectorAll("#deleteArticleBtn");
let editArticleUrl;

articleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitArticleBtn.innerText === "Edit") {

        const res = await fetch(editArticleUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: author.value,
                title: title.value,
                body: body.value
            })
        });
        const data = await res.json();
        // console.log(data)
        const matchedLi = Array.from(articleList.children).find(li => li.dataset.id === data._id);
        matchedLi.innerHTML = `
            ${data.title}
            <div class="d-flex align-items-center gap-2">
                <span class="badge bg-secondary">Waiting for Approval</span>
                <button type="button" class="btn p-0 editArticleBtn" data-url="/api/articles/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                <button type="button" class="btn p-0 deleteArticleBtn" data-url="/api/articles/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;

        editArticleUrl = undefined;
        author.value = "";
        title.value = "";
        body.value = "";
        submitArticleBtn.innerText = "Submit";
        cancelEditArticleBtn.classList.add("d-none");

    } else {

        const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: author.value,
                title: title.value,
                body: body.value
            })
        });
        const data = await res.json();
        // console.log(data)
        const li = document.createElement("li");
        li.className = "list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center";
        li.dataset.id = data._id;
        li.innerHTML = `
            ${data.title}
            <div class="d-flex align-items-center gap-2">
                <span class="badge bg-secondary">Waiting for Approval</span>
                <button type="button" class="btn p-0 editArticleBtn" data-url="/api/articles/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                <button type="button" class="btn p-0 deleteArticleBtn" data-url="/api/articles/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;
        articleList.appendChild(li);

        author.value = "";
        title.value = "";
        body.value = "";

    }
});

articleList.addEventListener("click", async (e) => {

    if (e.target.parentElement.classList.contains("editArticleBtn")) {
        const editArticleBtn = e.target.parentElement;
        const url = editArticleBtn.dataset.url;

        const res = await fetch(url);
        const data = await res.json();

        editArticleUrl = `/api/articles/${data._id}`;
        author.value = data.author;
        title.value = data.title;
        body.value = data.body;
        submitArticleBtn.innerText = "Edit";
        cancelEditArticleBtn.classList.remove("d-none");
    }

    if (e.target.parentElement.classList.contains("deleteArticleBtn")) {
        if (confirm("Are you sure you want to delete this article?")) {
            const deleteArticleBtn = e.target.parentElement;
            const url = deleteArticleBtn.dataset.url;

            editArticleUrl = undefined;
            author.value = "";
            title.value = "";
            body.value = "";
            submitArticleBtn.innerText = "Submit";
            !cancelEditArticleBtn.classList.contains("d-none") && cancelEditArticleBtn.classList.add("d-none");

            deleteArticleBtn.parentElement.parentElement.remove();
            await fetch(url, { method: "DELETE" });

        }
    }
});

cancelEditArticleBtn.addEventListener("click", (e) => {
    editArticleUrl = undefined;
    author.value = "";
    title.value = "";
    body.value = "";
    submitArticleBtn.innerText = "Submit";
    cancelEditArticleBtn.classList.add("d-none");
});