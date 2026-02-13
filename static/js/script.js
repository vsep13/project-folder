document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        presets: window.appData.presets,
        currentPreset: document.querySelector('select[name="preset"]').value,
        projectName: '',
        clientCode: '',
        jobNumber: '',
        appendDate: true,
        expanded: true
    };

    // Elements
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
    document.getElementById('expand-all').onclick = () => {
        state.expanded = true;
        renderTree();
    };
    document.getElementById('collapse-all').onclick = () => {
        state.expanded = false;
        renderTree();
    };

    // Helpers
    const slugify = (text, keepCase = false) => {
        let str = text.toString();
        if (!keepCase) {
            str = str.toLowerCase();
        }

        return str
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^a-zA-Z0-9\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const formatProjectName = (text) => {
        if (!text) return '';
        // Sentence case with hyphens: "Summer Campaign" -> "Summer-campaign"
        const sentenceCase = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        return slugify(sentenceCase, true);
    };

    const getFolderName = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateStr = `${year}-${month}`;

        const job = state.jobNumber ? slugify(state.jobNumber) : '000000';
        // Client code is already uppercase coming from select if setup correctly, but force it here for preview
        const clientText = clientSelect.options[clientSelect.selectedIndex]?.text || '';
        const match = clientText.match(/\((.*?)\)$/);
        const code = match ? match[1] : '';
        const client = code ? slugify(code, true).toUpperCase() : 'CODE';

        const project = state.projectName ? formatProjectName(state.projectName) : 'Project-name';

        let name = `${job}_${client}_${project}`;
        if (state.appendDate) {
            name += `_${dateStr}`;
        }
        return name;
    };

    // Icons
    const ICONS = {
        folder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="folder-svg"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
        file: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-svg"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`
    };

    // Rendering
    const renderTree = () => {
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
            const icon = ICONS.folder;

            const iconClass = hasChildren || node.isRoot ? 'folder-icon dir' : 'folder-icon';

            let html = `<div class="folder-item" style="padding-left: ${indent}px">
                <span class="${iconClass}">${icon}</span>
                <span class="folder-name">${node.name}</span>
            </div>`;

            if (state.expanded) {
                Object.values(node.children).forEach(child => {
                    html += buildHtml(child, depth + 1);
                });
            }

            return html;
        };

        if (!folders.length) {
            treeView.innerHTML = `<div style="padding:1rem; color:var(--text-muted); text-align:center;">No folder structure defined for this preset.</div>`;
        } else {
            treeView.innerHTML = buildHtml(root);
        }

        // Update Summary Card
        previewProject.textContent = state.projectName ? formatProjectName(state.projectName) : '—';
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
