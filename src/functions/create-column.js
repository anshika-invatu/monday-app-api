const { app } = require('@azure/functions');
require('dotenv').config();
const fetch = require('node-fetch');

 const apiToken = process.env.apiToken
const boardId = process.env.boardId; 


app.http('create-column', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        async function createColumn(columnTitle, columnType) {
            console.log("columnTitle",columnTitle);
            const query = `
              mutation {
                create_column (board_id: ${boardId}, title: "${columnTitle}", column_type: ${columnType}) {
                  id
                }
              }
            `;


            const response = await fetch('https://api.monday.com/v2', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': apiToken,
              },
              body: JSON.stringify({ query }),
            });
          
            const data = await response.json();
            if (data.errors) {
              throw new Error(`Error creating ${columnTitle} column: ${data.errors[0].message}`);

            } else {
              console.log(`${columnTitle} column created:`, JSON.stringify(data, null, 2));
              return data.data.create_column.id;
            }
          }

          async function createColumns(val,type) {

            const firstnameColumnId = await createColumn(val, type);
          }
          

        try {
            requestBody = await request.json();
        } catch (error) {
            return {
                status: 400,
                body: "Invalid JSON in request body"
            };
        }

        const { column, type } = requestBody;

        if (column && type ) {
            try {
                await createColumns(column,type);
            } catch (err) {
                console.error('Error in createColumns:', err);
                return {
                    status: 500,
                    body: `An error occurred while creating column ${column}.`
                };
            }
            return {
                status: 200,
                body: `column ${column} with type ${type} is created.`
            };
        } else {
            return {
                status: 400,
                body: "Please pass Column and type in the request body"
            };
        }


    }
});
