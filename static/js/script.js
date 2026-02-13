document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        presets: window.appData.presets,
        currentPreset: document.querySelector('select[name="preset"]').value,
        projectName: '',
        clientCode: '',
        jobNumber: '',
        appendDate: true
    };

    // Elements
    const form = document.querySelector('form');
    const presetSelect = document.querySelector('select[name="preset"]');
    const jobInput = document.querySelector('input[name="job_no"]');
    const clientSelect = document.querySelector('select[name="client_index"]');
    const projectInput = document.querySelector('input[name="project_name"]');
    const dateToggle = document.querySelector('input[name="append_date"]');
    const treeView = document.getElementById('tree-view');
    const previewProject = document.getElementById('preview-project');
    const previewClient = document.getElementById('preview-client');
    const previewJob = document.getElementById('preview-job');

    // Controls
    document.getElementById('expand-all').onclick = () => renderTree(true);
    document.getElementById('collapse-all').onclick = () => renderTree(false);

    // Helpers
    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const getFolderName = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateStr = `${year}-${month}`;

        const job = state.jobNumber ? slugify(state.jobNumber) : '000000';
        const client = state.clientCode ? slugify(state.clientCode) : 'CODE';
        const project = state.projectName ? slugify(state.projectName) : 'project-name';

        let name = `${job}_${client}_${project}`;
        if (state.appendDate) {
            name += `_${dateStr}`;
        }
        return name;
    };

    // Rendering
    const renderTree = (expandAll = true) => {
        const rootName = getFolderName();
        const folders = state.presets[state.currentPreset] || [];

        // Build hierarchy
        const root = { name: rootName, children: {}, isRoot: true };

        folders.forEach(path => {
            const parts = path.split('/');
            let current = root;

            parts.forEach(part => {
                if (!current.children[part]) {
                    current.children[part] = { name: part, children: {} };
                }
                current = current.children[part];
            });
        });

        // Generate HTML
        const buildHtml = (node, depth = 0) => {
            const indent = depth * 20;
            const hasChildren = Object.keys(node.children).length > 0;
            const icon = hasChildren ? '📂' : '📁'; // Simple icons

            let html = `<div class="folder-item" style="padding-left: ${indent}px">
                <span class="folder-icon">${icon}</span>
                <span class="folder-name">${node.name}</span>
            </div>`;

            if (hasChildren) {
                // For now, always expanded for simplicity in this MVP
                Object.values(node.children).forEach(child => {
                    html += buildHtml(child, depth + 1);
                });
            }

            return html;
        };

        treeView.innerHTML = buildHtml(root);

        // Update Summary Card
        previewProject.textContent = state.projectName || '—';
        previewClient.textContent = clientSelect.options[clientSelect.selectedIndex]?.text || '—';
        previewJob.textContent = state.jobNumber || '—';
    };

    // Event Listeners
    const updateState = () => {
        state.currentPreset = presetSelect.value;
        state.jobNumber = jobInput.value;
        state.projectName = projectInput.value;
        state.appendDate = dateToggle.checked;

        // Get client code from select text (format: "Name (CODE)")
        const clientText = clientSelect.options[clientSelect.selectedIndex]?.text || '';
        const match = clientText.match(/\((.*?)\)$/);
        state.clientCode = match ? match[1] : '';

        renderTree();
    };

    [presetSelect, jobInput, clientSelect, projectInput, dateToggle].forEach(el => {
        if (el) el.addEventListener('input', updateState);
    });

    // Initial render
    updateState();
});
