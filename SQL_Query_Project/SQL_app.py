#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar  8 13:02:55 2025

@author: angie
"""
# SQL_app.py
from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_query', methods=['POST'])
def generate_query():
    data = request.json
    
    # Extract data from the request
    main_table = data.get('main_table', '')
    operation_type = data.get('operation_type', '')
    fields = data.get('fields', [])
    join_tables = data.get('join_tables', [])
    conditions = data.get('conditions', [])
    aggregations = data.get('aggregations', [])
    group_by = data.get('group_by', [])
    order_by = data.get('order_by', {})
    limit = data.get('limit', '')
    
    # Generate the SQL query
    query = build_sql_query(
        main_table, 
        operation_type, 
        fields, 
        join_tables, 
        conditions, 
        aggregations,
        group_by,
        order_by,
        limit
    )
    
    return jsonify({'query': query})

def build_sql_query(main_table, operation_type, fields, join_tables, conditions, aggregations, group_by, order_by, limit):
    # Start building the query
    query = ""
    
    # SELECT clause
    if operation_type == 'select':
        query += "SELECT "
        
        # If no fields or aggregations are selected, use *
        if not fields and not aggregations:
            query += "* "
        else:
            select_items = []
            
            # Add regular fields
            select_items.extend(fields)
            
            # Add aggregation functions
            for agg in aggregations:
                function = agg.get('function', '')
                field = agg.get('field', '')
                alias = agg.get('alias', '')
                
                if function and field:
                    agg_str = f"{function}({field})"
                    if alias:
                        agg_str += f" AS {alias}"
                    select_items.append(agg_str)
            
            query += ", ".join(select_items) + " "
    
    # FROM clause
    if main_table:
        query += f"FROM {main_table} "
    
    # JOIN clause
    for join in join_tables:
        table = join.get('table', '')
        type_ = join.get('type', 'INNER JOIN')
        on = join.get('on', '')
        
        if table and on:
            query += f"{type_} {table} ON {on} "
    
    # WHERE clause
    if conditions:
        query += "WHERE "
        where_conditions = []
        
        for condition in conditions:
            field = condition.get('field', '')
            operator = condition.get('operator', '=')
            value = condition.get('value', '')
            logical = condition.get('logical', 'AND')
            
            if field and operator:
                # Format value based on operator
                if operator.upper() in ('IN', 'NOT IN'):
                    # For IN operators, format as (val1, val2, ...)
                    if isinstance(value, list):
                        # Simpler approach without nested f-strings
                        value_strings = []
                        for v in value:
                            value_strings.append(f"'{v}'")
                        formatted_value = f"({', '.join(value_strings)})"
                    else:
                        formatted_value = f"({value})"
                elif operator.upper() in ('LIKE', 'NOT LIKE', '=', '<>', '>', '<', '>=', '<='):
                    # For string operators, add quotes
                    formatted_value = f"'{value}'"
                else:
                    formatted_value = value
                
                where_condition = f"{field} {operator} {formatted_value}"
                where_conditions.append(where_condition)
        
        query += " AND ".join(where_conditions) + " "
    
    # GROUP BY clause
    if group_by:
        query += "GROUP BY " + ", ".join(group_by) + " "
    
    # ORDER BY clause
    if order_by and order_by.get('field'):
        direction = order_by.get('direction', 'ASC')
        query += f"ORDER BY {order_by['field']} {direction} "
    
    # LIMIT clause
    if limit:
        query += f"LIMIT {limit}"
    
    return query.strip()

if __name__ == '__main__':
    app.run(debug=True)