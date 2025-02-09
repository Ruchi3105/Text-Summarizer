async function summarize() {
    const text = document.getElementById("inputText").value;
    const inputLanguage = document.getElementById("inputLanguage").value;
    const targetLanguage = document.getElementById("targetLanguage").value;
    const topicExtraction = document.getElementById("topicExtraction").checked;

    document.getElementById("summaryText").innerText = "Summarizing...";
    document.getElementById("translatedText").innerText = "";
    document.getElementById("topicsList").innerHTML = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                input_language: inputLanguage,
                target_language: targetLanguage,
                topic_extraction: topicExtraction,
            }),
        });

        if (!response.ok) {
            throw new Error("Error: Input language mismatch.");
        }

        const data = await response.json();

        document.getElementById("summaryText").innerText = data.summary;
        document.getElementById("translatedText").innerText = data.translated_text;

        const topicsList = document.getElementById("topicsList");
        topicsList.innerHTML = "";
        data.topics.forEach((topic) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerText = topic;
            topicsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
        document.getElementById("summaryText").innerText = "";
    }
}

function clearFields() {
    document.getElementById("inputText").value = "";
    document.getElementById("summaryText").innerText = "";
    document.getElementById("translatedText").innerText = "";
    document.getElementById("topicsList").innerHTML = "";
    document.getElementById("inputLanguage").value = "en";
    document.getElementById("targetLanguage").value = "en";
    document.getElementById("topicExtraction").checked = false;
    document.getElementById("summarizeButton").disabled = true;
}

function validateInputLanguage() {
    const inputLanguage = document.getElementById("inputLanguage").value;
    const text = document.getElementById("inputText").value;

    if (!text) {
        document.getElementById("summarizeButton").disabled = true;
        return;
    }

    fetch("https://translation.googleapis.com/language/translate/v2/detect", {
        method: "POST",
        body: JSON.stringify({ q: text }),
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            const detectedLang = data.data.detections[0][0].language;
            if (detectedLang !== inputLanguage) {
                alert("Warning: Input text language does not match the selected input language.");
                document.getElementById("summarizeButton").disabled = true;
            } else {
                document.getElementById("summarizeButton").disabled = false;
            }
        })
        .catch((error) => console.error("Error detecting language:", error));
}

async function checkSimilarity() {
    const text1 = document.getElementById("text1").value.trim();
    const text2 = document.getElementById("text2").value.trim();

    if (!text1 || !text2) {
        alert("Please enter text in both fields to check similarity.");
        return;
    }

    const similarityScore = document.getElementById("similarityScore");
    similarityScore.innerText = "Calculating similarity...";

    try {
        const response = await fetch("http://127.0.0.1:5000/similarity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text1: text1, text2: text2 }),
        });

        if (!response.ok) {
            throw new Error("Error calculating similarity.");
        }

        const data = await response.json();
        similarityScore.innerText = `Similarity Score: ${data.similarity.toFixed(5)}`;
    } catch (error) {
        console.error("Error:", error);
        similarityScore.innerText = "Error calculating similarity. Please try again.";
    }
}

function clearSimilarityFields() {
    document.getElementById("text1").value = "";
    document.getElementById("text2").value = "";
    document.getElementById("similarityScore").innerText = "";
}

document.getElementById("inputText").addEventListener("input", () => {
    const text = document.getElementById("inputText").value.trim();
    const summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.disabled = text === "";
});


function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText || document.getElementById(elementId).value;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy:", err);
    });
}


document.getElementById("clearButton").addEventListener("click", clearFields);