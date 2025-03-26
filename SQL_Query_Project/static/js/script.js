// static/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Add Field Button
    document.getElementById('add-field-btn').addEventListener('click', function() {
        const container = document.getElementById('fields-container');
        const fieldRow = document.createElement('div');
        fieldRow.className = 'field-row';
        fieldRow.innerHTML = `
            <div class="row g-3 align-items-center">
                <div class="col-11">
                    <input type="text" class="form-control field-input" placeholder="Enter field name">
                </div>
                <div class="col-1 text-center">
                    <span class="remove-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</span>
                </div>
            </div>
        `;
        container.appendChild(fieldRow);
    });

    // Add Join Button
    document.getElementById('add-join-btn').addEventListener('click', function() {
        const container = document.getElementById('joins-container');
        const joinRow = document.createElement('div');
        joinRow.className = 'field-row';
        joinRow.innerHTML = `
            <div class="row g-3 align-items-center mb-2">
                <div class="col-md-3">
                    <select class="form-select join-type">
                        <option value="INNER JOIN">INNER JOIN</option>
                        <option value="LEFT JOIN">LEFT JOIN</option>
                        <option value="RIGHT JOIN">RIGHT JOIN</option>
                        <option value="FULL OUTER JOIN">FULL OUTER JOIN</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control join-table" placeholder="Table name">
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control join-on" placeholder="ON condition (e.g., table1.id = table2.id)">
                </div>
                <div class="col-md-1 text-center">
                    <span class="remove-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</span>
                </div>
            </div>
        `;
        container.appendChild(joinRow);
    });

    // Add Condition Button
    document.getElementById('add-condition-btn').addEventListener('click', function() {
        const container = document.getElementById('conditions-container');
        const conditionRow = document.createElement('div');
        conditionRow.className = 'field-row';
        conditionRow.innerHTML = `
            <div class="row g-3 align-items-center mb-2">
                <div class="col-md-3">
                    <input type="text" class="form-control condition-field" placeholder="Field name">
                </div>
                <div class="col-md-2">
                    <select class="form-select condition-operator">
                        <option value="=">= (Equal)</option>
                        <option value="<>">≠ (Not Equal)</option>
                        <option value=">">></option>
                        <option value="<"><</option>
                        <option value=">=">≥</option>
                        <option value="<=">≤</option>
                        <option value="LIKE">LIKE</option>
                        <option value="IN">IN</option>
                        <option value="NOT IN">NOT IN</option>
                        <option value="IS NULL">IS NULL</option>
                        <option value="IS NOT NULL">IS NOT NULL</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control condition-value" placeholder="Value">
                </div>
                <div class="col-md-3">
                    <select class="form-select condition-logical">
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                </div>
                <div class="col-md-1 text-center">
                    <span class="remove-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</span>
                </div>
            </div>
        `;
        container.appendChild(conditionRow);
    });

    // Add Aggregation Button
    document.getElementById('add-aggregation-btn').addEventListener('click', function() {
        const container = document.getElementById('aggregations-container');
        const aggregationRow = document.createElement('div');
        aggregationRow.className = 'field-row';
        aggregationRow.innerHTML = `
            <div class="row g-3 align-items-center mb-2">
                <div class="col-md-3">
                    <select class="form-select aggregation-function">
                        <option value="COUNT">COUNT</option>
                        <option value="SUM">SUM</option>
                        <option value="AVG">AVG</option>
                        <option value="MIN">MIN</option>
                        <option value="MAX">MAX</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control aggregation-field" placeholder="Field name">
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control aggregation-alias" placeholder="Alias (optional)">
                </div>
                <div class="col-md-1 text-center">
                    <span class="remove-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</span>
                </div>
            </div>
        `;
        container.appendChild(aggregationRow);
    });

    // Add Group By Button
    document.getElementById('add-groupby-btn').addEventListener('click', function() {
        const container = document.getElementById('groupby-container');
        const groupByRow = document.createElement('div');
        groupByRow.className = 'field-row';
        groupByRow.innerHTML = `
            <div class="row g-3 align-items-center">
                <div class="col-11">
                    <input type="text" class="form-control groupby-field" placeholder="Enter field name">
                </div>
                <div class="col-1 text-center">
                    <span class="remove-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</span>
                </div>
            </div>
        `;
        container.appendChild(groupByRow);
    });

    // Form Submit Handler
    document.getElementById('queryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect data from the form
        const mainTable = document.getElementById('mainTable').value;
        const operationType = document.getElementById('operationType').value;
        
        // Collect fields
        const fields = [];
        document.querySelectorAll('.field-input').forEach(function(field) {
            if (field.value.trim()) {
                fields.push(field.value.trim());
            }
        });
        
        // Collect joins
        const joins = [];
        document.querySelectorAll('.field-row:has(.join-table)').forEach(function(joinRow) {
            const type = joinRow.querySelector('.join-type').value;
            const table = joinRow.querySelector('.join-table').value.trim();
            const on = joinRow.querySelector('.join-on').value.trim();
            
            if (table && on) {
                joins.push({
                    type: type,
                    table: table,
                    on: on
                });
            }
        });
        
        // Collect conditions
        const conditions = [];
        document.querySelectorAll('.field-row:has(.condition-field)').forEach(function(conditionRow) {
            const field = conditionRow.querySelector('.condition-field').value.trim();
            const operator = conditionRow.querySelector('.condition-operator').value;
            const value = conditionRow.querySelector('.condition-value').value.trim();
            const logical = conditionRow.querySelector('.condition-logical').value;
            
            if (field && (operator === 'IS NULL' || operator === 'IS NOT NULL' || value)) {
                conditions.push({
                    field: field,
                    operator: operator,
                    value: value,
                    logical: logical
                });
            }
        });
        
        // Collect aggregations
        const aggregations = [];
        document.querySelectorAll('.field-row:has(.aggregation-function)').forEach(function(aggregationRow) {
            const func = aggregationRow.querySelector('.aggregation-function').value;
            const field = aggregationRow.querySelector('.aggregation-field').value.trim();
            const alias = aggregationRow.querySelector('.aggregation-alias').value.trim();
            
            if (func && field) {
                aggregations.push({
                    function: func,
                    field: field,
                    alias: alias
                });
            }
        });
        
        // Collect group by fields
        const groupBy = [];
        document.querySelectorAll('.groupby-field').forEach(function(field) {
            if (field.value.trim()) {
                groupBy.push(field.value.trim());
            }
        });
        
        // Collect order by
        const orderByField = document.getElementById('orderByField').value.trim();
        const orderByDirection = document.getElementById('orderByDirection').value;
        
        const orderBy = orderByField ? {
            field: orderByField,
            direction: orderByDirection
        } : {};
        
        // Collect limit
        const limit = document.getElementById('limitValue').value.trim();
        
        // Prepare data for the backend
        const data = {
            main_table: mainTable,
            operation_type: operationType,
            fields: fields,
            join_tables: joins,
            conditions: conditions,
            aggregations: aggregations,
            group_by: groupBy,
            order_by: orderBy,
            limit: limit
        };
        
        // Send data to the backend
        fetch('/generate_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Display the generated query
            document.getElementById('queryResult').textContent = data.query;
            document.getElementById('result-section').classList.remove('d-none');
            
            // Scroll to the result
            document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while generating the query.');
        });
    });
    
    // Copy Button
    document.getElementById('copyBtn').addEventListener('click', function() {
        const queryText = document.getElementById('queryResult').textContent;
        navigator.clipboard.writeText(queryText).then(function() {
            const copyBtn = document.getElementById('copyBtn');
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });
    });
    
    // Download Button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const queryText = document.getElementById('queryResult').textContent;
        const blob = new Blob([queryText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'query.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
