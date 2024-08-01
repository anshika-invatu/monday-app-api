const { app } = require('@azure/functions');
const fetch = require('node-fetch');
require('dotenv').config();

const apiToken = process.env.apiToken

app.http('get-boardDetails', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        const queryBoardsWithGroups = `
        {
            boards {
            id
            name
            groups {
                id
                title
            }
            }
        }
        `;

        async function fetchBoards() {
        const response = await fetch('https://api.monday.com/v2', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken,
            },
            body: JSON.stringify({ query: queryBoardsWithGroups }),
        });

        const data = await response.json();
        let  result =JSON.stringify(data, null, 2)
        console.log(JSON.stringify(data, null, 2));
        return result
        }

        try {
            let results = await fetchBoards();
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
       

    }
});
