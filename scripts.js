document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const zip = new JSZip();
    
    // Load the uploaded .mcpack file
    zip.loadAsync(file).then((contents) => {
        // Load a specific JSON file, e.g., "ui.json"
        return zip.file("ui.json").async("text");
    }).then((data) => {
        // Populate the textarea with the content of the JSON file
        document.getElementById('json-editor').value = data;
    }).catch((err) => {
        console.error("Error reading the .mcpack file:", err);
    });
});

document.getElementById('preview-button').addEventListener('click', () => {
    const jsonData = document.getElementById('json-editor').value;

    try {
        const parsedData = JSON.parse(jsonData);
        renderPreview(parsedData);
    } catch (e) {
        console.error("Invalid JSON:", e);
    }
});

function renderPreview(data) {
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = ""; // Clear previous preview

    // Example: Render a button based on the JSON (modify as needed)
    if (data.button) {
        const button = document.createElement('button');
        button.innerText = data.button.text || "Sample Button";
        button.style.width = data.button.width + "px";
        button.style.height = data.button.height + "px";
        button.style.backgroundColor = data.button.color || "#007bff";
        previewArea.appendChild(button);
    } else {
        previewArea.innerText = "No UI elements to preview.";
    }
}

document.getElementById('download-button').addEventListener('click', () => {
    downloadModifiedPack();
});

function downloadModifiedPack() {
    const zip = new JSZip();
    zip.file("ui.json", document.getElementById('json-editor').value);
    // Add any other modified files here as needed
    zip.generateAsync({type: "blob"})
        .then(function(content) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = "modified_pack.mcpack";
            a.click();
        });
}
