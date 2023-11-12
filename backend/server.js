const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.post('path to post', async (req, res) => {
//   try {
//     // Get updated data from the req body
//     const updatedData = req.body;

//     // Read existing data from json file
//     const existingData = await fs.readFile('jsonfile', 'utf-8');
//     const parsedData = JSON.parse(existingData);

//     // Update the data here
//     // would be like: playerData.player = updatedData

//     // Save data back to JSON file
//     await fs.writeFile('jsonfile', JSON.stringify(parsedData, null, 2), 'utf-8');
    
//     res.status(200).send('Player data updated successfully');
//   } catch(error) {
//     console.error('Error writing data: ', error);
//     res.status(500).send('Internal server error.');
//   };
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}.`);
});