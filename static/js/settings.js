document.addEventListener('DOMContentLoaded', () => {
    // 1. Client Code Uppercase Enforcement
    const clientCodeInput = document.getElementById('client_code_input');
    if (clientCodeInput) {
        clientCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    // 2. Preset Edit Population
    const presetNameInput = document.getElementById('preset_name');
    const presetContentInput = document.getElementById('preset_content');
    const editButtons = document.querySelectorAll('.edit-preset-btn');
    const presetActionInput = document.querySelector('#presetFactory input[name="action"]');

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const content = btn.dataset.content;

            presetNameInput.value = name;
            presetContentInput.value = content;
            
            // Optional: Scroll to top of form
            presetNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on name
            presetNameInput.focus();
            
            // Change action to 'edit_preset' for better flash message (optional, as logic is same)
            if (presetActionInput) {
                presetActionInput.value = 'edit_preset';
            }
        });
    });
});
