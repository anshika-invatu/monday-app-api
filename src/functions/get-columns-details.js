const { app } = require('@azure/functions');
const fetch = require('node-fetch');
require('dotenv').config();

const apiToken = process.env.apiToken
//const boardId = process.env.boardId; 


app.http('get-columns-details', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let requestBody;

        try {
            requestBody = await request.json();
        } catch (error) {
            return {
                status: 400,
                body: "Invalid JSON in request body"
            };
        }
        const { boardId } = requestBody;
        if (!boardId) {
            return {
              status: 400,
              body: "Please pass boardId in the request body",
            };
        }

            try {

                let results = await fetchColumns(boardId);
                return {
                    status: 200,
                    body: results
                };
            } catch (err) {
                console.error('Error in createColumns:', err);
                return {
                    status: 500,
                    body: `An error occurred while fetching details.`
                };
            } 


  

        async function fetchColumns(boardId) {

            const queryColumns = `
            {
                boards(ids: ${boardId}) {
                columns {
                    id
                    title
                }
                groups {
                    id
                    title
                }
                }
            }
            `;
        const response = await fetch('https://api.monday.com/v2', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken,
            },
            body: JSON.stringify({ query: queryColumns }),
        });

        const data = await response.json();
        let  result =JSON.stringify(data, null, 2)
        console.log(JSON.stringify(data, null, 2));
        return result;
        }
        
    }
});
