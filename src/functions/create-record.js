const { app } = require('@azure/functions');
const fetch = require('node-fetch');
require('dotenv').config();

const apiToken = process.env.apiToken
const boardId = process.env.boardId; 
const groupId = process.env.groupId; // Replace with your actual group ID


app.http('create-record', {
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
        const { item,firstName, lastName,email} = requestBody;
        if (!firstName || !lastName|| !email || !item) {
            return {
              status: 400,
              body: "Please pass firstName,lastName and email in the request body",
            };
        }


        

            // const queryColumns = `
            // {
            //     boards(ids: ${boardId}) {
            //     columns {
            //         id
            //         title
            //     }
            //     }
            // }
            // `;

            // async function fetchColumns() {
            // const response = await fetch('https://api.monday.com/v2', {
            //     method: 'POST',
            //     headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': apiToken,
            //     },
            //     body: JSON.stringify({ query: queryColumns }),
            // });

            // const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            // }

            // fetchColumns().catch((err) => {
            // console.error('Error:', err);
            // });

            // const firstName = 'John';
            // const lastName = 'Doe';
            // const email = 'john.doe@example.com';

            const columnValues = JSON.stringify({
                firstname3: firstName,
                lastname2: lastName,
                email4: { email: email, text: email }
              });

              const mutation = `
                mutation {
                    create_item (
                    board_id: ${boardId},
                    group_id: "${groupId}",
                    item_name: "${item}",
                    column_values: "${columnValues.replace(/"/g, '\\"')}"
                    ) {
                    id
                    }
                }
                `;
                try {

                    let results = await createNewRecord();
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
                async function createNewRecord() {
                    const response = await fetch('https://api.monday.com/v2', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': apiToken,
                      },
                      body: JSON.stringify({ query: mutation }),
                    });
                  
                    const data = await response.json();
                    if (data.errors) {
                      console.error('Error creating record:', data.errors);
                    } else {
                      console.log('New record created:', JSON.stringify(data, null, 2));
                      let  result =JSON.stringify(data, null, 2)

                      return result;
                    }
                  }

                //   createNewRecord().catch((err) => {
                //     console.error('Error:', err);
                //   });


        // return { body: `Hello` };
    }
});
